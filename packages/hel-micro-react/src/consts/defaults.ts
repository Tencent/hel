import * as diff from '../_diff/index';

export const VER = diff.VER;

export default {
  SHADOW_MODE: 'v2',
  SHADOW_HOST_NAME: 'hel-shadow-app',
  SHADOW_BODY_NAME: 'hel-shadow-body',
  STATIC_SHADOW_BODY_NAME: 'hel-static-shadow-body',
  SHADOW: true,
  SET_STYLE_AS_STRING: true,
  ENABLE_APPEND_CSS: true,
  H1_STYLE: { color: 'red' },
} as const;
