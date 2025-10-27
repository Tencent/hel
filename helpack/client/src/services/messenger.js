/**
 * @see http://biqing.github.io/labs/messenger/messenger.js
 */

const { hasOwnProperty } = Object.prototype;

// @ts-ignore
window.top.Messenger = (function () {
  // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
  // !注意 消息前缀应使用字符串类型
  let prefix = '[PROJECT_NAME]';
  const supportPostMessage = 'postMessage' in window;

  // Target 类, 消息对象
  function Target(target, name) {
    let errMsg = '';
    if (arguments.length < 2) {
      errMsg = 'target error - target and name are both requied';
    } else if (typeof target !== 'object') {
      errMsg = 'target error - target itself must be window object';
    } else if (typeof name !== 'string') {
      errMsg = 'target error - target name must be string type';
    }
    if (errMsg) {
      throw new Error(errMsg);
    }
    this.target = target;
    this.name = name;
  }

  // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
  if (supportPostMessage) {
    // IE8+ 以及现代浏览器支持
    Target.prototype.send = function (msg) {
      this.target.postMessage(prefix + msg, '*');
    };
  } else {
    // 兼容IE 6/7
    Target.prototype.send = function (msg) {
      const targetFunc = window.top.navigator[prefix + this.name];
      if (typeof targetFunc === 'function') {
        targetFunc(prefix + msg, window);
      } else {
        throw new Error('target callback function is not defined');
      }
    };
  }

  // 信使类
  // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
  // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
  function Messenger(messengerName, projectName) {
    this.targets = {};
    this.name = messengerName;
    this.listenFunc = [];
    prefix = projectName || prefix;
    if (typeof prefix !== 'string') {
      // @ts-ignore
      prefix = prefix.toString();
    }
    this.initListen();
  }

  // 添加一个消息对象
  Messenger.prototype.addTarget = function (target, name) {
    const targetObj = new Target(target, name);
    this.targets[name] = targetObj;
  };

  // 初始化消息监听
  Messenger.prototype.initListen = function () {
    const self = this;
    const generalCallback = function (msg) {
      if (typeof msg === 'object') {
        // 排除掉调试状态来自webpack的这个信号
        if (typeof msg.data === 'object' && msg.data.type === 'webpackOk') {
          return;
        }
        msg = msg.data || '';
      }

      if (!msg) {
        return;
      }

      msg = msg.slice(prefix.length);
      // 剥离消息前缀
      for (let i = 0; i < self.listenFunc.length; i++) {
        self.listenFunc[i](msg);
      }
    };

    if (supportPostMessage) {
      if ('addEventListener' in document) {
        window.top.addEventListener('message', generalCallback, false);
      } else if ('attachEvent' in document) {
        // @ts-ignore
        window.top.attachEvent('onmessage', generalCallback);
      }
    } else {
      // 兼容IE 6/7
      window.top.navigator[prefix + this.name] = generalCallback;
    }
  };

  // 监听消息
  Messenger.prototype.listen = function (callback) {
    this.listenFunc.push(callback);
  };
  // 注销监听
  Messenger.prototype.clear = function () {
    this.listenFunc = [];
  };
  // 广播消息
  Messenger.prototype.send = function (msg) {
    const { targets } = this;
    let target;
    for (target in targets) {
      if (hasOwnProperty.call(targets, target)) {
        targets[target].send(msg);
      }
    }
  };

  return Messenger;
})();
