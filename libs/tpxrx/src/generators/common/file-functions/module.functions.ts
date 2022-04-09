import {Tree} from '@nrwl/devkit';
import {MODULE_EFFECTS_REGEX, MODULE_PROVIDERS_REGEX} from '../regexp';
import {getEffects, getFacade} from '../util.functions';
import {insertImport} from '@nrwl/workspace/src/generators/utils/insert-import';
import {getModuleFilePath} from '../path.functions';
import {Names} from '../names';
import {insertItems} from '../insert.functions';

export function insertModuleContent(tree: Tree, projectNs: Names, domainNs: Names) {
  const path = getModuleFilePath(projectNs, 'module.ts');

  const newEffectsItems = [
    getEffects(domainNs.className),
  ];

  const newFacadeItems = [
    getFacade(domainNs.className),
  ];

  insertItems(tree, path, newEffectsItems, MODULE_EFFECTS_REGEX, '[', ']', ',');
  insertItems(tree, path, newFacadeItems, MODULE_PROVIDERS_REGEX, '[', ']', ',');
  insertModuleImports(tree, projectNs, domainNs);
}

export function insertModuleImports(tree: Tree, projectNs: Names, domainNs: Names) {
  insertImport(
    tree,
    getModuleFilePath(projectNs, 'module.ts'),
    getFacade(domainNs.className),
    `./+state/${domainNs.fileName}/${domainNs.fileName}.facade`,
  );
  insertImport(
    tree,
    getModuleFilePath(projectNs, 'module.ts'),
    getEffects(domainNs.className),
    `./+state/${domainNs.fileName}/${domainNs.fileName}.effects`
  );
}
