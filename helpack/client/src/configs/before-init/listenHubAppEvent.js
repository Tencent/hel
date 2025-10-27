import { IMG_TNEWS_SPLASH_SCREEN } from 'configs/constant';
import { ADD_BG, REMOVE_BG } from 'configs/constant/event';
import { on } from 'services/event';

function setAppNodeDisplay(display) {
  // 添加bg前隐藏当前子应用（针对对vue应用），以便获得更好的使用体验
  const node = document.body.querySelector('#app');
  if (node) {
    node.style.display = display;
  }
}

on(ADD_BG, (bgImg) => {
  // 添加bg前隐藏当前子应用（针对对vue应用），以便获得更好的使用体验
  setAppNodeDisplay('none');
  const bodyStyle = document.body.style;
  bodyStyle.backgroundImage = `url(${bgImg || IMG_TNEWS_SPLASH_SCREEN})`;
  // 这样写才能保证body里空的时候，背景图也是居中布局
  // bodyStyle.backgroundPosition = 'center 25vh';
  bodyStyle.backgroundPosition = 'center';
  bodyStyle.backgroundRepeat = 'no-repeat';
  bodyStyle.backgroundSize = '600px';
});

on(REMOVE_BG, () => {
  const bodyStyle = document.body.style;
  bodyStyle.backgroundImage = '';
  bodyStyle.backgroundPosition = '';
  bodyStyle.backgroundRepeat = '';
  bodyStyle.backgroundSize = '';
  setAppNodeDisplay('block');
});
