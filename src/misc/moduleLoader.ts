import { ModuleType } from 'constant/module';
import { CommonModule } from 'modules/commonModule';

const debugModuleLoading = false;

export const smartLoadingModules = async (props: {
  langCode: string;
  modules: Array<CommonModule<unknown>>;
  reInitialise?: boolean;
  loadFromJson?: boolean;
}) => {
  const initTasks: Array<Promise<string | void>> = [];
  for (const module of props.modules) {
    if (props.reInitialise == true) {
      module.isReady = false;
    }

    if (props.loadFromJson == true) {
      initTasks.push(module.initFromIntermediate());
    } else {
      initTasks.push(module.init());
    }
  }
  console.log('');
  const initMessages = await Promise.all(initTasks);
  for (const message of initMessages) {
    if (message) console.log(`\t${message}`);
  }

  console.log('\nModules initialised');
  const modulesLoaded: Array<ModuleType> = [];
  for (const module of props.modules) {
    if (module.isReady) {
      modulesLoaded.push(module.type);
    }
  }

  if (debugModuleLoading)
    console.log(`Modules already ready: ${modulesLoaded.map((m) => ModuleType[m]).join(', ')}`);

  console.log('Enriching data\n');
  let loadingAttemptCount = 0;
  let moduleNeedsLoading = false;
  do {
    moduleNeedsLoading = false;
    if (debugModuleLoading) console.log('checkingIfModuleNeedsLoading');
    if (loadingAttemptCount > 30) {
      const unloadedModules: Array<string> = [];
      for (const module of props.modules) {
        if (module.isReady) continue;
        unloadedModules.push(ModuleType[module.type]);
      }
      const unloadedModulesString = unloadedModules.join(', ');
      throw `Too many attempts were performed to load all modules. Probably because of a circular dependency! \nUnloaded modules: ${unloadedModulesString}`;
    }
    for (const module of props.modules) {
      if (module.isReady) continue;

      let requiredModulesAreLoaded = true;
      for (const moduleDependency of module.dependsOn) {
        if (modulesLoaded.includes(moduleDependency) == false) {
          requiredModulesAreLoaded = false;
          break;
        }
      }
      if (requiredModulesAreLoaded) {
        try {
          await module.enrichData(props.langCode, props.modules);
          modulesLoaded.push(module.type);
        } catch (e) {
          console.error('Unable to load modules', e);
        }
      } else {
        moduleNeedsLoading = true;
        const requiredModules = module.dependsOn.filter((d) => modulesLoaded.includes(d) == false);
        if (debugModuleLoading)
          console.log(
            `Module ${ModuleType[module.type]} is waiting for: ${requiredModules
              .map((m) => ModuleType[m])
              .join(', ')}`,
          );
      }
    }
  } while (moduleNeedsLoading);

  if (debugModuleLoading) console.log('combining data');
  for (const module of props.modules) {
    await module.combineData(props.langCode, props.modules);
  }
};
