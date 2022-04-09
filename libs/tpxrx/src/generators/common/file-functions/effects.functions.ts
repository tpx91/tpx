import {Tree} from '@nrwl/devkit';
import {CONSTRUCTOR_INJECTION_REGEX, CONSTRUCTOR_REGEX} from '../regexp';
import {Names} from '../names';
import {insertItems, insertItemsBeforeRegex} from '../insert.functions';
import {getEffectsInjectionTemplate, getEffectTemplate} from '../template-functions/template-effects.functions';
import {getStateDomainFilePath} from '../path.functions';
import {isActionTypeReset} from '../util.functions';

export function insertEffectsContent(tree: Tree, projectNs: Names, domainNs: Names, actionsNs: Names[]) {
  const path = getStateDomainFilePath(projectNs, domainNs, 'effects.ts');

  const effects = actionsNs
    .filter(a => !isActionTypeReset(a))
    .map((actionNs) => getEffectTemplate(tree, domainNs, actionNs));

  const injections = [getEffectsInjectionTemplate(tree, domainNs)];

  insertItemsBeforeRegex(tree, path, effects, CONSTRUCTOR_REGEX, '\n\n');
  insertItems(tree, path, injections, CONSTRUCTOR_INJECTION_REGEX, '(', ')', ',', true);
}

