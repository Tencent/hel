//  parse html，inspred by https://zhuanlan.zhihu.com/p/338772106,
// fixed self close tag parse bug.
// fixed including comment parse bug.

const SPACE_REGEX = /\s/;
const TOKEN_REGEX = /[a-zA-Z0-9\-]/;
const DOCTYPE_MARK = '<!DOCTYPE html>';
const COMMENT_START = '<!--';
const COMMENT_END = '-->';
const META_END = '</meta>';
const META_END_LEN = META_END.length;

export class HTMLParser {
  constructor() {
    this.input = '';
    this.len = 0;
    this.cur = 0;
  }

  get eof() {
    return this.cur >= this.len;
  }

  peek(offset = 0) {
    return this.input[this.cur + offset];
  }

  sub(len, start) {
    const startIdx = start || this.cur;
    return this.input.substring(startIdx, startIdx + len);
  }

  moveCur(num) {
    this.cur += num;
  }

  consumeChar(c) {
    const curChar = this.peek();
    if (curChar === c) {
      this.cur++;
    } else {
      throw new Error(`Unexpected character: '${curChar}' should be '${c}'`);
    }
    return curChar;
  }

  consumeSpace() {
    this.consumeWhile(SPACE_REGEX);
  }

  consumeWhile(regex) {
    const result = [];
    do {
      const curChar = this.peek();
      if (regex.test(curChar)) {
        result.push(curChar);
        this.cur++;
      } else {
        break;
      }
    } while (!this.eof);
    return result.join('');
  }

  noop() {}

  pureInput(/** @type string */ input) {
    let puredStr = input.trim();
    if (puredStr.startsWith(DOCTYPE_MARK)) {
      puredStr = puredStr.substring(DOCTYPE_MARK.length);
    }

    // 移除 <!-- --> 相关的注释
    const delComment = (str) => {
      const commentStartIdx = str.indexOf(COMMENT_START);
      const commentEndIdx = str.indexOf(COMMENT_END);
      if (commentStartIdx >= 0 && commentEndIdx >= 0) {
        const strBeforeComment = str.substring(0, commentStartIdx);
        const strAfterComment = str.substring(commentEndIdx + COMMENT_END.length);
        return delComment(`${strBeforeComment}${strAfterComment}`);
      }
      return str;
    };

    puredStr = delComment(puredStr);
    return puredStr;
  }

  parse(input, options = {}) {
    this.input = this.pureInput(input);
    this.len = this.input.length;
    this.onTagOpen = options.onTagOpen || this.noop();
    this.onTagClose = options.onTagClose || this.noop();
    this.cur = 0;
    return this.parseNodes();
  }

  parseNodes() {
    const nodes = [];
    do {
      let node;
      if (this.peek() === '<') {
        if (this.peek(1) === '/') break;
        node = this.parseElement();
      } else {
        node = this.parseTextNode();
      }
      if (node === ' ') {
        // filter ' ' node
        continue;
      }
      nodes.push(node);
    } while (!this.eof);
    return nodes;
  }

  parseTextNode() {
    const text = this.consumeWhile(/[^<]/);
    return text.replace(/[\s\n]+/g, ' ');
  }

  parseElement() {
    this.consumeChar('<');
    const tag = this.parseTag();
    this.onTagOpen(tag);
    this.consumeSpace();
    const attrs = this.parseAttrs();

    const curChar = this.peek();
    const curPrev1Char = this.peek(-1);
    const handleTagEnd = (children, move = 0) => {
      //  const closeTag = this.parseTag();
      this.parseTag();
      this.consumeSpace();
      this.consumeChar('>');
      if (move) {
        this.moveCur(move);
      }
      const toReturn = {
        tag,
        attrs,
        children,
      };
      this.onTagClose(tag, toReturn);
      return toReturn;
    };

    if (`${curPrev1Char}${curChar}` === '/>') {
      // is self close tag
      return handleTagEnd([]);
    }

    if (tag === 'meta' && curChar === '>') {
      // handle <meta> or <meta></meta>
      const endFeature = this.sub(META_END_LEN, this.cur + 1);
      const move = endFeature === META_END ? META_END_LEN : 0;
      return handleTagEnd([], move);
    }

    this.consumeChar('>');
    const children = this.parseNodes();
    this.consumeChar('<');
    this.consumeChar('/');
    return handleTagEnd(children);
  }

  parseTag() {
    const tag = this.consumeWhile(TOKEN_REGEX);
    return tag;
  }

  parseAttrs() {
    const attrs = {};
    while (this.peek() !== '>') {
      const name = this.parseTag();
      if (!name) {
        this.consumeChar(this.peek());
        continue;
      }

      if (this.peek() === '=') {
        this.consumeChar('=');
        this.consumeChar('"');
        const value = this.consumeWhile(/[^"]/);
        this.consumeChar('"');
        attrs[name] = value;
      } else {
        attrs[name] = '';
      }
      this.consumeSpace();
    }
    return attrs;
  }
}

export function parseHtml(html, options) {
  const parser = new HTMLParser();
  const result = parser.parse(html, options);
  return result;
}
