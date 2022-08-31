import * as helMicro from 'hel-micro';
import React from 'react';

export default function RemoteCallBtn() {
  return <button onClick={async function () {
    const lib = await helMicro.preFetchLib('remote-lib-tpl');
    alert(lib.num.random(22));
  }}>Click me to call remote lib method!</button>;
}
