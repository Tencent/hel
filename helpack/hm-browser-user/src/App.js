import { core, preFetchLib } from 'hel-micro';
import { useEffect, useState, useRef } from 'react';
import { hello } from '@hel-demo/mono-libs';
import './App.css';
import { fetchMultipleLibVersions } from './api/versionApi';

const REMOTE_LIB_NAME = process.env.REACT_APP_HEL_LIB_NAME || '@hel-demo/mono-libs';
const HEL_PLATFORM_API_PREFIX = process.env.REACT_APP_HEL_API_PREFIX || '';
const HEL_CUSTOM_HOST = process.env.REACT_APP_HEL_CUSTOM_HOST || '';
const HEL_PLATFORM_NAME = 'hel';

// List of libs to monitor (can be extended)
const MONITORED_LIBS = [
  '@hel-demo/mono-libs',
  '@hel-demo/lib1',
  'hdemo-hub',
  'hdemo-lib',
  'hdemo-lib2',
  'hdemo-lib3',
  'hdemo-lib4',
  'hdemo-lib5',
  'hdemo-lib6',
  'hel-demo-mono-libs',
  'hel-demo-mono-libs-2',
  'hel-demo-mono-libs-3',
  'hel-demo-mono-libs-4',
  'hel-hello-helpack',
];

// Polling interval in milliseconds (default: 2 seconds)
const POLL_INTERVAL = 2000;

function App() {
  const [remoteMsg, setRemoteMsg] = useState('waiting for hel module...');
  const [error, setError] = useState('');
  const [libVersion, setLibVersion] = useState('');
  const [allLibVersions, setAllLibVersions] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [versionChanges, setVersionChanges] = useState({});
  const previousVersionsRef = useRef({});
  const pollIntervalRef = useRef(null);

  // Fetch all lib versions
  const fetchAllVersions = async () => {
    try {
      const versions = await fetchMultipleLibVersions(MONITORED_LIBS);
      
      // Detect version changes
      const changes = {};
      versions.forEach(lib => {
        const prevVersion = previousVersionsRef.current[lib.name];
        const currentVersion = lib.version;
        
        if (prevVersion && prevVersion !== currentVersion && currentVersion !== 'error') {
          changes[lib.name] = {
            from: prevVersion,
            to: currentVersion,
            timestamp: new Date().toLocaleTimeString(),
          };
        }
        
        previousVersionsRef.current[lib.name] = currentVersion;
      });

      if (Object.keys(changes).length > 0) {
        setVersionChanges(prev => ({ ...prev, ...changes }));
        console.log('[VERSION MONITOR] Version changes detected:', changes);
      }

      setAllLibVersions(versions);
      setLastUpdateTime(new Date());
    } catch (err) {
      console.error('[VERSION MONITOR] Error fetching versions:', err);
      setError(err?.message || 'failed to fetch lib versions');
    }
  };

  // Polling effect
  useEffect(() => {
    // Initial fetch
    fetchAllVersions();

    // Set up polling
    pollIntervalRef.current = setInterval(() => {
      fetchAllVersions();
    }, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Fetch remote lib (existing functionality)
  useEffect(() => {
    let unmounted = false;

    async function fetchRemoteLib() {
      try {
        const enableLocalHost = window.location.hostname === 'localhost';
        console.log(
          '[HEL DEMO] preFetchLib setup',
          REMOTE_LIB_NAME,
          'platform:',
          HEL_PLATFORM_NAME,
          'api:',
          HEL_PLATFORM_API_PREFIX,
          'custom host:',
          HEL_CUSTOM_HOST,
          'enableLocalHost:',
          enableLocalHost,
        );
        const lib = await preFetchLib(REMOTE_LIB_NAME, {
          platform: 'hel',
          apiPrefix: HEL_PLATFORM_API_PREFIX,
          helpackApiUrl: 'https://helmicro.com/openapi/meta',
          custom: {
            host: HEL_CUSTOM_HOST,
            enable: enableLocalHost,
            trust: true,
          },
        });

        if (!unmounted) {
          const helloMsg = typeof lib.hello === 'function' ? lib.hello() : 'remote lib loaded';
          setRemoteMsg(helloMsg);
          const versionInfo = core.getVersion(REMOTE_LIB_NAME, { platform: HEL_PLATFORM_NAME });
          const versionLabel =
            versionInfo?.version_tag || versionInfo?.sub_app_version || versionInfo?.build_version || '';
          setLibVersion(versionLabel);
          console.log('[HEL DEMO] remote lib loaded, version:', versionLabel || 'unknown');
        }
      } catch (err) {
        if (!unmounted) {
          setError(err?.message || 'failed to fetch remote lib');
          setLibVersion('');
        }
        console.error('[HEL DEMO] preFetchLib failed:', err);
      }
    }

    fetchRemoteLib();

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="App">
      <h1>hello result: {hello()}</h1>
      <header className="App-header">
        <p>HEL remote module demo</p>
        <p className="App-status">{remoteMsg}</p>
        <p className="App-version">
          Remote lib version: {libVersion || 'not available (yet)'}
        </p>
        {error ? <p className="App-error">{error}</p> : null}
        
        {/* Version Monitor Section */}
        <div className="version-monitor">
          <h2>Lib Version Monitor</h2>
          <p className="monitor-status">
            {lastUpdateTime ? `Last updated: ${lastUpdateTime.toLocaleTimeString()}` : 'Initializing...'}
            {' | '}
            Polling every {POLL_INTERVAL / 1000}s
          </p>
          
          <div className="version-list">
            {allLibVersions.length === 0 ? (
              <p className="loading">Loading versions...</p>
            ) : (
              <table className="version-table">
                <thead>
                  <tr>
                    <th>Lib Name</th>
                    <th>Current Version</th>
                    <th>Online Version</th>
                    <th>Build Version</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allLibVersions.map((lib, index) => {
                    const hasChange = versionChanges[lib.name];
                    return (
                      <tr
                        key={lib.name}
                        className={hasChange ? 'version-changed' : ''}
                        title={hasChange ? `Changed from ${hasChange.from} to ${hasChange.to} at ${hasChange.timestamp}` : ''}
                      >
                        <td className="lib-name">{lib.name}</td>
                        <td className="version-value">{lib.version}</td>
                        <td className="version-value">{lib.onlineVersion}</td>
                        <td className="version-value">{lib.buildVersion}</td>
                        <td className="version-status">
                          {lib.error ? (
                            <span className="status-error">Error</span>
                          ) : hasChange ? (
                            <span className="status-changed">Updated!</span>
                          ) : (
                            <span className="status-ok">OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {Object.keys(versionChanges).length > 0 && (
            <div className="version-changes-log">
              <h3>Recent Changes</h3>
              <ul>
                {Object.entries(versionChanges).slice(-5).reverse().map(([libName, change]) => (
                  <li key={`${libName}-${change.timestamp}`}>
                    <strong>{libName}</strong>: {change.from} → {change.to} ({change.timestamp})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="App-hint">
          Update the module in Hel Pack (platform: hel, meta host: {HEL_PLATFORM_API_PREFIX}, custom host: {HEL_CUSTOM_HOST}) and see the change reflected here in real-time.
        </p>
      </header>
    </div>
  );
}

export default App;