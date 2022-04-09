import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getFacade, getFailure, getPending, getSuccess, isActionTypeReset, toPural} from '../util.functions';
import {
  CONSTRUCTOR_CONTENT_REGEX,
  CONSTRUCTOR_INJECTION_REGEX,
  CONSTRUCTOR_REGEX,
  FACADE_FUNCTION_REGEX,
  FACADE_RESET_ASSETS_REGEX
} from '../regexp';
import {getStateProjectFilePath, getStateDomainFilePath} from '../path.functions';
import {
  getProjectFacadeAssignmentTemplate,
  getProjectFacadeDeclarationTemplate, getProjectFacadeParamTemplate,
  getFacadeFunctionTemplate,
  getFacadeObservableTemplate
} from '../template-functions/template-facade.functions';
import {insertItems, insertItemsBeforeRegex} from '../insert.functions';
import {tpxrxNames} from '../names.functions';
import {insertImport} from '@nrwl/workspace/src/generators/utils/insert-import';

export function insertFacadeContent(tree: Tree, projectNs: Names, domainNs: Names, actionsNs: Names[], propertyNs: Names, crud: boolean) {
  const facadePath = getStateDomainFilePath(projectNs, domainNs, 'facade.ts');
  const facadeResetsPath = getStateDomainFilePath(projectNs, domainNs, 'facade.resets.ts');

  let propertyObservables = [];
  if (propertyNs && crud) {
    propertyObservables = [
      getFacadeObservableTemplate(tree, domainNs, propertyNs),
      getFacadeObservableTemplate(tree, domainNs, tpxrxNames(toPural(propertyNs.name))),
    ];
  } else if (propertyNs) {
    propertyObservables = [
      getFacadeObservableTemplate(tree, domainNs, propertyNs),
    ];
  }
  const actionObservables = actionsNs
    .filter((a) => !isActionTypeReset(a))
    .reduce((result, actionNs) => {
      const pendingActionNs = tpxrxNames(getPending(actionNs.name), actionNs.actionType);
      const successActionNs = tpxrxNames(getSuccess(actionNs.name), actionNs.actionType);
      const failureActionNs = tpxrxNames(getFailure(actionNs.name), actionNs.actionType);
      return [
        ...result,
        getFacadeObservableTemplate(tree, domainNs, pendingActionNs),
        getFacadeObservableTemplate(tree, domainNs, successActionNs),
        getFacadeObservableTemplate(tree, domainNs, failureActionNs),
      ]
    }, []);

  const actionFunctions = actionsNs
    .filter((a) => !isActionTypeReset(a))
    .map((actionNs) => getFacadeFunctionTemplate(tree, domainNs, actionNs, propertyNs));

  const actionResetFunctions = actionsNs
    .filter((a) => isActionTypeReset(a))
    .map((actionNs) => getFacadeFunctionTemplate(tree, domainNs, actionNs, propertyNs));

  insertItemsBeforeRegex(tree, facadePath, propertyObservables, FACADE_FUNCTION_REGEX, '');
  insertItemsBeforeRegex(tree, facadePath, actionObservables, FACADE_FUNCTION_REGEX, '');
  insertItemsBeforeRegex(tree, facadePath, actionFunctions, CONSTRUCTOR_REGEX, '\n\n');
  insertItemsBeforeRegex(tree, facadeResetsPath, actionResetFunctions, FACADE_RESET_ASSETS_REGEX, '\n\n');
}

export function insertProjectFacadeContent(tree: Tree, projectNs: Names, domainNs: Names) {
  const path = getStateProjectFilePath(projectNs, 'facade.ts');

  const domainFacadeDeclarations = [getProjectFacadeDeclarationTemplate(tree, domainNs)];
  const domainFacadeInjections = [getProjectFacadeParamTemplate(tree, domainNs)];
  const domainFacadeAssignments = [getProjectFacadeAssignmentTemplate(tree, domainNs)];

  insertItemsBeforeRegex(tree, path, domainFacadeDeclarations, CONSTRUCTOR_REGEX, '\n\n');
  insertItems(tree, path, domainFacadeInjections, CONSTRUCTOR_INJECTION_REGEX, '(', ')', ',');
  insertItems(tree, path, domainFacadeAssignments, CONSTRUCTOR_CONTENT_REGEX, '{', '}', '');
  insertProjectFacadeImport(tree, projectNs, domainNs);
}

export function insertProjectFacadeImport(tree: Tree, projectNs: Names, domainNs: Names) {
  insertImport(
    tree,
    getStateProjectFilePath(projectNs, 'facade.ts'),
    `${getFacade(domainNs.className)}`,
    `./${domainNs.fileName}/${domainNs.fileName}.facade`,
  );
}
