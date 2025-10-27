/* eslint-disable react/prop-types */
import Discover from 'components/icon/Discover';

const stBox = { padding: '32px', color: 'white' };
const stKeyword = { color: '#007acd' };
const stBtnBox = { lineHeight: '26px', border: 'dashed 1px white' };
const stBtnLabel = { transform: 'translateY(4px)' };

export default function ({ keyword = '', onClick, ...rest }) {
  return (
    <div style={stBox} {...rest}>
      暂无<span style={stKeyword}>{keyword}</span>
      <br />
      去应用市场逛一逛吧^_^
      <div className="gMenuItemHoverBlue" onClick={onClick} style={stBtnBox}>
        <Discover style={stBtnLabel} /> 开始探索
      </div>
    </div>
  );
}
