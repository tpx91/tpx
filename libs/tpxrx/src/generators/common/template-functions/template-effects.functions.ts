import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getTemplate, getTemplatePath} from './template.functions';

export function getEffectTemplate(tree: Tree, domainNs: Names, actionNs: Names): string {
  return getTemplate(tree, getTemplatePath('effects', 'effect'), {
    domainPropertyName: domainNs?.propertyName,
    domainClassName: domainNs?.className,
    actionPropertyName: actionNs?.propertyName,
  });
}

export function getEffectsInjectionTemplate(tree: Tree, domainNs: Names): string {
  return getTemplate(tree, getTemplatePath('effects', 'effects-injection'), {
    domainPropertyName: domainNs?.propertyName,
    domainClassName: domainNs?.className,
  });
}
