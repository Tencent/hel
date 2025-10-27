import * as commonService from 'services/common';

const stPath = { color: 'red' };

export default function NotFound() {
  return (
    <h1>
      404 not found, page <span style={stPath}>/{commonService.getCurrentPage()} </span>is watting to be added!
    </h1>
  );
}
