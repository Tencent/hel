import { executeLogicFn } from 'at/core/logicGateway';
import middlewares from 'at/middlewares';
import homeCtrl from 'controllers/home';

function allowCors(res, isPage) {
  // 是否跨域这个设置在ias做了，所以这里不用写了
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Content-Type');
  // res.header('Access-Control-Allow-Methods', '*');
  const contentType = isPage ? 'text/html; charset=utf-8' : 'application/json;charset=utf-8';
  res.header('Content-Type', contentType);
}

function handleApiOrPageReq(req, res, isPage, next) {
  // allow cors request
  allowCors(res, isPage);

  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }

  let len = middlewares.length;
  if (len > 0) {
    const myNext = () => {
      if (len === 0) {
        // all middlewares executed
        return next();
      }

      const idx = len - 1;
      len = len - 1;
      const m = middlewares[idx];
      m(req, myNext);
    };
    myNext();
    return;
  }

  next();
}

export default function (/** @type {import('express').Request} */ req, res, next) {
  try {
    const ua = req.header('user-agent');
    // 健康检查不做任何打印
    if (ua && ua.includes('healthcheck')) {
      // do nothing
    } else {
      console.log(`req.url: ${req.url}`);
    }
    const path = req.path;

    const isPage = path.startsWith('/openapi/html') || path.startsWith('/page') || path.startsWith('/__page');
    const isApi = path.startsWith('/api') || path.startsWith('/openapi');

    if (isApi || isPage) {
      handleApiOrPageReq(req, res, isPage, next);
      return;
    }

    executeLogicFn(homeCtrl, { req, res }); // 渲染首页，结束此函数
  } catch (err) {
    res.send({ code: '-1', msg: err.message });
  }
}
