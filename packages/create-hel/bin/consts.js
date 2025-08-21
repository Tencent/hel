const CMD_TYPE = {
  init: '.init',
};

const CMD_TYPE_LIST = Object.keys(CMD_TYPE).map((key) => CMD_TYPE[key]);

module.exports = {
  TEMPLATE_REACT_MONO: 'react-mono',
  CLI_KEYWORD: 'hel',
  CLI_FULL_KEYWORD: 'create-hel',
  HEL_MONO_TEMPLATES: 'hel-mono-templates',
  REPO_URL_PREFIX: 'https://github.com/hel-eco/',
  CMD_TYPE,
  CMD_TYPE_LIST,
};
