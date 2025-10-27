import { ccReducer } from 'services/concent';

window.top.addEventListener('popstate', (p1, p2) => {
  console.log('popstate', p1, p2);
  // console.log('即将跳转目标路径为：', window.top.location.href);
  // 走到这一步，页面还没有跳转

  setTimeout(() => {
    ccReducer.portal.checkPageUrl();
  }, 1000);
});
