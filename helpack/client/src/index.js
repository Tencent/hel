import { message } from 'antd';
import AppRoot from 'components/AppRoot';
import 'configs/before-init';
import { HEL_CHARGER } from 'configs/constant';
import ReactDOM from 'react-dom';
import 'styles/appStyles.css';

message.config({
  duration: 2,
  top: 38,
});

async function main() {
  ReactDOM.render(<AppRoot />, document.getElementById('app-manager-root'));
}

main().catch((err) => {
  console.error(err);
  alert(`err: ${err.message}, contact ${HEL_CHARGER}`);
});
