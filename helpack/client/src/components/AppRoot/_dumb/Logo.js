/* eslint-disable react/prop-types */
import { ICON_HEL } from 'configs/constant';

export default function Logo({ onClick }) {
  return <img className="gHover" witdh="36" height="36" alt="logo" onClick={onClick} src={ICON_HEL} />;
}
