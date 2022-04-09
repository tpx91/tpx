import {joinPathFragments, Tree} from '@nrwl/devkit';
import * as fs from 'fs';

const TEMPLATE_VAR_REGEX = '<%=\\s*{key}\\s*%>';
const TEMPLATE_VAR_REGEX_2 = '<%=\\s*\\w+\\s*%>';

export function getTemplate(tree: Tree, templatePath: string, substitutions: { [key: string]: string }): string {
  const template = fs.readFileSync(templatePath).toString().trim();
  const result = Object.keys(substitutions || {}).reduce((r, k) => {
    const regexpString = TEMPLATE_VAR_REGEX.replace('{key}', k);
    const regexp = new RegExp(regexpString, 'g');
    return r.replace(regexp, substitutions[k]);
  }, template);

  const errorMatches = result.match(TEMPLATE_VAR_REGEX_2);
  if (errorMatches) {
    throw new Error(`tempate vars ${errorMatches.join(', ')} not defined`);
  }

  return result;
}

export function getTemplatePath(dir: string, filename: string): string {
  return joinPathFragments(__dirname, '..', '..', 'templates', 'content-templates', dir, `${filename}.template.txt`);
}
