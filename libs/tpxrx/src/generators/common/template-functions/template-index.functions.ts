import {Tree} from '@nrwl/devkit';
import {Names} from '../names';
import {getTemplate, getTemplatePath} from './template.functions';

export function getIndexTemplate(tree: Tree, projectNs: Names): string {
  return getTemplate(tree, getTemplatePath('index', 'index'), {
    projectFileName: projectNs?.fileName,
  });
}
