//  parse html，inspred by https://zhuanlan.zhihu.com/p/338772106, fixed self close tag parse bug.

const SPACE_REGEX = /\s/;
const TOKEN_REGEX = /[a-zA-Z0-9\-]/;

export class HTMLParser {
  constructor() {
    this.input = "";
    this.cur = 0;
  }

  get eof() {
    return this.cur >= this.input.length;
  }

  peek(offset = 0) {
    return this.input[this.cur + offset];
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
    return result.join("");
  }

  noop() { }

  parse(input, options = {}) {
    this.input = input;
    this.onTagOpen = options.onTagOpen || this.noop();
    this.onTagClose = options.onTagClose || this.noop();
    this.cur = 0;
    return this.parseNodes();
  }

  parseNodes() {
    const nodes = [];
    do {
      let node;
      if (this.peek() === "<") {
        if (this.peek(1) === "/") break;
        node = this.parseElement();
      } else {
        node = this.parseTextNode();
      }
      nodes.push(node);
    } while (!this.eof);
    return nodes;
  }

  parseTextNode() {
    const text = this.consumeWhile(/[^<]/);
    return text.replace(/[\s\n]+/g, " ");
  }

  parseElement() {
    this.consumeChar("<");
    const tag = this.parseTag();
    this.onTagOpen(tag);
    this.consumeSpace();
    const attrs = this.parseAttrs();

    const curChar = this.peek();
    const curPrev1Char = this.peek(-1);
    if (`${curPrev1Char}${curChar}` === "/>") {
      // is self close tag
      const toReturn = {
        tag,
        attrs,
        children: []
      };
      this.onTagClose(tag, toReturn);
      return toReturn;
    }

    this.consumeChar(">");
    const children = this.parseNodes();
    this.consumeChar("<");
    this.consumeChar("/");
    //  const closeTag = this.parseTag();
    this.parseTag();
    this.consumeSpace();
    this.consumeChar(">");
    const toReturn = {
      tag,
      attrs,
      children
    };
    this.onTagClose(tag, toReturn);
    return toReturn;
  }

  parseTag() {
    const tag = this.consumeWhile(TOKEN_REGEX);
    return tag;
  }

  parseAttrs() {
    const attrs = {};
    while (this.peek() !== ">") {
      const name = this.parseTag();
      if (!name) {
        this.consumeChar(this.peek());
        continue;
      }

      if (this.peek() === "=") {
        this.consumeChar("=");
        this.consumeChar('"');
        const value = this.consumeWhile(/[^"]/);
        this.consumeChar('"');
        attrs[name] = value;
      } else {
        attrs[name] = "";
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
