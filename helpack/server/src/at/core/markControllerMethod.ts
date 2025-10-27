export default function (wrappedNodeModuleOrModules) {
  let wrappedNodeModules = wrappedNodeModuleOrModules;
  if (!Array.isArray(wrappedNodeModuleOrModules)) {
    wrappedNodeModules = [wrappedNodeModuleOrModules];
  }

  wrappedNodeModules.forEach((wrappedNodeModule) => {
    const { name, mod } = wrappedNodeModule;
    Object.keys(mod).forEach((methodName) => {
      const method = mod[methodName];
      method.__fnName__ = methodName;
      method.__modName__ = name;
    });
  });
}
