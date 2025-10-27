import { Input, Modal } from 'antd';
import { VerticalBlank } from 'components/dumb/Blank';

export function ClassItemUpdateLayer(props) {
  const { settings } = props;
  const {
    ins: { state, syncer },
  } = settings;

  return (
    <Modal
      visible={state.modalVisible}
      onOk={settings.modify}
      onCancel={settings.closeModal}
      title="修改分类名称"
      okText="确认"
      cancelText="取消"
      confirmLoading={state.updateBtnLoading}
    >
      key：
      <Input value={state.selectedClassInfo.class_key} disabled={true} />
      <VerticalBlank height="12px" />
      名称：
      <Input value={state.editName} onChange={syncer.editName} />
    </Modal>
  );
}
