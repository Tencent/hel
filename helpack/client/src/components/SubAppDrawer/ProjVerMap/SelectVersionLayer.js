/* eslint-disable */
import { Drawer } from 'antd';
import { VERSION_LIST } from 'configs/constant/ccModule';
import { typeCtxDe, useC2Mod } from 'services/concent';
import AppVersionList from '../AppVersionList';

function setup(c) {
  const ctx = typeCtxDe({}, c);
  const ins = ctx.initState({
    subApp: null,
    visible: false,
  });
  ctx.on('openSelectVersionLayer', (subApp) => {
    ins.setState({ subApp, visible: true });
  });
  ctx.on('closeSelectVersionLayer', () => {
    ins.setState({ visible: false });
  });

  const settings = {
    ins,
    close() {
      ins.setState({ visible: false });
    },
  };
  return settings;
}

function SelectVersionLayer(props) {
  const { settings } = useC2Mod(VERSION_LIST, { setup });
  const { ins } = settings;

  return (
    <Drawer visible={ins.state.visible} width="1200px" onClose={settings.close}>
      <AppVersionList subApp={ins.state.subApp} titleUiMode="noTitle" />
    </Drawer>
  );
}

SelectVersionLayer.displayName = 'SelectVersionLayer';

export default SelectVersionLayer;
