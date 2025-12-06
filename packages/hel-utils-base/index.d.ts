
export interface INullDef {
  /** 这些值可判断为空 */
  nullValues: any[];
  /** default: true, {} 是否为空 */
  isEmptyObjNull: boolean;
  /** default: true, [] 是否为空 */
  isEmptyArrNull: boolean;
}

export declare const slash: {
  start: (path: string) => string;
  noStart: (path: string) => string;
  end: (path: string) => string;
  noEnd: (path: string) => string;
  ensureSlash: (path: string, options: { need: boolean; loc: 'end' | 'start' }) => string;
};

export declare const arr: {
  noDupPush: (arr: (string | number)[], item: string | number) => (string | number)[];
};

export declare const obj: {
  okeys: (obj: object) => string;
  isNull: (val: any, nullDef: INullDef) => boolean;
  purify: (obj: object, judgeValueValid: (value: any, key: string) => boolean) => object;
};

export declare const str: {
  /**
   * for getting pretty format multi line string when use \`...\`
   * this function will remove indent of every line automatically
   * @param {string} mayLineBreakStr
   * @param {'MULTI' | 'ONE'} [mode='MULTI']
   * @returns
   * ```
   * // usage 1, process multi lines with mode='MULTI' by default
   * pfstr(`
   *   line1 line1 line1,
   *   line2 line2 line2.
   * `);
   * // pass to console.log will print:
   * line1 line1 line1,
   * line2 line2 line2.
   * // attention: end <br/> will be removed automatically in MULTI mode
   * pfstr(`
   *   line1 line1 line1,<br/>
   *   line2 line2 line2.
   * `);
   * // pass to console.log will print:
   * line1 line1 line1,
   * line2 line2 line2.
   *
   * // usage 2, set mode='ONE' to get no line break string
   * pfstr(`
   *   line1 line1 line1,
   *   line2 line2 line2.
   * `, 'ONE');
   * // pass to console.log will print:
   * line1 line1 line1, line2 line2 line2.
   *
   * // usage 3, add <br/> to control line break
   * pfstr(`
   *   line1 line1 line1,
   *   line2 line2 line2,<br/>
   *   line3 line3 line3.
   * `, 'ONE');
   * // pass to console.log will print:
   * line1 line1 line1, line2 line2 line2,
   * line3 line3 line3.
   * ```
   */
  pfstr: (rawStr: string) => string;
};

export declare const file: {
  /**
   * 递归获得某个目录下的所有文件绝对路径
   * @param {string} dirPath 形如: /user/zzk/log/build
   * @return {string[]} filePathList
   * 形如 ['/user/zzk/log/build/js/xx.js', '/user/zzk/log/build/img/xx.png']
   */
  getAllFilePath: (dirPath: string) => string;
};
