/* eslint-disable react/prop-types */
import React from 'react';
import { IconWrap } from './styled';

const st = { color: 'white', margin: '12px', fontSize: '14px' };

/**
 * @param {object} props
 * @param {(e:React.MouseEvent)=void} props.onMouseEnter
 * @param {(e:React.MouseEvent)=void} props.onMouseLeave
 */
export default function BarItem({ onMouseEnter, onMouseLeave, icon, label, ...rest }) {
  return (
    <div className="gHover" {...rest} style={st} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <IconWrap>{icon}</IconWrap>
      {label}
    </div>
  );
}
