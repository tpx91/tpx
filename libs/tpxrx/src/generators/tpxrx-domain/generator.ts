import {Tree, generateFiles} from '@nrwl/devkit';
import {GeneratorOptions} from './schema';
import {insertActionsContent} from '../common/file-functions/action.functions';
import {insertEffectsContent} from '../common/file-functions/effects.functions';
import {
  insertProjectFacadeContent,
  insertFacadeContent
} from '../common/file-functions/facade.functions';
import {
  insertProjectReducerContent,
  insertReducerContent
} from '../common/file-functions/reducer.functions';
import {insertSelectorsContent} from '../common/file-functions/selectors.functions';
import {insertModuleContent} from '../common/file-functions/module.functions';
import {tpxrxActionNamesArray, tpxrxNames} from '../common/names.functions';
import {decode} from '../common/insert.functions';
import {
  getDomainTemplatePath,
  getModuleFilePath,
  getStateDomainPath,
  getStatePath,
} from '../common/path.functions';
import {getCrudActions, toFormattedNames} from '../common/util.functions';
import {generatorWrapper} from '../common/generator';

export default async function (tree: Tree, schema: GeneratorOptions) {
  return generatorWrapper(tree, schema, generateDomain);
}

export async function generateDomain(tree: Tree, schema: GeneratorOptions) {
  const crud = schema.crud;
  const actions = crud ? getCrudActions(schema.name) : [];
  const projectNs = tpxrxNames(schema.project);
  const domainNs = tpxrxNames(schema.name);
  const actionsNs = tpxrxActionNamesArray(actions);
  const propertyNs = crud ? tpxrxNames(schema.name) : null;

  validate(tree, projectNs, domainNs);

  /*
   * generate domain +state files
   */
  await generateFiles(
    tree,
    getDomainTemplatePath(),
    getStatePath(projectNs),
    {
      ...toFormattedNames(projectNs, 'project'),
      ...toFormattedNames(domainNs, 'domain'),
      tmpl: '',
    }
  );

  insertActionsContent(tree, projectNs, domainNs, actionsNs, propertyNs);
  insertEffectsContent(tree, projectNs, domainNs, actionsNs);
  insertFacadeContent(tree, projectNs, domainNs, actionsNs, propertyNs, crud);
  insertReducerContent(tree, projectNs, domainNs, actionsNs, propertyNs, crud);
  insertSelectorsContent(tree, projectNs, domainNs, actionsNs, propertyNs, crud);
  insertProjectFacadeContent(tree, projectNs, domainNs);
  insertProjectReducerContent(tree, projectNs, domainNs);
  insertModuleContent(tree, projectNs, domainNs);

  decode(tree, projectNs);
}

function validate(tree: Tree, projectNs, domainNs) {
  if (!tree.exists(getModuleFilePath(projectNs, 'module.ts'))) {
    throw new Error(`project module file ${projectNs.name} not found`);
  }
  if (tree.children(getStateDomainPath(projectNs, domainNs)).length > 0) {
    throw new Error(`domain ${domainNs.name} already exists`);
  }
}
