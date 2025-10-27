import React from 'react';

const stFooter = {
  textAlign: 'center',
  padding: '5px',
  height: '45px',
};

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div style={stFooter}>
      Copyright @ {year} 腾讯微前端oteam, Powered by{' '}
      <a href="https://github.com/tnfe/hel" target="_blank" rel="noopener noreferrer">
        hel-micro
      </a>
      、
      <a href="https://github.com/concentjs/concent" target="_blank" rel="noopener noreferrer">
        concent
      </a>
      、
      <a href="https://github.com/facebook/react" target="_blank" rel="noopener noreferrer">
        react
      </a>
    </div>
  );
};

export default React.memo(Footer);
