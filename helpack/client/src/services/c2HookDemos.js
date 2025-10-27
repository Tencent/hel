import { makeUseC2Mod, typeCtxConn, typeCtxM, typeCtxMConn, useC2Conn, useC2Mod, useC2ModConn } from './concent';

const stBox = { margin: '12px', padding: '12px', border: '1px solid purple' };

// ----------------------- [Start] useC2Mod ----------------------------
function setup(c) {
  // you can also use statement /** @type {import('types/store').CtxM<{}, 'counter'>} */
  // to mark the variable c type instead of calling typeCtxM
  const ctx = typeCtxM('counter', {}, c);
  const ins = ctx.initState({ priKey1: 'xxx', show: false });

  const cu = ctx.computed({
    x3(n) {
      return n.count * 3;
    },
  });
  // ctx.effect(); // lifecycle

  return {
    cu,
    fullState: ins.state,
    changePriKey1: () => ins.setState({ priKey1: Date.now() }),
    toggleShow: ins.sybo.show,
    addCount: ctx.mr.add3Times,
  };
}

export function UseC2Mod() {
  // current component belong to module 'counter'
  const { settings: se } = useC2Mod('counter', { setup });
  const { cu, fullState } = se;
  return (
    <div onClick={se.toggleShow} style={stBox}>
      count x3:{cu.x3} {fullState.count} {fullState.show ? 'true' : 'false'}
      <br />
      priKey1: {fullState.priKey1}
      <button onClick={se.toggleShow}>toggle show</button>
      <button onClick={se.addCount}>addCount</button>
    </div>
  );
}

// 使用工厂函数来构造钩子时，会返回一个 typeCtx 函数帮助用户标记类型
const ret = makeUseC2Mod('counter');
function setupA1(c) {
  const ctx = ret.typeCtx(c);
  const cu = ctx.computed({
    countx6: (n) => n.count * 6,
  });
  return { cu };
}
export function UseC2ModByFactory() {
  const ctx = ret.useC2Mod({ setup: setupA1 });
  return (
    <div style={stBox}>
      {ctx.state.count} {ctx.settings.cu.countx6}
    </div>
  );
}
// ----------------------- [End] useC2Mod ----------------------------

// ----------------------- [Start] useC2Conn ----------------------------
function setup3(c) {
  // you can also use statement /** @type {import('types/store').CtxConn<{}, 'foo'|'bar'>} */
  // to mark the variable c type instead of calling typeCtxConn
  const ctx = typeCtxConn(['foo', 'bar'], {}, c);
  const cu = ctx.computedModule('bar', {
    hiBarKey(n) {
      return `${n.lastName}_ from bar module`;
    },
  });

  return {
    cu,
    changeLastName: () => ctx.cr.foo.changeLastName(),
  };
}

export function UseC2Conn() {
  // current component has connected to module 'foo' and 'bar'
  const {
    settings: se,
    cr,
    connectedState,
  } = useC2Conn(['foo', 'bar'], {
    setup: setup3,
  });
  const { cu } = se;
  return (
    <div style={stBox}>
      <button onClick={se.changeLastName}>se.changeLastName</button>
      <button onClick={() => cr.foo.changeLastName()}>cr.changeLastName</button>
      {cu.hiBarKey}
      <h1>{connectedState.foo.lastName}</h1>
    </div>
  );
}
// ----------------------- [End] useC2ModConn ----------------------------

// ----------------------- [Start] useC2ModConn ----------------------------
function setup2(c) {
  // you can also use statement /** @type {import('types/store').CtxMConn<{}, 'counter', foo'|'bar'>} */
  // to mark the variable c type instead of calling typeCtxMConn
  const ctx = typeCtxMConn('counter', ['foo', 'bar'], {}, c);
  const ins = ctx.initState({ priKey1: 'xxx', show: false });

  const cu = ctx.computedModule('foo', {
    hiFooKey(n) {
      return `${n.addr}_ from foo module`;
    },
  });

  return {
    fullState: ins.state,
    toggleShow: ins.sybo.show,
    cu,
    callBarMethod: () => ctx.cr.bar.f1(),
  };
}

export function UseC2ModConn() {
  // current component belong to module 'counter',
  // and also has connected to module 'foo' and 'bar'
  const { settings: se } = useC2ModConn('counter', ['foo', 'bar'], {
    setup: setup2,
  });
  const { cu } = se;
  return (
    <div style={stBox} onClick={se.callBarMethod}>
      {cu.hiFooKey} <br />
      {se.fullState.show ? 'true' : 'false'}
      <br />
      <button onClick={se.toggleShow}>toggle show</button>
    </div>
  );
}
// ----------------------- [End] useC2ModConn ----------------------------
