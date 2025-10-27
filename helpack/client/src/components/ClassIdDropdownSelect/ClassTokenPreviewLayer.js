import { CopyOutlined } from '@ant-design/icons';
import { message, Modal, Spin } from 'antd';
import { VerticalBlank } from 'components/dumb/Blank';
import copy from 'copy-to-clipboard';
import { ste } from 'utils/common';

const stCopy = { color: 'var(--lra-theme-color)', paddingLeft: '3px' };

export function ClassTokenPreviewLayer(props) {
  const { settings } = props;
  const {
    ins: { state },
  } = settings;
  const { selectedClassInfo: info, classToken, classTokenLoading } = state;

  const copyToken = (e) => {
    ste(e);
    message.success(`复制分类token成功!`, 1);
    copy(classToken);
  };

  return (
    <Modal visible={state.classTokenModalVisible} footer={[]} onCancel={settings.closeClassTokenModal} title="查看分类token">
      <Spin spinning={classTokenLoading}>
        key：{info.class_key}
        <VerticalBlank height="12px" />
        名称：{info.class_label}
        <VerticalBlank height="12px" />
        token：{classToken} <CopyOutlined style={stCopy} onClick={copyToken} />
      </Spin>
    </Modal>
  );
}
