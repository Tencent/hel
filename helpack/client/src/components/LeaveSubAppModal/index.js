import { useConcent } from 'concent';
import { CLOSE_MODAL, OPEN_MODAL } from 'configs/constant/event';
import { HUB_APP_MODAL } from 'configs/constant/nodeSelector';
import React from 'react';
import ReactDOM from 'react-dom';
import { Mask, ModalBody, ModalBtn, ModalFoot, ModalHead, ModalWrap } from './styled';

function setup(ctx) {
  ctx.initState({ show: false, title: '', content: '' });
  const closeModal = () => ctx.set('show', false);

  let extra = {};
  ctx.on(CLOSE_MODAL, () => {
    if (extra.onCancel) return extra.onCancel(closeModal); // as next
    closeModal();
  });

  ctx.on(OPEN_MODAL, ({ title, content, onOk, onCancel }) => {
    extra = { onOk, onCancel };
    ctx.setState({ show: true, title, content });
  });

  return {
    closeModal,
    handleOk: () => {
      if (extra.onOk) return extra.onOk(closeModal); // as next
      closeModal();
    },
  };
}

function ModalContent() {
  const { state, settings } = useConcent({ setup });
  if (!state.show) return '';

  return (
    <Mask>
      <ModalWrap>
        <ModalHead>{state.title}</ModalHead>
        <ModalBody>{state.content}</ModalBody>
        <ModalFoot>
          <ModalBtn className="gHover" onClick={settings.closeModal}>
            取消
          </ModalBtn>
          <ModalBtn primary className="gHover" onClick={settings.handleOk}>
            确认
          </ModalBtn>
        </ModalFoot>
      </ModalWrap>
    </Mask>
  );
}

export default class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    const mountNode = document.getElementById(HUB_APP_MODAL);
    this.mountNode = mountNode;
  }
  componentDidMount() {
    document.body.appendChild(this.mountNode);
  }

  componentWillUnmount() {
    document.body.removeChild(this.mountNode);
  }

  render() {
    if (this.mountNode) {
      return ReactDOM.createPortal(<ModalContent />, this.mountNode);
    } else {
      return <ModalContent />;
    }
  }
}
