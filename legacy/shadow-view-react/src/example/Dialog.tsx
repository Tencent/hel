import React from 'react';
import { createPortal } from 'react-dom';

export class Dialog extends React.Component<any> {
  root: HTMLElement;
  constructor(props: any, ...args: any[]) {
    // @ts-ignore
    super(props, ...args);
    const doc = window.document;
    this.root = doc.createElement('div');
    doc.body.appendChild(this.root);
  }

  render() {
    const { children } = this.props;
    return createPortal(<div>{children}</div>, this.root);
  }

  componentWillUnmount() {
    window.document.body.removeChild(this.root);
  }
}
