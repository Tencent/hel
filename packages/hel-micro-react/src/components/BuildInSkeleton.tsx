import React from 'react';

const boxStyle = { padding: '8px 16px', width: '100%' };
const barStyle = { backgroundColor: 'lightgrey', width: '100%', height: '19px', margin: '16px 0' };
const halfBarStyle = { ...barStyle, width: '50%' };

/**
 * 内置的骨架屏组件
 * @returns
 */
export default function BuildInSkeleton() {
  return (
    <div style={boxStyle}>
      <div style={halfBarStyle} />
      <div style={barStyle} />
      <div style={barStyle} />
      <div style={barStyle} />
      <div style={barStyle} />
      <div style={barStyle} />
    </div>
  );
}
