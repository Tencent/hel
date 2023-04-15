import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';

export { useObject, useService, useForceUpdate };

const toExport = {
  useObject,
  useService,
  useForceUpdate,
};

export default toExport;
