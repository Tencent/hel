/**
 * 该文件仅用于演示，可删除或者根据自己想在本地启动时做一些其他工作而调整
 */
import { LIB_NAME } from 'configs/subApp';
import { random } from 'utils/num';

function __changeNum__() {
  const num = random(100);
  forceRender(num);
}
// @ts-ignore
window.__changeNum__ = __changeNum__;

function forceRender(num = 0) {
  let con = document.querySelector('#container');
  if (!con) {
    con = document.createElement('div');
    con.id = 'container';
    document.body.append(con);
  }
  con.innerHTML = `
    <div>
      <h1>welcome to develop  your first hel remote module ${LIB_NAME}</h1>
      <h2>initial num : ${num}</h2>
      <button onclick="__changeNum__()">click</button>
      <span style="color:red;">you can delete this file</span>
    </div>
  `;
}

forceRender();
