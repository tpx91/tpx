import {Action, ActionType, Names} from './names';

export function getActions(name: string): string {
  return `${name}Actions`;
}

export function getFacade(name: string): string {
  return `${name}Facade`;
}

export function getEffects(name: string): string {
  return `${name}Effects`;
}

export function getSelectors(name: string): string {
  return `${name}Selectors`;
}

export function getService(name: string): string {
  return `${name}Service`;
}

export function getPending(name: string): string {
  return `${name}Pending`;
}

export function getSuccess(name: string): string {
  return `${name}Success`;
}

export function getFailure(name: string): string {
  return `${name}Failure`;
}

export function getInjection(propertyName: string, className: string): string {
  return `private ${getFacade(propertyName)}: ${getFacade(className)}`;
}

export function getState(className: string): string {
  return `${className}State`;
}

export function getInitialState(propertyName: string): string {
  return `${propertyName}InitialState`;
}

export function getOns(className: string): string {
  return `get${className}Ons`;
}

export function getRegexMatch(path: string, content: string, regexp: RegExp, ignoreError?: boolean): string {
  const regexpMatch = content.match(regexp)?.[0];
  if (!regexpMatch && !ignoreError) {
    throw new Error(`no regexp match found: ${regexp}, ${path}`);
  }
  return regexpMatch;
}

export function findStartIndex(content: string, regex: RegExp): number {
  const search = content.search(regex);
  const match = content.match(regex)?.[0] || '';
  return search + match.length;
}

export function findEndIndex(content: string, startIndex: number, openChar: string, closeChar: string): number {
  let count = 1;
  const contentSubstr = content.substring(startIndex);
  for (let i = 0; i < contentSubstr.length; i++) {
    const c = contentSubstr.charAt(i);
    if (c === openChar) {
      count++;
    }
    if (c === closeChar) {
      count--;
    }
    if (count === 0) {
      return i + startIndex;
    }
  }
  return -1;
}

export function toPural(name: string): string {
  return `${name}List`;
}

export function toPuralFileName(name: string): string {
  return `${name}-list`;
}

export function toSingular(name: string): string {
  return name.endsWith('List') ? name.substring(0, name.length - 4) : name;
}

export function toArray(name: string): string {
  return `${name}[]`;
}

export function toFormattedNames(names: Names, format: 'project' | 'domain'): {[key: string]: string} {
  return Object.keys(names).reduce((r, k) => ({
    ...r,
    [`${format}${firstLetterUppercase(k)}`]: names[k],
  }), {});
}

export function firstLetterUppercase(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.substring(1)}`;
}

export function getCrudActions(actionName: string): Action[] {
  return [
    {
      name: toPuralFileName(`load-${actionName}`),
      type: ActionType.LOAD_ALL
    },
    {
      name: `load-${actionName}ById`,
      type: ActionType.LOAD_BY_ID
    },
    {
      name: `create-${actionName}`,
      type: ActionType.CREATE
    },
    {
      name: `update-${actionName}`,
      type: ActionType.UPDATE
    },
    {
      name: `delete-${actionName}`,
      type: ActionType.DELETE
    },
    {
      name: `reset-${actionName}`,
      type: ActionType.RESET
    },
    {
      name: toPuralFileName(`reset-${actionName}`),
      type: ActionType.RESET_ALL
    },
  ];
}

export function isActionTypeReset(actionNs: Names): boolean {
  return actionNs.actionType === ActionType.RESET || actionNs.actionType === ActionType.RESET_ALL;
}
