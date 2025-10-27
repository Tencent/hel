/* eslint-disable react/prop-types */
import { IconWrap } from './styled';

export default function BarItem({ onMouseEnter, onMouseLeave, icon, label, ...rest }) {
  return (
    <div className="gHover" {...rest} style={{ color: 'white', margin: '12px' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <IconWrap>{icon}</IconWrap>
      {label}
    </div>
  );
}
