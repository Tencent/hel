import { IShadowRootOptions } from './IShadowRootOptions';

/**
 * ShadowView 属性
 */
export interface IShadowViewProps extends IShadowRootOptions {
  /**
   * 根元素的 tagName
   * 默认为 `shadow-view`
   */
  tagName?: string;

  /**
   * Shadow 容器中的子元素
   */
  children?: React.ReactNode;

  /**
   * React Ref function
   */
  ref?: Function;

  /**
   * 顶层元素的 className
   */
  className?: string;

  /**
   * 顶层元素 style
   */
  style?: any;

  /**
   * 引入的样式表单
   */
  styleSheets?: string[];

  /**
   * 引入的样式文本
   */
  styleContent?: string;

  /**
   * 显示延时
   */
  showDelay?: number;

  /**
   * 是否启用隔离，默认为 true
   */
  scoped?: boolean;

  /**
   * 显示动画持续时间
   */
  transitionDuration?: string;

  /**
   * added by fantasticsoul
   * 参数1：shadowRoot 本身，参数2：shadowRoot 的父容器 和 shoRoot 方法
   */
  onShadowRootReady?: (shadowRoot: ShadowRoot, options: { showRoot: (opacity: string) => void; root: any }) => any;

  /**
   * added by fantasticsoul
   * 支持透传id
   */
  id?: string;
}
