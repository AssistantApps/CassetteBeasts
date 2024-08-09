import { CommonModule } from 'modules/commonModule';

export const validateModules = (modules: Array<CommonModule<unknown, unknown>>): boolean => {
  const types = modules.map((mod) => mod.type);
  if (new Set(types).size !== types.length) {
    console.error('Duplicate ModuleType!');
    return false;
  }

  return true;
};
