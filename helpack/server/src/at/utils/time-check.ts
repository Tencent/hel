import errCode from 'at/configs/errCode';

const { HEL_ERR_TIME_EXPIRED } = errCode;

export function checkTimestamp(timestamp: any, validSpan = 6000) {
  var timeNum = Number(timestamp);
  if (!timeNum || Number.isNaN(timeNum)) {
    throw new HelError('who are you, strange request...', HEL_ERR_TIME_EXPIRED);
  }

  const nowTimestamp = Date.now();
  const realSpan = Math.round(nowTimestamp - timeNum);
  if (realSpan > validSpan) {
    throw new HelError(
      `timestamp expired ${realSpan} ms (limit is ${validSpan} ms), make sure your system time is right`,
      HEL_ERR_TIME_EXPIRED,
    );
  }
}
