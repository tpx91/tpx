import {addDependenciesToPackageJson, formatFiles, installPackagesTask, Tree} from '@nrwl/devkit';
import {setLibDirName} from './path.functions';

export async function generatorWrapper<T>(tree: Tree, schema: T, generatorFct: (tree: Tree, schema: T) => Promise<void>) {
  setLibDirName(tree);
  await generatorFct(tree, schema);
  await formatFiles(tree);
  addDependencies(tree);

  return () => {
    installPackagesTask(tree);
  };
}


function addDependencies(tree: Tree) {
  const dependencies = {
    '@ngrx/effects': '^13.0.2',
    '@ngrx/entity': '^13.0.2',
    '@ngrx/router-store': '^13.0.2',
    '@ngrx/store': '^13.0.2',
    '@ngrx/store-devtools': '^13.0.2'
  };
  const devDependencies = {};
  addDependenciesToPackageJson(tree, dependencies, devDependencies);
}
