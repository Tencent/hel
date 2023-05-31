
function setProtoOf(obj, proto) {
  obj.__proto__ = proto;
  return obj;
}

function mixinProperties(obj, proto) {
  for (var prop in proto) {
    if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj[prop] = proto[prop];
    }
  }
  return obj;
}

// inspired by  https://github.com/wesleytodd/setprototypeof
/* eslint no-proto: 0 */
const setProto = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);

/**
 * create a object with helux prototype
 */
export function createHeluxObj(rawObj?: any) {
  let heluxObj = Object.create(null);
  const protoCopy = { ...Object.prototype };
  setProto(heluxObj, protoCopy);
  if (rawObj) {
    Object.assign(heluxObj, rawObj);
  }
  return heluxObj;
}

/**
 * create observable object
 */
export function createOb(rawObj: any, setFn: any, getFn: any) {
  if (typeof Proxy === 'function') {
    return new Proxy(rawObj, {
      set(target, key, val) {
        return setFn(target, key, val);
      },
      get(target, key) {
        return getFn(target, key);
      },
    });
  } else {
    const downgradeObj = createHeluxObj();
    Object.keys(rawObj).forEach((key) => {
      Object.defineProperty(downgradeObj, key, {
        enumerable: true,
        configurable: false,
        set: function (val) {
          return setFn(rawObj, key, val);
        },
        get: function () {
          return getFn(rawObj, key);
        },
      });
    });
    return downgradeObj;
  }
}
