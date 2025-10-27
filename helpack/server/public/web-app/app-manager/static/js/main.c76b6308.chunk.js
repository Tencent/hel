(this.webpackJsonpclient = this.webpackJsonpclient || []).push([
  [0],
  {
    0: function (e, t) {
      e.exports = React;
    },
    103: function (e, t) {
      e.exports = ReactDOM;
    },
    276: function (e, t, a) {
      e.exports = {
        controlLine: 'styles_controlLine__3RCfz',
        controlArea: 'styles_controlArea__1ZAr3',
        controlItem: 'styles_controlItem__3NGUm',
        srvModCardWrap: 'styles_srvModCardWrap__2y3mU',
        srvModJsLogo: 'styles_srvModJsLogo__1kp78',
      };
    },
    332: function (e, t, a) {
      e.exports = { tipLabelWrap: 'common_tipLabelWrap__20S-c' };
    },
    471: function (e, t, a) {
      e.exports = a(746);
    },
    472: function (e, t, a) {},
    473: function (e, t) {
      function a(e) {
        if (!e.endsWith('vue.js')) return;
        const t = window.Vue || window.LEAH_Vue;
        !(function (e) {
          try {
            if (Object.keys(e).length > 2) return void (e.default || (e.default = e));
            const t = e.default;
            t && Object.assign(e, t);
          } catch (t) {
            console.error('ensureModShape err:', t);
          }
        })(t),
          (window.Vue = t),
          (window.LEAH_Vue = t);
      }
      !(function () {
        const e = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (!e) return;
        new e(function (e) {
          e.forEach(function (e) {
            const { addedNodes: t } = e,
              n = t.length;
            for (let r = 0; r < n; r++) {
              const e = t[r].src || '';
              e && a(e);
            }
          });
        }).observe(document, { childList: !0 });
      })();
    },
    474: function (e, t) {},
    533: function (e, t) {},
    577: function (e, t) {},
    746: function (e, t, a) {
      'use strict';
      a.r(t);
      var n = {};
      a.r(n),
        a.d(n, 'LATEST_VISIT', function () {
          return L;
        }),
        a.d(n, 'STAR', function () {
          return I;
        }),
        a.d(n, 'CREATED', function () {
          return O;
        }),
        a.d(n, 'STORE', function () {
          return M;
        }),
        a.d(n, 'NEW_APP', function () {
          return T;
        }),
        a.d(n, 'CLASS_MGR', function () {
          return V;
        }),
        a.d(n, 'SYNC_STAFF', function () {
          return j;
        }),
        a.d(n, 'SYNC_ALLOWED_APPS', function () {
          return N;
        }),
        a.d(n, 'NEW_PLATFORM_APP', function () {
          return D;
        }),
        a.d(n, 'TOP', function () {
          return B;
        }),
        a.d(n, 'INTRO', function () {
          return P;
        }),
        a.d(n, 'WELCOME', function () {
          return z;
        });
      var r = {};
      a.r(r),
        a.d(r, 'OUT_URL_PREFIX', function () {
          return R;
        }),
        a.d(r, 'OUT_URL_PREFIX_V2', function () {
          return F;
        }),
        a.d(r, 'HEL_CHARGER', function () {
          return H;
        }),
        a.d(r, 'HEL_ADMINS', function () {
          return U;
        }),
        a.d(r, 'LS_HUB_PORTAL_STATE', function () {
          return G;
        }),
        a.d(r, 'IMG_TNEWS_SPLASH_SCREEN', function () {
          return K;
        }),
        a.d(r, 'DEFAULT_LOGO', function () {
          return W;
        }),
        a.d(r, 'ICON_HEL', function () {
          return q;
        }),
        a.d(r, 'ICON_PIPELINE', function () {
          return J;
        }),
        a.d(r, 'ICON_GITCODE', function () {
          return Y;
        }),
        a.d(r, 'ICON_STAR_NO', function () {
          return $;
        }),
        a.d(r, 'ICON_STAR', function () {
          return X;
        }),
        a.d(r, 'ICON_DEL', function () {
          return Z;
        }),
        a.d(r, 'HEL_ARCH', function () {
          return Q;
        }),
        a.d(r, 'HEL_BANNER', function () {
          return ee;
        }),
        a.d(r, 'HEL_LABEL_LOGO', function () {
          return te;
        }),
        a.d(r, 'HEL_REMOTE_LIB_CASE', function () {
          return ae;
        }),
        a.d(r, 'HEL_REMOTE_REACT_CASE', function () {
          return ne;
        }),
        a.d(r, 'HEL_REMOTE_VUE_CASE', function () {
          return re;
        }),
        a.d(r, 'DEMO_EDITOR_BG', function () {
          return le;
        }),
        a.d(r, 'APP_CARD_GRAY', function () {
          return oe;
        }),
        a.d(r, 'SEC_STR', function () {
          return pe;
        }),
        a.d(r, 'path2Module', function () {
          return ue;
        }),
        a.d(r, 'lsKeys', function () {
          return me;
        });
      var l = {};
      a.r(l),
        a.d(l, 'getSearchObj', function () {
          return jt;
        }),
        a.d(l, 'openNewTab', function () {
          return Dt;
        }),
        a.d(l, 'getMetaApiUrl', function () {
          return Pt;
        }),
        a.d(l, 'getNoHtmlContentMetaApiUrl', function () {
          return zt;
        });
      var o = {};
      a.r(o),
        a.d(o, 'setLoading', function () {
          return Rt;
        }),
        a.d(o, 'redirectTo', function () {
          return Ft;
        }),
        a.d(o, 'loadSubApp', function () {
          return Ht;
        }),
        a.d(o, 'initUserExtendData', function () {
          return Ut;
        }),
        a.d(o, 'login', function () {
          return Gt;
        }),
        a.d(o, 'updateUserVisitApp', function () {
          return Kt;
        }),
        a.d(o, 'changeSubApp', function () {
          return Wt;
        }),
        a.d(o, 'checkPageUrl', function () {
          return qt;
        }),
        a.d(o, 'updateStarApps', function () {
          return Jt;
        }),
        a.d(o, 'mergeSubAppMap', function () {
          return Yt;
        }),
        a.d(o, 'delVisitApp', function () {
          return $t;
        }),
        a.d(o, 'delStarApp', function () {
          return Xt;
        }),
        a.d(o, 'initClassInfoList', function () {
          return Zt;
        });
      var c = {};
      a.r(c),
        a.d(c, 'displaySubAppWithSideBar', function () {
          return Qt;
        }),
        a.d(c, 'displaySubAppOnly', function () {
          return ea;
        }),
        a.d(c, 'isCurActiveAppRich', function () {
          return ta;
        }),
        a.d(c, 'isAdmin', function () {
          return aa;
        });
      var i = {};
      a.r(i),
        a.d(i, 'initPage', function () {
          return fa;
        }),
        a.d(i, 'initStarList', function () {
          return ba;
        }),
        a.d(i, 'initCreatedList', function () {
          return Ea;
        }),
        a.d(i, 'initVisitList', function () {
          return ya;
        }),
        a.d(i, 'initTop', function () {
          return wa;
        }),
        a.d(i, 'initAllPage', function () {
          return va;
        }),
        a.d(i, 'changePageAndLoading', function () {
          return ka;
        }),
        a.d(i, 'fetchDataList', function () {
          return Ca;
        }),
        a.d(i, 'handleStarIconClick', function () {
          return _a;
        }),
        a.d(i, 'handleDelIconClick', function () {
          return Sa;
        }),
        a.d(i, 'delSubAppInView', function () {
          return xa;
        }),
        a.d(i, 'handleOtherPages', function () {
          return Aa;
        }),
        a.d(i, 'updateSubAppViewModel', function () {
          return La;
        }),
        a.d(i, 'updateSubApp', function () {
          return Ia;
        }),
        a.d(i, 'searchApp', function () {
          return Oa;
        }),
        a.d(i, 'refreshCurPage', function () {
          return Ma;
        }),
        a.d(i, 'refreshStoreApp', function () {
          return Ta;
        }),
        a.d(i, 'resetAppInfoCache', function () {
          return Va;
        });
      var s = {};
      a.r(s),
        a.d(s, 'listMode', function () {
          return ja;
        });
      var p = {};
      a.r(p),
        a.d(p, 'modTableMeta', function () {
          return Ha;
        }),
        a.d(p, 'handlePageCurrentChange', function () {
          return Ua;
        }),
        a.d(p, 'handleNextPage', function () {
          return Ga;
        }),
        a.d(p, 'handlePageSizeChange', function () {
          return Ka;
        }),
        a.d(p, 'clearTable', function () {
          return Wa;
        }),
        a.d(p, 'fetchTableData', function () {
          return qa;
        });
      var u = {};
      a.r(u),
        a.d(u, 'refreshTableCurPage', function () {
          return rn;
        }),
        a.d(u, 'freshSubApp', function () {
          return ln;
        }),
        a.d(u, 'freshSubAppGlobalMarkInfo', function () {
          return on;
        }),
        a.d(u, 'freshSubAppAssociate', function () {
          return cn;
        }),
        a.d(u, 'freshSubAppAssociateAndTable', function () {
          return sn;
        }),
        a.d(u, 'fetchVersionList', function () {
          return pn;
        }),
        a.d(u, 'updateAppVersion', function () {
          return un;
        }),
        a.d(u, 'clickUpdateVersionBtn', function () {
          return mn;
        }),
        a.d(u, 'clear', function () {
          return dn;
        }),
        a.d(u, 'showChangeOnlineInput', function () {
          return gn;
        }),
        a.d(u, 'showChangeGrayInput', function () {
          return hn;
        }),
        a.d(u, 'agreeGray', function () {
          return fn;
        }),
        a.d(u, 'clickAgreeGrayBtn', function () {
          return bn;
        }),
        a.d(u, 'delAppUserMark', function () {
          return En;
        }),
        a.d(u, 'delAppGlobalMark', function () {
          return yn;
        }),
        a.d(u, 'changeListMode', function () {
          return wn;
        }),
        a.d(u, 'updateProjVer', function () {
          return vn;
        }),
        a.d(u, 'resetVerCache', function () {
          return kn;
        });
      var m = {};
      a.r(m),
        a.d(m, 'refreshTableCurPage', function () {
          return Sn;
        }),
        a.d(m, 'fetchDataList', function () {
          return xn;
        }),
        a.d(m, 'clear', function () {
          return An;
        }),
        a.d(m, 'changeListMode', function () {
          return Ln;
        });
      var d = {};
      a.r(d),
        a.d(d, 'remoteLib', function () {
          return $n;
        }),
        a.d(d, 'remoteLibLazy', function () {
          return Xn;
        }),
        a.d(d, 'remoteReact', function () {
          return Zn;
        }),
        a.d(d, 'remoteVue', function () {
          return Qn;
        });
      var g = {};
      a.r(g),
        a.d(g, 'makeGroupButtonView', function () {
          return jo;
        }),
        a.d(g, 'makeRadioGroupView', function () {
          return No;
        }),
        a.d(g, 'makeInputView', function () {
          return Do;
        }),
        a.d(g, 'makeSelectView', function () {
          return Bo;
        }),
        a.d(g, 'makeInputGroupView', function () {
          return Po;
        }),
        a.d(g, 'makeInputMultiView', function () {
          return zo;
        }),
        a.d(g, 'makeInputNumberView', function () {
          return Ro;
        }),
        a.d(g, 'makeSwitchView', function () {
          return Fo;
        }),
        a.d(g, 'makeCustomizeView', function () {
          return Ho;
        }),
        a.d(g, 'fieldTypeMakerMap', function () {
          return Uo;
        }),
        a.d(g, 'getFieldTypeMaker', function () {
          return Go;
        });
      a(472), a(473);
      var h = a(51);
      var f = a(40);
      function b(e) {
        return Object.keys(e);
      }
      function E(e) {
        if (e) return JSON.parse(JSON.stringify(e));
        throw new Error('empty object');
      }
      function y(e, t) {
        const a = Object(f.a)({}, e);
        return t
          ? (Object.keys(t).forEach((e) => {
              const n = t[e];
              void 0 !== n && null !== n && (a[e] = n);
            }),
            a)
          : a;
      }
      function w(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        if (!e) return t || e;
        try {
          return JSON.parse(e);
        } catch (a) {
          return t || e;
        }
      }
      function v(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        const { nullValues: a = [null, void 0, ''], emptyObjIsNull: n = !0, emptyArrIsNull: r = !0 } = t,
          l = a.includes(e);
        return !!l || (Array.isArray(e) ? !!r && 0 === e.length : 'object' === typeof e && !!n && 0 === Object.keys(e).length);
      }
      function k(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }
      function C(e, t) {
        const a = t || ((e) => !v(e)),
          n = {};
        return (
          b(e).forEach((t) => {
            a(e[t]) && (n[t] = e[t]);
          }),
          n
        );
      }
      function _(e, t) {
        e.includes(t) || e.push(t);
      }
      function S(e, t) {
        Array.isArray(e[t]) || (e[t] = [e[t]]);
      }
      var x = a(271),
        A = a.n(x);
      const L = '/latest-visit',
        I = '/star',
        O = '/created',
        M = '/store',
        T = '/new-app',
        V = '/class-management',
        j = '/sync-staff',
        N = '/sync-allowed-apps',
        D = '/new-app2',
        B = '/top',
        P = '/intro',
        z = '/welcome',
        R = 'https://footprint.qq.com/hel',
        F = 'https://helmicro.com',
        H = 'fantasticsoul',
        U = window.__HELPACK_ADMINS__ || [H],
        G = 'hub.portalState',
        K = 'https://mat1.gtimg.com/news/js/tnfe/imgs/leah4/t-fetching.png',
        W = 'https://tnfe.gtimg.com/hel-img/tnew-logo.png',
        q = 'https://tnfe.gtimg.com/hel-img/hel-logo-64.png',
        J = 'https://tnfe.gtimg.com/image/k7ajm4boap_1623656062511.png',
        Y = 'https://tnfe.gtimg.com/hel-img/gitcode-logo-v2.png',
        $ = 'https://tnfe.gtimg.com/hel-img/star-no-v3.png',
        X = 'https://tnfe.gtimg.com/hel-img/star.png',
        Z = 'https://tnfe.gtimg.com/hel-img/icon-del.png',
        Q = 'https://tnfe.gtimg.com/image/f13q7cuzxt_1652895450360.png',
        ee = 'https://tnfe.gtimg.com/image/eai2tlcqqm_1641021424949.jpg',
        te = 'https://tnfe.gtimg.com/image/cr34f76naf_1641028409205.png',
        ae = 'https://tnfe.gtimg.com/image/7bljnu12is_1652903733496.png',
        ne = 'https://tnfe.gtimg.com/image/as5esz5jel_1652903738582.png',
        re = 'https://tnfe.gtimg.com/image/snddrqs0o9_1652903744537.png',
        le = 'https://tnfe.gtimg.com/image/li4ag50scc_1653811070745.png',
        oe = 'TODO:app-card-gray-demo-image',
        ce = 'xc_is_cool_bilibalaweiwei',
        ie = window.__HELPACK_SECSTR__ || ce;
      let se = '';
      if (ie === ce) se = ce;
      else {
        const e = 'ayxfbrysVczsIVjsgo'.replace('x', '').replace('y', '').replace('z', ''),
          t = { mode: A.a.mode.ECB, padding: A.a.pad.Pkcs7 };
        se = A.a.AES.decrypt(ie, e, t).toString(A.a.enc.Utf8);
      }
      const pe = se,
        ue = { [L]: 'latestVisit', [I]: 'starList', [M]: 'appStore', [B]: 'top', [O]: 'createdList' },
        me = { APP_CARD_GRAY: 'helpack.appCard.bgGray', LIST_MODE: 'helpack.appStore.listMode' };
      var de = a(462),
        ge = a(225),
        he = a(305),
        fe = a.n(he);
      const { LATEST_VISIT: be, STAR: Ee, STORE: ye, INTRO: we } = n;
      function ve() {
        const { pathname: e } = window.top.location,
          t = e.substring(1);
        return t.startsWith('page/') ? t.substring(5) : t;
      }
      function ke() {
        const e = ge.history.getRouterHistory();
        if (!e) return window.top.location.hash.substr(1);
        const { pathname: t } = e.location;
        return t;
      }
      let Ce = (function () {
        const e = window.top.location.hash.substr(1);
        return [be, Ee, ye, we, '/'].includes(e) ? e : '/';
      })();
      function _e(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        t ? Se(''.concat(window.top.location.origin, '/#').concat(e)) : ((Ce = e), ge.history.push(e));
      }
      function Se(e) {
        let t = e;
        e.endsWith('#/') && (t = e.substr(0, e.length - 2));
        const { port: a } = window.location;
        if (a && t.includes(''.concat(a, '/page/')))
          return de.b.warn('\u4e0d\u652f\u6301\u5728\u672c\u5730\u5f00\u53d1\u65f6\u8bbf\u95ee '.concat(t));
        !(function () {
          const e = Object(h.getState)('portal');
          (e.persistTime = Date.now()), (e.justLoadByHrefRefresh = !0);
          try {
            localStorage.setItem(G, JSON.stringify(e));
          } catch (t) {}
        })(),
          (window.top.location.href = t);
      }
      function xe(e) {
        const { project_name: t } = e;
        return 'https://some-devops/pipeline/'.concat(t);
      }
      function Ae(e) {
        const { project_name: t, pipeline_id: a, build_id: n, plugin_ver: r } = e;
        return r ? 'https://some-devops/console/pipeline/'.concat(t, '/').concat(a, '/detail/').concat(n) : '';
      }
      function Le(e) {
        return console.log('get avatar for name '.concat(e)), 'https://avatars.githubusercontent.com/u/7334950?v=4&size=64';
      }
      var Ie = function () {
          let e = {};
          try {
            const t = JSON.parse(localStorage.getItem(G)),
              {
                userInfo: a,
                starAppNames: n,
                name2SubApp: r,
                visitAppNames: l,
                justLoadByHrefRefresh: o,
                persistTime: c,
                basicDataReady: i,
              } = t;
            e =
              Date.now() - c > 3e3
                ? { persistTime: c }
                : {
                    userInfo: a,
                    starAppNames: n,
                    name2SubApp: r,
                    visitAppNames: l,
                    justLoadByHrefRefresh: o,
                    persistTime: c,
                    basicDataReady: i,
                  };
          } catch (r) {}
          let t = ve();
          t.startsWith('__hub') && (t = '');
          const a = !t;
          let n = {
            delayRemoveStyle: 0,
            loading: !1,
            sideBarVisible: a,
            ballVisible: !a,
            contentVisible: a,
            basicDataReady: !1,
            userInfo: { user: '', icon: '' },
            starAppNames: [],
            visitAppNames: [],
            userMarkedList: [],
            activeApp: t,
            appVerId2detail: {},
            name2SubApp: {},
            persistTime: 0,
            moduleLoadtime: Date.now(),
            justLoadByHrefRefresh: !1,
          };
          return (n = y(n, e)), n;
        },
        Oe = a(771),
        Me = a(449),
        Te = a.n(Me);
      var Ve = a(139),
        je = a(236),
        Ne = a.n(je),
        De = a(400),
        Be = a(450),
        Pe = a.n(Be);
      const ze = {},
        Re = ['info', 'error', 'success', 'warn', 'warning'];
      function Fe(e, t, a, n, r) {
        if (!Re.includes(e)) return console.error('messageService call invalid method['.concat(e, ']')), t('ignored');
        if (r < 0) return t(de.b[e](a, n));
        const l = ''.concat(e, '_').concat(a);
        if (ze[l]) return t('ignored');
        (ze[l] = setTimeout(() => {
          delete ze[l];
        }, r)),
          t(de.b[e](a, n));
      }
      function He(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1200;
        return new Promise((n) => {
          Fe('info', n, e, t, a);
        });
      }
      function Ue(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1200;
        return new Promise((n) => {
          Fe('error', n, e, t, a);
        });
      }
      function Ge(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1200;
        return new Promise((n) => {
          Fe('success', n, e, t, a);
        });
      }
      function Ke(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1200;
        return new Promise((n) => {
          Fe('warn', n, e, t, a);
        });
      }
      function We(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1200;
        return new Promise((n) => {
          Fe('warning', n, e, t, a);
        });
      }
      var qe = 'hel_1000';
      const Je = ['checkFn', 'defaultValue'];
      Ne.a.setConfig({ retryCount: 3, timeout: 2e4 });
      const Ye = { headers: { 'Content-Type': 'application/json' }, withCredentials: !0 },
        $e = function (e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          const { returnLogicData: n = !0, check: r = !0 } = a,
            { statusCode: l = 0 } = e,
            o = e.data || e;
          if (l >= 400) throw new Error('\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef'.concat(l));
          const { status: c = '0', message: i = '\u63a5\u53e3\u683c\u5f0f\u9519\u8bef', response: s, code: p, data: u, msg: m } = o;
          if (r && void 0 !== c && '0' !== c) {
            const e = new Error(i);
            throw ((e.status = c), (e.url = t), e);
          }
          if (r && void 0 !== p && '0' !== String(p)) {
            const e = new Error('url: '.concat(t, ' ').concat(m || i));
            throw ((e.code = p), e);
          }
          return n ? (void 0 !== u ? u : s) : o;
        },
        Xe = (e, t) => {
          const a = e.replace(/ /g, '');
          let n = ''.concat(a);
          return t
            ? a.includes('?')
              ? ''.concat(n, '&').concat(fe.a.stringify(t))
              : ''.concat(n, '?').concat(fe.a.stringify(t))
            : (e.startsWith('http') || (n = ''.concat(window.top.location.origin).concat(n)), n);
        },
        Ze = (e) => {
          const t = Date.now();
          return e.includes('?') ? ''.concat(e, '&_rt=').concat(t) : ''.concat(e, '?_rt=').concat(t);
        };
      function Qe(e, t) {
        if (!t) {
          throw (
            (e.code === qe
              && Ue('\u4f60\u7684\u5f53\u524d\u7cfb\u7edf\u65f6\u95f4\u4e0d\u6b63\u786e\uff0c\u8bf7\u6821\u6b63\u540e\u518d\u5c1d\u8bd5'),
            e)
          );
        }
        return (
          e && e.response && e.response.status >= 400 && Ue('\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef '.concat(e.response.status)), t
        );
      }
      async function et(e, t, a) {
        let n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
        const { returnLogicData: r, defaultValue: l = '', check: o = !0 } = n;
        try {
          delete n.returnLogicData, delete n.check;
          const l = Object(f.a)(Object(f.a)({}, Ye), n);
          let c;
          if ('get' === e) {
            const n = Ze(Xe(t, a));
            c = await Ne.a[e](n, '', l);
          } else c = await Ne.a[e](Xe(t, ''), a, l);
          return $e(c, t, { returnLogicData: r, check: o });
        } catch (c) {
          return Qe(c, l);
        }
      }
      async function tt(e, t, a) {
        return et('post', e, t, a);
      }
      const at = async (e) => {
        let { checkFn: t = $e, defaultValue: a } = e,
          n = Object(Ve.a)(e, Je);
        try {
          if (((n.url = Xe(n.url)), 'jsonp' === n.method)) {
            return t(await Pe()({ type: 'jsonp', url: ''.concat(n.url, '?').concat(fe.a.stringify(n.data)) }));
          }
          ('get' !== n.method && n.method) || ((n.params = n.data), delete n.data), (n.withCredentials = !0);
          const { data: e } = await Object(De.a)(n);
          return t(e);
        } catch (r) {
          return console.error(n, r.message), Ue(r.message), a;
        }
      };
      (at.get = async function (e, t, a) {
        return et('get', e, t, a);
      }),
        (at.put = async function (e, t, a) {
          return et('put', e, t, a);
        }),
        (at.xFormPost = async function (e, t) {
          let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          const { returnLogicData: n, defaultValue: r = '' } = a;
          try {
            delete a.returnLogicData;
            const r = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, withCredentials: !0 },
              l = await Ne.a.post(Xe(e, t), {}, r);
            return $e(l, e, n);
          } catch (l) {
            return Qe(l, r);
          }
        }),
        (at.post = tt),
        (at.postE = async function (e, t) {
          let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          try {
            return tt(e, t, a);
          } catch (n) {
            return We(n.message), Qe(n, a.defaultValue);
          }
        }),
        (at.postFromData = async function (e, t) {
          const a = new FormData();
          Object.keys(t).forEach((e) => {
            a.append(e, t[e]);
          });
          const n = De.a.create({ withCredentials: !0 });
          return new Promise((t, r) => {
            n.post(e, a).then((e) => {
              200 == e.status ? t(e.data) : r(e.status);
            });
          });
        }),
        (at.multiGet = async function (e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const { returnLogicData: a, defaultValue: n = '' } = t;
          try {
            delete t.returnLogicData;
            const n = e.map((e) => Xe(e, '')),
              r = void 0 !== t.failStrategy ? t.failStrategy : Ne.a.const.KEEP_ALL_BEEN_EXECUTED;
            return (await Ne.a.multiGet(n, Object(f.a)(Object(f.a)({}, Ye), { failStrategy: r }))).map((e, t) => $e(e, n[t], a));
          } catch (r) {
            return Qe(r, n);
          }
        }),
        (at.multiPost = async function (e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          const { returnLogicData: a, defaultValue: n = '' } = t;
          try {
            delete t.returnLogicData, e.forEach((e) => (e.url = Xe(e.url, '')));
            const n = void 0 !== t.failStrategy ? t.failStrategy : Ne.a.const.KEEP_ALL_BEEN_EXECUTED;
            return (await Ne.a.multiPost(e, Object(f.a)(Object(f.a)({}, Ye), { failStrategy: n }))).map((t, n) => $e(t, e[n].url, a));
          } catch (r) {
            return Qe(r, n);
          }
        });
      var nt = at;
      function rt(e) {
        return A.a.MD5(e).toString();
      }
      function lt(e, t, a) {
        const n = rt(''.concat(t, '_').concat(a, '_').concat(pe));
        return ''.concat(e, '&nonce=').concat(n);
      }
      function ot(e, t, a) {
        const n = Date.now(),
          r = rt(''.concat(t, '_').concat(n, '_').concat(pe)),
          l = e.includes('?') ? '&' : '?',
          o = ''
            .concat(a ? 'name='.concat(t, '&') : '', 'timestamp=')
            .concat(n, '&nonce=')
            .concat(r);
        return ''.concat(e).concat(l).concat(o);
      }
      function ct(e) {
        const t = Object(f.a)({}, e);
        return (
          t.gray_users && 'object' === typeof t.gray_users && (t.gray_users = JSON.stringify(t.gray_users)),
          t.owners && 'object' === typeof t.owners && (t.owners = JSON.stringify(t.owners)),
          t
        );
      }
      async function it() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = Object(f.a)({}, e);
        t.page || (t.page = 1), t.size || (t.size = 20), (t = C(t)), (t.page = t.page - 1);
        const a = Date.now();
        let n = '/api/v1/app/info/querySubApps?timestamp='.concat(a);
        const r = ''.concat(t.page, '_').concat(pe, '_').concat(t.size, '_').concat(a),
          l = rt(r);
        n = ''.concat(n, '&nonce=').concat(l);
        const o = await nt.post(n, t);
        return o;
      }
      async function st(e) {
        return await nt.get('/api/v1/app/info/getSubApp?name='.concat(e));
      }
      async function pt(e) {
        const t = Date.now(),
          a = rt(''.concat(e.name, '_').concat(t, '_').concat(pe));
        return await nt.post('/api/v1/app/info/createSubApp?timestamp='.concat(t, '&nonce=').concat(a), ct(e));
      }
      async function ut(e) {
        const t = Date.now(),
          a = rt(''.concat(e.id, '_').concat(t, '_').concat(pe)),
          n = '/api/v1/app/info/updateSubApp?timestamp='.concat(t, '&nonce=').concat(a);
        return await nt.post(n, ct(e), { check: !1, returnLogicData: !1 });
      }
      async function mt(e, t, a) {
        const n = a ? '1' : '0';
        return await nt.get('/api/v1/app/info/getSubAppVersion?name='.concat(e, '&ver=').concat(t, '&content=').concat(n));
      }
      const dt = {};
      function gt(e, t) {
        let a = dt[e];
        a || (a = dt[e] = []), a.push(t);
      }
      function ht(e) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) a[n - 1] = arguments[n];
        const r = dt[e];
        r && r.forEach((e) => e(...a));
      }
      var ft = a(0),
        bt = a.n(ft);
      Et = 'counter';
      var Et;
      function yt() {
        for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a];
        return t;
      }
      function wt(e, t, a) {
        const n = a || {},
          { setup: r, tag: l, extra: o, staticExtra: c, cuDesc: i, passCuDesc: s = !0, props: p = {}, ccClassKey: u } = n,
          m = { module: e, connect: t, setup: r, props: p, tag: l, extra: o, staticExtra: c, cuDesc: null };
        return s && (m.cuDesc = i), { regOpt: m, ccClassKey: u };
      }
      function vt(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        const { regOpt: a, ccClassKey: n } = wt(e, [], t);
        return Object(h.useConcent)(a, n);
      }
      function kt(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        const a = Object(f.a)({ setup: e }, t),
          { regOpt: n, ccClassKey: r } = wt(h.cst.MODULE_DEFAULT, [], a),
          { settings: l } = Object(h.useConcent)(n, r);
        return l;
      }
      function Ct(e, t) {
        let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return yt(e, t), a;
      }
      function _t(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return yt(h.cst.MODULE_DEFAULT, e), t;
      }
      function St(e) {
        return Object(h.getState)(e);
      }
      function xt(e) {
        return Object(h.getComputed)(e);
      }
      function At() {
        return Object(h.getState)();
      }
      const Lt = h.reducer,
        It = h.default.emit;
      function Ot() {
        const e = Date.now();
        return { timestamp: e, nonce: rt(''.concat(pe, '_').concat(e)) };
      }
      async function Mt() {
        const { timestamp: e, nonce: t } = Ot();
        return await nt.get('/api/v1/classInfo/list?timestamp='.concat(e, '&nonce=').concat(t));
      }
      function Tt(e) {
        return ''.concat(window.location.origin, '/page/').concat(e);
      }
      function Vt(e, t) {
        const a = e.slice(),
          n = a.indexOf(t);
        return n >= 0 && a.splice(n, 1), a;
      }
      function jt() {
        const { search: e } = window.top.location,
          t = {};
        if (e && e.startsWith('?')) {
          return (
            e
              .substring(1)
              .split('&')
              .forEach((e) => {
                const [a, n] = e.split('=');
                t[a] = n;
              }),
            t
          );
        }
        return t;
      }
      let Nt = null;
      function Dt(e) {
        const t = window.top;
        if (!Nt) {
          const e = t.document.createElement('a');
          Nt = e;
        }
        (Nt.href = e), (Nt.target = '_blank'), (Nt.rel = 'noopener norefferrer'), Nt.click();
        try {
          Nt.parentNode.removeChild(Nt);
        } catch (a) {
          throw new Error('\u65b0\u7a97\u53e3\u6253\u5f00\u5e94\u7528\u6210\u529f');
        }
      }
      function Bt(e) {
        const { isOut: t = !0, isV2: a = !0, version: n = '' } = e || {},
          r = n ? '&version='.concat(n) : '';
        let l = window.location.origin;
        return t && (l = a ? F : R), { prefix: l, versionQuery: r };
      }
      function Pt(e, t) {
        const { prefix: a, versionQuery: n } = Bt(t);
        return ''.concat(a, '/openapi/v1/app/info/getSubAppAndItsFullVersion?name=').concat(e).concat(n);
      }
      function zt(e, t) {
        const { prefix: a, versionQuery: n } = Bt(t);
        return ''.concat(a, '/openapi/v1/app/info/getSubAppAndItsVersion?name=').concat(e).concat(n);
      }
      function Rt(e, t) {
        if (t.loading !== e) return { loading: e };
      }
      function Ft(e, t, a) {
        window.top.history.replaceState({}, '\u6d77\u62c9\u6a21\u5757\u7ba1\u63a7', '/'),
          a.setState({ contentVisible: !0, sideBarVisible: !0, loading: !1, activeApp: null });
        const n = Ce;
        ge.history.push(n);
      }
      async function Ht(e, t, a) {
        if (!e) return;
        await a.setState({ loading: !0, contentVisible: !1, sideBarVisible: !1 });
        const n = (e) => {
          e && de.b.warn(e), ht('removeBg'), a.setState({ activeApp: null, loading: !1, contentVisible: !0, sideBarVisible: !0 });
        };
        try {
          const { appVerId2detail: r, name2SubApp: o, activeApp: c } = t;
          let i = o[e];
          if (!i) {
            if (((i = await st(e)), !i)) return void n('['.concat(e, ']\u672a\u5728\u5e94\u7528\u4e2d\u5fc3\u6ce8\u518c\u8fc7'));
            (o[e] = i), await a.setState({ name2SubApp: o });
          }
          if (!i.is_local_render) {
            const e = i.render_app_host || ''.concat(window.location.origin, '/page/').concat(i.name);
            return console.trace('targetSubApp', i, e), void console.trace(l);
          }
          ht('addBg', i.splash_screen);
          const { online_version: s, build_version: p, enable_gray: u, is_in_gray: m, gray_users: d } = i;
          let g =
            (function () {
              const e = window.top.location.search;
              return (e && fe.a.parse(e, { ignoreQueryPrefix: !0 })._appv) || '';
            })() || s;
          if ((u && m && d.includes(t.userInfo.user) && (g = p), !g))
            return void n('['.concat(e, ']\u8fd8\u672a\u53d1\u5e03\u4efb\u4f55\u7248\u672c'));
          let h = r[g];
          if ((h || (h = await mt(i.name, g)), !h)) return void n('\u7248\u672c['.concat(g, ']\u6570\u636e\u5f02\u5e38'));
          const f = i.name;
          if (i.is_back_render) {
            const e = (e) => {
              window.top.history.replaceState({}, '\u6d77\u62c9\u6a21\u5757\u7ba1\u63a7', '/'),
                e && window.top.open(''.concat(window.top.location.origin, '/page/').concat(e));
            };
            return (
              n(),
              void (Date.now() - t.moduleLoadtime < 3e3
                ? Oe.a.confirm({ title: '\u786e\u8ba4\u6253\u5f00\u5e94\u7528'.concat(f), onOk: () => e(f), onCancel: () => e() })
                : e(f))
            );
          }
          (r[g] = h), Te.a.save('__leah_sub_app_name__', e), await a.setState({ activeApp: e, appVerId2detail: r, loading: !1 });
          const b = o[c];
          if (!t.justLoadByHrefRefresh) {
            const e = () => {
              Se(location.href);
            };
            if ((c !== f && b && b.is_rich) || i.is_rich) return e();
          }
          await a.setState({ justLoadByHrefRefresh: !1 });
          const { sub_app_name: E, sub_app_version: y, version_tag: w } = h,
            v = w || y;
          if ('standalone' === i.render_mode && !h.html_content) {
            const e = await mt(E, v, !0);
            return document.write(''), void document.write(e.html_content);
          }
          await renderSubApp(i, h);
        } catch (r) {
          throw (await a.dispatch(Rt, !1), r);
        }
      }
      async function Ut(e, t) {
        const { user: a } = t.userInfo,
          {
            starAppNames: n,
            visitAppNames: r,
            markedInfo: l,
          } = await (async function (e) {
            const t = Date.now(),
              a = 'combine3api_for_'.concat(e);
            let n = '/api/v1/app/info/combine3api?timestamp='.concat(t, '&name=').concat(a);
            n = lt(n, a, t);
            const r = await nt.get(n);
            return r.markedInfo || (r.markedInfo = { markedList: [] }), r;
          })(a);
        return { starAppNames: n, visitAppNames: r, userMarkedList: l.markedList };
      }
      async function Gt(e, t, a) {
        return (
          await a.setState({ userInfo: { user: 'test-user', icon: '', login: !0 } }),
          await a.dispatch(Ut),
          { loading: !1, basicDataReady: !0 }
        );
      }
      async function Kt(e) {
        try {
          const t = await (async function (e) {
            return await nt.get('/api/v1/app/info/updateUserVisitApp?name='.concat(e));
          })(e);
          return Lt.latestVisit.setState({ needRefresh: !0 }), { visitAppNames: t };
        } catch (t) {}
      }
      async function Wt(e, t, a) {
        const { appName: n, isLocalRender: r, noNewTab: l, renderAppPath: o } = e;
        let c = r,
          i = o;
        if (void 0 === c || !i) {
          const e = a.rootState.appStore.name2SubApp;
          let t = e[n];
          if (!t) {
            if (((t = await st(n)), !t)) return void de.b.warn('\u5e94\u7528 '.concat(n, ' \u4e0d\u5b58\u5728'));
            (e[n] = t), Lt.appStore.setState({ name2SubApp: e });
          }
          (c = t.is_local_render), (i = t.render_app_host || Tt(n));
        }
        if (!(c && l)) return de.b.success('\u5728\u65b0\u9875\u7b7e\u91cc\u8bbf\u95ee '.concat(n)), void window.open(i);
        try {
          a.dispatch(Kt, n);
        } catch (s) {}
        window.top.history.replaceState({}, n, '/'.concat(n)),
          window.top.location.reload(''.concat(window.top.location.origin, '/').concat(n));
      }
      function qt(e, t) {
        const a = ve(),
          { activeApp: n } = t;
        ((n && ('__hub' === a || '' === a)) || (!n && '__hub' !== a))
          && (console.log('[hel] redirect to '.concat(window.top.location.origin)),
          (window.top.location.href = ''.concat(window.top.location.origin).concat(window.top.location.pathname)),
          window.top.location.reload());
      }
      function Jt(e, t) {
        let { appName: a, _star: n } = e;
        const { starAppNames: r } = t;
        if (n) r.includes(a) || r.push(a);
        else if (r.includes(a)) {
          const e = r.indexOf(a);
          r.splice(e, 1);
        }
        return { starAppNames: r };
      }
      function Yt(e, t) {
        const { name2SubApp: a } = t;
        return Object.assign(a, e), { name2SubApp: a };
      }
      function $t(e, t) {
        const { visitAppNames: a } = t;
        return { visitAppNames: Vt(a, e) };
      }
      function Xt(e, t) {
        const { starAppNames: a } = t;
        return { starAppNames: Vt(a, e) };
      }
      async function Zt(e, t, a) {
        yt(e, t, a);
        return { allClassInfoList: await Mt() };
      }
      function Qt(e) {
        const { sideBarVisible: t, contentVisible: a } = e;
        return t && !a;
      }
      function ea(e) {
        const { sideBarVisible: t, contentVisible: a } = e;
        return !t && !a;
      }
      function ta(e) {
        const { activeApp: t, name2SubApp: a } = e,
          n = a[t];
        return n && n.is_rich;
      }
      function aa(e) {
        const { userInfo: t } = e;
        return U.includes(t.user);
      }
      var na = {
        state: Ie,
        reducer: o,
        computed: c,
        lifecycle: {
          loaded(e) {
            e(Zt);
          },
        },
      };
      function ra(e, t) {
        e.logo || (e.logo = W),
          (e._loading = !1),
          t && (e._star = t.includes(e.name)),
          void 0 === e.enable_gray && (e.enable_gray = 0),
          void 0 === e.is_in_gray && (e.is_in_gray = 0);
      }
      function la(e, t, a) {
        const n = a || {};
        return (
          e.forEach((e) => {
            ra(e, t), (n[e.name] = e);
          }),
          { subApps: e, name2SubApp: n }
        );
      }
      function oa(e) {
        const { appNames: t, user: a, page: n = 1, size: r = 20, isTop: l } = e,
          o = { page: n, size: r, where: {} };
        return t && (o.where.name = t), void 0 !== l && (o.where.is_top = l), a && (o.where.create_by = a), o;
      }
      function ca() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 100;
        const t = Math.random();
        return parseInt(t * e, 10);
      }
      const ia = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         '];
      const sa = [
          'a',
          'A',
          'b',
          'B',
          'c',
          'C',
          'd',
          'D',
          'e',
          'E',
          'f',
          'F',
          'g',
          'G',
          'h',
          'H',
          'i',
          'I',
          'j',
          'J',
          'k',
          'K',
          'l',
          'L',
          'm',
          'M',
          'n',
          'N',
          'o',
          'O',
          'p',
          'P',
          'q',
          'Q',
          'r',
          'R',
          's',
          'S',
          't',
          'T',
          'u',
          'U',
          'v',
          'V',
          'w',
          'W',
          'x',
          'X',
          'y',
          'Y',
          'z',
          'Z',
        ],
        pa = sa.length;
      function ua(e) {
        return (t, a) => {
          const n = e(t),
            r = e(a);
          return n < r ? -1 : n > r ? 1 : 0;
        };
      }
      var ma = {
        get url() {
          return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/;
        },
        get letterOrNum() {
          return /^[A-Za-z0-9|_|-]+$/;
        },
        get letterNumOrCn() {
          return /^[\u4e00-\u9fa5A-Za-z0-9-|_]+$/;
        },
      };
      const da = ['appName'];
      function ga(e, t) {
        const a = 0 === e.subApps.length || e.needRefresh;
        return e.needRefresh && t.setState({ needRefresh: !1 }), a;
      }
      function ha(e) {
        Lt.portal.mergeSubAppMap(e, { silent: !0 });
      }
      async function fa(e, t, a) {
        const n = jt();
        if (n.app) {
          const e = { searchStr: n.app, listMode: 'all' };
          '1' === n.openver && (e.isVerTabOpen = !0), await a.setState(e);
        }
        (e || ga(t, a)) && a.dispatch(Ca, { page: 1 });
      }
      async function ba(e, t, a) {
        if (e || ga(t, a)) {
          const { starAppNames: e } = a.rootState.portal,
            t = oa({ page: 1, size: 100, appNames: e });
          a.dispatch(Ca, t);
        }
      }
      async function Ea(e, t, a) {
        if (e || ga(t, a)) {
          const e = oa({ page: 1, size: 100, user: At().portal.userInfo.user });
          a.dispatch(Ca, e);
        }
      }
      async function ya(e, t, a) {
        if (e || ga(t, a)) {
          const { visitAppNames: e } = a.rootState.portal,
            t = oa({ page: 1, size: 100, appNames: e });
          a.dispatch(Ca, t);
        }
      }
      async function wa(e, t, a) {
        if (e || ga(t, a)) {
          const e = oa({ page: 1, size: 100, isTop: 1 });
          a.dispatch(Ca, e);
        }
      }
      async function va(e, t, a) {
        let n = ke();
        '/' === n && (n = L);
        const r = { [L]: ya, [I]: ba, [M]: fa, [B]: wa, [O]: Ea },
          l = Vt(Object.keys(r), n),
          o = r[n];
        await a.dispatch([ue[n], o], !0),
          l.forEach((e) => {
            const t = ue[e];
            Lt[t].setState({ needRefresh: !0 });
          });
      }
      function ka(e) {
        let { page: t, loading: a } = e;
        return { loading: a, page: t };
      }
      async function Ca() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = arguments.length > 1 ? arguments[1] : void 0,
          a = arguments.length > 2 ? arguments[2] : void 0;
        const { listMode: n, searchStr: r, classKey: l, isVerTabOpen: o, searchType: c, searchUser: i, loading: s } = t;
        if (s) return;
        const p = e && e.page ? e.page : t.page,
          u = e && e.size ? e.size : t.size,
          m = { page: p, size: u, where: {} };
        if ((await a.setState({ page: p, size: u }), 'appStore' === a.module)) {
          if (('test' === n ? (m.where.is_test = 1) : 'prod' === n && (m.where.is_test = 0), ['name', 'name_exact'].includes(c) && r)) {
            const e = r.replace(/ /g, '');
            e && (m.where.name = 'name' === c ? '%%'.concat(e, '%%') : e);
          } else 'creator' === c && i && (m.where.create_by = i);
          '-10000' !== l && (m.where.class_key = l);
        }
        e.where && Object.assign(m.where, e.where);
        const { name2SubApp: d } = t;
        try {
          await a.dispatch(ka, { loading: !0, page: p });
          const { apps: e, total: t } = await it(m),
            { starAppNames: n } = a.rootState.portal,
            { subApps: l, name2SubApp: c } = la(e, n);
          if ((await a.dispatch(ka, { loading: !1, page: p }), 0 === l.length && p > 1))
            return Ke('\u6ca1\u6709\u66f4\u591a\u5b50\u5e94\u7528\u4e86', 1), null;
          if (('appStore' !== a.module && l.sort(ua((e) => e.app_group_name)), Object.assign(d, c), ha(c), o)) {
            await a.setState({ isVerTabOpen: !1 });
            const e = l.find((e) => e.name === r);
            e && It('openSubAppDrawer', e, 'version');
          }
          return { subApps: l, name2SubApp: d, total: t };
        } catch (g) {
          return Ue(g.message), { loading: !1 };
        }
      }
      async function _a(e, t, a) {
        let { appName: n, needDel: r = !1 } = e;
        const { name2SubApp: l } = t,
          o = n,
          c = l[o];
        if (c) {
          (c._loading = !0), await a.setState({ name2SubApp: l });
          const e = !c._star,
            t = { appName: o, _star: e };
          try {
            await (async function (e) {
              let t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
              const a = await nt.get('/api/v1/app/info/updateUserStarApp?name='.concat(e, '&star=').concat(t ? 1 : 0));
              return a;
            })(o, e),
              await Lt.portal.updateStarApps(t),
              (c._loading = !1),
              (c._star = e),
              await a.setState({ name2SubApp: l }),
              r && (await a.dispatch(xa, o), Lt.portal.delStarApp(o)),
              await a.dispatch(Aa, t);
          } catch (i) {
            (c._loading = !1), await a.setState({ name2SubApp: l });
          }
        }
      }
      async function Sa(e, t, a) {
        const { name2SubApp: n } = t,
          r = n[e];
        r
          && ((r._loading = !0),
          await a.setState({ name2SubApp: n }),
          await (async function (e) {
            return await nt.get('/api/v1/app/info/delUserVisitApp?name='.concat(e));
          })(e),
          await a.dispatch(xa, e),
          Lt.portal.delVisitApp(e));
      }
      function xa(e, t) {
        const { name2SubApp: a, subApps: n } = t,
          r = n.findIndex((t) => t.name === e);
        if (r >= 0) return delete a[e], n.splice(r, 1), { name2SubApp: a, subApps: n };
      }
      function Aa(e) {
        const t = ke();
        Vt([L, I, M, B], t).forEach((t) => {
          const a = ue[t];
          t === L || t === I || t === B ? Lt[a].setState({ needRefresh: !0 }) : Lt.appStore.updateSubAppViewModel(e);
        });
      }
      function La(e, t) {
        let { appName: a } = e,
          n = Object(Ve.a)(e, da);
        const { name2SubApp: r } = t,
          l = r[a];
        if (l)
          return (
            Object.keys(n).forEach((e) => {
              l[e] = n[e];
            }),
            { name2SubApp: r }
          );
      }
      async function Ia(e, t, a) {
        const { is_local_render: n, render_app_host: r, class_key: l } = e;
        if (!1 === n) {
          if (!r)
            return (
              He(
                '\u5e94\u7528\u9009\u62e9\u4e86\u4e0d\u5728\u5f53\u524d\u5e73\u53f0\u6e32\u67d3\uff0c\u8bf7\u586b\u5199\u3010\u5e94\u7528\u7684\u6e32\u67d3\u57df\u540d\u3011',
              ),
              !1
            );
          if (!ma.url.test(r)) return He('\u586b\u5199\u7684\u5e94\u7528\u6e32\u67d3\u57df\u540d\u4e0d\u5408\u6cd5'), !1;
        }
        l || ((e.class_key = ''), (e.class_name = ''));
        const o = await ut(e);
        return 0 !== parseInt(o.code, 10) ? (Ke(o.msg), !1) : (await a.dispatch(va), !0);
      }
      async function Oa(e, t, a) {
        await a.dispatch(Ca, { page: 1 });
      }
      async function Ma(e, t, a) {
        await a.dispatch(Ca);
      }
      function Ta(e, t, a) {
        const { subApps: n, name2SubApp: r } = t,
          { starAppNames: l } = a.rootState.portal;
        ra(e, l);
        const o = r[e.name];
        return o ? Object.assign(o, e) : (r[e.name] = e), { subApps: n, name2SubApp: r };
      }
      async function Va(e, t, a) {
        const n = await (async function (e) {
          const t = Date.now();
          let a = '/api/v1/app/info/resetAppInfoCache?timestamp='.concat(t);
          return (a = lt(a, e, t)), await nt.post(a, { name: e });
        })(e);
        n && (await a.dispatch(Ta, n));
      }
      function ja(e) {
        localStorage.setItem(me.LIST_MODE, e.listMode);
      }
      var Na = {
        state: function () {
          return {
            listMode: localStorage.getItem(me.LIST_MODE) || 'prod',
            searchType: 'name',
            searchStr: '',
            searchUser: '',
            classKey: '-10000',
            isVerTabOpen: !1,
            needRefresh: !1,
            loading: !1,
            btnLoading: !1,
            page: 1,
            total: 0,
            size: 20,
            subApps: [],
            name2SubApp: {},
            allClassInfoList: [],
          };
        },
        reducer: i,
        watch: s,
      };
      var Da = function () {
        return {
          listMode: 'all',
          subApp: {},
          globalMarkedList: [],
          pageList: [],
          total: 0,
          markTotal: 0,
          buildTotal: 0,
          showInput: !1,
          changeMode: 'online',
          inputVersion: '',
          updateLoading: !1,
          grayBtnLoading: !1,
          projVerAreaLoading: !1,
        };
      };
      var Ba = a(179),
        Pa = a(459),
        za = a(769);
      function Ra() {
        let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
          t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50;
        return { lockId: 'init_lock', hasMoreMode: e, hasMore: !0, current: 1, pageSize: t, total: 0, list: [], loading: !1 };
      }
      function Fa(e, t) {
        return (function (e, t, a) {
          let n = e[t];
          return n || (n = e[t] = a), n;
        })(e, t, Ra());
      }
      function Ha(e, t) {
        let { tableId: a, toMod: n } = e;
        const { meta: r } = t,
          l = Fa(r, a);
        return (r[a] = y(l, n)), { meta: r };
      }
      async function Ua(e, t, a) {
        let { current: n, tableId: r, fetchFn: l } = e;
        await a.dispatch(Ha, { tableId: r, toMod: { loading: !0, current: n, lockId: Date.now() } }),
          await a.dispatch(qa, { tableId: r, fetchFn: l });
      }
      async function Ga(e, t, a) {
        let { tableId: n, fetchFn: r } = e,
          { meta: l } = t;
        const { current: o } = Fa(l, n);
        await a.dispatch(Ua, { current: o + 1, tableId: n, fetchFn: r });
      }
      async function Ka(e, t, a) {
        let { tableId: n, pageSize: r, fetchFn: l } = e;
        await a.dispatch(Ha, { tableId: n, toMod: { loading: !0, pageSize: r, lockId: Date.now() } }),
          await a.dispatch(qa, { tableId: n, fetchFn: l });
      }
      function Wa(e, t, a) {
        let { tableId: n } = e;
        a.dispatch(Ha, { tableId: n, toMod: { list: [], total: 0, loading: !1 } });
      }
      async function qa(e, t, a) {
        let { tableId: n, fetchFn: r } = e;
        const { meta: l } = t,
          o = Fa(l, n),
          { current: c, pageSize: i, lockId: s, list: p, hasMoreMode: u } = o,
          m = await r({ current: c, pageSize: i, list: p });
        if (!m) return void (await a.dispatch(Ha, { tableId: n, toMod: { loading: !1 } }));
        const { pageList: d, page_list: g, total: h = 0, hasMore: f = !0 } = m,
          b = d || g || [];
        if (Fa(l, n).lockId !== s) return;
        const E = (c - 1) * i;
        b.forEach((e, t) => {
          e && (e.__seq = E + (t + 1));
        });
        let y = b;
        u && (y = p.concat(b)), await a.dispatch(Ha, { tableId: n, toMod: { list: y, total: h, hasMore: f, loading: !1 } });
      }
      Object(h.configure)('GeneralTable', { state: () => ({ meta: {} }), reducer: p });
      var Ja,
        Ya = a(74),
        $a = a(71);
      const Xa = Object($a.c)(za.a)(Ja || (Ja = Object(Ya.a)(['\n  &&& {\n    .ant-table-thead {\n      display: none;\n    }\n  }\n']))),
        Za = 'refreshTable',
        Qa = 'clearTable',
        en = 'refreshTableCurPage',
        tn = (e) => {
          const { tid: t, fetchAfterMounted: a = !0, hasMoreMode: n = !1, fetchFn: r, pageSizeOptions: l = ['50', '100', '200'] } = e.props,
            { ccUniqueKey: o } = e;
          if (!e.state.meta[t]) {
            const a = parseInt(l[0], 10) || 50;
            e.state.meta[t] = Ra(n, a);
          }
          e.on([Za, t], async (a) => {
            const n = a || r;
            await e.mr.clearTable({ tableId: t }, o), await e.mr.handlePageCurrentChange({ tableId: t, current: 1, fetchFn: n }, o);
          }),
            e.on([Qa, t], () => {
              e.mr.clearTable({ tableId: t }, o);
            }),
            e.on([en, t], (a) => {
              const n = a || r,
                l = e.state.meta[t];
              e.mr.handlePageCurrentChange({ tableId: t, current: l.current, fetchFn: n }, o);
            }),
            e.effect(() => (a && c(1), () => e.mr.clearTable({ tableId: t }, o)), []);
          const c = (a) => {
            const { fetchFn: n } = e.props;
            e.mr.handlePageCurrentChange({ tableId: t, current: a, fetchFn: n }, o);
          };
          return {
            handlePageCurrentChange: c,
            handelPageSizeChange: (a, n) => {
              const { fetchFn: r } = e.props;
              e.mr.handlePageSizeChange({ tableId: t, pageSize: n, fetchFn: r }, o);
            },
            handleNextPage: () => {
              const { fetchFn: a } = e.props;
              e.mr.handleNextPage({ tableId: t, fetchFn: a });
            },
            pageSizeOptions: l,
          };
        };
      var an = bt.a.memo(function (e) {
        const { state: t, settings: a } = Object(h.useConcent)({ module: 'GeneralTable', setup: tn, props: e }),
          {
            tid: n,
            columns: r,
            rowKey: l = 'id',
            scroll: o = { x: '100%' },
            hasMoreMode: c = !1,
            disableBtnWhenNoMore: i,
            hasTopPagination: s = !1,
            getColumns: p,
            noTableHead: u = !1,
          } = e,
          { list: m, loading: d, current: g, total: f, pageSize: b, hasMore: E } = t.meta[n],
          { handelPageSizeChange: y, handlePageCurrentChange: w, handleNextPage: v, pageSizeOptions: k } = a,
          C = bt.a.createElement(Pa.a, {
            onShowSizeChange: y,
            onChange: w,
            current: g,
            total: f,
            showSizeChanger: !0,
            pageSizeOptions: k,
            pageSize: parseInt(b, 10),
            style: { paddingRight: '20px', float: 'right' },
          }),
          _ = p ? p({ uiPagination: C, hasTopPagination: s, total: f }) : r,
          S = u ? Xa : za.a;
        return bt.a.createElement(
          ft.Fragment,
          null,
          bt.a.createElement(S, { rowKey: l, columns: _, dataSource: m, loading: d, pagination: !1, scroll: o }),
          bt.a.createElement('div', { style: { height: '19px', width: '100%' } }),
          c
            ? i && !E
              ? bt.a.createElement(Ba.a, { disabled: !0, style: { width: '100%' } }, '\u6ca1\u6709\u66f4\u591a\u4e86')
              : bt.a.createElement(Ba.a, { onClick: v, style: { width: '100%' } }, '\u52a0\u8f7d\u66f4\u591a')
            : C,
        );
      });
      const nn = {
        refreshTableCurPage() {
          Object(h.emit)([en, 'vTable']);
        },
        refreshTable() {
          Object(h.emit)([Za, 'vTable']);
        },
      };
      async function rn() {
        nn.refreshTableCurPage();
      }
      async function ln(e) {
        const t = await st(e);
        return ra(t), Lt.appStore.refreshStoreApp(t), { subApp: t };
      }
      async function on(e) {
        const t = await (async function (e) {
            return await nt.get('/api/v1/app/info/getAppGlobalData?name='.concat(e));
          })(e),
          {
            mark_info: { markedList: a },
          } = t;
        return { globalMarkedList: a };
      }
      async function cn(e, t, a) {
        const n = e || t.subApp.name;
        await Promise.all([a.dispatch(ln, n), a.dispatch(on, n)]);
      }
      async function sn(e, t, a) {
        const { subApp: n } = t;
        await a.dispatch(cn, n.name), await a.dispatch(rn);
      }
      async function pn(e, t) {
        const { subApp: a, listMode: n, globalMarkedList: r } = t,
          { userMarkedList: l } = St('portal'),
          { current: o, pageSize: c } = e,
          { name: i } = a,
          s = await (async function (e) {
            return await nt.post('/api/v1/app/version/countSubAppVersionListByName', { name: e });
          })(i);
        let p = [];
        const u = (e) => _(p, e.ver);
        r.forEach(u),
          l.filter((e) => e.name === i).forEach(u),
          a.online_version && _(p, a.online_version),
          a.build_version && _(p, a.build_version);
        const m = p.length,
          d = (o - 1) * c;
        p = p.slice(d, d + c);
        let g = [],
          h = s.total;
        return (
          'all' === n
            ? ((h = s.total),
              (g = await (async function (e, t, a) {
                const n = Date.now(),
                  r = t - 1;
                let l = '/api/v1/app/version/getSubAppVersionListByName?timestamp='.concat(n);
                const o = rt(''.concat(e, '_').concat(pe, '_').concat(a, '_').concat(r, '_').concat(n));
                return (l = ''.concat(l, '&nonce=').concat(o)), await nt.post(l, { name: e, page: r, size: a });
              })(i, o, c)),
              g.push({ $uiType: 'switchMarkTip' }))
            : ((h = m),
              (g = await (async function (e, t) {
                return await nt.post('/api/v1/app/version/getSubAppVersionListByVers', { name: e, verList: t });
              })(i, p)),
              g.push({ $uiType: 'switchAllTip' })),
          { total: h, pageList: g, markTotal: m, buildTotal: s.total }
        );
      }
      async function un() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = arguments.length > 1 ? arguments[1] : void 0,
          a = arguments.length > 2 ? arguments[2] : void 0;
        const n = e.inputVersion || t.inputVersion,
          r = e.changeMode || t.changeMode,
          { subApp: l } = t,
          { id: o, name: c } = l,
          i = n.replace(/ /g, '');
        if (!i) return void Ke('\u8bf7\u8f93\u5165\u7248\u672c\u53f7', 2);
        const s = { id: o, name: c };
        try {
          if ('online' === r) {
            if (l.online_version === i) return void He('\u7ebf\u4e0a\u7248\u672c\u65e0\u53d8\u5316', 2);
            const e = await mt(c, i);
            if (!e || v(e)) return void Ke('\u7248\u672c\u4e0d\u5b58\u5728', 2);
            if (e.sub_app_name !== l.name)
              return void Ke(
                '\u5f53\u524d\u4fee\u6539\u7248\u672c\u6240\u5c5e\u7684\u5e94\u7528\u540d\u548c\u76ee\u6807\u5e94\u7528\u4e0d\u4e00\u81f4',
                2,
              );
            s.online_version = i;
          } else {
            if ('gray' !== r) return void Ke('\u672a\u77e5\u7684 changeMode '.concat(r), 2);
            if ((l.build_version === i) & (1 === l.is_in_gray)) return void He('\u7070\u5ea6\u7248\u672c\u65e0\u53d8\u5316', 2);
            (s.build_version = i), (s.is_in_gray = 1);
          }
          await a.setState({ updateLoading: !0 });
          const e = await ut(s);
          return '0' !== ''.concat(e.code)
            ? (Ke(e.msg, 2), { updateLoading: !1 })
            : (Object.assign(l, s), { updateLoading: !1, subApp: l });
        } catch (p) {
          return He(p.message, 2), { updateLoading: !1 };
        }
      }
      async function mn(e, t, a) {
        await a.dispatch(un, e), Object(h.emit)([en, 'vTable']), await Lt.appStore.initAllPage();
      }
      function dn() {
        return { subApp: {}, inputVersion: '', showInput: !1 };
      }
      function gn() {
        return { showInput: !0, changeMode: 'online' };
      }
      function hn() {
        return { showInput: !0, changeMode: 'gray' };
      }
      async function fn(e, t, a) {
        const { subApp: n } = t;
        try {
          await a.setState({ updateLoading: !0 });
          const e = await ut({ id: n.id, name: n.name, online_version: n.build_version, is_in_gray: 0 });
          return '0' !== ''.concat(e.code)
            ? (Ke(e.msg), { updateLoading: !1 })
            : ((n.online_version = n.build_version),
              (n.is_in_gray = 0),
              Ge('\u7070\u5ea6\u901a\u8fc7\u6210\u529f', 1),
              { updateLoading: !1, subApp: n });
        } catch (r) {
          return He(r.message), { updateLoading: !1 };
        }
      }
      async function bn(e, t, a) {
        await a.setState({ grayBtnLoading: !0 }),
          await a.dispatch(fn),
          await a.setState({ grayBtnLoading: !1 }),
          Object(h.emit)([en, 'vTable']),
          await Lt.appStore.initAllPage();
      }
      async function En(e, t, a) {
        const { appName: n, ver: r } = e;
        await (async function (e) {
          return await nt.post('/api/v1/app/info/delAppUserMarkInfo', e);
        })({ name: n, ver: r }),
          await Lt.portal.initUserExtendData(),
          nn.refreshTableCurPage();
      }
      async function yn(e, t, a) {
        const { appName: n, ver: r } = e;
        await (async function (e) {
          const t = ot('/api/v1/app/info/delAppGlobalMarkInfo', e.name);
          return await nt.post(t, e);
        })({ name: n, ver: r }),
          await a.dispatch(on, n),
          nn.refreshTableCurPage();
      }
      async function wn(e, t, a) {
        await a.setState({ listMode: e }), await a.dispatch(cn, t.subApp.name), nn.refreshTable();
      }
      async function vn(e, t, a) {
        const { subApp: n } = t;
        await a.setState({ updateLoading: !0 });
        const r = { map: {}, utime: n.proj_ver.utime };
        e.forEach((e) => {
          r.map[e.id] = { o: e.onlineVerId, b: e.buildVerId };
        });
        try {
          const e = await ut({ id: n.id, name: n.name, proj_ver: r });
          return '0' !== ''.concat(e.code)
            ? (Ke(e.msg), { updateLoading: !1 })
            : (Ge('\u3010\u9879\u76ee\u4e0e\u7248\u672c\u3011\u914d\u7f6e\u66f4\u65b0\u6210\u529f', 1),
              (n.proj_ver = e.data.proj_ver),
              { updateLoading: !1, subApp: n });
        } catch (l) {
          return He(l.message), { updateLoading: !1 };
        }
      }
      async function kn(e) {
        const { verAppName: t, verID: a } = e;
        await (async function (e, t) {
          const a = Date.now();
          let n = '/api/v1/app/version/resetVerCache?timestamp='.concat(a);
          const r = rt(''.concat(t, '_').concat(a, '_').concat(pe));
          return (n = ''.concat(n, '&nonce=').concat(r)), await nt.post(n, { versionId: t, appName: e });
        })(t, a);
      }
      function Cn(e, t) {
        const { name: a, size: n, page: r } = t,
          l = Date.now();
        let o = '/api/v1/hmn/'.concat(e, '?timestamp=').concat(l);
        const c = rt(''.concat(a, '_').concat(pe, '_').concat(n, '_').concat(r, '_').concat(l));
        return (o = ''.concat(o, '&nonce=').concat(c)), o;
      }
      const _n = {
        refreshTableCurPage() {
          Object(h.emit)([en, 'smTable']);
        },
        refreshTable() {
          Object(h.emit)([Za, 'smTable']);
        },
      };
      async function Sn() {
        _n.refreshTableCurPage();
      }
      async function xn(e, t) {
        try {
          const { subAppName: a } = t,
            { current: n, pageSize: r } = e,
            { list: l, count: o } = await (async function (e, t, a) {
              const n = t - 1,
                r = Cn('statList', { name: e, size: a, page: n }),
                { list: l, count: o } = await nt.post(r, { name: e, page: n, size: a });
              return { list: l, count: o };
            })(a, n, r);
          return { total: o, pageList: l };
        } catch (a) {
          return de.b.error(a.message), { total: 0, pageList: [] };
        }
      }
      function An() {
        return { subAppName: '', inputVersion: '', showInput: !1 };
      }
      async function Ln(e, t, a) {
        await a.setState({ listMode: e }), _n.refreshTable();
      }
      var In = {
        appStore: Na,
        VersionList: { state: Da, reducer: u },
        ServerModList: {
          state: function () {
            return { listMode: 'card', subAppName: '', pageList: [], total: 0 };
          },
          reducer: m,
        },
        portal: na,
        latestVisit: Na,
        starList: Na,
        createdList: Na,
        top: Na,
      };
      function On(e) {
        const t = document.body.querySelector('#app');
        t && (t.style.display = e);
      }
      h.default.bindCcToWindow('Hel'),
        Object(h.run)(In, {
          middlewares: [
            (e, t) => {
              console.warn(e), t();
            },
          ],
        }),
        window.top.addEventListener('popstate', (e, t) => {
          console.log('popstate', e, t),
            setTimeout(() => {
              Lt.portal.checkPageUrl();
            }, 1e3);
        }),
        gt('addBg', (e) => {
          On('none');
          const t = document.body.style;
          (t.backgroundImage = 'url('.concat(e || K, ')')),
            (t.backgroundPosition = 'center'),
            (t.backgroundRepeat = 'no-repeat'),
            (t.backgroundSize = '600px');
        }),
        gt('removeBg', () => {
          const e = document.body.style;
          (e.backgroundImage = ''), (e.backgroundPosition = ''), (e.backgroundRepeat = ''), (e.backgroundSize = ''), On('block');
        });
      var Mn = a(103),
        Tn = a.n(Mn),
        Vn = a(768),
        jn = a(456),
        Nn = a(349),
        Dn = a(129),
        Bn = a(378),
        Pn = a(210),
        zn = a(778),
        Rn = a(335),
        Fn = a(465),
        Hn = a(785),
        Un = a(786),
        Gn = a(787);
      const Kn = (e) => {
          let { children: t = '', type: a = 'horizon', height: n = '22px', width: r = '28px', style: l = {} } = e;
          const o = Object(f.a)({ display: 'inline-block', width: r, height: n }, l);
          return 'vertical' === a && (o.display = 'block'), bt.a.createElement('div', { style: o }, t);
        },
        Wn = (e) => bt.a.createElement(Kn, Object(f.a)({ width: '8px' }, e)),
        qn = (e) => bt.a.createElement(Kn, Object(f.a)({ type: 'vertical' }, e)),
        Jn = (e) => {
          let { width: t = '8px', style: a = {}, children: n = '' } = e;
          const r = Object(f.a)({ paddingRight: t }, a);
          return bt.a.createElement('span', { style: r }, n);
        };
      var Yn = Kn;
      const $n =
          "\n// \u8be6\u7ec6\u4ecb\u7ecd\u89c1 https://tencent.github.io/hel/docs/tutorial/intro\n// Step1\uff0c\u5165\u53e3\u6587\u4ef6\u540e\u79fb\uff0c\u5148\u9884\u52a0\u8f7d\u8fdc\u7a0b\u6a21\u5757\uff0c\u518d\u52a0\u8f7d\u9879\u76ee\u6a21\u5757\n(async function(){\n  const helMicro = await import('hel-micro');\n  await helMicro.preFetchLib('remote-lib-tpl');\n  import('./loadApp'); // \u8fd9\u91cc\u5f00\u59cb\u8f7d\u5165\u4f60\u7684\u9879\u76ee\u5165\u53e3\u6587\u4ef6\n})();\n\n\n/** --------------------------------------------------------------------------- */\n\n// Step2\uff0c\u9884\u52a0\u8f7d\u52a8\u4f5c\u6267\u884c\u5b8c\u6bd5\u540e\uff0c\u53ef\u5b89\u5168\u5728\u9879\u76ee\u5185\u90e8\u4efb\u610f\u6587\u4ef6\u7684\u5934\u90e8\u4f7f\u7528 import \u8bed\u6cd5\u9759\u6001\u5bfc\u5165\u8fdc\u7a0b\u6a21\u5757\n// \u8fd9\u4e2a\u5305\u7684 js \u5165\u53e3\u6587\u4ef6\u662f\u4e00\u4e2a\u7a7a\u58f3\u6587\u4ef6\uff0c\u4ec5\u66b4\u9732\u4e86\u4e00\u4e2a\u4ee3\u7406\u5bf9\u8c61\uff0c\u5b9e\u9645\u6267\u884c\u4ee3\u7801\u5df2\u5728 Step1 \u5904\u62c9\u53d6\u5b8c\u6bd5\n// \u6240\u4ee5\u5b83\u5e76\u4e0d\u4f1a\u5f71\u54cd\u4f60\u7684\u9879\u76ee\u6253\u5305\u4f53\u79ef\uff0c\u540c\u65f6\u56e0\u4e3a\u6a21\u5757\u4e3b\u903b\u8f91\u4e0d\u53c2\u4e0e\u6784\u5efa\uff0c\u5c06\u63d0\u901f\u4f60\u7684\u9879\u76ee\u6784\u5efa\u901f\u5ea6\nimport remoteLib from 'remote-lib-tpl';\n\nexport function callRemoteMethod(){\n  // \u73b0\u5728\u4f60\u53ef\u4ee5\u50cf\u8c03\u7528\u672c\u5730\u65b9\u6cd5\u4e00\u6837\u653e\u5fc3\u8c03\u7528\u8fdc\u7a0b\u65b9\u6cd5\u4e86\uff0c\u5e76\u53ef\u4ee5\u83b7\u5f97\u5b8c\u6574\u7684 IDE \u63d0\u793a\uff01^_^\n  return remoteLib.num.random(19);\n}\n",
        Xn =
          "\nimport helMicro from 'hel-micro';\n\n// \u4e0d\u5173\u5fc3\u7c7b\u578b\u4e14\u9700\u8981\u4f7f\u7528\u65f6\u624d\u52a0\u8f7d\u6a21\u5757\uff0c\u4f7f\u7528 helMicro.preFetchLib \u83b7\u53d6\u8fdc\u7a0b\u5e93\u5373\u53ef\nexport async function callRemoteMethod(){\n  const remoteLib = await helMicro.preFetchLib('remote-lib-tpl');\n  return remoteLib.num.random(19);\n}\n\n/** --------------------------------------------------------------------------- */\n// \u5173\u5fc3\u6a21\u5757\u7c7b\u578b\uff0c\u4e14\u9700\u8981\u4f7f\u7528\u65f6\u624d\u52a0\u8f7d\u6a21\u5757\uff0c\u5b89\u88c5\u6a21\u5757\u5e76\u5bfc\u51fa\u6a21\u5757\u7c7b\u578b\u5e76\u4f20\u7ed9\u6cdb\u578b\u53c2\u6570\u5373\u53ef\nimport type { Lib } from remote-lib-tpl';\nimport helMicro from 'hel-micro';\n\nexport async function  callRemoteMethod(){\n  const remoteLib = await helMicro.preFetchLib<Lib>('remote-lib-tpl');\n  return remoteLib.num.random(19);\n}\n",
        Zn =
          "\n// \u8fd9\u662f\u4e00\u4e2a\u7531 hel-micro \u4ece HelPack \u52a8\u6001\u62c9\u53d6\u7684\u8fdc\u7a0b react \u7ec4\u4ef6\n// \u6ce8\uff1a\u80fd\u8fd9\u6837\u5934\u90e8\u9759\u6001import\u5bfc\u5165\u662f\u56e0\u4e3a\u5165\u53e3\u6587\u4ef6\u5904\u5df2\u6267\u884c\u9884\u52a0\u8f7d\nimport { HelloRemoteReactComp } from 'remote-react-comps-tpl';\n\nfunction Demo(){\n  // \u50cf\u672c\u5730\u7ec4\u4ef6\u4e00\u6837\u4f7f\u7528\u8fdc\u7a0b\u7ec4\u4ef6\u5427\n  return <HelloRemoteReactComp label=\"hi remote comp\" />;\n}\n\n/** --------------------------------------------------------------------------- */\n\n// \u901a\u8fc7 hel-micro-react \u5f02\u6b65\u52a0\u8f7d\u8fdc\u7a0b\u7ec4\u4ef6\u5e76\u4eab\u6709 shadow-dom \u6837\u5f0f\u9694\u79bb\u80fd\u529b\n// hel-micro-react \u662f\u57fa\u4e8e hel-micro \u505a\u5c01\u88c5\u6765\u9002\u914d react \u6846\u67b6\u7684\u9002\u914d\u5c42\u5e93\nimport { useRemoteComp } from 'hel-micro-react';\n\nfunction ShadowDemo(){\n  const Comp = useRemoteComp('remote-react-comps-tpl', 'HelloRemoteReactComp');\n  return <Comp  label=\"hi remote comp\" />;\n}\n",
        Qn =
          '\n<template>\n  <div class="app">\n    <HelloRemoteVueComp label="hi remote comp" />\n  </div>\n</template>\n\n<script>\n// \u8fd9\u662f\u4e00\u4e2a\u7531 hel-micro \u4ece HelPack \u52a8\u6001\u62c9\u53d6\u7684\u8fdc\u7a0bvue\u7ec4\u4ef6\n// \u6ce8\uff1a\u80fd\u8fd9\u6837\u5934\u90e8\u9759\u6001import\u5bfc\u5165\u662f\u56e0\u4e3a\u5165\u53e3\u6587\u4ef6\u5904\u5df2\u6267\u884c\u9884\u52a0\u8f7d\nimport { HelloRemoteVueComp } from \'remote-vue-comps-tpl\';\n\nexport default {\n  name: \'App\',\n  components: { HelloRemoteVueComp } // \u50cf\u672c\u5730\u7ec4\u4ef6\u4e00\u6837\u4f7f\u7528\u8fdc\u7a0b\u7ec4\u4ef6\u628a ^_^\n};\n</script>\n',
        er = { display: 'inline-block', width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'darkgray', margin: '0 2px' };
      function tr() {
        return bt.a.createElement(
          'td',
          { align: 'center' },
          bt.a.createElement('div', { style: er }),
          bt.a.createElement('div', { style: er }),
          bt.a.createElement('div', { style: er }),
        );
      }
      function ar(e) {
        const { site: t, logo: a, label: n } = e;
        return bt.a.createElement(
          'td',
          { align: 'center', style: { padding: '12px' } },
          bt.a.createElement(
            'a',
            { href: t, target: '_blank', rel: 'noopener noreferrer' },
            bt.a.createElement('img', { width: '60px;', height: '60px', src: a }),
          ),
          bt.a.createElement('br', null),
          bt.a.createElement('a', { target: '_blank', href: t, rel: 'noopener noreferrer' }, bt.a.createElement('b', null, n)),
        );
      }
      var nr, rr, lr, or, cr, ir, sr;
      Rn.b.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !0, noSyntaxValidation: !0 });
      const { HEL_ARCH: pr, HEL_BANNER: ur, HEL_LABEL_LOGO: mr } = r,
        dr = $a.c.div(
          nr
            || (nr = Object(Ya.a)([
              "\n  position: 'relative';\n  background-image: url(",
              ');\n  background-size: cover;\n  background-repeat: repeat-x;\n  width: 100%;\n  height: 520px;\n',
            ])),
          ur,
        ),
        gr = $a.c.div(
          rr
            || (rr = Object(Ya.a)([
              '\n  position: absolute;\n  background-size: cover;\n  background-image: url(',
              ');\n  background-repeat: no-repeat;\n  width: 104px;\n  height: 32px;\n  left: 13px;\n  top: 13px;\n',
            ])),
          mr,
        ),
        hr = $a.c.div(
          lr || (lr = Object(Ya.a)(['\n  position: absolute;\n  left: 128px;\n  top: 16px;\n  color: gray;\n  font-size: 19px;\n'])),
        ),
        fr = $a.c.span(
          or
            || (or = Object(Ya.a)([
              '\n  position: absolute;\n  font-size: 88px ;\n  left: 50%;\n  top: 100px;\n  transform: translateX(-50%);\n',
            ])),
        ),
        br = $a.c.div(
          cr
            || (cr = Object(Ya.a)([
              '\n  position: relative;\n  display: flex;\n  justify-content: center;\n  width: 100%;\n  margin: 0 0 50px 0;\n',
            ])),
        ),
        Er = $a.c.div(ir || (ir = Object(Ya.a)(['\n  display: inline-block;\n  width: 20px;\n']))),
        yr = $a.c.span(
          sr
            || (sr = Object(Ya.a)([
              '\n  position: absolute;\n  left: 100px;\n  top: 10px;\n  width: 102px;\n  text-align: center;\n  border: 1px solid #d9d9d9;\n  padding: 5px 15px;\n  border-radius: 20px;\n  font-size: 14px;\n  color: rgba(0,0,0,.65);\n',
            ])),
        ),
        wr = { position: 'absolute', width: '100%', top: '250px', fontSize: '28px', color: 'white', textAlign: 'center' },
        vr = { borderRadius: '3px', backgroundColor: 'white', padding: '0 12px', margin: '0 12px' },
        kr = {
          width: '1023px',
          height: '615px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: '40px',
          paddingLeft: '3px',
        },
        Cr = bt.a.memo(function () {
          const [e, t] = bt.a.useState('remoteLib');
          return bt.a.createElement(
            bt.a.Fragment,
            null,
            bt.a.createElement(
              br,
              { style: { marginBottom: '20px' } },
              bt.a.createElement(Bn.a.Group, {
                options: [
                  { label: '\u8fdc\u7a0b\u5e93-\u9884\u52a0\u8f7d', value: 'remoteLib' },
                  { label: '\u8fdc\u7a0b\u5e93-\u61d2\u52a0\u8f7d', value: 'remoteLibLazy' },
                  { label: '\u8fdc\u7a0breact\u7ec4\u4ef6', value: 'remoteReact' },
                  { label: '\u8fdc\u7a0bvue\u7ec4\u4ef6', value: 'remoteVue' },
                ],
                style: { width: '100%', textAlign: 'center' },
                onChange: (e) => t(e.target.value),
                value: e,
              }),
            ),
            bt.a.createElement(
              br,
              { style: { marginBottom: '20px' } },
              bt.a.createElement(
                'div',
                { style: Object(f.a)(Object(f.a)({}, kr), {}, { backgroundImage: 'url('.concat(le, ')') }) },
                bt.a.createElement(Rn.a, {
                  width: '1015px',
                  height: '570px',
                  language: 'typescript',
                  theme: 'vs-dark',
                  value: d[e],
                  options: { selectOnLineNumbers: !0, fontSize: 16, noSyntaxValidation: !0 },
                }),
              ),
            ),
          );
        });
      function _r() {
        const e = (e) => {
            _e(e);
          },
          t = bt.a.createElement(
            bt.a.Fragment,
            null,
            bt.a.createElement(
              Ba.a,
              { type: 'primary', icon: bt.a.createElement(Fn.a, null), size: 'large', onClick: () => e(T) },
              '\u521b\u5efa\u5e94\u7528',
            ),
            bt.a.createElement(Er, null),
            bt.a.createElement(
              Ba.a,
              { icon: bt.a.createElement(Hn.a, null), size: 'large', onClick: () => e(M) },
              '\u63a2\u7d22\u66f4\u591a',
            ),
            bt.a.createElement(Er, null),
            bt.a.createElement(
              Ba.a,
              { icon: bt.a.createElement(Un.a, null), size: 'large', onClick: () => window.open('https://tencent.github.io/hel') },
              'hel-micro',
            ),
            bt.a.createElement(Er, null),
            bt.a.createElement(
              Ba.a,
              {
                icon: bt.a.createElement(Gn.a, null),
                size: 'large',
                onClick: () => window.open('https://github.com/Tencent/hel/issues/112'),
              },
              '\u89c6\u9891\u6559\u5b66',
            ),
          );
        return bt.a.createElement(
          'div',
          { style: { position: 'relative' } },
          bt.a.createElement(
            dr,
            null,
            bt.a.createElement(gr, null),
            bt.a.createElement(hr, null, 'Ver 3.0'),
            bt.a.createElement(fr, { className: 'hubShine' }, 'Hel Pack'),
            bt.a.createElement(
              'div',
              { style: wr },
              bt.a.createElement('div', null, '\u52a8\u6001\u5316\u6a21\u5757\u53d1\u5e03\u3001\u6258\u7ba1\u670d\u52a1'),
              bt.a.createElement(
                'div',
                null,
                '\u642d\u914d',
                bt.a.createElement('a', { href: 'https://tencent.github.io/hel/', target: 'blank', style: vr }, 'hel-micro'),
                '\uff0c \u8f7b\u677e\u5b9e\u73b0\u5fae\u524d\u7aef\u642d\u5efa\u3001\u7ec4\u4ef6\u70ed\u66f4\u65b0\u3001\u524d\u540e\u7aef\u5206\u79bb\u3001\u5e94\u7528\u79d2\u56de\u6eda ......',
              ),
              bt.a.createElement('div', { style: { height: '29px' } }),
              t,
            ),
          ),
          bt.a.createElement(
            br,
            { style: { backgroundColor: 'aliceblue', padding: '20px 0' } },
            bt.a.createElement(yr, { style: { top: '30px' } }, '\u8c01\u5728\u4f7f\u7528\u4e2d'),
            bt.a.createElement(
              'table',
              null,
              bt.a.createElement(
                'tr',
                null,
                bt.a.createElement(ar, {
                  label: '\u817e\u8baf\u4e91',
                  site: 'https://console.cloud.tencent.com/wedata/share/overview',
                  logo: 'https://user-images.githubusercontent.com/7334950/197116513-7c7382b6-a5b5-4fb9-bcd7-2ec891804b7d.png',
                }),
                bt.a.createElement(ar, {
                  label: '\u817e\u8baf\u97f3\u4e50',
                  site: 'https://www.tencentmusic.com',
                  logo: 'https://user-images.githubusercontent.com/7334950/253788999-40ca0ea2-e73d-4e7b-b932-162826d5bf97.png',
                }),
                bt.a.createElement(ar, {
                  label: '\u817e\u8baf\u6587\u6863',
                  site: 'https://docs.qq.com',
                  logo: 'https://user-images.githubusercontent.com/7334950/253789181-c4065149-304b-4b1e-bb93-23e1d849f45f.png',
                }),
                bt.a.createElement(ar, {
                  label: '\u817e\u8baf\u65b0\u95fb',
                  site: 'https://news.qq.com',
                  logo: 'https://user-images.githubusercontent.com/7334950/197115413-ede5f5fa-70dd-4632-b7f5-f6f8bc167023.png',
                }),
                bt.a.createElement(ar, {
                  label: '\u817e\u8baf\u81ea\u9009\u80a1',
                  site: 'https://gu.qq.com/resource/products/portfolio/m.htm',
                  logo: 'https://user-images.githubusercontent.com/7334950/253789148-c42ae516-991f-44df-a366-9b295c306b98.png',
                }),
                bt.a.createElement(tr, null),
              ),
            ),
          ),
          bt.a.createElement(
            br,
            null,
            bt.a.createElement(yr, null, '\u67b6\u6784'),
            bt.a.createElement('img', { width: '1200px', src: pr }),
          ),
          bt.a.createElement(qn, null),
          bt.a.createElement(
            br,
            { style: { paddingTop: '60px', marginBottom: '20px' } },
            bt.a.createElement(yr, null, '\u7279\u70b9'),
            bt.a.createElement(
              Pn.a,
              { span: 8, style: { padding: '0 20px 0 120px' } },
              bt.a.createElement(zn.a, {
                showIcon: !0,
                style: { width: '100%', height: '160px' },
                message: '\u53ef\u9760',
                description:
                  '\u4e0d\u4f9d\u8d56\u6d4f\u89c8\u5668 import map\u3001module script \u7279\u6027\uff0c\u4e0d\u4f9d\u8d56\u5177\u4f53\u7684 webpack \u7248\u672c\uff0c \u5373\u53ef\u5feb\u901f\u4e14\u5b89\u5168\u5730\u63a5\u5165\u8fdc\u7a0b\u6a21\u5757\u670d\u52a1',
                type: 'info',
              }),
            ),
            bt.a.createElement(
              Pn.a,
              { span: 8, style: { padding: '0 20px' } },
              bt.a.createElement(zn.a, {
                showIcon: !0,
                style: { width: '100%', height: '160px' },
                message: '\u5f00\u653e',
                description:
                  'HelPack \u4ec5\u8d1f\u8d23\u5236\u8ba2\u4ea7\u7269\u5143\u6570\u636e\u534f\u8bae\u6807\u51c6\u5e76\u6258\u7ba1\u5143\u6570\u636ejson\uff0c\u5f53\u524d\u5df2\u670d\u52a1\u4e8e webpack\u3001vite \u751f\u6001\uff0c\u4f9d\u8d56\u5143\u6570\u636e\u63d0\u53d6\u63d2\u4ef6\u53ef\u6269\u5c55\u5230\u5176\u4ed6\u6784\u5efa\u5de5\u5177\u4f53\u7cfb',
                type: 'info',
              }),
            ),
            bt.a.createElement(
              Pn.a,
              { span: 8, style: { padding: '0 120px 0 20px' } },
              bt.a.createElement(zn.a, {
                showIcon: !0,
                style: { width: '100%', height: '160px' },
                message: '\u7075\u6d3b',
                description:
                  '\u6a21\u5757\u61d2\u52a0\u8f7d\u3001\u9884\u52a0\u8f7d\u4efb\u610f\u9009\u62e9\uff0c\u4e0d\u9650\u5b9a\u4f60\u7684\u4f7f\u7528\u65b9\u5f0f',
                type: 'info',
              }),
            ),
          ),
          bt.a.createElement(Cr, null),
          bt.a.createElement(br, null, t),
          bt.a.createElement('div', { style: { height: '52px' } }),
        );
      }
      var Sr = a(235),
        xr = a(311),
        Ar = a(770),
        Lr = a(246),
        Ir = a(779),
        Or = a(777),
        Mr = a(463),
        Tr = a(789),
        Vr = a(386),
        jr = a(790),
        Nr = a(791),
        Dr = a(269);
      function Br(e) {
        return e ? new Date(e).toLocaleString() : '';
      }
      function Pr(e) {
        let t = ' ';
        e.includes(' \u4e0a\u5348') && (t = ' \u4e0a\u5348'), e.includes(' \u4e0b\u5348') && (t = ' \u4e0b\u5348');
        const a = (e) =>
            (function (e, t, a) {
              if ((t -= (e = ''.concat(e)).length) <= 0) return e;
              if ((a || 0 === a || (a = ' '), ' ' === (a = ''.concat(a)) && t < 10)) return ia[t] + e;
              let n = '';
              for (; 1 & t && (n += a), (t >>= 1); ) a += a;
              return n + e;
            })(e, 2, '0'),
          [n, r] = e.split(t),
          [l, o, c] = n.split('/'),
          [i, s, p] = r.split(':');
        return ''.concat(l, '-').concat(a(o), '-').concat(a(c), ' ').concat(a(i), ':').concat(a(s), ':').concat(a(p));
      }
      function zr(e) {
        let t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        try {
          let a = new Date(e).toLocaleString('zh', { hour12: !1 });
          return t && (a = a.replace(/\//g, '-')), a;
        } catch (a) {
          return e;
        }
      }
      let Rr = {},
        Fr = {},
        Hr = !1;
      function Ur(e) {
        (Hr = !!e.helContext),
          (Rr = e.appProps || {}),
          (Fr = e.helContext || {}),
          (function () {
            if (!Gr()) return;
            (Wr = !0),
              document.addEventListener('click', () => {
                if (Fr.getShadowContainer) {
                  const e = Fr.getShadowContainer();
                  if (!e) return;
                  const { children: t } = e;
                  for (let a = 0, n = t.length; a < n; a++) {
                    const e = t[a],
                      { style: n } = e;
                    n && 'absolute' === n.position && (n.position = '');
                  }
                }
              });
          })();
      }
      function Gr() {
        return Hr;
      }
      function Kr(e) {
        if ('string' === typeof e) {
          return document.getElementById(e) || window.top.document.body;
        }
        return Fr.getShadowContainer ? Fr.getShadowContainer() : window.top.document.body;
      }
      let Wr = !1;
      function qr() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1e3;
        return new Promise((t) => setTimeout(t, e));
      }
      function Jr(e) {
        return e && (e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation()), !0;
      }
      var Yr,
        $r,
        Xr,
        Zr,
        Qr = a(136),
        el = a.n(Qr),
        tl = a(788);
      const al = $a.c.div(
          Yr
            || (Yr = Object(Ya.a)([
              '\n  display: -webkit-box;\n  height: 42px;\n  color: rgba(0, 0, 0, 0.45);\n  padding: 2px 0 0 6px;\n  font-size: 13px;\n  word-break: break-all;\n  text-overflow: -o-ellipsis-lastline;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n',
            ])),
        ),
        nl = $a.c.div(
          $r
            || ($r = Object(Ya.a)([
              '\n  display: inline-block;\n  height: 30px;\n  width: calc(100% - 30px);\n  padding-left: 6px;\n  font-size: 16px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n',
            ])),
        ),
        rl = $a.c.div(Xr || (Xr = Object(Ya.a)(['\n  width: 30px;\n  display: inline-block;\n  vertical-align: top;\n']))),
        ll = Object($a.c)(Ar.a)(
          Zr
            || (Zr = Object(Ya.a)([
              '\n  &&& {\n    .ant-card-actions {\n      background-color: #f2f3f6 !important;\n    }\n    .ant-card-actions>li:not(:last-child) {\n      border-right: 1px solid lightgrey;\n    }\n  }\n',
            ])),
        ),
        ol = { color: 'var(--lra-theme-color)' },
        cl = { paddingRight: '6px' },
        il = Object(f.a)(Object(f.a)(Object(f.a)({}, ol), cl), {}, { fontSize: '18px' });
      var sl = bt.a.memo(function (e) {
        const t = e.showIcons ? il : Object(f.a)({ color: 'green' }, cl),
          { name: a, data: n } = e;
        return bt.a.createElement(
          nl,
          {
            onClick: (t) => {
              t.stopPropagation(), e.onTitleClick(a, n);
            },
          },
          bt.a.createElement(Lr.a, { title: a }, bt.a.createElement('span', { style: t }, a)),
          e.showIcons
            && bt.a.createElement(Lr.a, { title: '\u8bbf\u95ee\u5f53\u524d\u5e94\u7528' }, bt.a.createElement(tl.a, { style: ol })),
          bt.a.createElement(Wn, { width: '5px' }),
          e.showIcons
            && bt.a.createElement(
              Lr.a,
              { title: '\u590d\u5236\u5e94\u7528\u540d\u79f0' },
              bt.a.createElement(Tr.a, {
                style: ol,
                onClick: (e) => {
                  Jr(e), de.b.info('\u590d\u5236\u5e94\u7528\u540d '.concat(a, ' \u6210\u529f!'), 1), el()(a);
                },
              }),
            ),
        );
      });
      const pl = ['appStore', 'starList', 'latestVisit'],
        { Meta: ul } = Ar.a,
        ml = { position: 'absolute', top: '8px', right: '2px', zIndex: 1 },
        dl = {
          position: 'absolute',
          left: '0px',
          top: '-8px',
          zIndex: 1,
          backgroundColor: '#3ca75b',
          color: 'white',
          padding: '0 12px',
          borderRadius: '2px',
          fontSize: '12px',
        },
        gl = { borderBottom: '1px solid rgb(47 84 235 / 52%)' },
        hl = { borderBottom: '1px solid rgb(238 74 61 / 52%)' },
        fl = (e) => {
          e.stopPropagation();
        },
        bl = { xs: 24, sm: 12, md: 12, lg: 12, xl: 6 },
        El = 'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)',
        yl = { WebkitClipPath: El, clipPath: El };
      function wl(e) {
        const t = Ct(pl[0], {}, e),
          { mr: a, ccUniqueKey: n, props: r } = t,
          l = {
            handleStarIconClick: (e) => {
              e.stopPropagation();
              const t = { appName: e.currentTarget.dataset.name, needDel: 'starList' === r.module };
              a.handleStarIconClick(t, { renderKey: n });
            },
            handleDelIconClick: (e) => {
              Jr(e);
              const t = e.currentTarget.dataset.name;
              a.handleDelIconClick(t, { renderKey: n });
            },
            handleEditIconClick: (e) => {
              Jr(e);
              const { name: a } = e.currentTarget.dataset,
                n = t.state.name2SubApp[a];
              t.emit('openSubAppDrawer', n);
            },
            jumpTo: (e) => {
              Jr(e);
              let t = e.currentTarget.dataset.git;
              t
                ? (t.startsWith('git@') && (t = t.replace('git@', 'https://')), window.top.open(t))
                : de.b.warn('\u5f53\u524d\u5b50\u5e94\u7528\u8fd8\u672a\u586b\u5199git\u4ed3\u5e93\u5730\u5740', 2);
            },
            handleCardClick(e) {
              l.handleEditIconClick(e);
            },
            onTitleClick(e, a) {
              t.emit('openConfirmVisitAppModal', e, a);
            },
            getStClassWrap(e) {
              const t = { 0: '#1468f8E0', 1: '#fda734E0', 2: '#f85552E0', 3: '#3ca75bE0' }[e.length % 4];
              return Object(f.a)(Object(f.a)({}, dl), {}, { backgroundColor: t });
            },
            getCardStyle() {
              const { appData: e } = t.props,
                { enable_pipeline: a, is_in_gray: n } = e,
                r = a ? gl : hl;
              return Object(f.a)(Object(f.a)({}, r), {}, { backgroundColor: n ? '#f2f3f6' : '#d3e9f9' });
            },
          };
        return l;
      }
      var vl = bt.a.memo(function (e) {
        const { appData: t, module: a } = e,
          { name: n, enable_pipeline: r } = t,
          { state: l, settings: o } = vt(a, { setup: wl, props: e }),
          [c, i] = bt.a.useState(!1),
          s = l.name2SubApp[n],
          p = (e, t) => {
            Jr(e), It('openCopySubAppLayer', s, t);
          };
        if (!s) return '';
        let u = '',
          m = '';
        s._star
          ? ((u = '\u5df2\u6536\u85cf (\u70b9\u51fb\u53d6\u6d88\u641c\u85cf\u8be5\u5e94\u7528)'),
            (m = bt.a.createElement('img', { width: '19px', height: '19px', src: X })))
          : ((u = '\u672a\u6536\u85cf (\u70b9\u51fb\u641c\u85cf\u8be5\u5e94\u7528)'),
            (m = bt.a.createElement('img', { width: '19px', height: '19px', src: $ })));
        const d = [
          bt.a.createElement(
            Lr.a,
            {
              key: 'avatar',
              title: bt.a.createElement(
                bt.a.Fragment,
                null,
                '\u521b\u5efa\u8005\uff1a',
                bt.a.createElement(Ir.a, { color: '#108ee9' }, s.create_by),
                bt.a.createElement('br', null),
                '\u521b\u5efa\u65f6\u95f4\uff1a',
                Br(s.create_at),
                bt.a.createElement('br', null),
                '\u6700\u8fd1\u66f4\u65b0\uff1a',
                Br(s.update_at),
              ),
              getTooltipContainer: Kr,
            },
            bt.a.createElement('div', { onClick: fl }, bt.a.createElement(Or.a, { size: 28, src: ''.concat(Le(s.create_by)) })),
          ),
          bt.a.createElement(
            Lr.a,
            { key: 'star', title: u, getTooltipContainer: Kr },
            bt.a.createElement('div', { 'data-name': s.name, onClick: o.handleStarIconClick }, m),
          ),
          bt.a.createElement(
            Lr.a,
            { key: 'edit', title: '\u8df3\u8f6c\u81f3git', getTooltipContainer: Kr },
            bt.a.createElement(
              'div',
              { style: yl, 'data-git': s.git_repo_url, onClick: o.jumpTo },
              bt.a.createElement('img', { style: yl, width: '22px', height: '19px', src: Y }),
            ),
          ),
        ];
        return (
          e.delVisit
            && d.push(
              bt.a.createElement(
                Lr.a,
                { key: 'del', title: '\u5220\u9664\u6700\u8fd1\u8bbf\u95ee', getTooltipContainer: Kr },
                bt.a.createElement(
                  'div',
                  { 'data-name': s.name, onClick: o.handleDelIconClick },
                  bt.a.createElement('img', { width: '19px', height: '19px', src: Z }),
                ),
              ),
            ),
          d.push(
            bt.a.createElement(
              Mr.a,
              {
                key: 'copy',
                content: bt.a.createElement(
                  'div',
                  null,
                  bt.a.createElement(
                    Lr.a,
                    {
                      title: bt.a.createElement(
                        'span',
                        null,
                        '\u590d\u5236\u5f53\u524d\u5e94\u7528\u4e3a\u540c\u5e94\u7528\u7ec4(',
                        t.app_group_name,
                        ')\u4e0b\u7684\u53e6\u4e00\u4e2a\u5e94\u7528\uff0c\u8be5\u5e94\u7528\u4f1a\u81ea\u52a8\u6807\u8bb0\u4e3a',
                        bt.a.createElement(Ir.a, { color: 'gray' }, '\u6d4b\u8bd5'),
                        '\u5e94\u7528',
                      ),
                    },
                    bt.a.createElement(Ba.a, { onClick: (e) => p(e, 'test') }, '\u540c\u7ec4\u590d\u5236'),
                  ),
                  bt.a.createElement(Wn, null),
                  bt.a.createElement(
                    Lr.a,
                    {
                      title: bt.a.createElement(
                        'span',
                        null,
                        '\u590d\u5236\u5f53\u524d\u5e94\u7528\u4e3a\u65b0\u5e94\u7528\u7ec4\u7684\u65b0\u5e94\u7528\uff0c\u8be5\u5e94\u7528\u4f1a\u81ea\u52a8\u6807\u8bb0\u4e3a',
                        bt.a.createElement(Ir.a, { color: '#f50' }, '\u6b63\u5f0f'),
                        '\u5e94\u7528\uff0c\u7b49\u540c\u4e8e\u5728\u65b0\u5efa\u5e94\u7528\u9875\u521b\u5efa\u4e00\u4e2a\u65b0\u5e94\u7528',
                      ),
                    },
                    bt.a.createElement(Ba.a, { onClick: (e) => p(e, 'prod') }, '\u975e\u540c\u7ec4\u590d\u5236'),
                  ),
                ),
              },
              bt.a.createElement('div', { 'data-name': s.name, onClick: Jr }, bt.a.createElement(Tr.a, null)),
            ),
            bt.a.createElement(
              Lr.a,
              { key: 'del', title: '\u66f4\u591a\u5e94\u7528\u4fe1\u606f', getTooltipContainer: Kr },
              bt.a.createElement('div', { 'data-name': s.name, onClick: o.handleEditIconClick }, bt.a.createElement(Vr.a, null)),
            ),
          ),
          bt.a.createElement(
            Pn.a,
            Object.assign({ span: 6, style: { position: 'relative' } }, bl),
            bt.a.createElement('div', { style: o.getStClassWrap(s.class_name || '') }, s.class_name),
            bt.a.createElement(
              'div',
              { style: ml, 'data-name': s.name, onClick: o.handleCardClick },
              1 === s.is_top && bt.a.createElement(Ir.a, { className: 'gHover', color: '#f50' }, bt.a.createElement(jr.a, null), '\u8350'),
              1 === s.is_test && bt.a.createElement(Ir.a, { className: 'gHover', color: 'grey' }, bt.a.createElement(Nr.a, null), '\u6d4b'),
              0 === r
                && bt.a.createElement(
                  Lr.a,
                  {
                    title:
                      '\u5df2\u8bbe\u7f6e\u7981\u6b62\u4e0a\u7ebf\uff0c\u89e6\u53d1\u6d41\u6c34\u7ebf\u6267\u884c\u4f1a\u5728\u5143\u6570\u636e\u63d0\u53d6\u6b65\u9aa4\u6267\u884c\u5931\u8d25',
                  },
                  bt.a.createElement(Ir.a, { className: 'gHover', color: 'red' }, bt.a.createElement(Dr.a, null), '\u7981'),
                ),
            ),
            bt.a.createElement(
              jn.a,
              { spinning: s._loading },
              bt.a.createElement(
                ll,
                {
                  hoverable: !0,
                  style: o.getCardStyle(),
                  'data-name': s.name,
                  onClick: o.handleCardClick,
                  actions: d,
                  onMouseEnter: () => i(!0),
                  onMouseLeave: () => i(!1),
                  bodyStyle: { borderBottom: '1px dotted lightgrey', padding: '24px 12px' },
                },
                bt.a.createElement(
                  'div',
                  null,
                  bt.a.createElement(rl, null, bt.a.createElement(Or.a, { src: s.logo })),
                  bt.a.createElement(sl, { name: s.name, data: s, onTitleClick: o.onTitleClick, showIcons: c }),
                  bt.a.createElement('div', null, bt.a.createElement(al, null, s.desc)),
                ),
              ),
            ),
          )
        );
      });
      function kl(e) {
        const t = Ct('latestVisit', {}, e);
        return (
          t.effect(() => {
            t.mr.initVisitList();
          }, []),
          { gotoStorePage: () => _e(M) }
        );
      }
      var Cl = bt.a.memo(() => {
        const { state: e, settings: t } = vt('latestVisit', { setup: kl });
        return bt.a.createElement(
          jn.a,
          { spinning: e.loading },
          0 !== e.subApps.length || e.loading
            ? ''
            : bt.a.createElement(
                Sr.a,
                {
                  image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
                  imageStyle: { height: 80 },
                  description: bt.a.createElement(
                    'span',
                    null,
                    ' \u6682\u65e0\u6700\u8fd1\u8bbf\u95ee\uff0c\u53bb\u5e94\u7528\u5e02\u573a\u901b\u901b\u5427 ',
                  ),
                },
                bt.a.createElement(
                  Ba.a,
                  { type: 'primary', icon: bt.a.createElement(Hn.a, null), onClick: t.gotoStorePage },
                  '\u63a2\u7d22\u66f4\u591a\u6709\u8da3\u5e94\u7528',
                ),
              ),
          bt.a.createElement(
            xr.a,
            { gutter: [16, 16] },
            e.subApps.map((e) => bt.a.createElement(vl, { key: e.name, delVisit: !0, appData: e, module: 'latestVisit' })),
          ),
        );
      });
      function _l(e) {
        const t = Ct('starList', {}, e);
        return (
          t.effect(() => {
            t.mr.initStarList();
          }, []),
          { gotoStorePage: () => _e(M) }
        );
      }
      var Sl = bt.a.memo(() => {
        const { state: e, settings: t } = vt('starList', { setup: _l, ccClassKey: 'StarList' });
        return bt.a.createElement(
          jn.a,
          { spinning: e.loading },
          0 !== e.subApps.length || e.loading
            ? ''
            : bt.a.createElement(
                Sr.a,
                {
                  image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
                  imageStyle: { height: 80 },
                  description: bt.a.createElement(
                    'span',
                    null,
                    ' \u6682\u65e0\u6211\u7684\u6536\u85cf\uff0c\u53bb\u5e94\u7528\u5e02\u573a\u901b\u901b\u5427 ',
                  ),
                },
                bt.a.createElement(
                  Ba.a,
                  { type: 'primary', icon: bt.a.createElement(Hn.a, null), onClick: t.gotoStorePage },
                  '\u63a2\u7d22\u66f4\u591a\u6709\u8da3\u5e94\u7528',
                ),
              ),
          bt.a.createElement(
            xr.a,
            { gutter: [16, 16] },
            e.subApps.map((e) => bt.a.createElement(vl, { key: e.name, appData: e, module: 'starList' })),
          ),
        );
      });
      function xl(e) {
        const t = Ct('createdList', {}, e);
        return (
          t.effect(() => {
            t.mr.initCreatedList(!0);
          }, []),
          { gotoNewAppPage: () => _e(T) }
        );
      }
      var Al = bt.a.memo(() => {
          const { state: e, settings: t } = vt('createdList', { setup: xl, ccClassKey: 'CreatedList' });
          return bt.a.createElement(
            jn.a,
            { spinning: e.loading },
            0 !== e.subApps.length || e.loading
              ? ''
              : bt.a.createElement(
                  Sr.a,
                  {
                    image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
                    imageStyle: { height: 80 },
                    description: bt.a.createElement(
                      'span',
                      null,
                      ' \u6682\u65e0\u6211\u7684\u521b\u5efa\uff0c\u53bb\u65b0\u5efa\u4e00\u4e2a\u5e94\u7528\u5427 ',
                    ),
                  },
                  bt.a.createElement(
                    Ba.a,
                    { type: 'primary', icon: bt.a.createElement(Hn.a, null), onClick: t.gotoNewAppPage },
                    '\u521b\u5efa\u6211\u7684\u7b2c\u4e00\u4e2a\u5e94\u7528',
                  ),
                ),
            bt.a.createElement(
              xr.a,
              { gutter: [16, 16] },
              e.subApps.map((e) => bt.a.createElement(vl, { key: e.name, appData: e, module: 'createdList' })),
            ),
          );
        }),
        Ll = a(277),
        Il = a(334),
        Ol = a(767),
        Ml = a(773),
        Tl = a(382),
        Vl = a(793),
        jl = a(794),
        Nl = a(207),
        Dl = a(365);
      function Bl() {
        return window.top._arrusers || [];
      }
      let Pl = !1,
        zl = !1;
      function Rl() {
        return zl;
      }
      function Fl() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '';
        const t = Bl();
        if (e.length < 1) return t.slice(0, 20);
        const a = t
          .filter((t) => {
            const { full: a = '' } = t;
            return a.includes(e);
          })
          .slice(0, 20);
        return a;
      }
      a.n(Dl)()(Fl, 300);
      function Hl(e) {
        const t = Ct('portal', {}, e),
          a = t.initState({ matchedUserList: Fl() }),
          n = a.computed({
            matchedUserOptions(e) {
              let { matchedUserList: t } = e;
              return Rl()
                ? t.map((e) => ({ label: e.full, value: e.en }))
                : [{ label: ft.createElement('div', { style: { width: '100%', textAlign: 'center' } }, ft.createElement(Nl.a, null)) }];
            },
          });
        t.effect(() => {
          r.initStaffState();
        }, []);
        const r = {
          searchMonitor(e) {
            const t = Fl(e);
            a.setState({ matchedUserList: t });
          },
          async initStaffState() {
            Rl()
              || (await (async function () {
                if (Pl) {
                  for (; !zl; ) await qr(1e3);
                  return !0;
                }
                Pl = !0;
                const e = async (e, t) => nt.get('/api/user/getAllUsers?start='.concat(e, '&size=').concat(t));
                try {
                  let t = [];
                  const [a, n, r, l] = await Promise.all([e(0, 5e4), e(5e4, 5e4), e(1e5, 5e4), e(15e4, 5e4)]);
                  return (t = t.concat(a).concat(n).concat(r).concat(l)), (window.top._arrusers = t), (zl = !0), !0;
                } catch (t) {
                  return console.error(t), !1;
                }
              })());
            const { userInfo: e } = t.state,
              n = Fl((e.user || '').substr(0, 2));
            a.setState({ matchedUserList: n });
          },
          state: a.state,
          cu: n,
        };
        return r;
      }
      var Ul = ft.memo(function (e) {
          const { mode: t = 'multiple', disabled: a = !1, style: n = {}, allowClear: r = !0, placeholder: l = '' } = e,
            {
              settings: { cu: o, searchMonitor: c },
            } = vt('portal', { setup: Hl }),
            i = 'single' === t ? void 0 : t;
          return ft.createElement(Il.a, {
            style: n,
            options: o.matchedUserOptions,
            onSearch: c,
            mode: i,
            placeholder: l,
            onChange: e.onChange,
            value: e.value,
            allowClear: r,
            disabled: a,
            showSearch: !0,
            getPopupContainer: Kr,
            filterOption: (e, t) => !!t.label.toLowerCase && t.label.toLowerCase().includes(e.toLowerCase()),
          });
        }),
        Gl = a(792),
        Kl = a(466),
        Wl = a(780);
      const ql = { classInfoList: [] };
      function Jl(e, t) {
        const { originalLabel: a, classKey: n } = t;
        if (!a.toLowerCase) return !1;
        if (!n.toLowerCase) return !1;
        const r = e.toLowerCase();
        return a.toLowerCase().includes(r) || n.toLowerCase().includes(r);
      }
      function Yl(e) {
        return {
          myClassItems: ql.classInfoList.filter((t) => t.create_by === e),
          visibleClassItems: ql.classInfoList.slice(0, 100),
          allClassItems: ql.classInfoList,
        };
      }
      function $l(e) {
        const { settings: t } = e,
          {
            ins: { state: a, syncer: n },
          } = t;
        return bt.a.createElement(
          Oe.a,
          {
            visible: a.modalVisible,
            onOk: t.modify,
            onCancel: t.closeModal,
            title: '\u4fee\u6539\u5206\u7c7b\u540d\u79f0',
            okText: '\u786e\u8ba4',
            cancelText: '\u53d6\u6d88',
            confirmLoading: a.updateBtnLoading,
          },
          'key\uff1a',
          bt.a.createElement(Ml.a, { value: a.selectedClassInfo.class_key, disabled: !0 }),
          bt.a.createElement(qn, { height: '12px' }),
          '\u540d\u79f0\uff1a',
          bt.a.createElement(Ml.a, { value: a.editName, onChange: n.editName }),
        );
      }
      const Xl = { color: 'var(--lra-theme-color)', paddingLeft: '3px' };
      function Zl(e) {
        const { settings: t } = e,
          {
            ins: { state: a },
          } = t,
          { selectedClassInfo: n, classToken: r, classTokenLoading: l } = a;
        return bt.a.createElement(
          Oe.a,
          { visible: a.classTokenModalVisible, footer: [], onCancel: t.closeClassTokenModal, title: '\u67e5\u770b\u5206\u7c7btoken' },
          bt.a.createElement(
            jn.a,
            { spinning: l },
            'key\uff1a',
            n.class_key,
            bt.a.createElement(qn, { height: '12px' }),
            '\u540d\u79f0\uff1a',
            n.class_label,
            bt.a.createElement(qn, { height: '12px' }),
            'token\uff1a',
            r,
            ' ',
            bt.a.createElement(Tr.a, {
              style: Xl,
              onClick: (e) => {
                Jr(e), de.b.success('\u590d\u5236\u5206\u7c7btoken\u6210\u529f!', 1), el()(r);
              },
            }),
          ),
        );
      }
      const Ql = { color: 'black', display: 'inline-block', width: '80px' },
        eo = { padding: '12px', margin: '12px', border: '1px solid var(--lra-theme-color)' },
        to = { color: 'var(--lra-theme-color)' };
      function ao(e) {
        const t = At().portal.userInfo.user,
          a = _t({}, e),
          n = a.initState(
            Object(f.a)(
              {
                newKey: '',
                newName: '',
                editName: '',
                modalVisible: !1,
                classTokenModalVisible: !1,
                selectedClassInfo: {},
                newBtnLoading: !1,
                updateBtnLoading: !1,
                showNewClassInfo: !1,
                classTokenLoading: !1,
                classToken: '',
              },
              Yl(t),
            ),
          );
        a.effect(() => {
          ql.classInfoList.length
            || Mt().then((e) => {
              (ql.classInfoList = e), n.setState(Yl(t));
            });
        }, []);
        const r = {
          user: t,
          ins: n,
          formatMsg: (e, t) => (e.includes('Validation error') ? t : e),
          cancelNewClassInfo() {
            n.setState({ showNewClassInfo: !1 });
          },
          showNewClassInfo: (e) => (e.preventDefault(), n.setState({ showNewClassInfo: !0 })),
          gotoClassMgr() {
            _e(V);
          },
          async newClassInfo(e) {
            e.preventDefault();
            const { newName: a, newKey: l } = n.state;
            if (!a || !l) return de.b.error('\u65b0\u5efa\u5931\u8d25\uff0c\u8bf7\u8f93\u5165\u5206\u7c7bkey\u3001\u540d\u79f0');
            if (a.length > 30 || l.length > 30)
              return de.b.error('\u65b0\u5efa\u5931\u8d25\uff0c\u5206\u7c7bkey\u6216\u540d\u79f0\u957f\u5ea6\u5927\u4e8e30');
            if (!ma.letterOrNum.test(l))
              return de.b.error(
                '\u65b0\u5efa\u5931\u8d25\uff0c\u5206\u7c7bkey\u53ea\u80fd\u662f\u82f1\u6587\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\u3001\u6a2a\u5411\u7684\u4efb\u610f\u7ec4\u5408',
              );
            n.setState({ newBtnLoading: !0 });
            const o = await (async function (e, t) {
              const { timestamp: a, nonce: n } = Ot();
              return await nt.post(
                '/api/v1/classInfo/create?timestamp='.concat(a, '&nonce=').concat(n),
                { key: e, name: t },
                { returnLogicData: !1, check: !1 },
              );
            })(l, a);
            let c = !1;
            '0' !== o.code
              ? de.b.error(r.formatMsg(o.msg, '\u5206\u7c7bkey\u6216\u540d\u79f0\u91cd\u590d'))
              : ((c = !0), de.b.success('\u65b0\u589e\u5206\u7c7b\u6210\u529f!'), ql.classInfoList.push(o.data)),
              n.setState(Object(f.a)({ newBtnLoading: !1, showNewClassInfo: !c }, Yl(t)));
          },
          openModal(e, t) {
            Jr(e), n.setState({ modalVisible: !0, selectedClassInfo: t, editName: t.class_label });
          },
          async openClassTokenModal(e, t) {
            Jr(e), n.setState({ classTokenModalVisible: !0, selectedClassInfo: t, classToken: '', classTokenLoading: !0 });
            try {
              const e = await (async function (e) {
                const { timestamp: t, nonce: a } = Ot();
                return await nt.get('/api/v1/classInfo/getFull?timestamp='.concat(t, '&nonce=').concat(a, '&id=').concat(e));
              })(t.id);
              n.setState({ classToken: e.class_token, classTokenLoading: !1 });
            } catch (a) {
              de.b.error(a.message), n.setState({ classTokenLoading: !1 });
            }
          },
          closeModal() {
            n.setState({ modalVisible: !1 });
          },
          closeClassTokenModal() {
            n.setState({ classTokenModalVisible: !1, classToken: '' });
          },
          async modify() {
            const { editName: e, selectedClassInfo: a, allClassItems: l } = n.state;
            if (l.filter((t) => t.class_label === e).length)
              return de.b.error('\u4fee\u6539\u65e0\u6548\uff0c\u540d\u5b57\u91cd\u590d\uff01');
            n.setState({ updateBtnLoading: !0 });
            const o = await (async function (e, t) {
              const { timestamp: a, nonce: n } = Ot();
              return await nt.post(
                '/api/v1/classInfo/update?timestamp='.concat(a, '&nonce=').concat(n),
                { key: e, name: t },
                { returnLogicData: !1, check: !1 },
              );
            })(a.class_key, e);
            '0' !== o.code
              ? de.b.error(r.formatMsg(o.msg, '\u5206\u7c7b\u540d\u79f0\u91cd\u590d'))
              : (de.b.success('\u66f4\u65b0\u5206\u7c7b\u540d\u79f0\u6210\u529f'), (a.class_label = e)),
              n.setState(Object(f.a)({ updateBtnLoading: !1, modalVisible: !1 }, Yl(t)));
          },
        };
        return r;
      }
      function no(e) {
        const { settings: t } = e,
          { ins: a } = t,
          { newBtnLoading: n } = a.state;
        return bt.a.createElement(
          'div',
          { style: eo },
          bt.a.createElement('span', { style: Ql }, '\u5206\u7c7bkey\uff1a'),
          bt.a.createElement(Ml.a, {
            style: { width: '360px' },
            placeholder: 'hel-demo',
            value: t.ins.state.newKey,
            onChange: a.syncer.newKey,
            allowClear: !0,
          }),
          bt.a.createElement(qn, { height: '3px' }),
          bt.a.createElement(
            Ir.a,
            { color: 'blue', style: { marginLeft: '80px' } },
            '\u5141\u8bb80~9\u6570\u5b57\u3001a~z\u5927\u5c0f\u5199\u5b57\u6bcd\u3001\u4e0b\u5212\u7ebf\u3001\u4e2d\u6a2a\u7ebf\u4efb\u610f\u7ec4\u5408\uff0c\u5efa\u8bae\u5f55\u5165\u4e00\u4e2a\u6709\u610f\u4e49\u7684key\uff0c',
            bt.a.createElement(
              'span',
              { style: { color: 'red' } },
              '\u540e\u7eed\u4e0d\u5141\u8bb8\u53d8\u66f4\uff0c\u6bcf\u4eba\u521b\u5efa\u4e0a\u96505\u4e2a',
            ),
          ),
          bt.a.createElement(qn, { height: '12px' }),
          bt.a.createElement('span', { style: Ql }, ' \u5206\u7c7b\u540d\u79f0\uff1a'),
          bt.a.createElement(Ml.a, {
            style: { width: '360px' },
            placeholder: '\u6d77\u62c9\u5206\u4eab\u6848\u4f8b',
            value: t.ins.state.newName,
            onChange: a.syncer.newName,
            allowClear: !0,
          }),
          bt.a.createElement(qn, { height: '3px' }),
          bt.a.createElement(
            Ir.a,
            { color: 'blue', style: { marginLeft: '80px' } },
            '\u7528\u4e8e\u5c55\u793a\u7684\u540d\u79f0\uff0c\u540e\u7eed\u53ef\u4ee5\u4e8c\u6b21\u66f4\u6539',
          ),
          bt.a.createElement(qn, { height: '12px' }),
          bt.a.createElement(
            'div',
            { style: { textAlign: 'center' } },
            bt.a.createElement(Ba.a, { onClick: t.cancelNewClassInfo }, '\u53d6\u6d88'),
            bt.a.createElement(Wn, { width: '20px' }),
            bt.a.createElement(Ba.a, { type: 'primary', onClick: t.newClassInfo, loading: n }, '\u786e\u8ba4'),
          ),
        );
      }
      function ro(e) {
        const { item: t, settings: a, showTokenBtn: n } = e;
        return bt.a.createElement(
          'div',
          null,
          t.class_label,
          bt.a.createElement(
            'span',
            { style: { color: 'lightgrey', paddingLeft: '12px' } },
            '( ',
            t.class_key,
            ' , ',
            t.create_by,
            ' \u521b\u5efa\u4e8e ',
            Br(t.ctime),
            a.user === t.create_by
              && bt.a.createElement(
                bt.a.Fragment,
                null,
                bt.a.createElement(Wn, null),
                bt.a.createElement(
                  Lr.a,
                  { title: '\u5f53\u524d\u5206\u7c7b\u7531\u8bbf\u95ee\u8005\u521b\u5efa\uff0c\u5141\u8bb8\u518d\u6b21\u4fee\u6539' },
                  bt.a.createElement(Gl.a, { style: to, onClick: (e) => a.openModal(e, t) }),
                ),
                bt.a.createElement(Wn, { width: '6px' }),
                n
                  && bt.a.createElement(
                    Lr.a,
                    {
                      title:
                        '\u67e5\u770b\u5206\u7c7btoken\uff0c\u6ee1\u8db3helpack-js-sdk\u3001hel-mono-deploy \u7b49\u5305\u4f53\u8c03\u7528api\u65f6\u4e4b\u9700',
                    },
                    bt.a.createElement(Kl.a, { style: to, onClick: (e) => a.openClassTokenModal(e, t) }),
                  ),
              ),
            ' )',
          ),
        );
      }
      function lo(e, t) {
        const { state: a } = e.ins;
        return a.visibleClassItems.map((a) => {
          const { class_label: n, class_key: r } = a;
          return { originalLabel: n, classKey: r, label: t ? bt.a.createElement(ro, { settings: e, key: r, item: a }) : n, value: r };
        });
      }
      function oo() {
        const e = kt(ao, { extra: { isPage: !0 } }),
          { myClassItems: t, showNewClassInfo: a } = e.ins.state;
        return bt.a.createElement(
          'div',
          null,
          bt.a.createElement($l, { settings: e }),
          bt.a.createElement(Zl, { settings: e }),
          bt.a.createElement(
            'div',
            null,
            '\u6211\u7684\u5206\u7c7b\u5217\u8868\uff08 \u6ca1\u6709\u5408\u9002\u7684\uff1f',
            bt.a.createElement(
              'span',
              { className: 'gHover', onClick: e.showNewClassInfo, style: { color: 'var(--lra-theme-color)' } },
              '\u65b0\u5efa',
            ),
            '\u4e00\u4e2a\uff09',
          ),
          a && bt.a.createElement(no, { settings: e }),
          t.length
            ? bt.a.createElement(
                'div',
                { style: { border: '1px solid var(--lra-theme-color)', padding: '12px' } },
                t.map((t) => bt.a.createElement(ro, { key: t.class_key, settings: e, item: t, showTokenBtn: !0 })),
              )
            : bt.a.createElement(Sr.a, null),
        );
      }
      var co = (e) => {
        const { disabled: t = !1, allowEdit: a = !0, style: n = {} } = e,
          r = kt(ao),
          { ins: l } = r;
        return bt.a.createElement(
          bt.a.Fragment,
          null,
          bt.a.createElement($l, { settings: r }),
          bt.a.createElement(Il.a, {
            showSearch: !0,
            allowClear: !0,
            style: n,
            disabled: t,
            placeholder: '\u9009\u62e9\u5206\u7c7b',
            onChange: e.onChange,
            value: e.value || void 0,
            dropdownRender: (e) =>
              a
                ? bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    e,
                    bt.a.createElement(Ol.a, { style: { margin: '8px 0' } }),
                    bt.a.createElement(
                      Wl.b,
                      { style: { padding: '0 8px 4px' } },
                      '\u627e\u4e0d\u5230\u5408\u9002\u7684\u5206\u7c7b\uff1f',
                      bt.a.createElement('span', { className: 'gHover', onClick: r.showNewClassInfo, style: to }, '\u65b0\u5efa'),
                      '\u4e00\u4e2a \uff0c\u53bb',
                      bt.a.createElement('span', { className: 'gHover', onClick: r.gotoClassMgr, style: to }, '\u6211\u7684\u5206\u7c7b'),
                      '\u67e5\u770b',
                    ),
                    l.state.showNewClassInfo && bt.a.createElement(no, { settings: r }),
                  )
                : bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    e,
                    bt.a.createElement(Ol.a, { style: { margin: '8px 0' } }),
                    bt.a.createElement(
                      'span',
                      { style: { paddingLeft: '8px', color: 'lightgrey' } },
                      '\u53ef\u5728\u65b0\u5efa\u6216\u4fee\u6539\u5e94\u7528\u65f6\u65b0\u589e\u5206\u7c7b',
                    ),
                  ),
            optionLabelProp: 'originalLabel',
            options: lo(r, a),
            filterOption: Jl,
          }),
        );
      };
      const io = { position: 'absolute', right: '3px', top: '-5px', width: '60px', zIndex: 2 },
        so = { width: '46px', transform: 'translateX(-1px)', verticalAlign: 'top' },
        po = [
          { label: '\u6b63\u5f0f', value: 'prod' },
          { label: '\u6d4b\u8bd5', value: 'test' },
          { label: '\u5168\u90e8', value: 'all' },
        ];
      function uo(e) {
        const t = Ct('appStore', {}, e),
          a = t.initState({ modelVisible: !1 });
        t.effect(() => {
          t.mr.initPage(!0),
            localStorage.getItem(me.APP_CARD_GRAY) || (localStorage.setItem(me.APP_CARD_GRAY, 1), a.setState({ modelVisible: !0 }));
        }, []),
          t.watch('listMode', (e, a) => {
            e.listMode !== a.listMode && t.mr.fetchDataList({ page: 1 });
          });
        const n = () => w(localStorage.getItem('HelHub.latestSearch'), []).filter((e) => !!e),
          r = {
            ins: a,
            fetchMore: () => {
              const e = { page: t.state.page + 1 };
              t.mr.fetchDataList(e);
            },
            handelPageSizeChange: (e, a) => {
              t.mr.fetchDataList({ page: e, size: a });
            },
            handlePageCurrentChange: async (e) => {
              t.mr.fetchDataList({ page: e });
            },
            handleNameClick(e) {
              const { key: a } = e;
              t.mr.setState({ searchStr: a }), t.mr.searchApp();
            },
            async searchApp() {
              await qr(12),
                t.mr.searchApp().then(() => {
                  const { subApps: e, searchStr: a, total: r, listMode: l } = t.state;
                  e.length
                    && ((e) => {
                      let t = n();
                      (t = Vt(t, e)), t.unshift(e), localStorage.setItem('HelHub.latestSearch', JSON.stringify(t));
                    })(a),
                    'all' !== l
                      && de.b.info(
                        'helpack \u4e3a\u4f60\u5171\u641c\u5230 '.concat(
                          r,
                          ' \u4e2a\u5e94\u7528\uff0c\u5982\u6ca1\u6709\u67e5\u8be2\u7ed3\u679c\u53ef\u5c1d\u8bd5\u5207\u6362\u5230\u3010\u5168\u90e8\u3011\u5e94\u7528',
                        ),
                        1,
                      );
                });
            },
            searchAppByClassKey(e) {
              t.mr.setState({ classKey: void 0 === e ? '-10000' : e }), t.mr.searchApp();
            },
            renderLatestSearchMenu() {
              const e = n();
              return bt.a.createElement(
                Ll.a,
                { className: 'smallScBar', onClick: r.handleNameClick, style: { maxHeight: '380px', overflowY: 'scroll', width: '280px' } },
                !e.length && bt.a.createElement(Sr.a, { description: '\u6682\u65e0\u6700\u8fd1\u641c\u7d22' }),
                e.map((e) => bt.a.createElement(Ll.a.Item, { key: e }, e)),
              );
            },
            showTotal: () =>
              bt.a.createElement(
                'span',
                { style: { color: 'rgba(0, 0, 0, 0.45)' } },
                'Hel Pack \u4e3a\u4f60\u5171\u641c\u7d22\u5230\u5e94\u7528 ',
                t.state.total,
                ' \u4e2a',
              ),
            searchOptions: [
              { label: '\u5e94\u7528\u540d\uff08\u6a21\u7cca\uff09', value: 'name' },
              { label: '\u5e94\u7528\u540d\uff08\u7cbe\u786e\uff09', value: 'name_exact' },
              { label: '\u521b\u5efa\u8005', value: 'creator' },
            ],
          };
        return r;
      }
      var mo = bt.a.memo(() => {
        const { state: e, settings: t, syncer: a, mr: n } = vt('appStore', { setup: uo, ccClassKey: 'AppStore' }),
          { ins: r } = t,
          l = bt.a.createElement(Il.a, {
            value: e.searchType,
            dropdownStyle: { minWidth: '140px' },
            options: t.searchOptions,
            onChange: a.searchType,
          });
        return bt.a.createElement(
          'div',
          { style: { position: 'relative' } },
          'test' === e.listMode
            && bt.a.createElement('img', { src: 'http://mat1.gtimg.com/news/js/tnfe/imgs/leah4/test_app.png', style: io }),
          bt.a.createElement(
            xr.a,
            null,
            bt.a.createElement(
              Pn.a,
              { span: 24 },
              '\u67e5\u770b\u5e94\u7528:',
              bt.a.createElement(Wn, null),
              bt.a.createElement(Bn.a.Group, { options: po, onChange: a.listMode, value: e.listMode }),
              bt.a.createElement(Ol.a, { type: 'vertical' }),
              bt.a.createElement(Wn, { width: '20px' }),
              bt.a.createElement(
                'span',
                { style: { position: 'relative' } },
                bt.a.createElement(Ml.a.Search, {
                  value: e.searchStr,
                  onChange: a.searchStr,
                  onSearch: t.searchApp,
                  style: { width: '380px' },
                  enterButton: !0,
                  allowClear: !0,
                  addonBefore: l,
                  placeholder: '\u8bf7\u8f93\u5165\u5e94\u7528\u540d',
                }),
                'creator' === e.searchType
                  && bt.a.createElement(Ul, {
                    mode: 'single',
                    placeholder: '\u8bf7\u9009\u62e9\u521b\u5efa\u8005',
                    value: e.searchUser,
                    style: { width: '249px', position: 'absolute', left: '84px' },
                    onChange: (e) => {
                      n.setState({ searchUser: e || '' });
                    },
                  }),
                ['name', 'name_exact'].includes(e.searchType)
                  && bt.a.createElement(
                    Tl.a,
                    { overlay: t.renderLatestSearchMenu },
                    bt.a.createElement(Ba.a, { style: so, className: 'gHover', icon: bt.a.createElement(Vl.a, null) }),
                  ),
              ),
              bt.a.createElement(Wn, null),
              bt.a.createElement(co, { allowEdit: !1, style: { width: '220px', verticalAlign: 'top' }, onChange: t.searchAppByClassKey }),
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ba.a,
                { onClick: n.refreshCurPage, className: 'gHover', style: { verticalAlign: 'top' }, icon: bt.a.createElement(jl.a, null) },
                '\u5237\u65b0',
              ),
            ),
          ),
          bt.a.createElement(qn, null),
          bt.a.createElement(
            jn.a,
            { spinning: e.loading },
            bt.a.createElement(xr.a, { justify: 'center' }, 0 === e.subApps.length && bt.a.createElement(Sr.a, null)),
            bt.a.createElement(
              xr.a,
              { gutter: [16, 16] },
              e.subApps.map((e) => bt.a.createElement(vl, { key: e.name, appData: e, module: 'appStore' })),
              bt.a.createElement(
                'div',
                { style: { width: '100%' } },
                bt.a.createElement(Pa.a, {
                  onShowSizeChange: t.handelPageSizeChange,
                  onChange: t.handlePageCurrentChange,
                  current: e.page,
                  total: e.total,
                  showSizeChanger: !0,
                  pageSizeOptions: ['20', '50', '100'],
                  pageSize: e.size,
                  style: { paddingRight: '20px', float: 'right' },
                  showTotal: t.showTotal,
                }),
              ),
            ),
          ),
          bt.a.createElement(
            Oe.a,
            {
              title: 'helpack \u66f4\u65b0\u63d0\u793a',
              visible: r.state.modelVisible,
              width: 1e3,
              centered: !0,
              onCancel: () => r.setState({ modelVisible: !1 }),
              footer: [bt.a.createElement(Ba.a, { key: '1', type: 'primary', onClick: () => r.setState({ modelVisible: !1 }) }, 'Ok')],
            },
            bt.a.createElement(
              'div',
              null,
              bt.a.createElement(zn.a, {
                showIcon: !0,
                type: 'info',
                message:
                  '\u5e94\u7528\u5217\u8868\u5361\u7247\u989c\u8272\u4f18\u5316\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u5168\u7070\u4ee3\u8868\u5e94\u7528\u6b63\u5728\u7070\u5ea6\u4e2d',
              }),
              bt.a.createElement(qn, null),
              bt.a.createElement('img', { src: oe }),
            ),
          ),
        );
      });
      function go(e) {
        e.effect(() => {
          e.mr.initTop();
        }, []);
      }
      var ho = bt.a.memo(() => {
          const { state: e } = Object(h.useConcent)({ module: 'top', setup: go }, 'Top');
          return bt.a.createElement(
            jn.a,
            { spinning: e.loading },
            bt.a.createElement(
              xr.a,
              { gutter: [16, 16] },
              e.subApps.map((e) => bt.a.createElement(vl, { key: e.name, appData: e, module: 'top' })),
            ),
          );
        }),
        fo = a(468),
        bo = a(772);
      function Eo(e) {
        let { width: t = '20px' } = e;
        return bt.a.createElement('div', { style: { width: t, display: 'inline-block' } });
      }
      var yo = a(775),
        wo = a(781);
      const vo = ['type', 'name', 'style', 'placeHolder'],
        ko = ['name', 'label', 'initValue', 'options', 'render'],
        Co = ['name', 'label', 'initValue', 'options', 'render', 'rules'],
        _o = ['name', 'label', 'placeholder', 'initValue', 'rules'],
        So = ['name', 'label', 'options', 'placeholder', 'initValue', 'rules'],
        xo = ['name', 'label'],
        Ao = ['name', 'label'],
        Lo = ['render'],
        { Option: Io } = Il.a;
      let Oo = 1;
      function Mo() {
        return (Oo += 1), Oo;
      }
      function To(e) {
        let t = e;
        return 'string' === typeof e[0] && (t = e.map((e) => ({ value: e, label: e }))), t;
      }
      function Vo(e, t) {
        return e.map((e, a) => {
          const { type: n, name: r, style: l = {}, placeHolder: o } = e,
            c = Object(Ve.a)(e, vo);
          let i = '';
          const s = e.rules || [];
          if ('select' === n) {
            const t = To(e.options);
            i = bt.a.createElement(
              Il.a,
              { placeholder: e.placeHolder, getPopupContainer: Kr },
              t.map((e, t) => bt.a.createElement(Io, { key: t, value: e.value }, e.label)),
            );
          } else if ('input' === n) i = bt.a.createElement(Ml.a, Object.assign({ style: l }, c, { placeholder: o }));
          else if ('inputNumber' === n) i = bt.a.createElement(yo.a, c);
          else {
            if ('customize' !== n) throw new Error('not implemented type['.concat(n, ']'));
            i = e.render(r, t);
          }
          const p = t ? [t, r] : r;
          return bt.a.createElement(bo.a.Item, { key: a, name: p, noStyle: !0, rules: s }, i);
        });
      }
      function jo(e) {
        let { name: t, label: a, initValue: n = '', options: r = [], render: l } = e,
          o = Object(Ve.a)(e, ko);
        const c = To(r),
          i = n || c[0];
        let s;
        return (
          (s = l
            ? l({ initValue: i, options: c })
            : bt.a.createElement(
                Bn.a.Group,
                Object.assign({ value: i }, o),
                c.map((e, t) => bt.a.createElement(Bn.a.Button, { key: t, value: e.value }, e.label)),
              )),
          bt.a.createElement(bo.a.Item, { key: Mo(), label: a, name: t, style: { marginBottom: '10px' } }, s)
        );
      }
      function No(e) {
        let { name: t, label: a, initValue: n = '', options: r = [], render: l, rules: o = [] } = e,
          c = Object(Ve.a)(e, Co);
        const i = To(r),
          s = n || i[0];
        let p;
        return (
          (p = l ? l({ initValue: s, options: i }) : bt.a.createElement(Bn.a.Group, Object.assign({ options: r, value: s }, c))),
          bt.a.createElement(bo.a.Item, { key: Mo(), label: a, name: t, rules: o, style: { marginBottom: '10px' } }, p)
        );
      }
      function Do(e) {
        let { name: t, label: a, placeholder: n = '', initValue: r = '', rules: l = [] } = e,
          o = Object(Ve.a)(e, _o);
        return bt.a.createElement(
          bo.a.Item,
          { key: Mo(), label: a, name: t, rules: l, style: { marginBottom: '10px' } },
          bt.a.createElement(Ml.a, Object.assign({ placeholder: n, value: r }, o)),
        );
      }
      function Bo(e) {
        let { name: t, label: a, options: n = [], placeholder: r = '', initValue: l = '', rules: o = [] } = e,
          c = Object(Ve.a)(e, So);
        return bt.a.createElement(
          bo.a.Item,
          { key: Mo(), label: a, name: t, rules: o, style: { marginBottom: '10px' } },
          bt.a.createElement(
            Il.a,
            Object.assign({ placeholder: r, value: l }, c, { getPopupContainer: Kr }),
            n.map((e, t) => bt.a.createElement(Io, { key: t, value: e.value }, e.label)),
          ),
        );
      }
      function Po(e) {
        let { name: t, label: a, items: n = [] } = e;
        const r = Vo(n, t);
        return bt.a.createElement(
          bo.a.Item,
          { key: Mo(), label: a, style: { marginBottom: '10px' } },
          bt.a.createElement(Ml.a.Group, { compact: !0 }, r),
        );
      }
      function zo(e) {
        let { label: t, items: a = [] } = e;
        const n = Vo(a);
        return bt.a.createElement(bo.a.Item, { key: Mo(), label: t, style: { marginBottom: '10px' } }, n);
      }
      function Ro(e) {
        let { name: t, label: a } = e,
          n = Object(Ve.a)(e, xo);
        return bt.a.createElement(
          bo.a.Item,
          { key: Mo(), name: t, label: a, style: { marginBottom: '10px' } },
          bt.a.createElement(yo.a, n),
        );
      }
      function Fo(e) {
        let { name: t, label: a } = e,
          n = Object(Ve.a)(e, Ao);
        return bt.a.createElement(
          bo.a.Item,
          { key: Mo(), name: t, label: a, style: { marginBottom: '10px' } },
          bt.a.createElement(wo.a, n),
        );
      }
      function Ho(e) {
        let { render: t } = e,
          a = Object(Ve.a)(e, Lo);
        const { name: n, label: r } = a,
          l = t ? t(a) : bt.a.createElement('h', null, 'need render');
        return bt.a.createElement(bo.a.Item, { key: Mo(), name: n, label: r, style: { marginBottom: '10px' } }, l);
      }
      const Uo = {
        input: Do,
        switch: Fo,
        select: Bo,
        inputGroup: Po,
        inputMulti: zo,
        inputNumber: Ro,
        groupButton: jo,
        radioGroup: No,
        customize: Ho,
      };
      function Go(e) {
        const t = Uo[e];
        if (!t) throw new Error('not implement field type['.concat(e, ']'));
        return t;
      }
      const { Item: Ko } = bo.a,
        { Group: Wo, Button: qo } = Bn.a,
        { getFieldTypeMaker: Jo } = g,
        Yo = {
          formItemLayout: (e) => ('horizontal' === e.formLayout ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } } : null),
          buttonItemLayout: (e) => ('horizontal' === e.formLayout ? { wrapperCol: { span: 14, offset: 4 } } : null),
        },
        $o = (e) => {
          e.initState({ formLayout: e.props.layout || 'horizontal', loading: !1 }),
            e.computed(Yo),
            e.on('cancelFormBtnLoading', () => {
              e.setState({ loading: !1 });
            }),
            e.on('fillFormValues', (t) => {
              e.extra.form.setFieldsValue(t);
            }),
            (window.top._form = e.extra.form),
            e.effectProps(
              () => {
                const { fillValues: t } = e.props;
                if (t) {
                  const a = Object(f.a)({}, t);
                  e.extra.form.setFieldsValue(a);
                }
              },
              ['fillValues'],
              { immediate: !0 },
            );
          const t = (t) => {
            e.setState({ formLayout: t.target.value });
          };
          let a = () => '';
          e.props.dynamicLayout
            && (a = () =>
              bt.a.createElement(
                Ko,
                { label: e.props.layoutFieldLabel || 'Form Layout', style: { marginBottom: '10px' } },
                bt.a.createElement(
                  Wo,
                  { value: e.state.formLayout, onChange: t },
                  bt.a.createElement(qo, { value: 'horizontal' }, 'Horizontal'),
                  bt.a.createElement(qo, { value: 'vertical' }, 'Vertical'),
                  bt.a.createElement(qo, { value: 'inline' }, 'Inline'),
                ),
              ));
          const n = e.props.fields.map((e) => {
              const { type: t, options: a } = e;
              return Jo(t)(a);
            }),
            { resetBtn: r } = e.props;
          let l = '';
          if (void 0 !== r) {
            const t = () => e.extra.form.resetFields(),
              a = 'string' !== typeof r ? 'Reset' : r;
            l = bt.a.createElement(Ba.a, { htmlType: 'button', onClick: t }, a);
          }
          let o = '';
          const { fillBtn: c, fillValues: i } = e.props;
          if (void 0 !== c) {
            const t = () => {
                if (!i) return alert('\u8bf7\u8bbe\u7f6e\u6b32\u586b\u5145\u7684\u9ed8\u8ba4\u503c');
                e.extra.form.setFieldsValue(i);
              },
              a = 'string' !== typeof c ? 'Fill form' : c;
            o = bt.a.createElement(Ba.a, { htmlType: 'button', onClick: t }, a);
          }
          return {
            renderLayoutControl: a,
            UIFields: n,
            UIResetBtn: l,
            UIFillBtn: o,
            onValuesChange: (t) => {
              e.props.onValuesChange && e.props.onValuesChange(t, e.extra.form);
            },
            onFinish: (t) => {
              e.props.onFinish && (e.props.onFinish(t), e.setState({ loading: !0 }));
            },
          };
        };
      var Xo = bt.a.memo((e) => {
        const [t] = bo.a.useForm(),
          a = Object(h.useConcent)({ setup: $o, props: e, extra: { form: t } }),
          {
            state: { formLayout: n, loading: r },
            refComputed: { formItemLayout: l, buttonItemLayout: o },
            settings: { renderLayoutControl: c, UIFields: i, UIResetBtn: s, UIFillBtn: p, onValuesChange: u, onFinish: m },
          } = a,
          d = e.extraBtns || '',
          g = { layout: n };
        e.fields.forEach((e) => {
          Object.prototype.hasOwnProperty.call(e.options, 'value') && (g[e.options.name] = e.options.value);
        });
        const { showSelfBtn: f = !0 } = e;
        return bt.a.createElement(
          'div',
          null,
          bt.a.createElement(
            bo.a,
            Object.assign({}, l, { layout: n, form: t, onFinish: m, initialValues: g, onValuesChange: u }),
            c(),
            i,
            bt.a.createElement(
              bo.a.Item,
              o,
              d,
              f
                && bt.a.createElement(
                  'div',
                  { style: { textAlign: 'center', paddingTop: '12px' } },
                  bt.a.createElement(Ba.a, { type: 'primary', htmlType: 'submit', loading: r }, e.submitBtnLabel || 'Submit'),
                  s ? bt.a.createElement(bt.a.Fragment, null, bt.a.createElement(Eo, null), s) : '',
                  p ? bt.a.createElement(bt.a.Fragment, null, bt.a.createElement(Eo, null), p) : '',
                ),
            ),
          ),
        );
      });
      const Zo = window.location.origin,
        Qo =
          '\u5982\u8bbe\u5b9a\u4e86\u3010\u662f\u5426\u5728\u5e73\u53f0\u5e95\u5ea7\u4e0b\u6e32\u67d3\u3011\u4e3a\u3010\u662f\u3011\u5219\u5e94\u7528\u8bbf\u95ee\u5165\u53e3\u4f1a\u9ed8\u8ba4\u662f '.concat(
            Zo,
            '/{appName}\uff0c\u6ce8\uff1a\u6b63\u5f0f\u5e94\u7528\u7684\u540d\u5b57\u548c\u7ec4\u540d\u4f1a\u4fdd\u6301\u4e00\u81f4',
          ),
        ec =
          '\u7528\u4e8e\u9632\u6b62\u4ed6\u4eba\u521b\u5efa\u84dd\u76fe\u6d41\u6c34\u7ebf\u65f6\u77e5\u9053\u4f60\u7684app\u540d\u79f0\u5c31\u53ef\u4ee5\u6784\u5efa\u5e76\u8986\u76d6\u4f60\u7684\u5e94\u7528\u4ea7\u7269\uff0c\u540c\u65f6\u4e5f\u7528\u4e8e\u533a\u5206\u591a\u4e2a\u5206\u533a\u7684\u5b50\u5e94\u7528',
        tc =
          '\u8868\u793a\u591a\u4e2aapp\u5e94\u7528\u662f\u540c\u4e00\u79cdapp\u4e0b\u4e0d\u540c\u73af\u5883\uff08\u540c\u4e00\u4e2a\u4ed3\u5e93\u4e0d\u540c\u5206\u652f\u4e0d\u540c\u6d41\u6c34\u7ebf\uff09\u7684\u5b9e\u4f8b\uff0c \u6ce8\uff1a\u6b63\u5f0f\u5e94\u7528\u7684\u540d\u5b57\u548c\u7ec4\u540d\u4f1a\u4fdd\u6301\u4e00\u81f4',
        ac =
          '\u6b64\u53c2\u6570\u7528\u4e8e\u63a7\u5236\u8bbf\u95ee\u6309\u94ae\u7684\u8df3\u8f6c\u8def\u5f84\uff0c'
          + '\u9009\u62e9\u3010\u662f\u3011\u8bbf\u95ee '
            .concat(Zo, '/{appName}\uff0c\u9009\u62e9\u3010\u5426\u3011\u8bbf\u95ee ')
            .concat(Zo, '/page/{appName}')
          + '\uff08\u652f\u6301\u81ea\u5b9a\u4e49\u3010\u5e94\u7528\u6e32\u67d3\u8def\u5f84\u3011\u503c\u6765\u63a7\u5236\u9009\u62e9\u3010\u5426\u3011\u65f6\u7684\u8df3\u8f6c\u8def\u5f84\uff09',
        nc =
          '\u5f53\u3010\u662f\u5426\u5728\u5e73\u53f0\u5e95\u5ea7\u4e0b\u6e32\u67d3\u3011\u4e3a\u3010\u5426\u3011\u4e14\u9700\u8981\u81ea\u5b9a\u4e49\u8bbf\u95ee\u8def\u5f84\u65f6\uff0c\u586b\u5199\u6b64\u9879',
        rc = {
          pattern: /^[a-z0-9-/@_]+$/,
          message:
            '\u53ea\u80fd\u662f\u5c0f\u5199\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\u3001\u4e2d\u5212\u7ebf\u3001\u659c\u7ebf\u3001@\u7684\u7ec4\u5408',
        },
        lc = [
          { required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528token' },
          { max: 30, type: 'string', message: '\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e30' },
          {
            pattern: /^[a-zA-Z0-9-_]+$/,
            message: '\u53ea\u80fd\u662f\u82f1\u6587\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\u3001\u4e2d\u5212\u7ebf\u7684\u7ec4\u5408',
          },
        ],
        oc = [{ max: 64, type: 'string', message: '\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e64' }, rc],
        cc = {
          name: '',
          token: '',
          app_group_name: '',
          cnname: '',
          splash_screen: '',
          desc: '',
          git_repo_url: '',
          api_host: '',
          is_test: 0,
          enable_gray: 0,
          enable_pipeline: 1,
          gray_users: [],
          owners: [],
          is_local_render: 0,
          render_app_host: '',
          ui_framework: 'lib',
        };
      function ic() {
        return ''
          .concat(location.hostname.split('.')[0], '-')
          .concat(
            (function () {
              let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 6,
                t = '';
              for (let a = 0; a < e; a++) t += sa[ca(pa)];
              return t;
            })(),
            '-',
          )
          .concat(Date.now());
      }
      const sc = {
          type: 'input',
          options: {
            name: 'token',
            label: bt.a.createElement(
              'span',
              null,
              '\u5e94\u7528token ',
              bt.a.createElement(Lr.a, { title: ec, color: 'blue', getPopupContainer: Kr }, bt.a.createElement(fo.a, null)),
            ),
            disabled: !0,
            placeholder: 'input app token',
            rules: lc,
          },
        },
        pc = {
          type: 'input',
          options: {
            name: 'app_group_name',
            disabled: !0,
            label: bt.a.createElement(
              'span',
              null,
              '\u5e94\u7528\u6240\u5c5e\u7ec4\u540d\u79f0 ',
              bt.a.createElement(Lr.a, { title: tc, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u4e00\u4e2a\u7ec4\u540d\u53ef\u5bf9\u5e94\u591a\u4e2a\u5e94\u7528\u540d\uff0c\u8868\u793a\u5e94\u7528\u5bf9\u5e94\u7684\u591a\u79cd\u73af\u5883(\u4f8b\u5982\u4e0d\u540c\u7684\u5206\u652f)',
              ),
            ),
            placeholder:
              '\u65b0\u5efa\u6b63\u5f0f\u5e94\u7528\u65f6\u3010\u5e94\u7528\u6240\u5c5e\u7ec4\u540d\u3011\u9ed8\u8ba4\u548c\u3010\u5e94\u7528\u540d\u3011\u4fdd\u6301\u4e00\u81f4',
            rules: [{ required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528\u7ec4\u540d\u79f0' }, ...oc],
          },
        },
        uc = {
          type: 'input',
          options: {
            name: 'name',
            label: bt.a.createElement(
              'span',
              null,
              '\u5e94\u7528\u540d\u79f0 ',
              bt.a.createElement(Lr.a, { title: Qo, color: 'blue' }, bt.a.createElement(fo.a, { getTooltipContainer: Kr })),
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u65b0\u5efa\u6b63\u5f0f\u5e94\u7528\u65f6\uff0c\u5e94\u7528\u7ec4\u540d\u4f1a\u81ea\u52a8\u4e0e\u5e94\u7528\u540d\u4fdd\u6301\u4e00\u81f4\uff0c\u5408\u6cd5\u7684\u5e94\u7528\u540d\u5f62\u5982\uff1a@xx-scope/xx-name\uff08\u5e26scope\uff09, xx-name\uff08\u4e0d\u5e26scope\uff09',
              ),
            ),
            placeholder: 'input app name',
            rules: [{ required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528\u540d\u79f0' }, ...oc],
          },
        },
        mc = {
          type: 'input',
          options: {
            name: 'cnname',
            label: bt.a.createElement('span', null, '\u5e94\u7528\u4e2d\u6587\u540d'),
            placeholder: 'input app cnname',
          },
        },
        dc = {
          type: 'input',
          options: {
            name: 'desc',
            label: bt.a.createElement('span', null, '\u5e94\u7528\u63cf\u8ff0'),
            placeholder: 'input app desc',
            rules: [{ required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528\u63cf\u8ff0' }],
          },
        },
        gc = {
          type: 'customize',
          options: {
            name: 'owners',
            label: bt.a.createElement(
              'span',
              null,
              '\u8d1f\u8d23\u4eba',
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u9664\u521b\u5efa\u4eba\u5916\uff0c\u53ef\u6dfb\u52a0\u8d1f\u8d23\u4eba\u8ba9\u5176\u4ed6\u4eba\u6709\u6743\u9650\u4fee\u6539\u6b64\u5e94\u7528',
              ),
            ),
            render: (e) => bt.a.createElement(Ul, e),
          },
        },
        hc = {
          type: 'customize',
          options: {
            name: 'class_key',
            label: bt.a.createElement(
              'span',
              null,
              '\u5206\u7c7b',
              bt.a.createElement(Wn, null),
              bt.a.createElement(Ir.a, { color: 'blue' }, '\u65b9\u4fbf\u7528\u6237\u805a\u5408\u67e5\u770b\u67d0\u4e00\u7c7b\u5e94\u7528'),
            ),
            render: (e) => bt.a.createElement(co, e),
          },
        },
        fc = {
          type: 'radioGroup',
          options: {
            name: 'enable_gray',
            initValue: cc.enable_gray,
            options: [
              { value: 1, label: '\u662f' },
              { value: 0, label: '\u5426' },
            ],
            label: bt.a.createElement(
              'span',
              null,
              '\u662f\u5426\u7070\u5ea6\u4e0a\u7ebf ',
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u5f00\u542f\u6b64\u529f\u80fd\u540e\u6bcf\u6b21\u6784\u5efa\u7684\u7248\u672c\u4e0d\u4f1a\u7acb\u5373\u4e0a\u7ebf\uff0c\u4ec5\u4e0b\u53d1\u7ed9\u7070\u5ea6\u7528\u6237\u4eec\uff0c\u76f4\u5230\u70b9\u51fb\u7070\u5ea6\u901a\u8fc7\u624d\u53ef\u5168\u91cf\u8bbf\u95ee',
              ),
            ),
          },
        },
        bc = {
          type: 'radioGroup',
          options: {
            name: 'enable_pipeline',
            initValue: cc.enable_pipeline,
            options: [
              { value: 1, label: '\u662f' },
              { value: 0, label: '\u5426' },
            ],
            label: bt.a.createElement(
              'span',
              null,
              '\u662f\u5426\u5141\u8bb8\u63d2\u4ef6\u6267\u884c ',
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u5f00\u542f\u540e\u6d41\u6c34\u7ebf\u91cc\u7684\u5143\u6570\u636e\u63d0\u53d6\u6b65\u9aa4\u80fd\u6b63\u5e38\u6267\u884c\uff0c\u5173\u95ed\u5219\u62d2\u7edd\u6267\u884c\uff0c\u5f53\u9700\u8981\u5728\u7279\u6b8a\u65f6\u671f\u7981\u6b62\u4e00\u5207\u4e0a\u7ebf\u884c\u4e3a\u65f6\u53ef\u8bbe\u7f6e\u4e3a\u5173\u95ed',
              ),
            ),
          },
        },
        Ec = {
          type: 'customize',
          options: {
            name: 'gray_users',
            label: bt.a.createElement(
              'span',
              null,
              '\u7070\u5ea6\u7528\u6237',
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u5f00\u542f\u7070\u5ea6\u4e0a\u7ebf\u529f\u80fd\u540e\uff0c\u6b64\u8bbe\u7f6e\u624d\u6709\u6548',
              ),
            ),
            render: (e) => bt.a.createElement(Ul, e),
          },
        },
        yc = {
          type: 'radioGroup',
          options: {
            name: 'is_local_render',
            initValue: cc.is_local_render,
            options: [
              { value: 1, label: '\u662f' },
              { value: 0, label: '\u5426' },
            ],
            label: bt.a.createElement(
              'span',
              null,
              '\u662f\u5426\u5728\u5e73\u53f0\u5e95\u5ea7\u4e0b\u6e32\u67d3',
              bt.a.createElement(Lr.a, { title: ac, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
            ),
          },
        },
        wc = {
          type: 'input',
          options: {
            name: 'render_app_host',
            label: bt.a.createElement(
              'span',
              null,
              '\u5e94\u7528\u6e32\u67d3\u8def\u5f84 ',
              bt.a.createElement(Lr.a, { title: nc, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
              bt.a.createElement(Wn, null),
              bt.a.createElement(Ir.a, { color: 'blue' }, nc),
            ),
          },
        },
        vc = {
          type: 'input',
          options: {
            name: 'git_repo_url',
            label: bt.a.createElement(
              'span',
              null,
              'git\u4ed3\u5e93\u5730\u5740 ',
              bt.a.createElement(Wn, null),
              bt.a.createElement(
                Ir.a,
                { color: 'blue' },
                '\u5efa\u8bae\u586b\u5199\uff0c\u65b9\u4fbf\u4ecehelpack\u53ef\u4ee5\u8df3\u8f6c\u5230\u4f60\u7684\u4ee3\u7801\u4ed3\u5e93',
              ),
            ),
            placeholder: 'input git repo url',
          },
        },
        kc = {
          type: 'radioGroup',
          options: {
            name: 'is_test',
            disabled: !0,
            label: bt.a.createElement(
              'span',
              null,
              '\u662f\u5426\u4e3a\u6b63\u5f0f ',
              bt.a.createElement(
                Lr.a,
                {
                  style: { zIndex: 9999999992 },
                  title: '\u4e00\u4e2aapp\u7ec4\u540d\u5141\u8bb8\u5b58\u5728\u4e00\u4e2a\u6b63\u5f0fapp\u548c\u591a\u4e2a\u6d4b\u8bd5app',
                  color: 'blue',
                  getTooltipContainer: Kr,
                },
                bt.a.createElement(fo.a, null),
              ),
            ),
            initValue: cc.is_test,
            options: [
              { value: 0, label: '\u662f' },
              { value: 1, label: '\u5426' },
            ],
            rules: [{ required: !0 }],
          },
        },
        Cc = [sc, pc, uc, dc, hc, vc],
        _c = [sc, pc, uc, mc, dc, hc, vc, gc, fc, bc, Ec, yc, wc];
      const Sc = { borderRadius: '3px', backgroundColor: 'white', padding: '0 3px', margin: '0 3px' },
        xc = [
          { label: '\u7b80\u5355', value: 'simple' },
          { label: '\u8be6\u7ec6', value: 'detail' },
        ],
        Ac = () =>
          bt.a.createElement('div', {
            style: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--lra-theme-color)' },
          });
      function Lc(e) {
        const t = (function () {
          const e = Object(f.a)({}, cc);
          return (e.token = ic()), e;
        })();
        let a = t;
        return v(e) || ((a = {}), Object.keys(t).forEach((t) => (a[t] = e[t]))), (a.token = ic()), a;
      }
      const Ic = (e) => {
        const t = Ct(h.cst.MODULE_DEFAULT, {}, e),
          { initState: a, emit: n } = t,
          { subApp: r, mode: l, hasAct: o = !1 } = t.props,
          c = Lc(r),
          i = l || 'prod';
        'prod' === i ? ((c.app_group_name = c.name), (c.is_test = 0)) : (c.is_test = 1);
        const s = a({
            defaultValues: c,
            toCommitValues: {},
            actKey: '',
            hasAct: o,
            formUiType: 'simple',
            formCreateMode: i,
            confirmCreateModalVisible: !1,
          }),
          { state: p } = s,
          u = () => {
            setTimeout(() => {
              n('cancelFormBtnLoading');
            }, 300);
          };
        let m = !1;
        const d = {
          insState: p,
          onValuesChange: (e, t) => {
            const a = t.getFieldsValue(),
              { defaultValues: n } = p;
            k(e, 'name') && 'prod' === p.formCreateMode
              ? (t.setFieldsValue({ app_group_name: e.name }), Object.assign(n, a, { app_group_name: e.name }))
              : Object.assign(n, a),
              k(e, 'name') && m && ((m = !1), t.setFieldsValue({ token: ic() })),
              s.setState({ defaultValues: n });
          },
          onFormFinish: async (e) => {
            const t = (e) => {
                de.b.warn(e), u();
              },
              a = y(p.defaultValues, e);
            if ((S(a, 'owners'), S(a, 'gray_users'), a.enable_gray && 0 === a.gray_users.length))
              return t(
                '\u5f53\u524d\u5e94\u7528\u5f00\u542f\u4e86\u7070\u5ea6\u529f\u80fd\uff0c\u8bf7\u8bbe\u7f6e\u7070\u5ea6\u7528\u6237\u540d\u5355',
              );
            if (a.owners.length > 50) return t('\u8d1f\u8d23\u4eba\u4e0d\u80fd\u5927\u4e8e 50');
            if (a.gray_users.length > 50) return t('\u7070\u5ea6\u540d\u5355\u4e0d\u80fd\u5927\u4e8e 50');
            const { is_local_render: n, render_app_host: r, name: l } = a;
            if (!1 === n) {
              if (!r)
                return t(
                  '\u5e94\u7528\u9009\u62e9\u4e86\u4e0d\u5728\u5f53\u524d\u5e73\u53f0\u6e32\u67d3\uff0c\u8bf7\u586b\u5199\u3010\u5e94\u7528\u7684\u6e32\u67d3\u57df\u540d\u3011',
                );
              if (!ma.url.test(r)) return t('\u586b\u5199\u7684\u5e94\u7528\u6e32\u67d3\u57df\u540d\u4e0d\u5408\u6cd5');
            }
            const o = l.split(''),
              c = l.indexOf('@'),
              i = l.indexOf('/'),
              m = o.length - 1,
              d = o.filter((e) => '/' === e).length,
              g = o.filter((e) => '@' === e).length;
            if (
              d > 1
              || g > 1
              || (1 === g && !l.startsWith('@'))
              || (1 === g && l.startsWith('@') && 0 === d)
              || (1 === g && l.startsWith('@') && 1 === d && i === c + 1)
              || (1 === g && l.startsWith('@') && 1 === d && i === m)
            )
              return t(
                '\u5e94\u7528\u540d\u4e0d\u5408\u6cd5\uff0c\u8bf7\u91cd\u65b0\u586b\u5199\uff0c'.concat(
                  '\u5408\u6cd5\u7684\u5e94\u7528\u540d\u5f62\u5982\uff1a@xx-scope/xx-name\uff08\u5e26scope\uff09, xx-name\uff08\u4e0d\u5e26scope\uff09',
                ),
              );
            s.setState({ toCommitValues: a, confirmCreateModalVisible: !0 });
          },
          getUiTitle: () =>
            bt.a.createElement(
              'div',
              null,
              '\u65b0\u5efa\xa0\xa0',
              'prod' === p.formCreateMode
                ? bt.a.createElement(Ir.a, { color: '#f50' }, '\u6b63\u5f0f')
                : bt.a.createElement(Ir.a, { color: 'gray' }, '\u6d4b\u8bd5'),
              '\u5e94\u7528',
              bt.a.createElement(Yn, { width: '8px' }),
              bt.a.createElement(
                Lr.a,
                {
                  title: bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    '\u6b22\u8fce\u5230hel\u521b\u5efa\u4f60\u7684\u4e13\u5c5e\u5e94\u7528\uff0c\u70b9\u51fb\u8bbf\u95ee\u793a\u4f8b\uff1a',
                    bt.a.createElement(
                      'a',
                      {
                        href: 'https://unpkg.com/hel-tpl-remote-vue-comps@1.5.3/hel_dist/index.html',
                        target: 'blink',
                        rel: 'noopener',
                        style: Sc,
                      },
                      'vue2x-demo',
                    ),
                    '\uff0c \u5982\u521b\u5efa\u5e94\u7528\u9047\u5230\u95ee\u9898\uff0c\u53ef\u8054\u7cfb\xa0',
                    bt.a.createElement(Ir.a, { color: '#f50' }, H),
                  ),
                },
                bt.a.createElement(fo.a, null),
              ),
              bt.a.createElement(Yn, null),
              bt.a.createElement(Bn.a.Group, { options: xc, value: p.formUiType, onChange: s.syncer.formUiType }),
              p.hasAct
                && bt.a.createElement(
                  Ba.a,
                  {
                    'data-key': 'join_hel_lib',
                    onClick: d.selAct,
                    style: { float: 'right' },
                    type: 'join_hel_lib' === p.actKey ? 'primary' : 'default',
                  },
                  'Hel\u51fd\u6570\u6a21\u5757\u6d3b\u52a8',
                ),
            ),
          getFieldConf: () => ('simple' === p.formUiType ? Cc : _c),
          selAct(e) {
            t.setState({ actKey: e.currentTarget.dataset.key });
            const a = Object(f.a)({}, p.defaultValues);
            (a.name = 'hlib-yourRtx'),
              (a.app_group_name = 'hlib-yourRtx'),
              (a.cnname = 'hel\u51fd\u6570\u6a21\u5757'),
              (a.git_repo_url = 'https://github.com/hel-eco/hel-activity/my-first-hel-lib'),
              (a.enable_gray = 0),
              (a.ui_framework = 'lib'),
              (a.desc =
                '\u8fd9\u662f\u6211\u7684\u7b2c\u4e00\u4e2ahel\u51fd\u6570\u6a21\u5757\uff0c\u4ed6\u5c06\u88ab\u591a\u4e2a\u9879\u76ee\u8fdc\u7a0b\u52a8\u6001\u52a0\u8f7d'),
              de.b.info('\u6b22\u8fce\u2501(*\uff40\u2200\xb4*)\u30ce \u53c2\u52a0\u521b\u5efahel\u51fd\u6570\u6a21\u5757\u6d3b\u52a8'),
              t.emit('fillFormValues', a);
          },
          async createApp() {
            let e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
            const { toCommitValues: t, formCreateMode: a } = s.state,
              n = E(t);
            n.ui_framework || (n.ui_framework = 'lib'), n.class_key || (n.class_key = ''), (n.cnname = n.cnname || n.name);
            try {
              s.setState({ confirmCreateModalVisible: !1 }), await pt(n);
              const t = 'prod' === a ? '\u6b63\u5f0f' : '\u6d4b\u8bd5';
              if ((de.b.success(''.concat(t, '\u5e94\u7528[').concat(n.name, ']\u521b\u5efa\u6210\u529f\uff01')), !e)) {
                const e = E(n);
                (e.name = ''.concat(e.name, '-test')),
                  (e.is_test = 1),
                  (e.token = ic()),
                  await pt(e),
                  (m = !0),
                  de.b.success('\u6d4b\u8bd5\u5e94\u7528['.concat(e.name, ']\u521b\u5efa\u6210\u529f\uff01'));
              }
            } catch (r) {
              de.b.error(r.message);
            } finally {
              u();
            }
          },
          closeConfirmModal() {
            s.setState({ confirmCreateModalVisible: !1 }), u();
          },
          getModalTitle: () =>
            'prod' === p.formCreateMode
              ? '\u8bf7\u9009\u62e9\u521b\u5efa\u5e94\u7528\u6a21\u5f0f'
              : '\u521b\u5efa\u5e94\u7528\u4e8c\u6b21\u786e\u8ba4\u63d0\u793a',
          getModalFooter: () =>
            'prod' === p.formCreateMode
              ? [
                  bt.a.createElement(Ba.a, { key: '1', onClick: d.closeConfirmModal }, '\u53d6\u6d88'),
                  bt.a.createElement(
                    Ba.a,
                    { key: '2', type: 'primary', onClick: () => d.createApp(!1) },
                    '\u521b\u5efa\u6b63\u5f0f\u4e0e\u6d4b\u8bd5',
                  ),
                  bt.a.createElement(Ba.a, { key: '3', type: 'primary', onClick: () => d.createApp(!0) }, '\u4ec5\u521b\u5efa\u6b63\u5f0f'),
                ]
              : [
                  bt.a.createElement(Ba.a, { key: '1', onClick: d.closeConfirmModal }, '\u53d6\u6d88'),
                  bt.a.createElement(Ba.a, { key: '2', type: 'primary', onClick: () => d.createApp(!0) }, '\u521b\u5efa'),
                ],
          getModalContent: () =>
            'prod' === p.formCreateMode
              ? bt.a.createElement(
                  'div',
                  null,
                  bt.a.createElement(
                    'h4',
                    null,
                    bt.a.createElement(Ac, null),
                    bt.a.createElement(Jn, null),
                    '\u521b\u5efa\u6b63\u5f0f\u4e0e\u6d4b\u8bd5',
                  ),
                  bt.a.createElement(
                    'p',
                    null,
                    '\u4e3a\u5e94\u7528\u6240\u5c5e\u7ec4 ',
                    p.defaultValues.app_group_name,
                    ' \u540c\u65f6\u518d\u521b\u5efa\u4e00\u4e2a\u6d4b\u8bd5\u5e94\u7528 ',
                    bt.a.createElement(Ir.a, { color: 'green' }, p.defaultValues.name, '-test'),
                  ),
                  bt.a.createElement(
                    'h4',
                    null,
                    bt.a.createElement(Ac, null),
                    bt.a.createElement(Jn, null),
                    '\u4ec5\u521b\u5efa\u6b63\u5f0f',
                  ),
                  bt.a.createElement(
                    'p',
                    null,
                    '\u53ea\u521b\u5efa\u6b63\u5f0f\u5e94\u7528\uff0c\u540e\u7eed\u53ef\u4ee5\u5728\u5e94\u7528\u5546\u5e97\u67e5\u5230\u5f53\u524d\u5e94\u7528\u540e\u5e76\u70b9\u51fb\u3010\u540c\u7ec4\u590d\u5236\u3011\u8fbe\u5230\u518d\u6b21\u521b\u5efa\u6d4b\u8bd5\u5e94\u7528\u6548\u679c',
                  ),
                )
              : bt.a.createElement(
                  'div',
                  null,
                  '\u786e\u8ba4\u4e3a\u5e94\u7528\u7ec4 ',
                  p.defaultValues.app_group_name,
                  ' \u521b\u5efa\u65b0\u6d4b\u8bd5\u5e94\u7528 ',
                  p.defaultValues.name,
                  ' \u5417\uff1f',
                ),
        };
        return d;
      };
      var Oc = bt.a.memo((e) => {
          const { settings: t } = vt(h.cst.MODULE_DEFAULT, { setup: Ic, props: e }),
            { insState: a } = t;
          return bt.a.createElement(
            'div',
            { style: { textAlign: 'center' } },
            bt.a.createElement(zn.a, {
              style: { width: '1110px', margin: '0 auto 12px auto' },
              type: 'info',
              message: bt.a.createElement(
                bt.a.Fragment,
                null,
                '\u5982\u9700\u586b\u5199\u3010\u7070\u5ea6\u540d\u5355\u3011\u3001\u3010\u8d1f\u8d23\u4eba\u3011\u7b49\u4fe1\u606f\uff0c\u53ef\u9009\u62e9\u8be6\u7ec6\u9009\u9879\uff0c\u6216\u7b49\u5230\u521b\u5efa\u5b8c\u6bd5\u540e\u5230\u5e94\u7528\u8be6\u60c5\u91cc\u505a\u4e8c\u6b21\u4fee\u6539',
              ),
            }),
            bt.a.createElement(
              Ar.a,
              { title: t.getUiTitle(), style: { width: '1110px', margin: '0 auto', textAlign: 'left' } },
              bt.a.createElement(Xo, {
                key: a.formUiType,
                onValuesChange: t.onValuesChange,
                onFinish: t.onFormFinish,
                layout: 'vertical',
                fields: t.getFieldConf(),
                submitBtnLabel: '\u63d0\u4ea4',
                fillValues: a.defaultValues,
              }),
            ),
            bt.a.createElement(
              Oe.a,
              { title: t.getModalTitle(), onCancel: t.closeConfirmModal, visible: a.confirmCreateModalVisible, footer: t.getModalFooter() },
              t.getModalContent(),
            ),
          );
        }),
        Mc = bt.a.memo(() => bt.a.createElement(Oc, { mode: 'prod', hasAct: !0 }));
      const Tc = { color: 'red' };
      function Vc() {
        return bt.a.createElement(
          'h1',
          null,
          '404 not found, page ',
          bt.a.createElement('span', { style: Tc }, '/', ke().split('/')[1], ' '),
          'is watting to be added!',
        );
      }
      var jc = a(774);
      function Nc(e) {
        const t = e.initState({ loading: !1, syncType: 'corsProxy' }),
          a = {
            ins: t,
            inputRef: bt.a.createRef(),
            async submit() {
              const { syncType: e } = t.state,
                n = a.inputRef.current;
              if (!n || !e) return;
              t.setState({ loading: !0 });
              const r = n.resizableTextArea.textArea.value;
              return 'corsProxy' !== e || r.startsWith('{"code":0,"data":[{')
                ? 'wsdUsers' !== e || r.startsWith('var _arrusers = [[')
                  ? (await (async function (e, t) {
                      const a = Date.now(),
                        n = rt(''.concat(pe, '_').concat(a));
                      return await nt.post('/api/helper/syncStaff?timestamp='.concat(a, '&nonce=').concat(n), { staffStr: e, syncType: t });
                    })(r, e),
                    void t.setState({ loading: !1 }))
                  : (t.setState({ loading: !1 }),
                    de.b.warn(
                      '\u63d0\u4ea4\u6570\u636e\u4e0d\u5408\u6cd5\uff0c\u53ef\u8bbf\u95ee http://xxx-users.com \u53c2\u8003\u8fd4\u56de\u7684\u6570\u636e\u683c\u5f0f',
                    ))
                : (t.setState({ loading: !1 }),
                  de.b.warn(
                    '\u63d0\u4ea4\u6570\u636e\u4e0d\u5408\u6cd5\uff0c\u53ef\u8bbf\u95ee http://xxx-cors.com \u53c2\u8003\u8fd4\u56de\u7684\u6570\u636e\u683c\u5f0f',
                  ));
            },
          };
        return a;
      }
      var Dc = bt.a.memo(() => {
        const { settings: e } = Object(h.useConcent)({ setup: Nc }, 'SyncStaff'),
          { inputRef: t, ins: a } = e;
        return xt('portal').isAdmin
          ? bt.a.createElement(
              'div',
              { style: { textAlign: 'center' } },
              bt.a.createElement(Ml.a.TextArea, { rows: 25, ref: t, style: { backgroundColor: '#fcfafa' } }),
              bt.a.createElement(qn, null),
              bt.a.createElement(
                Bn.a.Group,
                { onChange: a.syncer.syncType, value: a.state.syncType },
                bt.a.createElement(
                  Lr.a,
                  { title: '\u6570\u636e\u6765\u81ea http://xxx-cors/api/v1/getStaff' },
                  bt.a.createElement(Bn.a, { value: 'corsProxy' }, 'corsProxy\u6570\u636e'),
                ),
                bt.a.createElement(
                  Lr.a,
                  { title: '\u6570\u636e\u6765\u81ea http://xxx-wsd-users/js/users.js' },
                  bt.a.createElement(Bn.a, { value: 'wsdUsers' }, 'wsdUsers\u6570\u636e'),
                ),
              ),
              bt.a.createElement(Wn, null),
              bt.a.createElement(Ba.a, { loading: a.state.loading, type: 'primary', onClick: e.submit }, '\u5f00\u59cb\u540c\u6b65'),
            )
          : bt.a.createElement(jc.a, { title: '403' });
      });
      var Bc = a(332),
        Pc = a.n(Bc);
      function zc(e) {
        const t = e.initState({ loading: !1, wrapLoading: !1, list: [] }),
          a = async () => {
            try {
              t.setState({ wrapLoading: !0 });
              const e = await (async function () {
                const e = St('portal').userInfo.user,
                  t = Date.now();
                let a = '/api/v1/allowed-app/getList?user='.concat(e, '&timestamp=').concat(t);
                return (a = lt(a, e, t)), await nt.get(a);
              })();
              t.setState({ wrapLoading: !1, list: e });
            } catch (e) {
              t.setState({ wrapLoading: !1 }), de.b.error(e.message);
            }
          };
        e.effect(() => {
          a();
        }, []);
        return {
          ins: t,
          async submit() {
            try {
              t.setState({ loading: !0 });
              const e = await (async function () {
                const e = St('portal').userInfo.user,
                  t = Date.now();
                let a = '/api/v1/allowed-app/refresh?user='.concat(e, '&timestamp=').concat(t);
                return (a = lt(a, e, t)), await nt.get(a);
              })();
              t.setState({ list: e, loading: !1 }),
                de.b.success(
                  '\u540c\u6b65\u6210\u529f\uff0c\u5f53\u524d\u5916\u7f51\u53ef\u8bbf\u95ee\u5e94\u7528\u5171\u8ba1 '.concat(
                    e.length,
                    ' \u4e2a',
                  ),
                );
            } catch (e) {
              t.setState({ loading: !1 }), de.b.error(e.message);
            }
          },
          copy() {
            de.b.success('\u590d\u5236\u5e94\u7528\u767d\u540d\u5355\u6210\u529f\uff01'), el()(t.state.list.join(','));
          },
          copyJson() {
            de.b.success('\u590d\u5236\u5e94\u7528\u767d\u540d\u5355Json\u6210\u529f\uff01'), el()(JSON.stringify(t.state.list));
          },
        };
      }
      var Rc = bt.a.memo(() => {
          const { settings: e } = Object(h.useConcent)({ setup: zc }, 'SyncStaff'),
            { ins: t } = e;
          return xt('portal').isAdmin
            ? bt.a.createElement(
                'div',
                { style: { textAlign: 'center', padding: '100px 0' } },
                bt.a.createElement(
                  jn.a,
                  { spinning: t.state.wrapLoading },
                  bt.a.createElement('h3', null, '\u5916\u7f51\u53ef\u8bbf\u95ee\u767d\u540d\u5355\uff1a'),
                  bt.a.createElement(
                    'div',
                    { style: { textAlign: 'left' } },
                    t.state.list.map((e) => bt.a.createElement(Ir.a, { key: e, style: { marginBottom: '3px' } }, e)),
                  ),
                ),
                bt.a.createElement(qn, null),
                bt.a.createElement(Ba.a, { loading: t.state.loading, type: 'primary', onClick: e.submit }, '\u5f00\u59cb\u540c\u6b65'),
                bt.a.createElement(Wn, null),
                bt.a.createElement(Ba.a, { onClick: e.copy }, '\u590d\u5236'),
                bt.a.createElement(Wn, null),
                bt.a.createElement(Ba.a, { onClick: e.copyJson }, '\u590d\u5236Json'),
                bt.a.createElement(
                  'div',
                  { style: { marginTop: '12px' } },
                  bt.a.createElement(
                    'span',
                    { className: Pc.a.tipLabelWrap },
                    '\u70b9\u51fb\u3010\u5f00\u59cb\u540c\u6b65\u3011\u6309\u94ae\uff0c\u5c06\u540c\u6b65\u6570\u636e\u91cc\u7684\u5e94\u7528\u5916\u7f51\u8bbf\u95ee\u767d\u540d\u5355\u5230\u5404\u4e2a\u540e\u53f0\u670d\u52a1\u5b9e\u4f8b\u8282\u70b9\u4e2d',
                  ),
                ),
              )
            : bt.a.createElement(jc.a, { title: '403' });
        }),
        Fc = bt.a.memo(() => bt.a.createElement(oo, null));
      function Hc() {
        return bt.a.createElement(
          Dn.g,
          null,
          bt.a.createElement(Dn.d, { exact: !0, path: I, component: Sl }),
          bt.a.createElement(Dn.d, { exact: !0, path: O, component: Al }),
          bt.a.createElement(Dn.d, { exact: !0, path: M, component: mo }),
          bt.a.createElement(Dn.d, { exact: !0, path: B, component: ho }),
          bt.a.createElement(Dn.d, { exact: !0, path: T, component: Mc }),
          bt.a.createElement(Dn.d, { exact: !0, path: L, component: Cl }),
          bt.a.createElement(Dn.d, { exact: !0, path: P, component: _r }),
          bt.a.createElement(Dn.d, { exact: !0, path: j, component: Dc }),
          bt.a.createElement(Dn.d, { exact: !0, path: N, component: Rc }),
          bt.a.createElement(Dn.d, { exact: !0, path: V, component: Fc }),
          bt.a.createElement(Dn.d, { component: Vc }),
        );
      }
      var Uc, Gc, Kc, Wc, qc, Jc, Yc, $c, Xc;
      const Zc = $a.c.div(
          Uc
            || (Uc = Object(Ya.a)([
              '\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0,0,0,0.3);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 999999999;\n',
            ])),
        ),
        Qc = $a.c.div(Gc || (Gc = Object(Ya.a)(['\n  width: 416px;\n  height: 170px;\n  background-color: white;\n']))),
        ei = $a.c.div(
          Kc
            || (Kc = Object(Ya.a)([
              '\n  height: 52px;\n  line-height: 52px;\n  text-align: center;\n  font-size: 22px;\n  font-weight: 400;\n  border-bottom: 1px solid #f0f0f0;\n',
            ])),
        ),
        ti = $a.c.div(
          Wc || (Wc = Object(Ya.a)(['\n  padding: 18px;\n  border: 1px solid #f0f0f0;\n  font-size: 14px;\n  color: grey;\n'])),
        ),
        ai = $a.c.div(qc || (qc = Object(Ya.a)(['\n  float: right;\n  padding: 18px;\n']))),
        ni = $a.c.button(
          Jc || (Jc = Object(Ya.a)(['\n  margin: 0 6px;\n  width: 80px;\n  ', ';\n  ', ';\n  ', ';\n'])),
          (e) => Object($a.b)(Yc || (Yc = Object(Ya.a)(['border:1px solid ', ''])), e.primary ? '#007acd' : 'lightgrey'),
          (e) => Object($a.b)($c || ($c = Object(Ya.a)(['background-color:', ''])), e.primary ? '#007acd' : 'white'),
          (e) => Object($a.b)(Xc || (Xc = Object(Ya.a)(['color:', ''])), e.primary ? 'white' : 'black'),
        );
      function ri(e) {
        e.initState({ show: !1, title: '', content: '' });
        const t = () => e.set('show', !1);
        let a = {};
        return (
          e.on('closeModal', () => {
            if (a.onCancel) return a.onCancel(t);
            t();
          }),
          e.on('closeModal', (t) => {
            let { title: n, content: r, onOk: l, onCancel: o } = t;
            (a = { onOk: l, onCancel: o }), e.setState({ show: !0, title: n, content: r });
          }),
          {
            closeModal: t,
            handleOk: () => {
              if (a.onOk) return a.onOk(t);
              t();
            },
          }
        );
      }
      function li() {
        const { state: e, settings: t } = Object(h.useConcent)({ setup: ri });
        return e.show
          ? bt.a.createElement(
              Zc,
              null,
              bt.a.createElement(
                Qc,
                null,
                bt.a.createElement(ei, null, e.title),
                bt.a.createElement(ti, null, e.content),
                bt.a.createElement(
                  ai,
                  null,
                  bt.a.createElement(ni, { className: 'gHover', onClick: t.closeModal }, '\u53d6\u6d88'),
                  bt.a.createElement(ni, { primary: !0, className: 'gHover', onClick: t.handleOk }, '\u786e\u8ba4'),
                ),
              ),
            )
          : '';
      }
      class oi extends bt.a.Component {
        constructor(e) {
          super(e);
          const t = document.getElementById('app-manager-modal');
          this.mountNode = t;
        }
        componentDidMount() {
          document.body.appendChild(this.mountNode);
        }
        componentWillUnmount() {
          document.body.removeChild(this.mountNode);
        }
        render() {
          return this.mountNode ? Tn.a.createPortal(bt.a.createElement(li, null), this.mountNode) : bt.a.createElement(li, null);
        }
      }
      var ci = a(776),
        ii = a(802),
        si = a(803),
        pi = a(796),
        ui = a(797);
      function mi(e) {
        const t = _t({}, e);
        return {
          tryGetToken: () => {
            t.emit('tryGetToken', async (e) => {
              de.b.info('\u5e94\u7528 ['.concat(e, '] token \u83b7\u53d6\u4e2d...'), 1);
              try {
                const a = await (async function (e) {
                  const t = await nt.get('/api/v1/app/info/getSubAppToken?name='.concat(e), '', { check: !1, returnLogicData: !1 });
                  if (0 !== parseInt(t.code, 10)) throw new Error(t.msg);
                  return t.data;
                })(e);
                t.emit('tokenGot', { appName: e, appToken: a });
              } catch (a) {
                de.b.error(a.message, 1);
              }
            });
          },
        };
      }
      var di = bt.a.memo(function (e) {
        const t = kt(mi);
        return bt.a.createElement(
          'div',
          null,
          e.children,
          bt.a.createElement(Ba.a, { size: 'small', type: 'primary', onClick: t.tryGetToken }, '\u67e5\u770btoken'),
        );
      });
      const gi = [
          {
            pattern: rc,
            message:
              '\u5fc5\u9700\u662f\u82f1\u6587\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\u3001\u4e2d\u5212\u7ebf\u7684\u7ec4\u5408\uff0c\u6ce8\u610f\u4e0d\u8981\u5305\u542b\u7a7a\u683c',
          },
          { max: 64, type: 'string', message: '\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e30' },
        ],
        hi = { zIndex: 9999999992 },
        fi = [
          {
            type: 'input',
            options: {
              name: 'token',
              label: bt.a.createElement(
                di,
                null,
                bt.a.createElement(
                  'span',
                  null,
                  '\u5e94\u7528token',
                  bt.a.createElement(
                    Lr.a,
                    { style: hi, title: ec, color: 'blue', getTooltipContainer: Kr },
                    bt.a.createElement(fo.a, null),
                  ),
                ),
                bt.a.createElement(Wn, null),
              ),
              disabled: !0,
              placeholder: 'input app token',
              rules: [{ required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528token' }],
            },
          },
          {
            type: 'input',
            options: {
              name: 'app_group_name',
              disabled: !0,
              label: bt.a.createElement(
                'span',
                null,
                '\u5e94\u7528\u6240\u5c5e\u7ec4\u540d\u79f0 ',
                bt.a.createElement(Lr.a, { style: hi, title: tc, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
                bt.a.createElement(Wn, null),
                bt.a.createElement(
                  Ir.a,
                  { color: 'blue' },
                  '\u4e00\u4e2a\u7ec4\u540d\u53ef\u5bf9\u5e94\u591a\u4e2a\u5e94\u7528\u540d\uff0c\u8868\u793a\u5e94\u7528\u5bf9\u5e94\u7684\u591a\u79cd\u73af\u5883(\u4f8b\u5982\u4e0d\u540c\u7684\u5206\u652f)',
                ),
              ),
              placeholder: 'input app group name',
              rules: [{ required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528\u7ec4\u540d\u79f0' }, ...gi],
            },
          },
          {
            type: 'input',
            options: {
              name: 'name',
              disabled: !0,
              label: bt.a.createElement(
                'span',
                null,
                '\u5e94\u7528\u540d\u79f0 ',
                bt.a.createElement(Lr.a, { style: hi, title: Qo, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
              ),
              placeholder: 'input app name',
              rules: [{ required: !0, message: '\u8bf7\u8f93\u5165\u5e94\u7528\u540d\u79f0' }, ...gi],
            },
          },
          kc,
          mc,
          dc,
          hc,
          gc,
          fc,
          Ec,
          bc,
          {
            type: 'radioGroup',
            options: {
              name: 'is_local_render',
              initValue: cc.is_local_render,
              options: [
                { value: 1, label: '\u662f' },
                { value: 0, label: '\u5426' },
              ],
              label: bt.a.createElement(
                'span',
                null,
                '\u662f\u5426\u5728\u5e73\u53f0\u5e95\u5ea7\u4e0b\u6e32\u67d3 ',
                bt.a.createElement(Lr.a, { style: hi, title: ac, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
              ),
            },
          },
          {
            type: 'input',
            options: {
              name: 'render_app_host',
              label: bt.a.createElement(
                'span',
                null,
                '\u5e94\u7528\u6e32\u67d3\u8def\u5f84 ',
                bt.a.createElement(Lr.a, { style: hi, title: nc, color: 'blue', getTooltipContainer: Kr }, bt.a.createElement(fo.a, null)),
                bt.a.createElement(Wn, null),
                bt.a.createElement(Ir.a, { color: 'blue' }, nc),
              ),
            },
          },
          {
            type: 'input',
            options: {
              name: 'git_repo_url',
              label: bt.a.createElement(
                'span',
                null,
                'git\u4ed3\u5e93\u5730\u5740 ',
                bt.a.createElement(Wn, null),
                bt.a.createElement(
                  Ir.a,
                  { color: 'blue' },
                  '\u5efa\u8bae\u586b\u5199\uff0c\u65b9\u4fbf\u4ecehelpack\u53ef\u4ee5\u8df3\u8f6c\u5230\u4f60\u7684\u4ee3\u7801\u4ed3\u5e93',
                ),
              ),
              placeholder: 'input git repo url',
            },
          },
        ],
        bi = fi.map((e) => ({ type: e.type, options: Object(f.a)(Object(f.a)({}, e.options), {}, { disabled: !0 }) }));
      var Ei = fi;
      function yi(e) {
        const t = _t({}, e),
          a = t.initState({
            mode: 'user',
            visible: !1,
            desc: '',
            loading: !1,
            title: '\u6dfb\u52a0\u6807\u8bb0\u63cf\u8ff0',
            alertDesc: '',
            appVerData: null,
            markData: null,
          });
        return (
          t.on('openMarkInfoModal', (e, t) => {
            const { userMarkedList: n } = St('portal'),
              { globalMarkedList: r } = St('VersionList');
            if ('user' === t) {
              const r = n.find((t) => t.ver === e.sub_app_version),
                l = r ? '\u4fee\u6539\u4e2a\u4eba\u6807\u8bb0\u63cf\u8ff0' : '\u6dfb\u52a0\u4e2a\u4eba\u6807\u8bb0\u63cf\u8ff0',
                o = r ? r.desc : '',
                c = '\u4f60\u6b63\u5728\u4e3a\u5e94\u7528\u7248\u672c '.concat(
                  e.sub_app_version,
                  ' \u6dfb\u52a0\u4e2a\u4eba\u6807\u8bb0\uff0c\u65b9\u4fbf\u4f60\u4ee5\u540e\u53ef\u5feb\u901f\u7b5b\u9009\u4e2a\u4eba\u5173\u5fc3\u7684\u7248\u672c\u6570\u636e',
                );
              return void a.setState({ visible: !0, appVerData: e, desc: o, markData: r, title: l, alertDesc: c, mode: t });
            }
            const l = r.find((t) => t.ver === e.sub_app_version),
              o = l ? '\u4fee\u6539\u5168\u5c40\u6807\u8bb0\u63cf\u8ff0' : '\u6dfb\u52a0\u5168\u5c40\u6807\u8bb0\u63cf\u8ff0',
              c = l ? l.desc : '',
              i = '\u4f60\u6b63\u5728\u4e3a\u5e94\u7528\u7248\u672c '.concat(
                e.sub_app_version,
                ' \u6dfb\u52a0\u5168\u5c40\u6807\u8bb0\uff0c\u65b9\u4fbf\u4ee5\u540e\u6240\u6709\u4eba\u90fd\u53ef\u5feb\u901f\u7b5b\u9009\u76f8\u5173\u7248\u672c\u6570\u636e',
              );
            a.setState({ visible: !0, appVerData: e, desc: c, markData: l, title: o, alertDesc: i, mode: t });
          }),
          {
            ins: a,
            close() {
              a.setState({ visible: !1, loading: !1 });
            },
            async submit() {
              const { appVerData: e, desc: t, mode: n, title: r } = a.state;
              if (!e) return;
              a.setState({ loading: !0 });
              const { sub_app_name: l } = e,
                o = e.version_tag || e.sub_app_version;
              try {
                'user' === n
                  ? (await (async function (e) {
                      return await nt.post('/api/v1/app/info/updateAppUserMarkInfo', e);
                    })({ name: l, ver: o, desc: t }),
                    await Lt.portal.initUserExtendData())
                  : (await (async function (e) {
                      const t = ot('/api/v1/app/info/updateAppGlobalMarkInfo', e.name);
                      return await nt.post(t, e);
                    })({ name: l, ver: o, desc: t }),
                    await Lt.VersionList.freshSubAppGlobalMarkInfo(l)),
                  de.b.success(''.concat(r, '\u6210\u529f')),
                  Lt.VersionList.refreshTableCurPage(),
                  a.setState({ loading: !1, visible: !1 });
              } catch (c) {
                de.b.error(c.message), a.setState({ loading: !1 });
              }
            },
          }
        );
      }
      var wi = bt.a.memo(function () {
        const e = kt(yi),
          {
            ins: { state: t, syncer: a },
          } = e;
        return bt.a.createElement(
          Oe.a,
          {
            visible: t.visible,
            onCancel: e.close,
            width: '800px',
            title: t.title,
            onOk: e.submit,
            confirmLoading: t.loading,
            okText: '\u786e\u8ba4',
            cancelText: '\u53d6\u6d88',
          },
          bt.a.createElement(Ml.a, {
            value: t.desc,
            onChange: a.desc,
            placeholder: '\uff08\u53ef\u9009\uff09\u8bf7\u8f93\u5165\u63cf\u8ff0',
          }),
          bt.a.createElement(qn, null),
          bt.a.createElement(zn.a, { message: t.alertDesc, type: 'info', showIcon: !0 }),
        );
      });
      function vi(e) {
        const t = _t({}, e),
          a = t.initState({ dataStr: '', visible: !1, mode: 'av', ver: '', name: '', loading: !1 });
        t.on('openMetaDataDrawer', async (e) => {
          const { sub_app_version: t, version_tag: n, sub_app_name: r } = e,
            l = n || t;
          a.setState({ visible: !0, loading: !0, name: r, ver: l });
          const o = await (async function (e, t) {
            return await nt.get('/openapi/v1/app/info/getSubAppAndItsFullVersion?name='.concat(e, '&version=').concat(t));
          })(r, l);
          a.setState({ dataStr: JSON.stringify(o, null, 2), loading: !1 });
        });
        const n = {
          ins: a,
          close() {
            a.setState({ visible: !1, dataStr: '', loading: !1 });
          },
          getInterfaceUrl(e) {
            const { name: t, ver: n } = a.state;
            return Pt(t, { isOut: e, version: n });
          },
          getInterfaceUrlNoHC(e) {
            const { name: t, ver: n } = a.state;
            return zt(t, { isOut: e, version: n });
          },
          copyUrl() {
            de.b.success('\u590d\u5236\u63a5\u53e3\u6210\u529f'), el()(n.getInterfaceUrl());
          },
          copyUrlNoHC() {
            de.b.success('\u590d\u5236\u63a5\u53e3\uff08\u65e0html_content\uff09\u6210\u529f'), el()(n.getInterfaceUrlNoHC());
          },
          copyOutUrl() {
            de.b.success('\u590d\u5236\u5916\u7f51\u63a5\u53e3\u6210\u529f'), el()(n.getInterfaceUrl(!0));
          },
          copyOutUrlNoHC() {
            de.b.success('\u590d\u5236\u5916\u7f51\u63a5\u53e3\uff08\u65e0html_content\uff09\u6210\u529f'), el()(n.getInterfaceUrlNoHC(!0));
          },
        };
        return n;
      }
      var ki = bt.a.memo(function () {
        const e = kt(vi),
          {
            ins: { state: t, syncer: a },
          } = e;
        return bt.a.createElement(
          ci.a,
          {
            title: '\u67e5\u770b\uff08\u5e94\u7528\u3001\u7248\u672c\uff09\u5143\u6570\u636e',
            bodyStyle: { paddingTop: '8px' },
            visible: t.visible,
            width: '1160px',
            onClose: e.close,
          },
          bt.a.createElement('a', { href: e.getInterfaceUrl(), target: '_blink' }, '\u63a5\u53e3'),
          bt.a.createElement(Tr.a, { onClick: e.copyUrl }),
          bt.a.createElement(Jn, { width: '19px' }),
          bt.a.createElement('a', { href: e.getInterfaceUrlNoHC(), target: '_blink' }, '\u63a5\u53e3(\u65e0html_content)'),
          bt.a.createElement(Tr.a, { onClick: e.copyUrlNoHC }),
          bt.a.createElement(Jn, { width: '19px' }),
          bt.a.createElement('a', { href: e.getInterfaceUrlNoHC(!0), target: '_blink' }, '\u5916\u7f51\u63a5\u53e3'),
          bt.a.createElement(Tr.a, { onClick: e.copyOutUrl }),
          bt.a.createElement(Jn, { width: '19px' }),
          bt.a.createElement('a', { href: e.getInterfaceUrlNoHC(!0), target: '_blink' }, '\u5916\u7f51\u63a5\u53e3(\u65e0html_content)'),
          bt.a.createElement(Tr.a, { onClick: e.copyOutUrlNoHC }),
          bt.a.createElement(qn, { height: '8px' }),
          bt.a.createElement(zn.a, {
            message: '\u5916\u7f51\u63a5\u53e3\u4e0d\u80fd\u76f4\u63a5\u8bbf\u95ee\uff0c\u76ee\u524d\u53ef\u8054\u7cfb '.concat(
              H,
              ' \u52a0\u5165\u767d\u540d\u5355\u540e\u5373\u53ef\u6b63\u5e38\u4f7f\u7528\uff08\u6ce8\uff1a\u5916\u7f51\u63a5\u53e3\u8fd4\u56de\u6570\u636e\u505a\u4e86\u4e00\u5b9a\u7684\u8131\u654f\u5904\u7406\uff0c\u5982git\u4fe1\u606f\u7b49\u4e0d\u518d\u8fd4\u56de\uff09',
            ),
            type: 'info',
            showIcon: !0,
          }),
          bt.a.createElement(qn, { height: '8px' }),
          bt.a.createElement(
            jn.a,
            { spinning: t.loading },
            bt.a.createElement(Rn.a, {
              width: '100%',
              height: 'calc(100vh - 130px)',
              language: 'json',
              theme: 'vs-dark',
              value: t.dataStr,
              options: { selectOnLineNumbers: !0 },
              onChange: a.dataStr,
            }),
          ),
        );
      });
      function Ci(e) {
        const t = _t({}, e),
          a = t.initState({ visible: !1, verID: '', verAppName: '', alertDesc: '', loading: !1 });
        return (
          t.on('openResetVerModal', (e) => {
            const { sub_app_version: t, sub_app_name: n } = e,
              r = '\u4f60\u6b63\u5728\u5c1d\u8bd5\u5237\u65b0\u5e94\u7528\u7248\u672c '.concat(
                t,
                ' \u7684\u7f13\u5b58\u6570\u636e\uff0c\u6b64\u529f\u80fd\u4ec5\u5f53\u6570\u636e\u5e93\u7684\u5e94\u7528\u7248\u672c\u6709\u53d8\u66f4\u65f6\uff0c\u70b9\u51fb\u6b64\u6309\u94ae\u624d\u6709\u610f\u4e49',
              );
            a.setState({ visible: !0, verID: t, verAppName: n, alertDesc: r });
          }),
          {
            ins: a,
            close() {
              a.setState({ visible: !1, loading: !1, verID: '', verAppName: '' });
            },
            async submit() {
              const { verID: e, verAppName: t } = a.state;
              if (e && t) {
                a.setState({ loading: !0 });
                try {
                  await Lt.VersionList.resetVerCache({ verAppName: t, verID: e }),
                    de.b.success('\u5237\u65b0'.concat(t, ' ').concat(e, '\u7f13\u5b58\u6210\u529f')),
                    Lt.VersionList.refreshTableCurPage(),
                    a.setState({ loading: !1, visible: !1 });
                } catch (n) {
                  de.b.error(n.message), a.setState({ loading: !1 });
                }
              }
            },
          }
        );
      }
      var _i,
        Si,
        xi,
        Ai,
        Li = bt.a.memo(function () {
          const e = kt(Ci),
            {
              ins: { state: t },
            } = e;
          return bt.a.createElement(
            Oe.a,
            {
              visible: t.visible,
              onCancel: e.close,
              width: '800px',
              title: '\u5237\u65b0\u7f13\u5b58',
              onOk: e.submit,
              confirmLoading: t.loading,
              okText: '\u786e\u8ba4',
              cancelText: '\u53d6\u6d88',
            },
            bt.a.createElement(zn.a, { message: t.alertDesc, type: 'info', showIcon: !0 }),
          );
        }),
        Ii = a(795),
        Oi = a(300),
        Mi = a(302),
        Ti = a(799),
        Vi = a(782),
        ji = a(798);
      const Ni = (e) => {
          Xi(e),
            e.preventDefault(),
            de.b.warn(
              '\u5f53\u524d\u6784\u5efa\u6570\u636e\u7248\u672c\u8fc7\u65e7\uff0c\u6ca1\u8bb0\u5f55\u6d41\u6c34\u7ebf\u5176\u4ed6\u6570\u636e(git\u3001pipeline\u7b49)\uff0c\u8bf7\u8bbf\u95ee\u6700\u65b0\u6784\u5efa\u7684\u7248\u672c\u6216\u8005\u91cd\u65b0\u6784\u5efa\u4e00\u4e2a\u65b0\u7248\u672c',
              2,
            );
        },
        Di = { display: 'inline-block', backgroundColor: '#f2f6fd', padding: '0px 12px', marginRight: '3px' },
        Bi = '#fff2e8',
        Pi = '#f0f0f0',
        zi = '#f0f5ff',
        Ri = '#f9f0ff',
        Fi = '#f50',
        Hi = 'gray',
        Ui = '#2f54eb',
        Gi = '#722ed1',
        Ki = Object($a.c)(Ar.a)(_i || (_i = Object(Ya.a)(['\n  .ant-card-actions{\n    background-color: ', ';\n  }\n'])), Bi),
        Wi = Object($a.c)(Ar.a)(Si || (Si = Object(Ya.a)(['\n  .ant-card-actions{\n    background-color: ', ';\n  }\n'])), Pi),
        qi = Object($a.c)(Ar.a)(xi || (xi = Object(Ya.a)(['\n  .ant-card-actions{\n    background-color: ', ';\n  }\n'])), zi),
        Ji = Object($a.c)(Ar.a)(Ai || (Ai = Object(Ya.a)(['\n  .ant-card-actions{\n    background-color: ', ';\n  }\n'])), Ri),
        Yi = { marginBottom: '5px' },
        $i = {
          buildSwitchTip(e) {
            const t = 'tag' === e ? Ui : Fi,
              a = 'tag' === e ? '\u5df2\u6807\u8bb0' : '\u5168\u90e8',
              n = 'tag' === e ? '\u5168\u90e8' : '\u5df2\u6807\u8bb0',
              r =
                'hasTitle' === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'hasTitle')
                  ? '\uff0c\u6216\u70b9\u51fb\u9876\u90e8\u3010\u5168\u90e8\u3011/\u3010\u5df2\u6807\u8bb0\u3011\u5355\u9009\u6309\u94ae\u7ec4\u6765\u5207\u6362\u5217\u8868\u6a21\u5f0f'
                  : '';
            return bt.a.createElement(zn.a, {
              type: 'info',
              showIcon: !0,
              description: bt.a.createElement(
                bt.a.Fragment,
                null,
                '\u5f53\u524d\u6784\u5efa\u7248\u672c\u5217\u8868\u662f',
                n,
                '\u6a21\u5f0f\uff0c\u4f60\u53ef\u4ee5\u70b9\u51fb',
                bt.a.createElement(Ir.a, { color: t, className: 'gHover', onClick: () => Lt.VersionList.changeListMode(e) }, a),
                '\u5207\u6362\u5217\u8868\u4e3a',
                a,
                '\u6a21\u5f0f',
                r,
                bt.a.createElement(qn, { height: '16px' }),
                bt.a.createElement(
                  'span',
                  { style: { color: 'grey', fontWeight: 300 } },
                  bt.a.createElement(
                    'p',
                    null,
                    '\u5168\u90e8\u5217\u8868\uff1a\u5c55\u793a\u6d41\u6c34\u7ebf\u6784\u5efa\u7684\u6240\u6709\u7248\u672c\u6570\u636e',
                  ),
                  bt.a.createElement(
                    'p',
                    null,
                    '\u5df2\u6807\u8bb0\u5217\u8868\uff1a\u4ec5\u5c55\u793a\u5e26\u6709\u7ebf\u4e0a\u3001\u7070\u5ea6\u3001\u4e2a\u4eba\u3001\u5168\u5c40 4\u79cd\u6807\u8bb0\u7684\u7248\u672c\u6570\u636e',
                  ),
                ),
              ),
            });
          },
        };
      function Xi(e) {
        return e && e.stopPropagation && e.stopPropagation(), !0;
      }
      function Zi(e, t) {
        const { stTitle: a, stCol: n } = t,
          { subApp: r, globalMarkedList: l } = St('VersionList'),
          { userMarkedList: o } = St('portal'),
          c = e.version_tag || e.sub_app_version;
        let i = Ar.a;
        const s = { border: '1px solid lightgrey', backgroundColor: '' },
          p = r.is_in_gray && r.build_version === c,
          u = r.online_version === c,
          m = l.find((e) => e.ver === c),
          d = o.find((e) => e.ver === c);
        u
          ? ((s.border = '1px solid '.concat(Fi)), (s.backgroundColor = Bi), (i = Ki))
          : p
          ? ((s.border = '1px solid '.concat(Hi)), (s.backgroundColor = Pi), (i = Wi))
          : m
          ? ((s.border = '1px solid '.concat(Ui)), (s.backgroundColor = zi), (i = qi))
          : d && ((s.border = '1px solid '.concat(Gi)), (s.backgroundColor = Ri), (i = Ji));
        let g = '',
          h = '',
          b = '',
          E = '',
          y = '',
          w = '';
        p && (h = bt.a.createElement(Ir.a, { color: Hi }, '\u7070\u5ea6')),
          u && (g = bt.a.createElement(Ir.a, { color: Fi }, '\u7ebf\u4e0a'));
        const v = { color: '#838383de' };
        if (m) {
          b = bt.a.createElement(Ir.a, { color: Ui }, '\u5168\u5c40');
          const { desc: e, userName: t, time: r } = m;
          if (e) {
            const l = Object(f.a)(
              Object(f.a)({}, n),
              {},
              { backgroundColor: 'rgb(47, 84, 235, 10%)', border: '1px dashed rgb(47, 84, 235, 60%)', paddingLeft: '3px' },
            );
            y = bt.a.createElement(
              Pn.a,
              { span: '24', style: l },
              bt.a.createElement('span', { style: a }, '\u5168\u5c40\u6807\u8bb0\u63cf\u8ff0\uff1a'),
              e,
              bt.a.createElement('span', { style: v }, ' (', t, ' ', Pr(new Date(r).toLocaleString()), ')'),
            );
          }
        }
        if (d) {
          E = bt.a.createElement(Ir.a, { color: Gi }, '\u4e2a\u4eba');
          const { desc: e, time: t } = d,
            r = Object(f.a)(
              Object(f.a)({}, n),
              {},
              {
                backgroundColor: 'rgb(114, 46, 209, 10%)',
                border: '1px dashed rgb(114, 46, 209, 60%)',
                paddingLeft: '3px',
                marginTop: m ? '6px' : '0px',
              },
            );
          e
            && (w = bt.a.createElement(
              Pn.a,
              { span: '24', style: r },
              bt.a.createElement('span', { style: a }, '\u4e2a\u4eba\u6807\u8bb0\u63cf\u8ff0\uff1a'),
              bt.a.createElement('span', { style: { wordBreak: 'break-all' } }, e),
              bt.a.createElement('span', { style: v }, ' (', Pr(new Date(t).toLocaleString()), ')'),
            ));
        }
        return {
          uiConner: bt.a.createElement('div', { style: { position: 'absolute', right: '-12px', top: '-10px' } }, g, h, b, E),
          uiGlobalMarkDesc: y,
          uiUserMarkDesc: w,
          stCard: s,
          CardComp: i,
        };
      }
      function Qi(e, t) {
        let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'hasTitle';
        const n = St('VersionList'),
          {
            userInfo: { user: r },
            userMarkedList: l,
          } = St('portal'),
          { globalMarkedList: o, subApp: c } = n,
          i = c.owners || [],
          s = i.concat(c.create_by),
          p = Ae(e),
          u = e.git_repo_url || '',
          m = { color: 'red' },
          { sub_app_version: d, sub_app_name: g } = e,
          f = e.version_tag || e.sub_app_version,
          b = s.includes(r);
        let E = !1,
          y = '';
        b
          ? o.length >= 100
            && ((E = !0),
            (y = bt.a.createElement(
              'span',
              { style: m },
              '\uff08\u6ce8\uff1a\u5f53\u524d\u5e94\u7528\u5df2\u8d85\u8fc7100\u4e2a\u5168\u5c40\u6807\u8bb0\u7248\u672c\uff0c\u8bf7\u5c1d\u8bd5\u5220\u9664\u4e00\u4e9b\u5176\u4ed6\u7684\u5df2\u6807\u8bb0\u6570\u636e\uff09',
            )))
          : ((E = !0),
            (y = bt.a.createElement(
              'span',
              { style: m },
              '\uff08\u6ce8\uff1a\u4f60\u4e0d\u662f\u5f53\u524d\u5e94\u7528\u8d1f\u8d23\u4eba\uff09',
            )));
        let w = '',
          v = !1;
        b
          ? (w = bt.a.createElement(
              'span',
              { style: m },
              '\uff08\u6ce8\uff1a\u6b64\u529f\u80fd\u4ec5\u5f53\u6570\u636e\u5e93\u7684\u5e94\u7528\u7248\u672c\u6709\u53d8\u66f4\u65f6\u70b9\u51fb\u6b64\u6309\u94ae\u624d\u6709\u610f\u4e49\uff09',
            ))
          : ((v = !0),
            (w = bt.a.createElement(
              'span',
              { style: m },
              '\uff08\u6ce8\uff1a\u4f60\u4e0d\u662f\u5f53\u524d\u5e94\u7528\u8d1f\u8d23\u4eba\uff09',
            )));
        let k = !1,
          C = '',
          _ = !1,
          S = !1;
        l.length >= 60
          && ((k = !0),
          (C = bt.a.createElement(
            'span',
            { style: m },
            '\uff08\u6ce8\uff1a\u4f60\u7684\u4e2a\u4eba\u6807\u8bb0\u6570\u636e\u5df2\u8d85\u8fc760\u6761\uff0c\u8bf7\u5c1d\u8bd5\u5220\u9664\u4e00\u4e9b\u5176\u4ed6\u7684\u5df2\u6807\u8bb0\u6570\u636e\uff09',
          )));
        const x = l.find((e) => e.ver === d);
        x && (_ = !0);
        const A = o.find((e) => e.ver === d);
        A && (S = !0);
        const L = p
            ? bt.a.createElement(
                'a',
                { key: 'pipeline', href: p, target: '_blank', rel: 'noopener noreferrer', onClick: (e) => Xi(e) },
                bt.a.createElement('img', { width: '20px', height: '20px', src: J }),
                ' \u67e5\u770b\u6d41\u6c34\u7ebf',
              )
            : bt.a.createElement(
                'a',
                { key: 'pipeline', onClick: Ni, rel: 'noopener noreferrer' },
                bt.a.createElement('img', { width: '20px', height: '20px', src: J }),
                ' \u67e5\u770b\u6d41\u6c34\u7ebf',
              ),
          I = u
            ? bt.a.createElement(
                'a',
                { key: 'git', href: ''.concat(u), target: '_blank', rel: 'noopener noreferrer', onClick: (e) => Xi(e) },
                bt.a.createElement('img', { width: '22px', height: '20px', src: Y }),
                ' \u67e5\u770bgit',
              )
            : bt.a.createElement(
                'a',
                { key: 'git', onClick: Ni, rel: 'noopener noreferrer' },
                bt.a.createElement('img', { width: '22px', height: '20px', src: Y }),
                ' \u67e5\u770bgit',
              );
        let O = '';
        O = n.subApp.is_local_render
          ? ''.concat(window.top.location.origin, '/page/').concat(e.sub_app_name, '?ver=').concat(f)
          : ''.concat(n.subApp.render_app_host, '?_appv=').concat(f) || '';
        const M = async (e) => {
            t(!0);
            const a = await Lt.VersionList.updateAppVersion({ inputVersion: f, changeMode: e });
            if ((t(!1), a && a.subApp)) {
              const t = 'online' === e ? '\u7ebf\u4e0a' : '\u7070\u5ea6';
              de.b.success('\u5207\u6362\u7248\u672c '.concat(f, ' \u4e3a').concat(t, '\u6210\u529f')),
                Object(h.emit)([en, 'vTable']),
                Lt.appStore.initAllPage();
            }
          },
          T = (e) => Xi(e) && M('online'),
          V = (e) => Xi(e) && M('gray'),
          j = (e) => {
            Xi(e), Lt.VersionList.delAppUserMark({ appName: g, ver: d });
          },
          N = (e) => {
            Xi(e), Lt.VersionList.delAppGlobalMark({ appName: g, ver: d });
          };
        let D = [];
        if ('hasTitle' === a)
          (D = [
            bt.a.createElement(
              'a',
              { key: 'visit', href: O, target: '_blank', rel: 'noopener noreferrer' },
              bt.a.createElement('img', { width: '20px', height: '20px', src: q }),
              '\u8bbf\u95ee\u5e94\u7528',
            ),
            L,
            I,
            bt.a.createElement(
              Lr.a,
              { key: 'online', title: '\u5207\u6362\u5f53\u524d\u7248\u672c\u4e3a\u7ebf\u4e0a\u7248\u672c' },
              bt.a.createElement(
                'span',
                { onClick: T },
                bt.a.createElement(Ii.a, null),
                bt.a.createElement(Jn, null),
                '\u5207\u4e3a\u7ebf\u4e0a',
              ),
            ),
          ]),
            1 === n.subApp.enable_gray
              && D.push(
                bt.a.createElement(
                  Lr.a,
                  { key: 'gray', title: '\u5207\u6362\u5f53\u524d\u7248\u672c\u4e3a\u7070\u5ea6\u7248\u672c' },
                  bt.a.createElement(
                    'span',
                    { onClick: V },
                    bt.a.createElement(Nr.a, null),
                    bt.a.createElement(Jn, null),
                    '\u5207\u4e3a\u7070\u5ea6',
                  ),
                ),
              );
        else {
          const t = (t) => Xi(t) && Object(h.emit)('selectAsProjVer', e, 'online'),
            a = (t) => Xi(t) && Object(h.emit)('selectAsProjVer', e, 'build'),
            n = (t) => Xi(t) && Object(h.emit)('selectAsProjVer', e, 'ol_bu');
          D = [
            bt.a.createElement(
              Lr.a,
              {
                key: 'online',
                title: '\u9009\u62e9\u5f53\u524d\u7248\u672c\u4e3a\u9879\u76ee\u5bf9\u5e94\u7684\u3010\u7ebf\u4e0a\u7248\u672c\u3011',
              },
              bt.a.createElement('span', { onClick: t }, bt.a.createElement(pi.a, null), bt.a.createElement(Jn, null), '\u7ebf\u4e0a'),
            ),
            bt.a.createElement(
              Lr.a,
              {
                key: 'build',
                title: '\u9009\u62e9\u5f53\u524d\u7248\u672c\u4e3a\u9879\u76ee\u5bf9\u5e94\u3010\u7070\u5ea6\u7248\u672c\u3011',
              },
              bt.a.createElement('span', { onClick: a }, bt.a.createElement(pi.a, null), bt.a.createElement(Jn, null), '\u7070\u5ea6'),
            ),
            bt.a.createElement(
              Lr.a,
              {
                key: 'ol_bu',
                title:
                  '\u9009\u62e9\u5f53\u524d\u7248\u672c\u4e3a\u9879\u76ee\u5bf9\u5e94\u3010\u7ebf\u4e0a\u7248\u672c\u3011\u548c\u3010\u7070\u5ea6\u7248\u672c\u3011',
              },
              bt.a.createElement(
                'span',
                { onClick: n },
                bt.a.createElement(pi.a, null),
                bt.a.createElement(Jn, null),
                '\u7ebf\u4e0a\u4e0e\u7070\u5ea6',
              ),
            ),
          ];
        }
        return (
          D.push(
            bt.a.createElement(
              Mr.a,
              {
                placement: 'top',
                content: bt.a.createElement(
                  'div',
                  { style: { width: '268px' } },
                  bt.a.createElement(
                    Lr.a,
                    { title: bt.a.createElement('span', null, '\u5f53\u524d\u7248\u672c\u7684\u5143\u6570\u636e') },
                    bt.a.createElement(
                      Ba.a,
                      { style: Yi, onClick: (t) => Xi(t) && Object(h.emit)('openMetaDataDrawer', e) },
                      '\u5143\u6570\u636e',
                    ),
                  ),
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(
                    Lr.a,
                    {
                      title: bt.a.createElement(
                        'span',
                        null,
                        '\u4e3a\u5f53\u524d\u7248\u672c\u6dfb\u52a0\u4e2a\u4eba\u6807\u8bb0\uff0c\u65b9\u4fbf\u81ea\u5df1\u67e5\u770b\u3002',
                        C,
                      ),
                    },
                    bt.a.createElement(
                      Ba.a,
                      { style: Yi, disabled: k, onClick: (t) => Xi(t) && Object(h.emit)('openMarkInfoModal', e, 'user') },
                      '\u4e2a\u4eba\u6807\u8bb0',
                    ),
                  ),
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(
                    Lr.a,
                    {
                      title: bt.a.createElement(
                        'span',
                        null,
                        '\u4e3a\u5f53\u524d\u7248\u672c\u6dfb\u52a0\u5168\u5c40\u6807\u8bb0\uff0c\u65b9\u4fbf\u6240\u6709\u4eba\u67e5\u770b\u3002',
                        y,
                      ),
                    },
                    bt.a.createElement(
                      Ba.a,
                      { style: Yi, disabled: E, onClick: (t) => Xi(t) && Object(h.emit)('openMarkInfoModal', e, 'global') },
                      '\u5168\u5c40\u6807\u8bb0',
                    ),
                  ),
                  bt.a.createElement(
                    Lr.a,
                    { title: bt.a.createElement('span', null, '\u5237\u65b0\u7248\u672c\u7f13\u5b58\u3002', w), placement: 'bottom' },
                    bt.a.createElement(
                      Ba.a,
                      { style: Yi, disabled: v, onClick: (t) => Xi(t) && Object(h.emit)('openResetVerModal', e) },
                      '\u5237\u65b0\u7f13\u5b58',
                    ),
                  ),
                  _
                    && bt.a.createElement(
                      bt.a.Fragment,
                      null,
                      bt.a.createElement(
                        Lr.a,
                        {
                          title: bt.a.createElement('span', null, '\u5220\u9664\u5f53\u524d\u7248\u672c\u7684\u4e2a\u4eba\u6807\u8bb0'),
                          placement: 'bottom',
                        },
                        bt.a.createElement(Ba.a, { style: Yi, onClick: j }, '\u4e2a\u4eba\u6807\u8bb0\u5220\u9664'),
                      ),
                      bt.a.createElement(Jn, null),
                    ),
                  b
                    && S
                    && bt.a.createElement(
                      bt.a.Fragment,
                      null,
                      bt.a.createElement(
                        Lr.a,
                        {
                          title: bt.a.createElement('span', null, '\u5220\u9664\u5f53\u524d\u7248\u672c\u7684\u5168\u5c40\u6807\u8bb0'),
                          placement: 'bottom',
                        },
                        bt.a.createElement(Ba.a, { style: Yi, onClick: N }, '\u5168\u5c40\u6807\u8bb0\u5220\u9664'),
                      ),
                      bt.a.createElement(Jn, null),
                    ),
                ),
              },
              bt.a.createElement('span', { onClick: Xi }, bt.a.createElement(ui.a, null), bt.a.createElement(Jn, null), '\u66f4\u591a'),
            ),
          ),
          D
        );
      }
      function es(e) {
        let t = '';
        const a = e.git_repo_url || '',
          n = a.endsWith('.git') ? a.substr(0, a.length - 4) : a,
          r = (e.git_hashes || '').split(',').filter((e) => !!e),
          l = r.length;
        if (l > 0) {
          const e = r.map((e, t) =>
              bt.a.createElement(
                'div',
                { key: t, style: { marginBottom: '6px' } },
                bt.a.createElement(
                  'a',
                  { style: Di, target: '_blank', rel: 'noopener noreferrer', href: ''.concat(n, '/commit/').concat(e) },
                  e,
                ),
                bt.a.createElement(Jn, null),
                ' ',
                bt.a.createElement(Tr.a, {
                  onClick: () => {
                    el()(e), de.b.success('\u590d\u5236\u63d0\u4ea4hash\u503c '.concat(e, ' \u6210\u529f'), 2);
                  },
                }),
              ),
            ),
            a = (t) => {
              Xi(t);
              Oe.a.confirm({
                title: bt.a.createElement(
                  'span',
                  null,
                  '\u5f53\u524d\u6784\u5efa\u7248\u672c\u5171\u5305\u542b',
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(Ir.a, { color: '#87d068' }, l),
                  '\u6761\u63d0\u4ea4\u8bb0\u5f55',
                ),
                content: bt.a.createElement(
                  'div',
                  { style: { paddingTop: '12px', transform: 'translateX(-28px)', maxHeight: '600px', overflowY: 'auto' } },
                  e,
                ),
                width: '520px',
                getContainer: Kr,
                type: 'info',
                cancelButtonProps: { style: { display: 'none' } },
                okText: '\u786e\u8ba4',
              });
            },
            o = 'git checkout -b hotfix/'.concat(r[0].substr(0, 8), ' ').concat(r[0]),
            c = () => {
              el()(o), de.b.success('\u68c0\u51fa\u547d\u4ee4\u590d\u5236\u6210\u529f\uff1a'.concat(o));
            };
          t = bt.a.createElement(
            bt.a.Fragment,
            null,
            bt.a.createElement(
              'a',
              { style: Di, target: '_blank', rel: 'noopener noreferrer', href: ''.concat(n, '/commit/').concat(r[0]), onClick: Xi },
              r[0],
            ),
            bt.a.createElement(
              Lr.a,
              {
                title: bt.a.createElement(
                  'span',
                  null,
                  '\u5171',
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(Ir.a, { color: '#87d068' }, l),
                  '\u6761\u63d0\u4ea4\u8bb0\u5f55\uff0c\u70b9\u51fb\u53ef\u67e5\u770b',
                ),
              },
              bt.a.createElement(Ir.a, { color: '#87d068', onClick: a, className: 'gHover' }, l),
            ),
            bt.a.createElement(
              Lr.a,
              { title: '\u70b9\u51fb\u590d\u5236\u57fa\u4e8e\u6b64hash\u5206\u652f\u68c0\u51fa\u65b0\u5206\u652f\u7684git\u547d\u4ee4' },
              bt.a.createElement(Ir.a, { onClick: c, className: 'gHover' }, ' ', bt.a.createElement(ji.a, null)),
            ),
          );
        }
        return { pureGitRepoUrl: n, uiGitHashLinks: t };
      }
      function ts() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'hasTitle';
        return $i.buildSwitchTip('tag', e);
      }
      function as() {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'hasTitle';
        return $i.buildSwitchTip('all', e);
      }
      function ns() {
        return bt.a.createElement(zn.a, {
          type: 'warning',
          showIcon: !0,
          description: bt.a.createElement(
            bt.a.Fragment,
            null,
            '\u5f53\u524d\u5e94\u7528\u8fd8\u672a\u53d1\u5e03\u8fc7\u65b0\u7248\u672c\uff0c\u53ef\u53c2\u8003\u4ee5\u4e0b\u8d44\u6599\u5b66\u4e60\uff1a',
            bt.a.createElement('br', null),
            '1. \u53d1\u5e03\u8fdc\u7a0bjs\u5e93',
            bt.a.createElement('a', { target: 'blank', href: 'https://www.bilibili.com/video/BV15t4y1u7i5' }, '\u89c6\u9891'),
            '\u4e0e',
            bt.a.createElement('a', { target: 'blank', href: 'https://tencent.github.io/hel/docs/tutorial/helmod-dev' }, '\u6587\u6863'),
            bt.a.createElement('br', null),
            '2. \u6587\u7ae0\u5206\u4eab',
            bt.a.createElement(
              'a',
              { target: 'blank', href: 'https://juejin.cn/post/7139379656825765918' },
              '\u6a21\u5757\u8054\u90a6\u65b0\u9769\u547d',
            ),
          ),
        });
      }
      const rs = { color: 'rgba(0,0,0,.7)', verticalAlign: 'top' },
        ls = { minHeight: '26px' },
        os = [
          { label: '\u5168\u90e8', value: 'all' },
          { label: '\u5df2\u6807\u8bb0', value: 'tag' },
        ],
        cs = (e) => bt.a.createElement('span', { style: { color: '#838383de' } }, e.children),
        is = bt.a.memo(() => {
          const { state: e, syncer: t, sync: a, mr: n } = vt('VersionList', { tag: 'VTableTitle' }),
            r =
              'gray' === e.changeMode
                ? '\u8bf7\u8f93\u5165\u6b32\u4fee\u6539\u7684\u7070\u5ea6\u7248\u672c'
                : '\u8bf7\u8f93\u5165\u6b32\u4fee\u6539\u7684\u7ebf\u4e0a\u7248\u672c',
            l =
              'gray' === e.changeMode
                ? bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    bt.a.createElement(Nr.a, null),
                    bt.a.createElement(Wn, null),
                    bt.a.createElement('span', { style: { color: 'grey' } }, '\u7070\u5ea6\u7248\u672c: '),
                  )
                : bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    bt.a.createElement(Ii.a, null),
                    bt.a.createElement(Wn, null),
                    bt.a.createElement('span', { style: { color: 'blue' } }, '\u7ebf\u4e0a\u7248\u672c:  '),
                  ),
            o =
              1 === e.subApp.enable_gray
                ? bt.a.createElement(
                    'span',
                    null,
                    '\u7070\u5ea6\u529f\u80fd\uff1a',
                    bt.a.createElement(cs, null, '\u5df2\u542f\u7528'),
                    ' ',
                    bt.a.createElement(Oi.a, { style: { color: 'green' } }),
                    bt.a.createElement(Ol.a, { type: 'vertical' }),
                  )
                : bt.a.createElement(
                    'span',
                    null,
                    '\u7070\u5ea6\u529f\u80fd\uff1a',
                    bt.a.createElement(cs, null, '\u672a\u542f\u7528'),
                    ' ',
                    bt.a.createElement(Mi.a, { style: { color: 'red' } }),
                    bt.a.createElement(Ol.a, { type: 'vertical' }),
                  );
          let c = '',
            i = '';
          1 === e.subApp.enable_gray
            && ((c = bt.a.createElement(
              'span',
              null,
              '\u7070\u5ea6\u7248\u672c\uff1a',
              bt.a.createElement(cs, null, e.subApp.build_version),
              ' ',
              bt.a.createElement(Ol.a, { type: 'vertical' }),
              '\u7070\u5ea6\u72b6\u6001\uff1a ',
              e.subApp.is_in_gray
                ? bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    bt.a.createElement(cs, null, '\u7070\u5ea6\u4e2d'),
                    ' ',
                    bt.a.createElement(Dr.a, { style: { color: 'red' } }),
                  )
                : bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    bt.a.createElement(cs, null, '\u5df2\u901a\u8fc7'),
                    ' ',
                    bt.a.createElement(Ti.a, { style: { color: 'green' } }),
                  ),
            )),
            (i = bt.a.createElement(
              'div',
              { style: { wordBreak: 'break-all', wordWrap: 'break-word' } },
              '\u7070\u5ea6\u540d\u5355\uff1a',
              bt.a.createElement(cs, null, e.subApp.gray_users.join(',')),
            )));
          let s = '';
          1 === e.subApp.enable_gray
            && (s = bt.a.createElement(
              bt.a.Fragment,
              null,
              bt.a.createElement(Ba.a, { onClick: n.showChangeGrayInput, danger: !0 }, '\u5207\u6362\u7070\u5ea6\u7248\u672c'),
              bt.a.createElement(Wn, null),
            ));
          let p = '';
          e.subApp.is_in_gray
            && (p = bt.a.createElement(
              bt.a.Fragment,
              null,
              bt.a.createElement(
                Ba.a,
                { loading: e.grayBtnLoading, type: 'primary', onClick: n.clickAgreeGrayBtn },
                '\u7070\u5ea6\u901a\u8fc7',
              ),
              bt.a.createElement(Wn, null),
            ));
          const { user: u } = St('portal').userInfo;
          return bt.a.createElement(
            'div',
            null,
            bt.a.createElement(
              'div',
              null,
              '\u4f60\u597d\uff0c\u4eb2\u7231\u7684\u7528\u6237',
              u,
              '\uff0c Hel \u5df2\u4e3a\u8be5\u5e94\u7528\u4e00\u5171\u6784\u5efa\u4e86 ',
              bt.a.createElement(Ir.a, { color: Fi }, e.buildTotal),
              '\u4e2a\u7248\u672c \uff08\u5305\u542b ',
              bt.a.createElement(Ir.a, { color: Ui }, e.markTotal),
              '\u4e2a\u6807\u8bb0\u7248\u672c\uff09',
            ),
            bt.a.createElement('div', null, '\u7ebf\u4e0a\u7248\u672c\uff1a', bt.a.createElement(cs, null, e.subApp.online_version)),
            bt.a.createElement('div', null, o, c),
            i,
            bt.a.createElement(
              'div',
              { style: { float: 'right', margin: '12px 12px 0 0' } },
              bt.a.createElement(Bn.a.Group, {
                options: os,
                onChange: (e) => n.changeListMode(e.target.value),
                value: e.listMode,
                style: { width: '150px' },
              }),
              bt.a.createElement(Wn, null),
              p,
              s,
              bt.a.createElement(
                Lr.a,
                {
                  title:
                    '\u6ce8\u5165\u6307\u5b9a\u7248\u672c\u4f5c\u4e3a\u5728\u7ebf\u7248\u672c\uff0c\u5e76\u70b9\u51fb\u786e\u8ba4\u6309\u94ae\u6765\u5b8c\u6210\u5207\u6362',
                },
                bt.a.createElement(Ba.a, { onClick: n.showChangeOnlineInput, danger: !0 }, '\u5207\u6362\u5728\u7ebf\u7248\u672c'),
              ),
              bt.a.createElement(Wn, null),
              bt.a.createElement(Ba.a, { onClick: n.freshSubAppAssociateAndTable }, '\u5237\u65b0'),
            ),
            e.showInput
              ? bt.a.createElement(
                  'div',
                  { style: { float: 'right', marginRight: '12px', width: '100%' } },
                  bt.a.createElement(qn, { height: '12px' }),
                  bt.a.createElement(
                    'div',
                    { style: { float: 'right' } },
                    l,
                    bt.a.createElement(Ml.a, {
                      style: { width: '360px' },
                      value: e.inputVersion,
                      onChange: t.inputVersion,
                      placeholder: r,
                    }),
                    bt.a.createElement(Wn, null),
                    bt.a.createElement(
                      Ba.a,
                      { loading: e.updateLoading, type: 'primary', onClick: n.clickUpdateVersionBtn },
                      '\u786e\u8ba4',
                    ),
                    bt.a.createElement(Wn, null),
                    bt.a.createElement(Ba.a, { onClick: a('showInput', !1) }, '\u53d6\u6d88'),
                  ),
                )
              : '',
          );
        }),
        ss = function (e, t) {
          let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'hasTitle';
          const [n, r] = bt.a.useState(!1),
            { hasTopPagination: l, total: o, uiPagination: c } = t,
            { $uiType: i } = e;
          if ('topPagination' === i) return l && o > 5 && c;
          if ('switchAllTip' === i || 'switchMarkTip' === i) return 0 === o ? ns() : 'switchAllTip' === i ? as(a) : ts(a);
          const { uiConner: s, stCard: p, CardComp: u, uiGlobalMarkDesc: m, uiUserMarkDesc: d } = Zi(e, { stTitle: rs, stCol: ls }),
            g = Qi(e, r, a),
            { pureGitRepoUrl: h, uiGitHashLinks: b } = es(e),
            E = e.version_tag || e.sub_app_version,
            y = (e) => {
              Xi(e), el()(E), de.b.success('\u590d\u5236\u7248\u672c\u53f7 '.concat(E, ' \u6210\u529f'), 1);
            },
            w = (t) => {
              Xi(t), el()(e.git_branch), de.b.success('\u590d\u5236\u5206\u652f '.concat(e.git_branch, ' \u6210\u529f'), 1);
            };
          return bt.a.createElement(
            jn.a,
            { spinning: n },
            bt.a.createElement(
              u,
              { actions: g, style: p, hoverable: !0 },
              bt.a.createElement(
                xr.a,
                { gutter: 5, style: { position: 'relative' } },
                bt.a.createElement(
                  Pn.a,
                  { span: '13', style: ls },
                  bt.a.createElement('span', { style: rs }, '\u7248\u672c\u53f7\uff1a'),
                  E,
                  ' ',
                  bt.a.createElement(Tr.a, { onClick: y }),
                ),
                bt.a.createElement(
                  Pn.a,
                  { span: '11', style: ls },
                  bt.a.createElement('span', { style: rs }, '\u6784\u5efa\u65f6\u95f4\uff1a'),
                  zr(e.create_at),
                ),
                bt.a.createElement(
                  Pn.a,
                  { span: '13', style: ls },
                  bt.a.createElement('span', { style: rs }, '\u89e6\u53d1\u8005\uff1a'),
                  e.create_by,
                ),
                bt.a.createElement(
                  Pn.a,
                  { span: '11', style: Object(f.a)(Object(f.a)({}, ls), {}, { verticalAlign: 'top' }) },
                  bt.a.createElement('span', { style: rs }, '\u6784\u5efa\u5206\u652f\uff1a'),
                  ' ',
                  e.git_branch,
                  ' ',
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(Tr.a, { onClick: w }),
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(
                    'a',
                    { target: '_blank', rel: 'noopener noreferrer', href: ''.concat(h, '/tree/').concat(e.git_branch), onClick: Xi },
                    bt.a.createElement(Vi.a, null),
                  ),
                ),
                bt.a.createElement(
                  Pn.a,
                  { span: '13', style: ls },
                  bt.a.createElement('span', { style: rs }, 'git \u63d0\u4ea4 hash\uff1a'),
                  b,
                ),
                bt.a.createElement(
                  Pn.a,
                  { span: '11', style: ls },
                  bt.a.createElement('span', { style: rs }, '\u84dd\u76fe\u9879\u76ee\u7a7a\u95f4\uff1a'),
                  e.project_name,
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(
                    'a',
                    { target: '_blank', rel: 'noopener noreferrer', href: xe(e), onClick: Xi },
                    bt.a.createElement(Vi.a, null),
                  ),
                ),
                bt.a.createElement(
                  Pn.a,
                  { span: '24', style: ls },
                  bt.a.createElement('span', { style: rs }, 'git\u63d0\u4ea4\u63cf\u8ff0\uff1a'),
                  e.desc,
                ),
                m,
                d,
                s,
              ),
            ),
          );
        },
        ps = (e) => [{ key: 'op', title: () => bt.a.createElement(is, null), render: (t, a) => ss(a, e) }],
        us = (e) => [
          {
            key: 'op',
            title: () =>
              bt.a.createElement(zn.a, {
                type: 'info',
                message:
                  '\u8bf7\u4ece\u4ee5\u4e0b\u7248\u672c\u5217\u8868\u91cc\u9009\u62e9\u4e00\u7248\u4f5c\u4e3a\u9879\u76eeid\u7684\u5bf9\u5e94\u7248\u672c\uff0c\u6ce8\u610f\u9700\u70b9\u51fb\u7248\u672c\u5361\u7247\u5e95\u90e8\u7684\u3010\u7ebf\u4e0a\u3011\u3001\u3010\u7070\u5ea6\u3011\u3001\u3010\u7ebf\u4e0a\u4e0e\u7070\u5ea6\u3011\u6309\u94ae\u6765\u5b8c\u6210\u9009\u62e9\u64cd\u4f5c',
              }),
            render: (t, a) => ss(a, e, 'noTitle'),
          },
        ];
      function ms(e) {
        const t = Ct('VersionList', {}, e),
          a = t.initState({ pFetchSubAppEnd: !1 });
        return (
          t.mr.freshSubAppAssociate(t.props.name).then(() => {
            a.setState({ pFetchSubAppEnd: !0 });
          }),
          { ins: a, fetchFn: t.mr.fetchVersionList, pageSizeOptions: ['10', '20', '30'] }
        );
      }
      function ds(e) {
        const { titleUiMode: t = 'hasTitle' } = e,
          { settings: a } = vt('VersionList', { setup: ms, props: e, tag: 'AppVersionList' }),
          n = 'hasTitle' === t ? ps : us,
          { state: r } = a.ins;
        return bt.a.createElement(
          bt.a.Fragment,
          null,
          r.pFetchSubAppEnd
            && bt.a.createElement(an, {
              tid: 'vTable',
              fetchFn: a.fetchFn,
              getColumns: n,
              pageSizeOptions: a.pageSizeOptions,
              hasTopPagination: !0,
            }),
        );
      }
      ds.displayName = 'AppVersionList';
      var gs = bt.a.memo(ds),
        hs = a(276),
        fs = a.n(hs);
      const bs = { color: 'rgba(0,0,0,.7)', verticalAlign: 'top' },
        Es = { minHeight: '26px' },
        ys = [
          { label: '\u5361\u7247', value: 'card' },
          { label: '\u8868\u683c', value: 'table' },
        ],
        ws = (e) => {
          const { span: t = '12', colStyle: a = Es, titleStyle: n = bs, title: r, label: l } = e;
          return bt.a.createElement(
            Pn.a,
            { span: t, style: a },
            bt.a.createElement('span', { style: n }, r, '\uff1a'),
            l,
            ' ',
            bt.a.createElement(Tr.a, {
              onClick: (e) => {
                Xi(e), el()(l), de.b.success('\u590d\u5236'.concat(r, ' ').concat(l, ' \u6210\u529f'), 1);
              },
            }),
          );
        },
        vs = bt.a.memo(() => {
          const { state: e, mr: t } = vt('ServerModList', { tag: 'SMHead' }),
            { user: a } = St('portal').userInfo;
          return bt.a.createElement(
            'div',
            null,
            bt.a.createElement(
              'div',
              null,
              '\u4f60\u597d\uff0c\u4eb2\u7231\u7684\u7528\u6237',
              a,
              '\uff0c \u5f53\u524d\u6a21\u5757\u5171\u8fd0\u884c\u5728 ',
              bt.a.createElement(Ir.a, { color: Fi }, e.total),
              '\u4e2aNode\u670d\u52a1\u4e0a',
            ),
            bt.a.createElement(
              'div',
              { style: { float: 'right', margin: '12px 12px 0 0' } },
              '\u5217\u8868\u6a21\u5f0f\uff1a',
              bt.a.createElement(Bn.a.Group, {
                options: ys,
                onChange: (e) => t.changeListMode(e.target.value),
                value: e.listMode,
                style: { width: '150px' },
              }),
              bt.a.createElement(Wn, null),
              bt.a.createElement(Ba.a, { onClick: t.refreshTableCurPage }, '\u5237\u65b0'),
            ),
          );
        }),
        ks = () => [
          {
            key: 'op',
            title: () => bt.a.createElement('span', null),
            render: (e, t) =>
              ((e) => {
                const t = zr(e.load_at);
                return bt.a.createElement(
                  Ar.a,
                  { className: fs.a.srvModCardWrap, hoverable: !0 },
                  bt.a.createElement('div', { className: fs.a.srvModJsLogo }),
                  bt.a.createElement(
                    xr.a,
                    { gutter: 5, style: { position: 'relative' } },
                    bt.a.createElement(ws, { title: '\u6a21\u5757\u7248\u672c', label: e.mod_version }),
                    bt.a.createElement(ws, { title: '\u8f7d\u5165\u65f6\u95f4', label: t }),
                    bt.a.createElement(ws, { title: '\u73af\u5883', label: e.env_name }),
                    bt.a.createElement(ws, { title: '\u5bb9\u5668\u540d\u79f0', label: e.container_name }),
                    bt.a.createElement(ws, { title: '\u5bb9\u5668ip', label: e.container_ip }),
                    bt.a.createElement(ws, { title: 'pod\u540d\u79f0', label: e.pod_name }),
                    bt.a.createElement(ws, { title: '\u955c\u50cf\u540d\u79f0', label: e.img_version }),
                    bt.a.createElement(ws, { title: '\u57ce\u5e02', label: e.city }),
                  ),
                );
              })(t),
          },
        ],
        Cs = () => [
          { dataIndex: 'mod_version', title: '\u6a21\u5757\u7248\u672c' },
          { dataIndex: 'load_at', title: '\u8f7d\u5165\u65f6\u95f4', render: (e) => zr(e) },
          { dataIndex: 'env_name', title: '\u73af\u5883' },
          { dataIndex: 'container_name', title: '\u5bb9\u5668\u540d\u79f0' },
          { dataIndex: 'container_ip', title: '\u5bb9\u5668ip' },
          { dataIndex: 'pod_name', title: 'pod\u540d\u79f0' },
          { dataIndex: 'img_version', title: '\u955c\u50cf\u540d\u79f0' },
          { dataIndex: 'city', title: '\u57ce\u5e02' },
        ];
      function _s(e) {
        const t = Ct('ServerModList', {}, e);
        return t.setState({ subAppName: t.props.name }), { fetchFn: t.mr.fetchDataList, pageSizeOptions: ['10', '20', '30'] };
      }
      function Ss(e) {
        const { settings: t, state: a } = vt('ServerModList', { setup: _s, props: e, tag: 'ServerModList' }),
          n = 'card' === a.listMode,
          r = n ? ks : Cs;
        return bt.a.createElement(
          bt.a.Fragment,
          null,
          bt.a.createElement(vs, null),
          bt.a.createElement(an, {
            tid: 'smTable',
            fetchFn: t.fetchFn,
            getColumns: r,
            pageSizeOptions: t.pageSizeOptions,
            hasTopPagination: !0,
            noTableHead: n,
          }),
        );
      }
      Ss.displayName = 'ServerModList';
      var xs = bt.a.memo(Ss);
      const As = [
        { value: !0, label: '\u662f' },
        { value: !1, label: '\u5426' },
      ];
      function Ls(e) {
        const t = Ct('appStore', {}, e),
          a = t.initState({
            pSubApp: t.props.subApp || {},
            pResetAppInfoBtnLoading: !1,
            pAllowOutAccessBtnLoading: !1,
            pAllowOutAccessCardLoading: !1,
            isAllowed: !1,
            isAllowedOri: !1,
          }),
          n = () => {
            const { name: e } = a.state.pSubApp;
            if (!e) throw new Error('\u7f3a\u5931\u5e94\u7528\u540d');
            return e;
          },
          r = async () => {
            try {
              a.setState({ pAllowOutAccessCardLoading: !0 });
              const e = n(),
                t = await (async function (e) {
                  const t = Date.now();
                  let a = '/api/v1/allowed-app/isAllowed?name='.concat(e, '&timestamp=').concat(t);
                  return (a = lt(a, e, t)), await nt.get(a);
                })(e);
              a.setState({ pAllowOutAccessCardLoading: !1, isAllowed: t, isAllowedOri: t });
            } catch (e) {
              de.b.error(e.message), a.setState({ pAllowOutAccessBtnLoading: !1 });
            }
          };
        t.effect(() => {
          r();
        }, []);
        const l = {
          ins: a,
          isUserAdmin: () => xt('portal').isAdmin,
          getCanNotEditTip() {
            const { owners: e = [], create_by: t } = a.state.pSubApp,
              n = e.slice();
            return _(n, t), '\u6682\u4e0d\u80fd\u4fee\u6539\u8bbe\u7f6e\uff0c\u8bf7\u8054\u7cfb'.concat(n.join(','));
          },
          canEdit() {
            const e = St('portal').userInfo.user,
              { owners: t = [], create_by: n } = a.state.pSubApp;
            return l.isUserAdmin() || t.includes(e) || n === e;
          },
          async resetAppInfo() {
            try {
              const e = n();
              a.setState({ pResetAppInfoBtnLoading: !0 }),
                await t.mr.resetAppInfoCache(e),
                de.b.success('\u5237\u65b0\u5e94\u7528 '.concat(e, ' \u7f13\u5b58\u6210\u529f')),
                a.setState({ pResetAppInfoBtnLoading: !1 });
            } catch (e) {
              de.b.error(e.message), a.setState({ pResetAppInfoBtnLoading: !1 });
            }
          },
          async changeAllowed() {
            try {
              if (!l.canEdit()) return de.b.error(l.getCanNotEditTip());
              const e = n(),
                { isAllowed: t } = a.state;
              a.setState({ pAllowOutAccessBtnLoading: !0 }),
                await (async function (e, t) {
                  const a = Date.now();
                  let n = '/api/v1/allowed-app/'
                    .concat(t ? 'addAllowed' : 'delAllowed', '?name=')
                    .concat(e, '&timestamp=')
                    .concat(a);
                  return (n = lt(n, e, a)), await nt.get(n);
                })(e, t),
                de.b.success('\u4fee\u6539\u5e94\u7528 '.concat(e, ' \u5141\u8bb8\u5916\u7f51\u8bbf\u95ee\u8bbe\u7f6e\u6210\u529f')),
                a.setState({ pAllowOutAccessBtnLoading: !1, isAllowed: t, isAllowedOri: t });
            } catch (e) {
              de.b.error(e.message), console.trace(e), a.setState({ pAllowOutAccessBtnLoading: !1, isAllowed: a.state.isAllowedOri });
            }
          },
          onAllowedChanged(e) {
            a.setState({ isAllowed: e.target.value });
          },
        };
        return l;
      }
      function Is(e) {
        const { settings: t } = vt('appStore', { setup: Ls, props: e }),
          { state: a } = t.ins;
        return bt.a.createElement(
          bt.a.Fragment,
          null,
          t.isUserAdmin()
            && bt.a.createElement(zn.a, {
              type: 'info',
              message: '\u4f60\u6b63\u5728\u4ee5\u8d85\u7ba1\u8eab\u4efd\u4fee\u6539\u5e94\u7528\u8bbe\u7f6e',
            }),
          !t.canEdit() && bt.a.createElement(zn.a, { type: 'warning', message: t.getCanNotEditTip() }),
          bt.a.createElement(
            Ar.a,
            null,
            bt.a.createElement(
              Ba.a,
              { type: 'primary', disabled: !t.canEdit(), onClick: t.resetAppInfo, loading: a.pResetAppInfoBtnLoading },
              '\u5237\u65b0\u5e94\u7528\u7f13\u5b58',
            ),
            bt.a.createElement(qn, { height: '8px' }),
            bt.a.createElement(
              'span',
              { className: Pc.a.tipLabelWrap },
              bt.a.createElement(Dr.a, null),
              bt.a.createElement(Wn, null),
              '\u5237\u65b0 app_info \u6570\u636e\uff0c\u4ec5\u5f53\u4fee\u6539\u4e86\u6570\u636e\u5e93\u91cc\u7684 app_info \u6570\u636e\u65f6\uff0c\u70b9\u51fb\u6b64\u6309\u94ae\u624d\u6709\u610f\u4e49',
            ),
          ),
          bt.a.createElement(qn, null),
          bt.a.createElement(
            Ar.a,
            null,
            bt.a.createElement(
              jn.a,
              { spinning: a.pAllowOutAccessCardLoading },
              bt.a.createElement(
                'div',
                null,
                bt.a.createElement(Ba.a, { type: 'link' }, '\u5141\u8bb8\u5916\u7f51\u8bbf\u95ee'),
                bt.a.createElement(Wn, null),
                bt.a.createElement(Bn.a.Group, { options: As, value: a.isAllowed, onChange: t.onAllowedChanged }),
                bt.a.createElement(
                  Ba.a,
                  { type: 'primary', disabled: !t.canEdit(), onClick: t.changeAllowed, loading: a.pAllowOutAccessBtnLoading },
                  '\u786e\u8ba4\u4fee\u6539',
                ),
              ),
            ),
            bt.a.createElement(qn, { height: '8px' }),
            bt.a.createElement(
              'span',
              { className: Pc.a.tipLabelWrap },
              bt.a.createElement(Dr.a, null),
              bt.a.createElement(Wn, null),
              '\u5f00\u542f\u6b64\u529f\u80fd\u540e\uff0c\u5143\u6570\u636e\u83b7\u53d6',
              bt.a.createElement(
                'a',
                { href: Pt(a.pSubApp.name), target: '_blank', rel: 'noopener noreferrer' },
                '\u5916\u7f51\u63a5\u53e3',
              ),
              '\u624d\u53ef\u7528',
            ),
          ),
        );
      }
      Is.displayName = 'Setting';
      var Os = bt.a.memo(Is),
        Ms = a(800),
        Ts = a(801),
        Vs = a(464);
      function js(e) {
        const t = _t({}, e),
          a = t.initState({ subApp: null, visible: !1 });
        t.on('openSelectVersionLayer', (e) => {
          a.setState({ subApp: e, visible: !0 });
        }),
          t.on('closeSelectVersionLayer', () => {
            a.setState({ visible: !1 });
          });
        return {
          ins: a,
          close() {
            a.setState({ visible: !1 });
          },
        };
      }
      function Ns(e) {
        const { settings: t } = vt('VersionList', { setup: js }),
          { ins: a } = t;
        return bt.a.createElement(
          ci.a,
          { visible: a.state.visible, width: '1200px', onClose: t.close },
          bt.a.createElement(gs, { subApp: a.state.subApp, titleUiMode: 'noTitle' }),
        );
      }
      Ns.displayName = 'SelectVersionLayer';
      var Ds = Ns;
      let Bs = 1;
      function Ps() {
        return (Bs += 1), Bs;
      }
      function zs(e) {
        let t = '#00000073';
        const a = e.value.length;
        return (
          a > 30 && (t = 'red'),
          bt.a.createElement(
            'span',
            null,
            bt.a.createElement(Ml.a, { value: e.value, onChange: e.onChange, style: e.style }),
            bt.a.createElement(
              'span',
              { style: { color: '#00000073', paddingLeft: '8px' } },
              bt.a.createElement('span', { style: { color: t } }, a),
              '/30',
            ),
          )
        );
      }
      function Rs(e) {
        const { value: t, allowManualInput: a, syncer: n } = e;
        return bt.a.createElement(
          'span',
          null,
          bt.a.createElement(Ml.a, {
            value: t,
            disabled: !a,
            placeholder: '\u70b9\u3010\u9009\u62e9\u3011\u5f55\u5165\u7248\u672c\u53f7',
            style: e.style,
            onChange: n,
          }),
          bt.a.createElement(
            Mr.a,
            {
              content: bt.a.createElement(
                'div',
                null,
                bt.a.createElement(zn.a, {
                  message: bt.a.createElement(
                    'div',
                    null,
                    '\u590d\u5236\u89c4\u5219\u8bf4\u660e\uff1a',
                    bt.a.createElement(qn, { height: '14px' }),
                    bt.a.createElement(
                      'span',
                      { style: { color: 'grey', fontWeight: 300 } },
                      bt.a.createElement(
                        'p',
                        null,
                        '\u6a2a\u5411\u590d\u5236: \u5c06\u6b64\u5355\u5143\u683c\u7684\u7248\u672c\u53f7\u503c\u590d\u5236\u5230\u540c\u4e00\u884c\u5176\u4ed6\u5355\u5143\u683c',
                      ),
                      bt.a.createElement(
                        'p',
                        null,
                        '\u7eb5\u5411\u590d\u5236: \u5c06\u6b64\u5355\u5143\u683c\u7684\u7248\u672c\u53f7\u503c\u590d\u5236\u5230\u540c\u4e00\u5217\u5176\u4ed6\u5355\u5143\u683c',
                      ),
                      bt.a.createElement(
                        'p',
                        null,
                        '\u5168\u65b9\u5411\u590d\u5236: \u5c06\u6b64\u5355\u5143\u683c\u7684\u7248\u672c\u53f7\u503c\u590d\u5236\u5230\u5269\u4f59\u7684\u6240\u6709\u5355\u5143\u683c',
                      ),
                    ),
                  ),
                }),
                bt.a.createElement(
                  'div',
                  { style: { textAlign: 'center', marginTop: '12px' } },
                  bt.a.createElement(Ba.a, { onClick: () => e.copyToRow(t, e.uiId) }, '\u6a2a\u5411\u590d\u5236'),
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(Ba.a, { onClick: () => e.copyToCol(t, e.verKey) }, '\u7eb5\u5411\u590d\u5236'),
                  bt.a.createElement(Jn, null),
                  bt.a.createElement(Ba.a, { onClick: () => e.copyToAll(t) }, '\u5168\u65b9\u5411\u590d\u5236'),
                ),
              ),
            },
            bt.a.createElement(Jn, null),
            bt.a.createElement(Tr.a, { style: { color: 'grey' } }),
          ),
          bt.a.createElement(Jn, null),
          bt.a.createElement(
            Lr.a,
            { title: '\u70b9\u51fb\u6e05\u9664\u5f53\u524d\u5355\u5143\u683c\u9009\u62e9\u7684\u7248\u672c\u53f7' },
            bt.a.createElement(Mi.a, { onClick: () => e.delCellVer(e.uiId, e.verKey), style: { color: 'grey' } }),
          ),
        );
      }
      function Fs(e) {
        const { onlineVerIdSyncer: t, buildVerIdSyncer: a, item: n } = e,
          { id: r, onlineVerId: l, buildVerId: o } = n,
          c = { width: '82%' };
        return bt.a.createElement(
          xr.a,
          { style: { marginBottom: '12px' } },
          bt.a.createElement(
            Pn.a,
            { span: 7, style: { textAlign: 'center' } },
            bt.a.createElement(Ir.a, { style: { color: '#00000073' } }, e.idx + 1),
            bt.a.createElement(zs, { value: r, onChange: e.syncer, style: { width: '73%' } }),
          ),
          bt.a.createElement(
            Pn.a,
            { span: 7, style: { textAlign: 'center' } },
            bt.a.createElement(Rs, Object.assign({}, e, { value: l, syncer: t, verKey: 'onlineVerId', style: c })),
          ),
          bt.a.createElement(
            Pn.a,
            { span: 7, style: { textAlign: 'center' } },
            bt.a.createElement(Rs, Object.assign({}, e, { value: o, syncer: a, verKey: 'buildVerId', style: c })),
          ),
          bt.a.createElement(
            Pn.a,
            { span: 3, style: { textAlign: 'center' } },
            bt.a.createElement(Ba.a, { onClick: e.selectVersion, type: 'link', style: { padding: '2px' } }, '\u9009\u62e9'),
            bt.a.createElement(Jn, null),
            bt.a.createElement(Ba.a, { onClick: e.addItem, type: 'link', style: { padding: '2px' } }, '\u589e\u52a0'),
            bt.a.createElement(Jn, null),
            bt.a.createElement(Ba.a, { onClick: e.delItem, type: 'link', style: { padding: '2px' }, danger: !0 }, '\u5220\u9664'),
          ),
        );
      }
      function Hs(e) {
        const t = Ct('VersionList', {}, e),
          a = (e) => {
            const t = [];
            return (
              Object.keys(e).forEach((a) => {
                const { o: n = '', b: r = '' } = e[a];
                t.push({ id: a, uiId: Ps(), onlineVerId: n, buildVerId: r });
              }),
              t
            );
          },
          n = function () {
            let e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
            return { pLineDataList: [], mapBackup: null, pFetchSubAppEnd: e, pAllowManualInput: !1, idx: 0 };
          },
          r = (e) => E((e.proj_ver || {}).map || {}),
          l = t.initState(n(!1));
        t.mr.freshSubAppAssociate(t.props.name).then(() => {
          const e = r(t.state.subApp);
          l.setState({ pFetchSubAppEnd: !0, mapBackup: e, pLineDataList: a(e) });
        }),
          t.on('selectAsProjVer', (e, a) => {
            const { pLineDataList: n, idx: r } = l.state,
              { sub_app_version: o, version_tag: c } = e,
              i = c || o,
              s = n[r];
            if (s) {
              if ('online' === a) s.onlineVerId = i;
              else if ('build' === a) s.buildVerId = i;
              else {
                if ('ol_bu' !== a) return void alert('unknown selType '.concat(a));
                (s.onlineVerId = i), (s.buildVerId = i);
              }
              const e = r + 1,
                t = s.id
                  ? ''
                  : '\uff0c\u8bf7\u6ce8\u610f\u5f53\u524d\u884c\u6570\u8fd8\u672a\u5f55\u5165\u3010\u9879\u76eeid\u3011\u6570\u636e';
              He('\u9009\u62e9\u7248\u672c\u53f7 ['.concat(i, '] \u5f55\u5165\u5230\u7b2c').concat(e, '\u884c').concat(t), 1),
                l.setState({ pLineDataList: n });
            }
            t.emit('closeSelectVersionLayer');
          });
        return {
          ins: l,
          recover() {
            const e = E(l.state.mapBackup || {});
            l.setState({ pLineDataList: a(e) });
          },
          submit() {
            const { pLineDataList: e } = l.state,
              a = [];
            let n = !1,
              r = !1,
              o = '',
              c = '',
              i = '';
            return (
              e.forEach((e, t) => {
                const { id: l, onlineVerId: s } = e,
                  p = '\u8bf7\u68c0\u67e5\u7b2c'.concat(t + 1, '\u9879\uff01');
                var u, m;
                l
                  ? ma.letterOrNum.test(l)
                    || (o = ''.concat(
                      p,
                      'id\u547d\u540d\u53ea\u80fd\u662f\u5305\u542b\u5927\u5c0f\u5199\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e2d\u6a2a\u7ebf\u3001\u4e0b\u6a2a\u7ebf \u56db\u79cd\u7b26\u53f7\u7684\u7ec4\u5408',
                    ))
                  : ((n = !0), (i = p)),
                  l.length > 30 && (c = ''.concat(p, 'id\u547d\u540d\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e30\u4e2a\u5b57\u7b26')),
                  s || ((i = p), (r = !0)),
                  (u = a).includes((m = l)) || u.push(m);
              }),
              o
                ? Ue(o)
                : c
                ? Ue(c)
                : r
                ? Ue('\u5b58\u5728\u6709\u672a\u9009\u62e9\u7248\u672c\u53f7\u7684\u914d\u7f6e\u9879\uff0c'.concat(i))
                : n
                ? Ue('\u5b58\u5728\u6709\u672a\u586b\u5199\u7684\u9879\u76eeid\uff0c'.concat(i))
                : a.length < e.length
                ? Ue('\u5b58\u5728\u6709\u91cd\u590d\u7684\u9879\u76eeid\uff0c\u8bf7\u68c0\u67e5')
                : void t.mr.updateProjVer(e)
            );
          },
          selectVersion(e) {
            l.setState({ idx: e }), t.emit('openSelectVersionLayer', t.state.subApp);
          },
          delItem(e) {
            const { pLineDataList: t } = l.state;
            t.splice(e, 1),
              Ke(
                '\u5220\u9664\u6210\u529f\uff0c\u6ce8\u610f\u9700\u70b9\u51fb\u3010\u786e\u8ba4\u3011\u6309\u94ae\u540e\u624d\u4f1a\u751f\u6548',
              ),
              l.setState({ pLineDataList: t });
          },
          addItem(e) {
            const { pLineDataList: t } = l.state;
            if (36 === t.length) return Ke('\u6700\u591a\u53ea\u80fd\u6dfb\u52a0'.concat(36, '\u7ec4\u6620\u5c04\u5173\u7cfb'));
            t.splice(e, 0, { uiId: Ps(), id: '', onlineVerId: '', buildVerId: '' }), l.setState({ pLineDataList: t });
          },
          copyToRow(e, t) {
            const { pLineDataList: a } = l.state,
              n = a.find((e) => e.uiId === t);
            if (n) {
              if (!e)
                return Ke(
                  '\u6a2a\u5411\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u5148\u4e3a\u5355\u5143\u683c\u9009\u62e9\u4e00\u4e2a\u7248\u672c\u53f7',
                );
              (n.onlineVerId = e),
                (n.buildVerId = e),
                Ke(
                  '\u6a2a\u5411\u590d\u5236\u6210\u529f\uff0c\u6ce8\u610f\u9700\u70b9\u51fb\u3010\u786e\u8ba4\u3011\u6309\u94ae\u540e\u624d\u4f1a\u751f\u6548',
                ),
                l.setState({ pLineDataList: a.slice() });
            }
          },
          copyToCol(e, t) {
            if (!e)
              return Ke(
                '\u7eb5\u5411\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u5148\u4e3a\u5355\u5143\u683c\u9009\u62e9\u4e00\u4e2a\u7248\u672c\u53f7',
              );
            const { pLineDataList: a } = l.state;
            a.forEach((a) => (a[t] = e)),
              Ke(
                '\u7eb5\u5411\u590d\u5236\u6210\u529f\uff0c\u6ce8\u610f\u9700\u70b9\u51fb\u3010\u786e\u8ba4\u3011\u6309\u94ae\u540e\u624d\u4f1a\u751f\u6548',
              ),
              l.setState({ pLineDataList: a });
          },
          copyToAll(e) {
            if (!e)
              return Ke(
                '\u5168\u65b9\u5411\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u5148\u4e3a\u5355\u5143\u683c\u9009\u62e9\u4e00\u4e2a\u7248\u672c\u53f7',
              );
            const { pLineDataList: t } = l.state;
            t.forEach((t) => {
              (t.onlineVerId = e), (t.buildVerId = e);
            }),
              Ke(
                '\u5168\u65b9\u5411\u590d\u5236\u6210\u529f\uff0c\u6ce8\u610f\u9700\u70b9\u51fb\u3010\u786e\u8ba4\u3011\u6309\u94ae\u540e\u624d\u4f1a\u751f\u6548',
              ),
              l.setState({ pLineDataList: t });
          },
          delCellVer(e, t) {
            const { pLineDataList: a } = l.state,
              n = a.find((t) => t.uiId === e);
            if (n) {
              if (!n[t]) return Ke('\u6e05\u9664\u65e0\u6548\uff0c\u5f53\u524d\u5355\u5143\u683c\u65e0\u7248\u672c\u53f7');
              (n[t] = ''), Ke('\u6e05\u9664\u6210\u529f'), l.setState({ pLineDataList: a });
            }
          },
          async refresh() {
            t.setState({ projVerAreaLoading: !0 }), await t.mr.freshSubAppAssociate();
            const e = r(t.state.subApp),
              l = n();
            await t.setState(Object(f.a)(Object(f.a)({}, l), {}, { projVerAreaLoading: !1, mapBackup: e, pLineDataList: a(e) }));
          },
        };
      }
      function Us(e) {
        const { settings: t, state: a } = vt('VersionList', { setup: Hs, props: e, tag: 'ProjVerMap' }),
          { ins: n } = t,
          r = n.state.pLineDataList;
        return bt.a.createElement(
          'div',
          null,
          bt.a.createElement(
            'div',
            { className: fs.a.controlLine },
            bt.a.createElement(
              'div',
              { className: fs.a.controlArea },
              bt.a.createElement(
                Lr.a,
                {
                  title: bt.a.createElement(
                    bt.a.Fragment,
                    null,
                    bt.a.createElement(Ms.a, { style: { color: 'red', fontWeight: 900 } }),
                    '\u624b\u52a8\u5f55\u5165\u7248\u672c\uff0c\u7528\u6237\u9700\u81ea\u5df1\u627f\u62c5\u5f55\u9519\u7248\u672c\u53f7\u5e26\u6765\u7684\u5f02\u5e38\u7ed3\u679c',
                  ),
                },
                bt.a.createElement(wo.a, {
                  checkedChildren: '\u624b\u52a8\u5f55\u5165',
                  unCheckedChildren: '\u624b\u52a8\u5f55\u5165',
                  checked: n.state.pAllowManualInput,
                  onChange: n.syncer.pAllowManualInput,
                }),
              ),
              bt.a.createElement(Jn, null),
              bt.a.createElement(
                Lr.a,
                { title: '\u5237\u65b0\u9879\u76eeid\u4e0e\u7248\u672c\u6620\u5c04\u5173\u7cfb' },
                bt.a.createElement(
                  Ba.a,
                  {
                    type: 'primary',
                    size: 'small',
                    className: 'gHover '.concat(fs.a.controlItem),
                    onClick: t.refresh,
                    icon: bt.a.createElement(jl.a, null),
                  },
                  '\u5237\u65b0',
                ),
              ),
            ),
          ),
          bt.a.createElement(zn.a, {
            showIcon: !0,
            type: 'info',
            message:
              '\u901a\u8fc7\u81ea\u5b9a\u4e49\u3010\u9879\u76eeid\u3011\u4e0e\u3010\u7248\u672c\u53f7\u3011\u7684\u6620\u5c04\u5173\u7cfb\uff0c\u53ef\u4ee5\u652f\u6301\u8ba9\u4e0d\u540c\u9879\u76ee\u91cc\u7684 hel-micro sdk  \u62c9\u53d6\u540c\u4e00\u4e2a\u5e94\u7528\u7684\u4e0d\u540c\u65f6\u671f\u7684\u6784\u5efa\u7248\u672c\u53f7\uff08\u6ce8\uff1a\u76ee\u524d\u53ea\u652f\u6301\u6dfb\u52a0\u6700\u591a36\u7ec4\u6620\u5c04\u5173\u7cfb\uff09\u3002',
          }),
          bt.a.createElement(qn, null),
          bt.a.createElement(
            xr.a,
            { style: { marginBottom: '12px', backgroundColor: '#f4f5f5', padding: '6px' } },
            bt.a.createElement(
              Pn.a,
              { span: 7, style: { textAlign: 'center', borderRight: '1px solid lightgrey' } },
              '\u9879\u76eeid',
              bt.a.createElement(Jn, null),
              bt.a.createElement(Ir.a, { color: 'blue', style: { verticalAlign: 'bottom' } }, '\u5fc5\u987b'),
            ),
            bt.a.createElement(
              Pn.a,
              { span: 7, style: { textAlign: 'center', borderRight: '1px solid lightgrey' } },
              '\u7ebf\u4e0a\u7248\u672c\u53f7',
              bt.a.createElement(Jn, null),
              bt.a.createElement(Ir.a, { color: 'blue', style: { verticalAlign: 'bottom' } }, '\u5fc5\u987b'),
            ),
            bt.a.createElement(
              Pn.a,
              { span: 7, style: { textAlign: 'center', borderRight: '1px solid lightgrey' } },
              '\u7070\u5ea6\u7248\u672c\u53f7',
              bt.a.createElement(Jn, null),
              bt.a.createElement(Ir.a, { style: { verticalAlign: 'bottom' } }, '\u9009\u586b'),
            ),
            bt.a.createElement(Pn.a, { span: 3, style: { textAlign: 'center' } }, '\u64cd\u4f5c'),
          ),
          bt.a.createElement(
            jn.a,
            { spinning: a.projVerAreaLoading || !n.state.pFetchSubAppEnd },
            bt.a.createElement(
              bo.a,
              null,
              r.map((e, a) =>
                bt.a.createElement(Fs, {
                  item: e,
                  key: e.uiId,
                  idx: a,
                  uiId: e.uiId,
                  syncer: n.sync('pLineDataList.'.concat(a, '.id')),
                  buildVerIdSyncer: n.sync('pLineDataList.'.concat(a, '.buildVerId')),
                  onlineVerIdSyncer: n.sync('pLineDataList.'.concat(a, '.onlineVerId')),
                  selectVersion: () => t.selectVersion(a),
                  delItem: () => t.delItem(a),
                  addItem: () => t.addItem(a + 1),
                  copyToRow: t.copyToRow,
                  copyToCol: t.copyToCol,
                  copyToAll: t.copyToAll,
                  delCellVer: t.delCellVer,
                  allowManualInput: n.state.pAllowManualInput,
                }),
              ),
            ),
            !r.length
              && bt.a.createElement(
                bt.a.Fragment,
                null,
                bt.a.createElement(Sr.a, { description: '\u6682\u65e0\u914d\u7f6e\uff0c\u8bf7\u70b9\u51fb\u65b0\u589e' }),
                bt.a.createElement(qn, null),
              ),
            bt.a.createElement(
              'div',
              { style: { textAlign: 'center' } },
              bt.a.createElement(Ba.a, { onClick: () => t.addItem(r.length) }, bt.a.createElement(Fn.a, null), '\u65b0\u589e'),
              bt.a.createElement(Jn, null),
              bt.a.createElement(Ba.a, { onClick: t.recover }, bt.a.createElement(Ts.a, null), '\u6062\u590d'),
              bt.a.createElement(Jn, null),
              bt.a.createElement(
                Ba.a,
                { type: 'primary', onClick: t.submit, loading: a.updateLoading },
                bt.a.createElement(Vs.a, null),
                '\u786e\u8ba4',
              ),
            ),
          ),
          bt.a.createElement(Ds, null),
        );
      }
      Us.displayName = 'ProjVerMap';
      var Gs = Us;
      const Ks = ['token'],
        { Group: Ws, Button: qs } = Bn.a;
      let Js = 1;
      function Ys(e) {
        const t = _t({}, e),
          a = t.initState({ owners: [], disableEdit: !0, visible: !1, subApp: {}, selTab: 'application', key: Date.now() }),
          { state: n } = a;
        t.on('tryGetToken', (e) => {
          e(a.state.subApp.name);
        }),
          t.on('tokenGot', (e) => {
            let { appName: n, appToken: r } = e;
            a.state.subApp.name === n
              && (de.b.success('\u5e94\u7528 ['.concat(n, '] token \u83b7\u53d6\u6210\u529f...'), 1),
              t.emit('fillFormValues', { token: r }));
          }),
          t.on('openSubAppDrawer', function (e) {
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'application';
            const n = St('portal').userInfo.user,
              l = e.create_by,
              o = e.owners || [],
              c = !(o.includes(n) || l === n),
              i = Object(f.a)({ proj_ver: { map: {} } }, e),
              s = o.slice();
            s.includes(l) || s.push(l),
              (Js += 1),
              Lt.VersionList.setState({ subApp: i }),
              a.setState({ key: Js, owners: s, disableEdit: c, visible: !0, subApp: i, selTab: t }),
              r.switchTab(t);
          });
        const r = {
          onClose: () => {
            a.setState({ visible: !1, selTab: 'application' }), Lt.VersionList.clear();
          },
          onFormFinish: (e) => {
            const r = Object(f.a)({ id: n.subApp.id }, e);
            if (
              (Array.isArray(r.owners) || (r.owners = [r.owners]),
              Array.isArray(r.gray_users) || (r.gray_users = [r.gray_users]),
              r.owners.length > 50)
            )
              return t.emit('cancelFormBtnLoading'), de.b.warn('\u8d1f\u8d23\u4eba\u4e0d\u80fd\u5927\u4e8e 50');
            if (r.gray_users.length > 50)
              return t.emit('cancelFormBtnLoading'), de.b.warn('\u7070\u5ea6\u540d\u5355\u4e0d\u80fd\u5927\u4e8e 50');
            if ((r.cnname || (r.cnname = r.name), r.cnname.length > 128))
              return t.emit('cancelFormBtnLoading'), de.b.warn('\u4e2d\u6587\u540d\u79f0\u4e0d\u80fd\u5927\u4e8e128\u4f4d');
            const { token: l } = r,
              o = Object(Ve.a)(r, Ks);
            (o.render_app_host = o.render_app_host || ''),
              Lt.appStore
                .updateSubApp(o)
                .then((e) => {
                  e && (de.b.info('\u66f4\u65b0\u6210\u529f'), a.setState({ subApp: Object(f.a)(Object(f.a)({}, n.subApp), r) }));
                })
                .catch((e) => de.b.warn(e.message))
                .finally(() => t.emit('cancelFormBtnLoading'));
          },
          getFieldConf: () => (n.disableEdit ? bi : Ei),
          getUiExtraBtns: () =>
            n.disableEdit
              ? [
                  bt.a.createElement(zn.a, {
                    key: '1',
                    type: 'warning',
                    style: { marginTop: '12px' },
                    message: '\u65e0\u6743\u9650\u4fee\u6539,\u8bf7\u8054\u7cfb '.concat(n.owners.join(',')),
                  }),
                ]
              : [],
          switchTab: (e) => {
            const n = a.state.subApp.name;
            a.setState({ selTab: e }),
              n ? 'visit' === e && t.emit('openConfirmVisitAppModal', n, a.state.subApp) : de.b.warn('\u7f3a\u5931 appName \u53c2\u6570');
          },
          state: n,
        };
        return r;
      }
      var $s = bt.a.memo(function () {
        const e = kt(Ys),
          { subApp: t, selTab: a, visible: n, disableEdit: r, key: l } = e.state,
          { name: o } = t,
          c = bt.a.createElement(
            'div',
            null,
            '\u5e94\u7528 ',
            bt.a.createElement('span', { style: { color: 'var(--lra-theme-color)' } }, o),
            bt.a.createElement(Wn, null),
            bt.a.createElement(
              Ws,
              { value: a, onChange: (t) => e.switchTab(t.target.value) },
              bt.a.createElement(qs, { value: 'application' }, bt.a.createElement(Hn.a, null), ' \u7f16\u8f91\u5e94\u7528'),
              bt.a.createElement(qs, { value: 'version' }, bt.a.createElement(ii.a, null), ' \u7248\u672c\u5217\u8868'),
              bt.a.createElement(
                qs,
                { value: 'server_mod' },
                bt.a.createElement(si.a, null),
                ' \u670d\u52a1\u7aef\u5217\u8868 ',
                bt.a.createElement(Ir.a, { color: '#cd201f' }, 'new'),
              ),
              bt.a.createElement(qs, { value: 'proj_ver' }, bt.a.createElement(pi.a, null), ' \u9879\u76ee\u4e0e\u7248\u672c'),
              bt.a.createElement(qs, { value: 'visit' }, bt.a.createElement(tl.a, null), ' \u8bbf\u95ee\u5e94\u7528'),
              bt.a.createElement(
                qs,
                { value: 'setting', style: { width: '105px', textAlign: 'center' } },
                bt.a.createElement(ui.a, null),
                ' \u8bbe\u7f6e',
              ),
            ),
          );
        let i = '';
        return (
          (i =
            'application' === a
              ? bt.a.createElement(Xo, {
                  key: l,
                  onFinish: e.onFormFinish,
                  layout: 'vertical',
                  fields: e.getFieldConf(),
                  submitBtnLabel: '\u63d0\u4ea4',
                  fillBtn: '\u91cd\u7f6e',
                  showSelfBtn: !r,
                  extraBtns: e.getUiExtraBtns(),
                  fillValues: t,
                })
              : 'proj_ver' === a
              ? bt.a.createElement(Gs, { name: o })
              : 'setting' === a
              ? bt.a.createElement(Os, { subApp: t })
              : 'server_mod' === a
              ? bt.a.createElement(xs, { name: o })
              : bt.a.createElement(gs, { name: o })),
          bt.a.createElement(
            ci.a,
            { width: '1180px', title: c, placement: 'right', closable: !0, onClose: e.onClose, visible: n, zIndex: 200, getContainer: Kr },
            i,
            bt.a.createElement(wi, null),
            bt.a.createElement(ki, null),
            bt.a.createElement(Li, null),
          )
        );
      });
      function Xs(e) {
        const t = _t({}, e),
          a = t.initState({ mode: 'prod', subApp: {}, visible: !1 }),
          { state: n } = a;
        t.on('openCopySubAppLayer', function (e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'prod';
          a.setState({ mode: t, subApp: e, visible: !0 });
        });
        return {
          state: n,
          onClose() {
            a.setState({ visible: !1 });
          },
          getTitle: () =>
            'prod' === n.mode
              ? bt.a.createElement(
                  bt.a.Fragment,
                  null,
                  '\u4ee5\u5e94\u7528 ',
                  n.subApp.name,
                  ' \u4e3a\u6a21\u677f\u590d\u5236\u4e00\u4e2a\u65b0\u5e94\u7528\u7ec4\u7684\u65b0\u5e94\u7528',
                )
              : bt.a.createElement(
                  bt.a.Fragment,
                  null,
                  '\u4ee5\u5e94\u7528',
                  n.subApp.name,
                  ' \u4e3a\u6a21\u677f\u590d\u5236\u4e00\u4e2a\u540c\u5e94\u7528\u7ec4 ',
                  bt.a.createElement(Ir.a, { color: 'var(--lra-theme-color)' }, n.subApp.app_group_name),
                  '\u7684\u65b0\u5e94\u7528',
                ),
        };
      }
      var Zs = bt.a.memo(function () {
          const e = kt(Xs),
            { subApp: t, mode: a, visible: n } = e.state;
          return bt.a.createElement(
            ci.a,
            {
              width: '1180px',
              title: e.getTitle(),
              placement: 'right',
              closable: !0,
              onClose: e.onClose,
              visible: n,
              zIndex: 200,
              getContainer: Kr,
            },
            bt.a.createElement(Oc, { key: ''.concat(t.name, '_').concat(a), subApp: t, mode: a }),
          );
        }),
        Qs = a(804),
        ep = a(783),
        tp = a(805),
        ap = a(806),
        np = a(784),
        rp = a(807),
        lp = a(808),
        op = a(809),
        cp = a(810);
      const {
          LATEST_VISIT: ip,
          STAR: sp,
          CREATED: pp,
          STORE: up,
          INTRO: mp,
          NEW_APP: dp,
          TOP: gp,
          SYNC_STAFF: hp,
          SYNC_ALLOWED_APPS: fp,
          CLASS_MGR: bp,
        } = n,
        Ep = Object.values(n),
        { Group: yp, Button: wp } = Bn.a,
        vp = {
          [pp]: { label: '\u6211\u7684\u521b\u5efa', icon: bt.a.createElement(Qs.a, null) },
          [ip]: { label: '\u6700\u8fd1\u8bbf\u95ee', icon: bt.a.createElement(ep.a, null) },
          [hp]: { label: '\u540c\u6b65\u5458\u5de5', icon: bt.a.createElement(ep.a, null) },
          [fp]: { label: '\u540c\u6b65\u5e94\u7528\u767d\u540d\u5355', icon: bt.a.createElement(ep.a, null) },
        };
      function kp(e) {
        let t = '',
          a = '',
          n = '';
        return vp[e] ? ((a = 'uCenter'), (n = e)) : ((t = e), (n = pp)), { radioBtnKey: t, dropBtnKey: a, subMenuKey: n };
      }
      const Cp = { padding: '6px 12px', width: '100%' };
      function _p(e) {
        return bt.a.createElement('div', { className: 'gHoverTransToBlue', style: Cp, onClick: e.onClick }, e.children);
      }
      function Sp(e) {
        const t = e.initState(
          (function () {
            let e = ke();
            return '/' === e ? (e = ip) : Ep.includes(e) || (e = ''), Object(f.a)({ open: !1, path: e }, kp(e));
          })(),
        );
        e.on(Object(ge.getUrlChangedEvName)(), (t) => {
          const a = t.pathname;
          e.setState(Object(f.a)({ path: a }, kp(a)));
        });
        const a = {
          ins: t,
          handleRadioBtnClick: (t) => {
            const a = t.target.value;
            _e(a), e.setState({ radioBtnKey: a, dropBtnKey: '', path: a });
          },
          handleDropBtnClick: () => {
            const { subMenuKey: a } = t.state;
            _e(a), e.setState({ dropBtnKey: 'uCenter', path: a, radioBtnKey: '' });
          },
          clickSubMenu(t) {
            const a = t.key;
            _e(a), e.setState({ dropBtnKey: 'uCenter', radioBtnKey: '', path: a, subMenuKey: a });
          },
          renderMenu() {
            const e = xt('portal').isAdmin;
            return bt.a.createElement(
              'div',
              null,
              bt.a.createElement(
                xr.a,
                { gutter: 16 },
                bt.a.createElement(
                  Pn.a,
                  null,
                  bt.a.createElement(
                    Ar.a,
                    {
                      size: 'small',
                      title: bt.a.createElement(Ir.a, { color: '#87d068' }, '\u4e2a\u4eba\u4e2d\u5fc3'),
                      style: { width: 150 },
                    },
                    bt.a.createElement(
                      _p,
                      { onClick: () => a.clickSubMenu({ key: pp }) },
                      bt.a.createElement(Qs.a, null),
                      ' \u6211\u7684\u521b\u5efa',
                    ),
                    bt.a.createElement(
                      _p,
                      { onClick: () => a.clickSubMenu({ key: ip }) },
                      bt.a.createElement(ep.a, null),
                      ' \u6700\u8fd1\u8bbf\u95ee',
                    ),
                  ),
                ),
                bt.a.createElement(
                  Pn.a,
                  null,
                  bt.a.createElement(
                    Ar.a,
                    {
                      size: 'small',
                      title: bt.a.createElement(Ir.a, { color: '#87d068' }, '\u5176\u4ed6\u8bbe\u7f6e'),
                      style: { width: 150, height: '100%' },
                    },
                    e
                      && bt.a.createElement(
                        _p,
                        { onClick: () => a.clickSubMenu({ key: hp }) },
                        bt.a.createElement('span', null, '\u540c\u6b65\u5458\u5de5'),
                      ),
                    e
                      && bt.a.createElement(
                        _p,
                        { onClick: () => a.clickSubMenu({ key: fp }) },
                        bt.a.createElement('span', null, '\u540c\u6b65\u5e94\u7528\u767d\u540d\u5355'),
                      ),
                    bt.a.createElement(
                      _p,
                      { onClick: () => alert('\u5f85\u5b9e\u73b0') },
                      bt.a.createElement(tp.a, null),
                      ' ',
                      bt.a.createElement('span', { style: { color: 'grey' } }, 'thinking...'),
                    ),
                  ),
                ),
              ),
            );
          },
        };
        return a;
      }
      var xp = bt.a.memo(() => {
        const { state: e, settings: t } = Object(h.useConcent)({ setup: Sp }),
          { subMenuKey: a, radioBtnKey: n, dropBtnKey: r } = e,
          { label: l, icon: o } = vp[a];
        return bt.a.createElement(
          Ar.a,
          { style: { position: 'sticky', top: 0, zIndex: 99 }, bodyStyle: { padding: '12px 24px' } },
          bt.a.createElement(
            yp,
            { value: n, onChange: t.handleRadioBtnClick, buttonStyle: 'solid' },
            bt.a.createElement(wp, { value: up, style: { width: '110px' } }, bt.a.createElement(ap.a, null), ' \u5e94\u7528\u5546\u5e97'),
            bt.a.createElement(wp, { value: dp, style: { width: '110px' } }, bt.a.createElement(np.a, null), ' \u65b0\u5efa\u5e94\u7528'),
            bt.a.createElement(wp, { value: gp, style: { width: '110px' } }, bt.a.createElement(rp.a, null), ' \u7f6e\u9876\u63a8\u8350'),
            bt.a.createElement(wp, { value: mp, style: { width: '110px' } }, bt.a.createElement(lp.a, null), ' \u5173\u4e8e\u6d77\u62c9'),
            bt.a.createElement(wp, { value: bp, style: { width: '110px' } }, bt.a.createElement(ii.a, null), ' \u6211\u7684\u5206\u7c7b'),
            bt.a.createElement(wp, { value: sp, style: { width: '110px' } }, bt.a.createElement(op.a, null), ' \u6211\u7684\u6536\u85cf'),
          ),
          bt.a.createElement(
            yp,
            { value: r, buttonStyle: 'solid' },
            bt.a.createElement(wp, { value: 'uCenter', onClick: t.handleDropBtnClick }, o, l),
          ),
          bt.a.createElement(
            Mr.a,
            { content: t.renderMenu(), placement: 'bottomLeft' },
            bt.a.createElement(wp, { onMouseEnter: t.ins.sync('open', !0) }, bt.a.createElement(Vr.a, null)),
          ),
          bt.a.createElement(
            'div',
            { style: { float: 'right', display: 'inline-block' } },
            bt.a.createElement(
              'a',
              { rel: 'noopener noreferrer', href: 'https://tencent.github.io/hel/', target: '_blank' },
              bt.a.createElement(cp.a, null),
              ' \u6587\u6863',
            ),
          ),
        );
      });
      function Ap() {
        return bt.a.createElement(
          'svg',
          {
            viewBox: '64 64 896 896',
            focusable: 'false',
            'data-icon': 'file',
            width: '1em',
            height: '1em',
            fill: 'currentColor',
            'aria-hidden': 'true',
          },
          bt.a.createElement('path', {
            d: 'M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z',
          }),
        );
      }
      function Lp() {
        return bt.a.createElement(
          'svg',
          {
            viewBox: '64 64 896 896',
            focusable: 'false',
            'data-icon': 'star',
            width: '1em',
            height: '1em',
            fill: 'currentColor',
            'aria-hidden': 'true',
          },
          bt.a.createElement('path', {
            d: 'M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z',
          }),
        );
      }
      function Ip() {
        return bt.a.createElement(
          'svg',
          {
            viewBox: '64 64 896 896',
            focusable: 'false',
            'data-icon': 'home',
            width: '1em',
            height: '1em',
            fill: 'currentColor',
            'aria-hidden': 'true',
          },
          bt.a.createElement('path', {
            d: 'M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z',
          }),
        );
      }
      var Op,
        Mp,
        Tp,
        Vp,
        jp,
        Np,
        Dp,
        Bp,
        Pp,
        zp = function (e) {
          let { setIf: t, t: a = '', f: n = '' } = e;
          return t ? a : n;
        };
      function Rp(e) {
        let { onClick: t } = e;
        return bt.a.createElement('img', { className: 'gHover', witdh: '36', height: '36', alt: 'logo', onClick: t, src: q });
      }
      const Fp = $a.c.div(
          Op
            || (Op = Object(Ya.a)([
              '\n  overflow: hidden;\n  z-index: 199;\n  position: fixed;\n  background-color: #041528;\n  width: 60px;\n  height: 100vh;\n  padding-top: 10px;\n  text-align: center;\n  top: 0;\n  right: 0;\n',
            ])),
        ),
        Hp = $a.c.div(
          Mp
            || (Mp = Object(Ya.a)([
              '\n  position: fixed;\n  ',
              ';\n  right: 60px;\n  ',
              ';\n  width: 280px;\n  padding: 6px 6px;\n  min-height: 100px;\n  background-color: rgb(4, 21, 40);\n  border-left: 3px solid white;\n  border-top: 1px solid white;\n  border-bottom: 1px solid white;\n  border-right: 1px solid white;\n  color: white;\n',
            ])),
          (e) => Object($a.b)(Tp || (Tp = Object(Ya.a)(['display:', ''])), e.show ? 'block' : 'none'),
          (e) => Object($a.b)(Vp || (Vp = Object(Ya.a)(['top:', ''])), e.top || '60px'),
        ),
        Up = $a.c.div(
          jp
            || (jp = Object(Ya.a)([
              '\n  line-height: 33px;\n  height: 33px;\n  text-align: left;\n  padding-left: 12px;\n  margin: 3px 0;\n  font-size: 14px;\n',
            ])),
        ),
        Gp = $a.c.div(Np || (Np = Object(Ya.a)(['\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n']))),
        Kp = $a.c.div(Dp || (Dp = Object(Ya.a)(['\n  font-size: 16px;\n  margin-bottom: 3px;\n']))),
        Wp = $a.c.div(
          Bp
            || (Bp = Object(Ya.a)([
              '\n  position: absolute;\n  border: 1px solid white;\n  width: 36px;\n  height: 36px;\n  ',
              ';\n  background-size: contain;\n  margin-left: 12px;\n  border-radius: 18px;\n  bottom: 12px;\n',
            ])),
          (e) => Object($a.b)(Pp || (Pp = Object(Ya.a)(['background-image: url(', ')'])), e.src),
        ),
        qp = ['onMouseEnter', 'onMouseLeave', 'icon', 'label'],
        Jp = { color: 'white', margin: '12px', fontSize: '14px' };
      function Yp(e) {
        let { onMouseEnter: t, onMouseLeave: a, icon: n, label: r } = e,
          l = Object(Ve.a)(e, qp);
        return bt.a.createElement(
          'div',
          Object.assign({ className: 'gHover' }, l, { style: Jp, onMouseEnter: t, onMouseLeave: a }),
          bt.a.createElement(Kp, null, n),
          r,
        );
      }
      function $p(e) {
        let { style: t = {} } = e;
        return bt.a.createElement(
          'svg',
          {
            style: t,
            t: '1595129903573',
            viewBox: '0 0 1024 1024',
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg',
            'p-id': '1794',
            width: '20',
            height: '20',
          },
          bt.a.createElement('path', {
            d: 'M514.9 68.6c-245.5 0-445.3 199.8-445.3 445.3s199.8 445.3 445.3 445.3 445.3-199.8 445.3-445.3c0-245.6-199.7-445.3-445.3-445.3z m399.4 445.3c0 220.2-179.2 399.4-399.4 399.4S115.5 734.1 115.5 513.9s179.2-399.4 399.4-399.4 399.4 179.2 399.4 399.4z',
            fill: '#ffffff',
            'p-id': '1795',
          }),
          bt.a.createElement('path', {
            d: 'M702.5 304.1L432.1 422.4c-3.9 1.7-7 4.8-8.7 8.7L305.2 701.5c-2.3 5.3-1.9 11.1 1.3 15.9 3.2 4.8 8.4 7.7 14 7.7 2.3 0 4.6-0.5 6.8-1.4l270.4-118.3c3.9-1.7 7-4.8 8.7-8.7l118.3-270.4c2.3-5.3 1.9-11.1-1.3-15.9-4.5-6.8-13.3-9.6-20.9-6.3z m-34.5 73L566.4 580.2c-1.4 2.8-3.8 5.1-6.8 6.3l-165.1 66c-5.9 2.4-12.5 0.1-15.8-5.1-2.4-3.7-2.7-8.3-0.9-12.4l84.8-186.5c1.3-2.9 3.6-5.2 6.5-6.5L651 359.4c1.8-0.8 3.6-1.2 5.5-1.2 4.4 0 8.6 2.4 11.1 6.3 2.3 3.8 2.4 8.4 0.4 12.6z',
            fill: '#ffffff',
            'p-id': '1796',
          }),
          bt.a.createElement('path', {
            d: 'M514.9 474.8c-21.5 0-39 17.5-39 39s17.5 39 39 39c13.9 0 26.9-7.5 33.8-19.5 7-12 7-27 0-39-6.9-12-19.9-19.5-33.8-19.5z',
            fill: '#ffffff',
            'p-id': '1797',
          }),
        );
      }
      const Xp = ['keyword', 'onClick'],
        Zp = { padding: '32px', color: 'white' },
        Qp = { color: '#007acd' },
        eu = { lineHeight: '26px', border: 'dashed 1px white' },
        tu = { transform: 'translateY(4px)' };
      var au = function (e) {
        let { keyword: t = '', onClick: a } = e,
          n = Object(Ve.a)(e, Xp);
        return bt.a.createElement(
          'div',
          Object.assign({ style: Zp }, n),
          '\u6682\u65e0',
          bt.a.createElement('span', { style: Qp }, t),
          bt.a.createElement('br', null),
          '\u53bb\u5e94\u7528\u5e02\u573a\u901b\u4e00\u901b\u5427^_^',
          bt.a.createElement(
            'div',
            { className: 'gMenuItemHoverBlue', onClick: a, style: eu },
            bt.a.createElement($p, { style: tu }),
            ' \u5f00\u59cb\u63a2\u7d22',
          ),
        );
      };
      function nu() {
        Object(h.emit)('gotoPage', z);
      }
      function ru(e) {
        return (
          e.initState({ showLatestVisitMenu: !1, showStarMenu: !1, showHomeMenu: !1 }),
          {
            handleLeave: (t) => {
              const { clientY: a, target: n } = t.nativeEvent,
                { y: r, height: l } = n.getBoundingClientRect();
              (a <= r || a >= r + l) && e.setState({ showLatestVisitMenu: !1, showStarMenu: !1, showHomeMenu: !1 });
            },
            handleItemClick: (t) => {
              t.stopPropagation();
              const a = t.target.dataset.name;
              e.mr.changeSubApp({ appName: a });
            },
            gotoPage: (t) => {
              const { path: a } = t.target.dataset;
              e.setState({ showLatestVisitMenu: !1, showStarMenu: !1, showHomeMenu: !1 }), e.emit('gotoPage', a);
            },
          }
        );
      }
      function lu(e) {
        let { hideSideBar: t } = e;
        const { state: a, settings: n, sync: r } = Object(h.useConcent)({ module: 'portal', setup: ru }),
          { starAppNames: l, visitAppNames: o, userInfo: c } = a;
        return bt.a.createElement(
          Fp,
          null,
          bt.a.createElement(Wp, { className: 'gHover', src: c.icon, onClick: t }),
          bt.a.createElement(Rp, { onClick: nu }),
          bt.a.createElement(Yp, {
            icon: bt.a.createElement(Ap, null),
            label: '\u6700\u8fd1',
            onMouseEnter: r('showLatestVisitMenu', !0),
            onMouseLeave: n.handleLeave,
          }),
          bt.a.createElement(
            Hp,
            { top: '60px', show: a.showLatestVisitMenu, onMouseLeave: r('showLatestVisitMenu', !1) },
            o.map((e) =>
              bt.a.createElement(
                Up,
                { key: e, className: 'gMenuItemHoverBlue' },
                bt.a.createElement(Gp, { 'data-name': e, onClick: n.handleItemClick }, e),
              ),
            ),
            bt.a.createElement(zp, {
              setIf: 0 === o.length,
              t: bt.a.createElement(au, { 'data-path': M, keyword: '\u6700\u8fd1\u8bbf\u95ee', onClick: n.gotoPage }),
              f: bt.a.createElement(Up, { 'data-path': L, className: 'gMenuItemHoverBlue', onClick: n.gotoPage }, '\u66f4\u591a ...'),
            }),
          ),
          bt.a.createElement(Yp, {
            icon: bt.a.createElement(Lp, null),
            label: '\u6536\u85cf',
            onMouseEnter: r('showStarMenu', !0),
            onMouseLeave: n.handleLeave,
          }),
          bt.a.createElement(
            Hp,
            { top: '120px', show: a.showStarMenu, onMouseLeave: r('showStarMenu', !1) },
            l.map((e) =>
              bt.a.createElement(
                Up,
                { key: e, className: 'gMenuItemHoverBlue' },
                bt.a.createElement(Gp, { 'data-name': e, onClick: n.handleItemClick }, e),
              ),
            ),
            bt.a.createElement(zp, {
              setIf: 0 === l.length,
              t: bt.a.createElement(au, { 'data-path': M, keyword: '\u6211\u7684\u6536\u85cf', onClick: n.gotoPage }),
              f: bt.a.createElement(Up, { 'data-path': I, className: 'gMenuItemHoverBlue', onClick: n.gotoPage }, '\u66f4\u591a ...'),
            }),
          ),
          bt.a.createElement(Yp, {
            icon: bt.a.createElement(Ip, null),
            label: '\u4e3b\u9875',
            onMouseEnter: r('showHomeMenu', !0),
            onMouseLeave: n.handleLeave,
          }),
          bt.a.createElement(
            Hp,
            { top: '180px', show: a.showHomeMenu, onMouseLeave: r('showHomeMenu', !1) },
            bt.a.createElement(
              Up,
              { 'data-path': L, className: 'gMenuItemHoverBlue', onClick: n.gotoPage },
              bt.a.createElement(ep.a, null),
              ' \u6700\u8fd1\u8bbf\u95ee',
            ),
            bt.a.createElement(
              Up,
              { 'data-path': I, className: 'gMenuItemHoverBlue', onClick: n.gotoPage },
              bt.a.createElement(op.a, null),
              ' \u6211\u7684\u6536\u85cf',
            ),
            bt.a.createElement(
              Up,
              { 'data-path': M, className: 'gMenuItemHoverBlue', onClick: n.gotoPage },
              bt.a.createElement(ap.a, null),
              ' \u5e94\u7528\u5546\u5e97',
            ),
            bt.a.createElement(
              Up,
              { 'data-path': B, className: 'gMenuItemHoverBlue', onClick: n.gotoPage },
              bt.a.createElement(rp.a, null),
              ' \u7f6e\u9876\u63a8\u8350',
            ),
            bt.a.createElement(
              Up,
              { 'data-path': T, className: 'gMenuItemHoverBlue', onClick: n.gotoPage },
              bt.a.createElement(np.a, null),
              ' \u65b0\u5efa\u5e94\u7528',
            ),
          ),
        );
      }
      const ou = { textAlign: 'center', padding: '5px', height: '45px' };
      var cu = bt.a.memo(() => {
        const e = new Date().getFullYear();
        return bt.a.createElement(
          'div',
          { style: ou },
          'Copyright @ ',
          e,
          ' \u817e\u8baf\u5fae\u524d\u7aefoteam, Powered by ',
          bt.a.createElement('a', { href: 'https://github.com/tnfe/hel', target: '_blank', rel: 'noopener noreferrer' }, 'hel-micro'),
          '\u3001',
          bt.a.createElement(
            'a',
            { href: 'https://github.com/concentjs/concent', target: '_blank', rel: 'noopener noreferrer' },
            'concent',
          ),
          '\u3001',
          bt.a.createElement('a', { href: 'https://github.com/facebook/react', target: '_blank', rel: 'noopener noreferrer' }, 'react'),
        );
      });
      function iu(e) {
        const t = _t({}, e),
          a = t.initState({ visible: !1, appName: '', renderAppPath: '', isLocalRender: !0, subApp: null });
        t.on('openConfirmVisitAppModal', (e, t) => {
          const { is_local_render: n = !0 } = t,
            r = t.render_app_host || Tt(e);
          a.setState({ appName: e, visible: !0, isLocalRender: n, subApp: t, renderAppPath: r });
        });
        const n = {
          ins: a,
          cancel() {
            a.setState({ visible: !1 });
          },
          ok(e) {
            const { appName: t, isLocalRender: r, renderAppPath: l } = a.state;
            n.cancel(), Lt.portal.changeSubApp({ appName: t, isLocalRender: r, noNewTab: e, renderAppPath: l });
          },
          seeVersion() {
            n.cancel(), a.state.subApp && It('openSubAppDrawer', a.state.subApp, 'version');
          },
          seeApp() {
            n.cancel(), a.state.subApp && It('openSubAppDrawer', a.state.subApp, 'application');
          },
        };
        return n;
      }
      var su,
        pu = bt.a.memo(function () {
          const e = kt(iu),
            t = xt('portal').isAdmin,
            {
              ins: { state: a },
            } = e,
            n = [
              bt.a.createElement(Ba.a, { key: '1', onClick: e.cancel }, '\u53d6\u6d88'),
              bt.a.createElement(Ba.a, { key: '2', onClick: e.seeApp }, '\u67e5\u770b\u5e94\u7528'),
              bt.a.createElement(Ba.a, { key: '3', onClick: e.seeVersion }, '\u67e5\u770b\u7248\u672c'),
              t
                ? bt.a.createElement(Ba.a, { key: '4', onClick: () => e.ok(!0) }, '\u8bbf\u95ee(\u5f53\u524d\u9875\u7b7e\u6253\u5f00)')
                : null,
              bt.a.createElement(Ba.a, { key: '5', type: 'primary', onClick: () => e.ok() }, '\u786e\u8ba4\u8bbf\u95ee'),
            ].filter(Boolean);
          return bt.a.createElement(
            Oe.a,
            {
              width: 680,
              visible: a.visible,
              onCancel: e.cancel,
              footer: n,
              title: '\u786e\u8ba4\u8bbf\u95ee\u5e94\u7528 '.concat(a.appName),
            },
            bt.a.createElement(zn.a, {
              message: bt.a.createElement(
                'div',
                null,
                bt.a.createElement(
                  'p',
                  null,
                  '\u5982\u679c\u5f53\u524d\u5e94\u7528 ',
                  a.appName,
                  ' \u5e76\u975eUI\u6e32\u67d3\u578b\u5e94\u7528\uff08\u4ec5\u662f\u4e00\u4e2a\u51fd\u6570\u5e93\uff09\uff0c \u6216\u53d1\u5e03\u8005\u672a\u63d0\u4f9b\u5177\u4f53\u7684\u8df3\u8f6c\u94fe\u63a5\uff0c\u4f60\u53ef\u80fd\u8bbf\u95ee\u5230',
                  bt.a.createElement(Ir.a, { color: '#cd201f' }, '\u767d\u5c4f\u9875\u9762'),
                  '\u3002',
                ),
                bt.a.createElement(
                  'p',
                  null,
                  '\u70b9\u51fb\u4e0b\u65b9\u3010\u67e5\u770b\u5e94\u7528\u3011\u6309\u94ae\u8fdb\u5165\u5e94\u7528\u8be6\u60c5\u9875\uff0c\u8fdb\u4e00\u6b65\u7f16\u8f91\u8df3\u8f6c\u94fe\u63a5\u3001\u7070\u5ea6\u540d\u5355\u3001\u8d1f\u8d23\u4eba\u7b49\u4fe1\u606f\u3002',
                ),
                bt.a.createElement(
                  'p',
                  null,
                  '\u70b9\u51fb\u4e0b\u65b9\u3010\u67e5\u770b\u7248\u672c\u3011\u6309\u94ae\u8fdb\u5165\u5e94\u7528\u7684\u7248\u672c\u5217\u8868\u9875\uff0c\u4f7f\u7528\u7070\u5ea6\u3001\u56de\u6eda\u3001\u67e5\u770b\u5143\u6570\u636e\u7b49\u529f\u80fd\u3002',
                ),
              ),
              type: 'info',
            }),
          );
        });
      const uu = Object($a.c)(Vn.a)(su || (su = Object(Ya.a)(['\n  height: 100vh;\n  overflow: hidden;\n  z-index: 999999999;\n'])));
      class mu extends bt.a.Component {
        constructor() {
          super(...arguments),
            (this.state = {}),
            (this.ctx = {}),
            (this.resetSubAppMargin = (e) => {
              e instanceof Error && console.error(e);
              const t = this.ctx.moduleComputed,
                a = window.top.document.querySelector('#leah-sub-app-container');
              a
                && (t.displaySubAppWithSideBar
                  ? '60px' !== a.style.marginLeft && (a.style.marginLeft = '60px')
                  : t.displaySubAppOnly && '0px' !== a.style.marginLeft && (a.style.marginLeft = '0px'));
            }),
            (this.hideSideBar = () => {
              this.setState({ sideBarVisible: !1, ballVisible: !0 });
            }),
            (this.renderFullPage = () => {
              const { loading: e } = this.state;
              return bt.a.createElement(
                jn.a,
                { spinning: e },
                bt.a.createElement(
                  uu,
                  null,
                  this.renderContent(),
                  bt.a.createElement(Vn.a.Sider, { collapsed: !0, collapsedWidth: 60 }, this.renderSideBar()),
                ),
              );
            }),
            (this.renderSideBar = () => bt.a.createElement(lu, { hideSideBar: this.hideSideBar })),
            (this.renderContent = () => {
              const { basicDataReady: e } = this.state;
              return bt.a.createElement(
                Vn.a.Content,
                { style: { overflowY: 'auto' } },
                bt.a.createElement(xp, null),
                e
                  ? bt.a.createElement(
                      'div',
                      { style: { margin: '24px', padding: '24px', backgroundColor: 'white' } },
                      bt.a.createElement(Hc, null),
                      bt.a.createElement(pu, null),
                    )
                  : '',
                bt.a.createElement($s, null),
                bt.a.createElement(Zs, null),
                bt.a.createElement(cu, null),
              );
            }),
            (this.renderAppHub = () => {
              const { sideBarVisible: e, contentVisible: t } = this.state;
              return ke() === z ? '' : e && t ? this.renderFullPage() : e ? this.renderSideBar() : t ? this.renderContent() : '';
            }),
            (this.renderMainContent = () => bt.a.createElement(bt.a.Fragment, null, this.renderAppHub()));
        }
        componentDidMount() {
          this.ctx.mr.login().then(this.resetSubAppMargin).catch(this.resetSubAppMargin);
        }
        componentDidUpdate() {
          this.resetSubAppMargin();
        }
        $$setup() {
          const { on: e } = this.ctx;
          e('gotoPage', (e) => {
            const { activeApp: t, contentVisible: a } = this.ctx.state,
              n = () => {
                a || this.setState({ sideBarVisible: !0, contentVisible: !0, activeApp: null }), _e(e);
              };
            t
              ? this.ctx.emit('closeModal', {
                  title: '\u79bb\u5f00\u5e94\u7528 '.concat(t),
                  content: '\u662f\u5426\u786e\u8ba4\u79bb\u5f00\u5f53\u524d\u5b50\u5e94\u7528',
                  onOk: () => {
                    window.top.history.replaceState({}, '\u6d77\u62c9\u6a21\u5757\u7ba1\u63a7', '/'),
                      window.top.location.reload(window.top.location.origin);
                  },
                })
              : n();
          });
        }
        render() {
          return (
            console.log('%c HelApp BuildTime : '.concat('2025/10/22 16:55:08'), 'color:purple;border:6px solid purple;'),
            bt.a.createElement(
              Nn.BrowserRouter,
              { basename: '__hub' },
              bt.a.createElement(
                ge.ConnectRouter,
                null,
                bt.a.createElement(
                  Dn.g,
                  null,
                  bt.a.createElement(Dn.d, { exact: !0, path: z, component: _r }),
                  bt.a.createElement(Dn.d, { exact: !0, path: '/', component: _r }),
                  bt.a.createElement(Dn.d, { render: this.renderMainContent }),
                ),
                bt.a.createElement(oi, null),
              ),
            )
          );
        }
      }
      const du = Object(h.register)('portal')(mu);
      var gu = class extends bt.a.Component {
        render() {
          if ((Ur(this.props), Gr())) {
            const e = Fr.getShadowAppRoot ? Fr.getShadowAppRoot() : window.top.document.body;
            if (e) {
              const t = document.createElement('div');
              return e.appendChild(t), bt.a.createElement($a.a, { target: t }, bt.a.createElement(du, null));
            }
          }
          return bt.a.createElement(du, null);
        }
      };
      de.b.config({ duration: 2, top: 38 }),
        (async function () {
          Tn.a.render(bt.a.createElement(gu, null), document.getElementById('app-manager-root'));
        })().catch((e) => {
          console.error(e), alert('err: '.concat(e.message, ', contact ').concat(H));
        });
    },
  },
  [[471, 1, 2]],
]);
//# sourceMappingURL=main.c76b6308.chunk.js.map
