import * as React from 'react';
import { IShadowViewProps } from './IShadowViewProps';
import { attachShadow, supportShadow } from './ShadowRoot';

/**
 * ShadowView 创建一个启用了 Shadow DOM 的容器
 */
export class ShadowView extends React.Component<IShadowViewProps> {
  /**
   * ShadowRoot
   */
  public shadowRoot: ShadowRoot;

  /**
   * DOM Root
   */
  public root: HTMLElement;

  /**
   * 原始的  visibility 属性值
   */
  private originVisibility: string;

  /**
   * added by fantasticsoul
   * 使用 timeoutCount 控制 checkRootVisibility 执行次数
   */
  private timeoutCount = 0;

  /**
   * 渲染组件内容
   */
  public render() {
    const { tagName = 'shadow-view', children, className, style } = this.props;
    const props: any = { className, style, ref: this.onRef };
    // added by fantasticsoul
    if (this.props.id) props.id = this.props.id;

    const styleElement = this.renderStyle();
    return React.createElement(tagName, props, children, styleElement);
  }

  /**
   * 在执行 ref 函数时
   */
  private onRef = (root: HTMLElement) => {
    const { ref } = this.props;
    this.root = root;
    this.hideRoot();
    this.attachShadow();
    if (typeof ref === 'function') ref(root);
    else if (typeof ref === 'string') (<any>this)[ref] = root;

    // added by fantasticsoul
    if (this.props.onShadowRootReady) {
      var options = {
        showRoot: (opacity?: string) => {
          this.showRoot(opacity || '1'); // 不传默认值的话，就设值不透明度为1
        },
        root: root,
      };
      this.props.onShadowRootReady(this.shadowRoot, options);
    }
  };

  /**
   * 渲染局部作用域的样式
   */
  private renderStyle() {
    const { styleContent, styleSheets = [] } = this.props;
    const styleBuffer = [...styleSheets.map((url) => `@import url("${url}")`), ...(styleContent ? [styleContent] : [])];
    return React.createElement('style', { key: 'style' }, styleBuffer.join(';'));
  }

  /**
   * 在组件挂载时
   */
  componentDidMount() {
    const { showDelay = 16 } = this.props;
    // added by fantasticsoul，componentDidMount 时 timeoutCount 就置 0
    this.timeoutCount = 0;
    setTimeout(this.checkRootVisibility, showDelay);
  }

  /**
   * 启用 Shadow DOM
   */
  private attachShadow = () => {
    if (this.props.scoped === false) return;
    if (!supportShadow || !this.root || !this.root.children) return;
    const children = [].slice.call(this.root.children);
    const { mode = 'open', delegatesFocus } = this.props;
    this.shadowRoot = attachShadow(this.root, { mode, delegatesFocus });
    children.forEach((child: HTMLElement) => {
      this.shadowRoot.appendChild(child);
    });
  };

  /**
   * 隐藏根元素
   */
  private hideRoot = () => {
    if (!this.root || !this.root.style) return;
    this.originVisibility = this.root.style.opacity;
    this.root.style.opacity = '0';
  };

  /**
   * 显示根元素
   */
  private showRoot = (opacity?: string) => {
    if (!this.root || !this.root.style) return;
    const { transitionDuration } = this.props;
    this.root.style.transitionDuration = transitionDuration || '.3s';
    this.root.style.opacity = opacity || this.originVisibility;
  };

  /**
   * 检查样式加载状态
   */
  private checkRootVisibility = (): any => {
    // added by fantasticsoul，下面的 !this.shadowRoot || !this.shadowRoot.styleSheets 不严谨，
    // 导致 checkRootVisibility 一直执行，判断 props.styleSheets 即可
    var styleSheets = this.props.styleSheets || [];
    if (styleSheets.length === 0) {
      return this.showRoot();
    }
    // added by fantasticsoul 兜底判断，避免 checkRootVisibility 一直死循环
    if (this.timeoutCount >= 19) {
      return this.showRoot();
    } else {
      this.timeoutCount += 1;
    }

    if (!this.shadowRoot || !this.shadowRoot.styleSheets) {
      return this.showRoot();
    }
    const style = this.shadowRoot.styleSheets[0] as any;
    if (!style) return this.showRoot();
    const rules = [].slice.call(style.rules || style.cssRules || []);
    if (rules.length < 1) return this.showRoot();
    const pending = rules.some((rule: any) => {
      return !(rule.styleSheet || rule.href === '') && !rule.style;
    });
    return pending ? setTimeout(this.checkRootVisibility, 16) : this.showRoot();
  };
}
