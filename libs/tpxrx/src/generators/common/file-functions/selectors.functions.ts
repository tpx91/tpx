import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getFailure, getPending, getSuccess, isActionTypeReset, toPural} from '../util.functions';
import {getStateDomainFilePath} from '../path.functions';
import {getSelectorTemplate} from '../template-functions/template-selectors.functions';
import {tpxrxNames} from '../names.functions';
import {insertItemsToFileEnd} from '../insert.functions';

export function insertSelectorsContent(tree: Tree, projectNs: Names, domainNs: Names, actionsNs: Names[], propertyNs: Names, crud: boolean) {
  const path = getStateDomainFilePath(projectNs, domainNs, 'selectors.ts');

  let propertySelectors = [];
  if (propertyNs && crud) {
    propertySelectors = [
      getSelectorTemplate(tree, projectNs, propertyNs),
      getSelectorTemplate(tree, projectNs, tpxrxNames(toPural(propertyNs.name))),
    ];
  } else if (propertyNs) {
    propertySelectors = [
      getSelectorTemplate(tree, projectNs, propertyNs),
    ];
  }

  const actionSelectors = actionsNs
    .filter(a => !isActionTypeReset(a))
    .reduce((result, actionNs) => {
      const pendingActionNs = tpxrxNames(getPending(actionNs.name), actionNs.actionType);
      const successActionNs = tpxrxNames(getSuccess(actionNs.name), actionNs.actionType);
      const failureActionNs = tpxrxNames(getFailure(actionNs.name), actionNs.actionType);
      return [
        ...result,
        getSelectorTemplate(tree, projectNs, pendingActionNs),
        getSelectorTemplate(tree, projectNs, successActionNs),
        getSelectorTemplate(tree, projectNs, failureActionNs),
      ]
    }, []);

  insertItemsToFileEnd(tree, path, propertySelectors, '\n\n');
  insertItemsToFileEnd(tree, path, actionSelectors, '\n\n');
}
