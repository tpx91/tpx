import {
  Tree,
  generateFiles
} from '@nrwl/devkit';
import {libraryGenerator} from '@nrwl/angular/generators';
import {GeneratorOptions} from './schema';
import {generateDomain} from '../tpxrx-domain/generator';
import {tpxrxNames, tpxrxNamesArray} from '../common/names.functions';
import {decode, insertItemsToFileEnd} from '../common/insert.functions';
import {toFormattedNames} from '../common/util.functions';
import {
  getLibPath,
  getStatePath,
  getLibIndexPath,
  getModuleTemplatePath, getProjectTemplatePath
} from '../common/path.functions';
import {getIndexTemplate} from '../common/template-functions/template-index.functions';
import {generatorWrapper} from '../common/generator';

export default async function (tree: Tree, schema: GeneratorOptions) {
  return generatorWrapper(tree, schema, generateLib);
}

export async function generateLib(tree: Tree, schema: GeneratorOptions) {
  const crud = schema.crud;
  const projectNs = tpxrxNames(schema.name);
  const domainsNs = tpxrxNamesArray(schema.domains);

  /*
   * generate library files
   */
  await libraryGenerator(
    tree,
    {
      name: `${projectNs.name}`,
    }
  );
  insertItemsToFileEnd(
    tree,
    getLibIndexPath(projectNs),
    [getIndexTemplate(tree, projectNs)],
    '',
  );

  /*
   * generate module file
   */
  await generateFiles(
    tree,
    getModuleTemplatePath(),
    getLibPath(projectNs),
    {
      ...toFormattedNames(projectNs, 'project'),
      tmpl: '',
    }
  );

  /*
   * generate project +state files
   */
  await generateFiles(
    tree,
    getProjectTemplatePath(),
    getStatePath(projectNs),
    {
      ...toFormattedNames(projectNs, 'project'),
      tmpl: '',
    }
  );

  await domainsNs?.forEach(async (domainNs) => {
    await generateDomain(tree, {
      project: projectNs.name,
      name: domainNs.fileName,
      crud,
    })
  });

  /*
   * format files
   */
  decode(tree, projectNs);
}

