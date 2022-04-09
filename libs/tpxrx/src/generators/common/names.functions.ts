import {
  Action,
  ActionType,
  Names,
} from './names';
import {names} from '@nrwl/devkit';
import {toArray, toPural} from './util.functions';

export function tpxrxNames(name: string, actionType?: ActionType): Names {
  const n = names(name);
  return {
    ...n,
    fileName: n.fileName.replace('/', '-'),
    actionType,
  }
}

export function tpxrxPluralNames(name: string): Names {
  const names = tpxrxNames(name);
  return {
    ...names,
    propertyName: toPural(names.propertyName),
    className: toArray(names.className),
  }
}

export function tpxrxExendedNames(names: Names, extension: string): Names {
  return tpxrxNames(`${names.fileName}-${extension}`);
}

export function tpxrxNamesArray(names: string): Names[] {
  return names?.split(',')?.map((name) => tpxrxNames(name.trim())) || [];
}

export function tpxrxActionNamesArray(names: Action[]): Names[] {
  return names?.map((name) => tpxrxNames(name.name, name.type)) || [];
}
