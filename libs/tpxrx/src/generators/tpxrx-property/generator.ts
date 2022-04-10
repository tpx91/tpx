import {Tree} from '@nrwl/devkit';
import {GeneratorOptions} from './schema';
import {Action, ActionType, Names} from '../common/names';
import {insertActionsContent} from '../common/file-functions/action.functions';
import {getRegexMatch, toSingular} from '../common/util.functions';
import {REDUCER_STATE_CONTENT_REGEX} from '../common/regexp';
import {tpxrxActionNamesArray, tpxrxNames, tpxrxPluralNames} from '../common/names.functions';
import {insertFacadeContent} from '../common/file-functions/facade.functions';
import {insertReducerContent} from '../common/file-functions/reducer.functions';
import {insertSelectorsContent} from '../common/file-functions/selectors.functions';
import {getModuleFilePath, getStateDomainFilePath, getStateDomainPath} from '../common/path.functions';
import {generatorWrapper} from '../common/generator';

export default async function (tree: Tree, schema: GeneratorOptions) {
  return generatorWrapper(tree, schema, generateProperty);
}

export async function generateProperty(tree: Tree, schema: GeneratorOptions) {
  const array = schema.array;
  const action: Action = {
    name: `reset-${schema.name}`,
    type: ActionType.RESET
  };
  const projectNs = tpxrxNames(schema.project);
  const domainNs = tpxrxNames(schema.domain);
  const propertyNs = tpxrxNames(schema.name);
  const propertyBaseNs = tpxrxNames(toSingular(schema.name));
  const propertyArrayNs = array ? tpxrxPluralNames(propertyBaseNs.name) : propertyNs;
  const actionsNs = tpxrxActionNamesArray([action]);

  validate(tree, projectNs, domainNs, propertyNs, array);

  insertActionsContent(tree, projectNs, domainNs, actionsNs, propertyArrayNs);
  insertFacadeContent(tree, projectNs, domainNs, actionsNs, propertyNs, false);
  insertReducerContent(tree, projectNs, domainNs, actionsNs, propertyArrayNs, false);
  insertSelectorsContent(tree, projectNs, domainNs, actionsNs, propertyNs, false);
}

function validate(tree: Tree, projectNs: Names, domainNs: Names, propertyNs: Names, array: boolean) {
  if (!tree.exists(getModuleFilePath(projectNs, 'module.ts'))) {
    throw new Error(`project module file ${projectNs.name} not found`);
  }
  if (!tree.children(getStateDomainPath(projectNs, domainNs))?.length) {
    throw new Error(`domain ${domainNs.name} does not exists`);
  }
  if (array && !propertyNs.name.endsWith('List')) {
    throw new Error(`array property name has to end with List, e.g. ${propertyNs.propertyName}List`);
  }

  const path = getStateDomainFilePath(projectNs, domainNs, 'reducer.ts');
  const content = tree.read(path).toString();

  const stateDeclaration = getRegexMatch(path, content, REDUCER_STATE_CONTENT_REGEX, true);
  const propertyNameRegex = new RegExp(`${propertyNs.propertyName}\\??:\\s*\\w+(\\[\\])?\\s*;`, 'g');
  if (stateDeclaration.match(propertyNameRegex)) {
    throw new Error(`property ${propertyNs.propertyName} already exists`);
  }
}
