import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getTemplate, getTemplatePath} from './template.functions';

export function getSelectorTemplate(tree: Tree, projectNs: Names, selectorNs: Names) {
  return getTemplate(tree, getTemplatePath('selectors', 'selector'), {
    projectClassName: projectNs?.className,
    selectorClassName: selectorNs?.className,
    selectorPropertyName: selectorNs?.propertyName,
  });
}
