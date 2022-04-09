import {Tree} from '@nrwl/devkit';
import {ActionSuffix, ActionType, Names} from '../names';
import {getTemplate, getTemplatePath} from './template.functions';
import {isActionTypeReset, toArray, toPural} from '../util.functions';

export function getActionGroupTemplate(tree: Tree, projectNs: Names, domainNs: Names, actionNs: Names, propertyNs: Names) {
  return isActionTypeReset(actionNs) ?
    getTemplate(tree, getTemplatePath('actions', 'action-group-one'), {
      actionPropertyName: actionNs?.propertyName,
      action1: getActionTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'default'),
    }) :
    getTemplate(tree, getTemplatePath('actions', 'action-group-three'), {
      actionPropertyName: actionNs?.propertyName,
      action1: getActionTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'default'),
      action2: getActionTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'success'),
      action3: getActionTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'failure'),
    });
}

export function getActionTemplate(tree: Tree, projectNs: Names, domainNs: Names, actionNs: Names, propertyNs: Names, actionSuffix: ActionSuffix) {
  switch (actionNs?.actionType) {
    case ActionType.RESET:
    case ActionType.RESET_ALL:
      return getTemplate(tree, getTemplatePath('actions', 'action-reset'), {
        projectClassName: projectNs?.className,
        actionPropertyName: actionNs?.propertyName,
      });
    case ActionType.UNDEFINED:
      return getTemplate(tree, getTemplatePath('actions', `action-undefined-${actionSuffix}`), {
        projectClassName: projectNs?.className,
        actionPropertyName: actionNs?.propertyName,
      });
    default:
      return getTemplate(tree, getTemplatePath('actions', `action-${actionSuffix}`), {
        projectClassName: projectNs?.className,
        actionPropertyName: actionNs?.propertyName,
        properties: getActionPropertiesAsDeclarationsTemplate(tree, propertyNs, actionNs?.actionType, actionSuffix)
      });
  }
}

export function getActionPropertiesAsListTemplate(tree: Tree, propertyNs: Names, actionType: ActionType, actionSuffix: ActionSuffix): string {
  return getTemplate(tree, getTemplatePath('actions/list', `${actionType?.toLowerCase()}-${actionSuffix}`), {
    propertyPropertyName: propertyNs?.propertyName,
    propertyClassName: propertyNs?.className,
    pluralPropertyPropertyName: toPural(propertyNs?.propertyName),
    pluralPropertyClassName: toArray(propertyNs?.className),
  });
}

export function getActionPropertiesAsParamsTemplate(tree: Tree, propertyNs: Names, actionType: ActionType, actionSuffix: ActionSuffix): string {
  return getTemplate(tree, getTemplatePath('actions/params', `${actionType.toLowerCase()}-${actionSuffix}`), {
    propertyPropertyName: propertyNs?.propertyName,
    propertyClassName: propertyNs?.className,
    pluralPropertyPropertyName: toPural(propertyNs?.propertyName),
    pluralPropertyClassName: toArray(propertyNs?.className),
  });
}

export function getActionPropertiesAsDeclarationsTemplate(tree: Tree, propertyNs: Names, actionType: ActionType, actionSuffix: ActionSuffix): string {
  return getTemplate(tree, getTemplatePath('actions/declarations', `${actionType.toLowerCase()}-${actionSuffix}`), {
    propertyPropertyName: propertyNs?.propertyName,
    propertyClassName: propertyNs?.className,
    pluralPropertyPropertyName: toPural(propertyNs?.propertyName),
    pluralPropertyClassName: toArray(propertyNs?.className),
  });
}
