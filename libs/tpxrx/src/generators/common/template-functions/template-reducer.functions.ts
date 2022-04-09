import {Tree} from '@nrwl/devkit';
import {ActionSuffix, Names} from '../names';
import {getTemplate, getTemplatePath} from './template.functions';
import {isActionTypeReset, toPural} from '../util.functions';

export function getReducerOnsGroupTemplate(tree: Tree, projectNs: Names, domainNs: Names, actionNs: Names, propertyNs: Names): string {
  return isActionTypeReset(actionNs) ?
    getTemplate(tree, getTemplatePath('reducer', 'ons-group-one'), {
      actionPropertyName: actionNs?.propertyName,
      ons1: getReducerOnsTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'default')
    }) :
    getTemplate(tree, getTemplatePath('reducer', 'ons-group-three'), {
      actionPropertyName: actionNs?.propertyName,
      ons1: getReducerOnsTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'default'),
      ons2: getReducerOnsTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'success'),
      ons3: getReducerOnsTemplate(tree, projectNs, domainNs, actionNs, propertyNs, 'failure'),
    });
}

export function getReducerOnsTemplate(tree: Tree, projectNs: Names, domainNs: Names, actionNs: Names, propertyNs: Names, actionSuffix: ActionSuffix): string {
  return getTemplate(tree, getTemplatePath('reducer/ons', `ons-${actionNs.actionType.toLowerCase()}-${actionSuffix}`), {
    domainClassName: domainNs?.className,
    actionPropertyName: actionNs?.propertyName,
    propertyPropertyName: propertyNs?.propertyName,
    pluralPropertyPropertyName: toPural(propertyNs?.propertyName),
  });
}

export function getReducerDeclarationTemplate(tree: Tree, propertyNs: Names): string {
  return getTemplate(tree, getTemplatePath('reducer', 'declaration'), {
    propertyPropertyName: propertyNs?.propertyName,
    propertyClassName: propertyNs?.className,
  });
}

export function getReducerActionDeclarationGroupTemplate(tree: Tree, actionNs: Names): string {
  return getTemplate(tree, getTemplatePath('reducer', 'action-declaration-group'), {
    actionPropertyName: actionNs?.propertyName,
  });
}


export function getReducerResetAssetsGroupTemplate(tree: Tree, actionNs: Names): string {
  return getTemplate(tree, getTemplatePath('reducer', 'reset-assets-group'), {
    actionPropertyName: actionNs?.propertyName,
  });
}

export function getProjectReducerInitialStateTemplate(tree: Tree, domainNs: Names): string {
  return getTemplate(tree, getTemplatePath('reducer', 'project-reducer-initial-state'), {
    domainPropertyName: domainNs?.propertyName,
  });
}
export function getProjectReducerOnsTemplate(tree: Tree, domainNs: Names): string {
  return getTemplate(tree, getTemplatePath('reducer', 'project-reducer-ons'), {
    domainClassName: domainNs?.className,
  });
}
