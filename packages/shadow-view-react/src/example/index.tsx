import React from "react";
import ReactDOM from "react-dom";
import { ShadowView, attachShadow } from "../";

export class App extends React.Component {
  state = { msg: "" };

  onClick = () => {
    this.setState({ msg: "Hello" });
  };

  render() {
    const { msg } = this.state;
    return (
      <div>
        <a href="/outside">Link outside</a>
        <ShadowView>
          {msg ? <div>{msg}</div> : <span>No message</span>}
          <button onClick={this.onClick}>Click me</button>
          <a href="/inside">Link inside</a>
        </ShadowView>
      </div>
    );
  }

  async componentDidMount() {
    await this.createPortal();
  }

  async componentWillMount() {
    await this.removePortal();
  }

  portalRoot: HTMLElement;
  portalStyle: HTMLElement;

  async createPortal() {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const shadowRoot = attachShadow(root, { delegatesFocus: true });
    const portalStyle = document.createElement("style");
    portalStyle.setAttribute("scoped", "");
    shadowRoot.appendChild(portalStyle);
    const portalRoot = document.createElement("div");
    shadowRoot.appendChild(portalRoot);
    document.body.appendChild = (...args) => {
      return portalRoot.appendChild(...args);
    };
    document.body.append = (...args) => {
      return portalRoot.append(...args);
    };
    this.portalStyle = portalStyle;
    this.portalRoot = portalRoot;
  }

  async removePortal() {
    if (!this.portalRoot) return;
    if (this.portalRoot.remove) return this.portalRoot.remove();
    this.portalRoot.parentNode.removeChild(this.portalRoot);
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
