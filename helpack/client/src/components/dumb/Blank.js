/* eslint-disable react/prop-types */

const Blank = ({ children = '', type = 'horizon', height = '22px', width = '28px', style = {} }) => {
  const mergedStyle = { display: 'inline-block', width, height, ...style };
  if (type === 'vertical') mergedStyle.display = 'block';

  return <div style={mergedStyle}>{children}</div>;
};

export const NormalBlank = (props) => <Blank {...{ width: '8px', ...props }} />;
export const VerticalBlank = (props) => <Blank {...{ type: 'vertical', ...props }} />;

export const NormalSpanBlank = ({ width = '8px', style = {}, children = '' }) => {
  const mergedStyle = { paddingRight: width, ...style };
  return <span style={mergedStyle}>{children}</span>;
};

export default Blank;
