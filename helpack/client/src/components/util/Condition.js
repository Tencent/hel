// import React from 'react';

export default function ({ setIf, t = '', f = '' }) {
  return setIf ? t : f;
}
