const stDot = { display: 'inline-block', width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'darkgray', margin: '0 2px' };

export function MoreUser() {
  return (
    <td align="center">
      <div style={stDot}></div>
      <div style={stDot}></div>
      <div style={stDot}></div>
    </td>
  );
}

export function User(props) {
  const { site, logo, label } = props;
  return (
    <td align="center" style={{ padding: '12px' }}>
      <a href={site} target="_blank" rel="noopener noreferrer">
        <img width="60px;" height="60px" src={logo}></img>
      </a>
      <br />
      <a target="_blank" href={site} rel="noopener noreferrer">
        <b>{label}</b>
      </a>
    </td>
  );
}
