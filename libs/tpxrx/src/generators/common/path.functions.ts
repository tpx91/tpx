import {joinPathFragments, Tree} from '@nrwl/devkit';
import {Names} from './names';
import {__libDirName, set__LibDirName} from './globals';

export function getStateDomainFilePath(projectNs: Names, domainNs: Names, fileSuffix: string) {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib', '+state', domainNs.fileName, `${domainNs.fileName}.${fileSuffix}`);
}

export function getStateProjectFilePath(projectNs: Names, fileSuffix: string) {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib', '+state', `${projectNs.fileName}.${fileSuffix}`);
}

export function getModuleFilePath(projectNs: Names, fileSuffix: string) {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib', `${projectNs.fileName}.${fileSuffix}`);
}

export function getLibIndexPath(projectNs: Names): string {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'index.ts');
}

export function getLibPath(projectNs: Names): string {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib');
}

export function getStatePath(projectNs: Names): string {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib', '+state');
}

export function getStateDomainPath(projectNs: Names, domainNs: Names): string {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib', '+state', domainNs.fileName);
}

export function getLibFilePath(projectNs: Names, filename: string): string {
  return joinPathFragments(__libDirName, projectNs.name, 'src', 'lib', filename);
}

export function getModuleTemplatePath(): string {
  return joinPathFragments(__dirname, '..', 'templates', 'file-templates', 'module-files');
}

export function getProjectTemplatePath(): string {
  return joinPathFragments(__dirname, '..', 'templates', 'file-templates', 'project-files');
}

export function getDomainTemplatePath(): string {
  return joinPathFragments(__dirname, '..', 'templates', 'file-templates', 'domain-files');
}

export function setLibDirName(tree: Tree) {
  const nxJson = tree.read('nx.json').toString();
  const nxObject = JSON.parse(nxJson);
  const libDirName = nxObject?.workspaceLayout?.libsDir || 'libs';
  set__LibDirName(libDirName);
}
