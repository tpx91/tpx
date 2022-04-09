import {GeneratorOptions} from './schema';
import {Action, ActionType, Names} from '../common/names';
import {insertActionsContent} from '../common/file-functions/action.functions';
import {insertEffectsContent} from '../common/file-functions/effects.functions';
import {insertFacadeContent} from '../common/file-functions/facade.functions';
import {insertReducerContent} from '../common/file-functions/reducer.functions';
import {insertSelectorsContent} from '../common/file-functions/selectors.functions';
import {tpxrxActionNamesArray, tpxrxNames} from '../common/names.functions';
import {getStateDomainFilePath, getModuleFilePath, getStateDomainPath} from '../common/path.functions';
import {getCrudActions} from '../common/util.functions';
import {generatorWrapper} from '../common/generator';
import {Tree} from '@nrwl/devkit';

export default async function (tree: Tree, schema: GeneratorOptions) {
  return generatorWrapper(tree, schema, generateAction);
}

export async function generateAction(tree: Tree, schema: GeneratorOptions) {
  const crud = schema.crud;
  const actions: Action[] = crud ?
    getCrudActions(schema.name) :
    [{name: schema.name, type: ActionType.UNDEFINED}];
  const projectNs = tpxrxNames(schema.project);
  const domainNs = tpxrxNames(schema.domain);
  const actionsNs = tpxrxActionNamesArray(actions);
  const propertyNs = crud ? tpxrxNames(schema.name) : null;

  validate(tree, projectNs, domainNs, actionsNs);

  insertActionsContent(tree, projectNs, domainNs, actionsNs, propertyNs);
  insertEffectsContent(tree, projectNs, domainNs, actionsNs);
  insertFacadeContent(tree, projectNs, domainNs, actionsNs, propertyNs, crud);
  insertReducerContent(tree, projectNs, domainNs, actionsNs, propertyNs, crud);
  insertSelectorsContent(tree, projectNs, domainNs, actionsNs, propertyNs, crud);
}

function validate(tree: Tree, projectNs: Names, domainNs: Names, actionsNs: Names[]) {
  if (!tree.exists(getModuleFilePath(projectNs, 'module.ts'))) {
    throw new Error(`project module file ${projectNs.name} not found`);
  }
  if (!tree.children(getStateDomainPath(projectNs, domainNs))?.length) {
    throw new Error(`domain ${domainNs.name} does not exists`);
  }

  const actionsContent = tree.read(getStateDomainFilePath(projectNs, domainNs, 'actions.ts')).toString();
  const actionsResetsContent = tree.read(getStateDomainFilePath(projectNs, domainNs, 'actions.resets.ts')).toString();
  const content = actionsContent + actionsResetsContent;

  actionsNs.forEach((actionNs) => {
    const actionName = `export const ${actionNs.propertyName} = createAction(`;
    if (content.includes(actionName)) {
      throw new Error(`action ${actionNs.propertyName} already exists`);
    }
  });
}
