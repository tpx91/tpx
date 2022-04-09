import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getTemplate, getTemplatePath} from './template.functions';
import {getActionPropertiesAsListTemplate, getActionPropertiesAsParamsTemplate} from './template-actions.functions';
import {isActionTypeReset} from '../util.functions';

export function getFacadeFunctionTemplate(tree: Tree, domainNs: Names, actionNs: Names, propertyNs: Names): string {
  return isActionTypeReset(actionNs) ?
    getTemplate(tree, getTemplatePath('facade', 'facade-function-resets'), {
      domainClassName: domainNs?.className,
      actionPropertyName: actionNs?.propertyName,
    }) :
    getTemplate(tree, getTemplatePath('facade', 'facade-function'), {
      domainClassName: domainNs?.className,
      actionPropertyName: actionNs?.propertyName,
      propertiesAsParams: getActionPropertiesAsParamsTemplate(tree, propertyNs, actionNs?.actionType, 'default'),
      propertiesAsList: getActionPropertiesAsListTemplate(tree, propertyNs, actionNs?.actionType, 'default'),
    });
}

export function getFacadeObservableTemplate(tree: Tree, domainNs: Names, actionNs: Names): string {
  return getTemplate(tree, getTemplatePath('facade', 'facade-observable'), {
    domainClassName: domainNs?.className,
    actionClassName: actionNs?.className,
    actionPropertyName: actionNs?.propertyName,
  });
}

export function getProjectFacadeAssignmentTemplate(tree: Tree, domainNs: Names): string {
  return getTemplate(tree, getTemplatePath('facade', 'project-facade-assignment'), {
    domainPropertyName: domainNs?.propertyName,
  });
}

export function getProjectFacadeDeclarationTemplate(tree: Tree, domainNs: Names): string {
  return getTemplate(tree, getTemplatePath('facade', 'project-facade-declaration'), {
    domainPropertyName: domainNs?.propertyName,
    domainClassName: domainNs?.className,
  });
}

export function getProjectFacadeParamTemplate(tree: Tree, domainNs: Names): string {
  return getTemplate(tree, getTemplatePath('facade', 'project-facade-param'), {
    domainPropertyName: domainNs?.propertyName,
    domainClassName: domainNs?.className,
  });
}
