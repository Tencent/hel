import { Request, Response } from 'express';
import homeCtrl from '../../controllers/home';
import { executeLogicFn } from '../core/logicEntrance';

/**
 * 判断是不是扫描接口，避免安全扫描接口转发到后台
 * @see https://iwiki.woa.com/pages/viewpage.action?pageId=276007728
 */
function isScanReq(req: Request) {
  const ua = req.header('user-agent') || '';
  if (ua.includes('TST(Tencent_Security_Team)')) {
    return true;
  }
  if (req.header('Tencent-Leakscan')) {
    return true;
  }
  return false;
}

function handleApiOrPageReq(req: Request, res: Response, next) {
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (isScanReq(req) || req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }
  next();
}

export function handleAllRequest(req, res, next) {
  try {
    const path = req.path;

    // 测试 ttc.render xc.home_page 两个服务的首屏页面下载速度
    if (path.startsWith('/authapi/testHome')) {
      executeLogicFn(homeCtrl, { req, res });
      return;
    }

    if (path.startsWith('/api') || path.startsWith('/auth')) {
      handleApiOrPageReq(req, res, next);
      return;
    }

    executeLogicFn(homeCtrl, { req, res }); // 渲染首页，结束此函数
  } catch (err) {
    res.send({ code: '-1', msg: err.message });
  }
}
