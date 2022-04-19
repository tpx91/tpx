import {Tree} from '@nrwl/devkit';
import {getInitialState, getOns, getRegexMatch, getState, isActionTypeReset,} from '../util.functions';
import {ActionType, Names} from '../names';
import {insertImport} from '@nrwl/workspace/src/generators/utils/insert-import';
import {getStateDomainFilePath, getStateProjectFilePath} from '../path.functions';
import {
  getProjectReducerInitialStateTemplate,
  getProjectReducerOnsTemplate,
  getReducerActionDeclarationGroupTemplate,
  getReducerDeclarationTemplate,
  getReducerOnsGroupTemplate, getReducerResetAssetsGroupTemplate
} from '../template-functions/template-reducer.functions';
import {insertItems, insertItemsAfterRegex, insertItemsBeforeRegex} from '../insert.functions';
import {
  PROJECT_REDUCER_CREATE_REGEX,
  PROJECT_REDUCER_INITIAL_STATE_REGEX,
  PROJECT_REDUCER_STATE_WITH_EXTENDS_REGEX,
  PROJECT_REDUCER_STATE_WITHOUT_EXTENDS_REGEX,
  REDUCER_ONS_REGEX,
  REDUCER_RESET_ASSETS_REGEX,
  REDUCER_STATE_REGEX
} from '../regexp';
import {tpxrxPluralNames} from '../names.functions';

export function insertReducerContent(tree: Tree, projectNs: Names, domainNs: Names, actionsNs: Names[], propertyNs: Names, crud: boolean) {
  const reducerPath = getStateDomainFilePath(projectNs, domainNs, 'reducer.ts');
  const reducerResetsPath = getStateDomainFilePath(projectNs, domainNs, 'reducer.resets.ts');

  let propertyDeclarations = [];
  if (propertyNs && crud) {
    propertyDeclarations = [
      getReducerDeclarationTemplate(tree, propertyNs),
      getReducerDeclarationTemplate(tree, tpxrxPluralNames(propertyNs.name)),
    ];
  } else if (propertyNs) {
    propertyDeclarations = [
      getReducerDeclarationTemplate(tree, propertyNs),
    ];
  }

  const actionDeclarations = actionsNs
    .filter(a => !isActionTypeReset(a))
    .reduce((result, actionNs) => {
      return [
        ...result,
        getReducerActionDeclarationGroupTemplate(tree, actionNs),
      ]
    }, []);

  const ons = actionsNs
    .filter(a => !isActionTypeReset(a))
    .map((actionNs) => getReducerOnsGroupTemplate(tree, projectNs, domainNs, actionNs, propertyNs));

  const resetOns = actionsNs
    .filter(a => isActionTypeReset(a))
    .map((actionNs) =>
      actionNs.actionType === ActionType.RESET ?
        getReducerOnsGroupTemplate(tree, projectNs, domainNs, actionNs, propertyNs) :
        getReducerOnsGroupTemplate(tree, projectNs, domainNs, actionNs, tpxrxPluralNames(propertyNs.name))
    );

  const resetAssetsProperties = actionsNs
    .filter(a => !isActionTypeReset(a))
    .map((actionNs) => getReducerResetAssetsGroupTemplate(tree, actionNs));

  insertItems(tree, reducerPath, propertyDeclarations, REDUCER_STATE_REGEX, '{', '}', '');
  insertItems(tree, reducerPath, actionDeclarations, REDUCER_STATE_REGEX, '{', '}', '');
  insertItems(tree, reducerPath, ons, REDUCER_ONS_REGEX, '[', ']', '\n\n');
  insertItemsBeforeRegex(tree, reducerResetsPath, resetOns, REDUCER_RESET_ASSETS_REGEX, '\n\n');
  insertItems(tree, reducerResetsPath, resetAssetsProperties, REDUCER_RESET_ASSETS_REGEX, '{', '}', ',');
}

export function insertProjectReducerContent(tree: Tree, projectNs: Names, domainNs: Names) {
  const projectReducerPath = getStateProjectFilePath(projectNs, 'reducer.ts');

  const stateInterfaces = [getState(domainNs.className)];
  const initialStates = [getProjectReducerInitialStateTemplate(tree, domainNs)];
  const ons = [getProjectReducerOnsTemplate(tree, domainNs)];

  const hasExtends = getRegexMatch(projectReducerPath, tree.read(projectReducerPath).toString(), PROJECT_REDUCER_STATE_WITH_EXTENDS_REGEX, true);
  if (!hasExtends) {
    insertItemsAfterRegex(tree, projectReducerPath, ['extends'], PROJECT_REDUCER_STATE_WITHOUT_EXTENDS_REGEX, ' ');
  }
  insertItems(tree, projectReducerPath, stateInterfaces, PROJECT_REDUCER_STATE_WITH_EXTENDS_REGEX, '}', '{', ',');
  insertItems(tree, projectReducerPath, initialStates, PROJECT_REDUCER_INITIAL_STATE_REGEX, '{', '}', ',');
  insertItems(tree, projectReducerPath, ons, PROJECT_REDUCER_CREATE_REGEX, '(', ')', ',');
  insertProjectReducerImport(tree, projectNs, domainNs);
}

export function insertProjectReducerImport(tree: Tree, projectNs: Names, domainNs: Names) {
  insertImport(
    tree,
    getStateProjectFilePath(projectNs, 'reducer.ts'),
    `${getState(domainNs.className)}, ${getInitialState(domainNs.propertyName)}, ${getOns(domainNs.className)}`,
    `./${domainNs.fileName}/${domainNs.fileName}.reducer`,
  );
}
