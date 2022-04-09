import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getActionGroupTemplate} from '../template-functions/template-actions.functions';
import {insertItemsBeforeRegex, insertItemsToFileEnd} from '../insert.functions';
import {ACTION_RESET_ASSETS_REGEX} from '../regexp';
import {getStateDomainFilePath} from '../path.functions';
import {isActionTypeReset} from '../util.functions';

export function insertActionsContent(tree: Tree, projectNs: Names, domainNs: Names, actionsNs: Names[], propertyNs: Names) {
  const actionsPath = getStateDomainFilePath(projectNs, domainNs, 'actions.ts');
  const actionsResetsPath = getStateDomainFilePath(projectNs, domainNs, 'actions.resets.ts');

  const actionGroups = actionsNs
    .filter(a => !isActionTypeReset(a))
    .map((actionNs) => getActionGroupTemplate(tree, projectNs, domainNs, actionNs, propertyNs));

  const resetActionGroups = actionsNs
    .filter(a => isActionTypeReset(a))
    .map((actionNs) => getActionGroupTemplate(tree, projectNs, domainNs, actionNs, propertyNs));

  insertItemsToFileEnd(tree, actionsPath, actionGroups, '\n\n');
  insertItemsBeforeRegex(tree, actionsResetsPath, resetActionGroups, ACTION_RESET_ASSETS_REGEX, '\n\n');
}
