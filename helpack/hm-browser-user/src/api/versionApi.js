/**
 * API functions to fetch lib versions from helpack server
 */

const HEL_PLATFORM_API_PREFIX = process.env.REACT_APP_HEL_API_PREFIX || '';

/**
 * Fetch all libs and their versions from helpack server
 * @returns {Promise<Array>} Array of lib info with versions
 */
export async function fetchAllLibVersions() {
  try {
    // First, get all apps from helpack server
    // Using the openapi endpoint that doesn't require authentication
    const response = await fetch(`${HEL_PLATFORM_API_PREFIX}/openapi/v1/app/info/getSubAppAndItsVersion?name=@hel-demo/mono-libs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lib versions: ${response.statusText}`);
    }

    const data = await response.json();
    
    // If we get a single app, return it as an array
    if (data && data.name) {
      return [{
        name: data.name,
        version: data.version?.version_tag || data.version?.sub_app_version || data.online_version || 'unknown',
        onlineVersion: data.online_version || 'unknown',
        buildVersion: data.build_version || 'unknown',
        versionData: data.version,
      }];
    }

    // If we get an array, process it
    if (Array.isArray(data)) {
      return data.map(app => ({
        name: app.name,
        version: app.version?.version_tag || app.version?.sub_app_version || app.online_version || 'unknown',
        onlineVersion: app.online_version || 'unknown',
        buildVersion: app.build_version || 'unknown',
        versionData: app.version,
      }));
    }

    return [];
  } catch (error) {
    console.error('[VERSION API] Error fetching lib versions:', error);
    throw error;
  }
}

/**
 * Fetch version for a specific lib
 * @param {string} libName - Name of the lib
 * @returns {Promise<Object>} Lib version info
 */
export async function fetchLibVersion(libName) {
  try {
    const response = await fetch(`${HEL_PLATFORM_API_PREFIX}/openapi/v1/app/info/getSubAppAndItsVersion?name=${encodeURIComponent(libName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lib version: ${response.statusText}`);
    }

    const data = await response.json();
     console.log(`[DEBUG] Raw data for ${libName}:`, data);
    
    return {
      name: data.name || libName,
      version: data.version?.version_tag || data.version?.sub_app_version || data.online_version || 'unknown',
      onlineVersion: data.online_version || 'unknown',
      buildVersion: data.build_version || 'unknown',
      versionData: data.version,
    };
  } catch (error) {
    console.error(`[VERSION API] Error fetching version for ${libName}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple lib versions at once using batch API
 * @param {Array<string>} libNames - Array of lib names
 * @returns {Promise<Array>} Array of lib version info
 */
export async function fetchMultipleLibVersions(libNames) {
  try {
    // Batch API supports up to 8 names at once, so we need to split into chunks
    const BATCH_SIZE = 8;
    const chunks = [];
    for (let i = 0; i < libNames.length; i += BATCH_SIZE) {
      chunks.push(libNames.slice(i, i + BATCH_SIZE));
    }

    const allResults = [];

    for (const chunk of chunks) {
      try {
        // Use batch API if available (for openapi endpoint)
        const nameList = chunk.join(',');
        const response = await fetch(
          `${HEL_PLATFORM_API_PREFIX}/openapi/v1/app/info/batchGetSubAppAndItsVersion?name=${encodeURIComponent(nameList)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const batchData = await response.json();
          if (Array.isArray(batchData)) {
            const processed = batchData.map(app => ({
              name: app.name || 'unknown',
              version: app.version?.version_tag || app.version?.sub_app_version || app.online_version || 'unknown',
              onlineVersion: app.online_version || 'unknown',
              buildVersion: app.build_version || 'unknown',
              versionData: app.version,
            }));
            allResults.push(...processed);
            continue;
          }
        }
      } catch (batchError) {
        console.warn('[VERSION API] Batch API failed, falling back to individual requests:', batchError);
      }

      // Fallback to individual requests if batch fails
      const promises = chunk.map(name => fetchLibVersion(name).catch(err => {
        console.error(`[VERSION API] Failed to fetch ${name}:`, err);
        return {
          name,
          version: 'error',
          onlineVersion: 'error',
          buildVersion: 'error',
          error: err.message,
        };
      }));

      const chunkResults = await Promise.all(promises);
      allResults.push(...chunkResults);
    }

    return allResults;
  } catch (error) {
    console.error('[VERSION API] Error fetching multiple lib versions:', error);
    throw error;
  }
}

