import {Tree, visitNotIgnoredFiles} from '@nrwl/devkit';
import {findEndIndex, findStartIndex, getRegexMatch} from './util.functions';
import {Names} from './names';
import {getStatePath} from './path.functions';

export function insertItems(tree: Tree, path: string, insertItems: string[], matchRegex: RegExp, open: string, close: string, splitter: string, ignoreDuplicates?: boolean) {
  let content = tree.read(path).toString();
  const startIndex = findStartIndex(content, matchRegex);
  const endIndex = findEndIndex(content, startIndex, open, close);
  let subContent = content.substring(startIndex, endIndex).trim();
  const finalInsertItems = ignoreDuplicates ? removeDuplicates(insertItems, subContent, splitter) : insertItems;
  const insertContent = getInsertContent(finalInsertItems, splitter);
  subContent = subContent.endsWith(splitter) || !insertContent || !subContent ? subContent : (subContent + splitter);
  content = content.substring(0, startIndex) + subContent + insertContent + content.substring(endIndex);
  tree.write(path, content);
}

export function insertItemsToFileEnd(tree: Tree, path: string, insertItems: string[], splitter: string) {
  let content = tree.read(path).toString();
  const insertContent = getInsertContent(insertItems, splitter);
  content = content.trim();
  content = content.endsWith(splitter) || !insertContent || !content ? content : (content + splitter);
  content = content + insertContent;
  tree.write(path, content);
}

export function insertItemsBeforeRegex(tree: Tree, path: string, insertItems: string[], regexp: RegExp, splitter: string) {
  let content = tree.read(path).toString();
  const regexpMatch = getRegexMatch(path, content, regexp);
  let insertContent = getInsertContent(insertItems, splitter);
  insertContent = insertContent + regexpMatch;
  content = content.replace(regexpMatch, insertContent);
  tree.write(path, content);
}

export function insertItemsAfterRegex(tree: Tree, path: string, insertItems: string[], regexp: RegExp, splitter: string) {
  let content = tree.read(path).toString();
  const regexpMatch = getRegexMatch(path, content, regexp);
  let insertContent = getInsertContent(insertItems, splitter);
  insertContent = regexpMatch + insertContent;
  content = content.replace(regexpMatch, insertContent);
  tree.write(path, content);
}

export function getInsertContent(insertItems: string[], splitter: string): string {
  if (!insertItems?.length) {
    return '';
  }
  const insertContent = insertItems
    .map(i => {
      const i2 = i.trim();
      return splitter && i2.endsWith(splitter) ? i2.substring(0, i2.length - 1) : i2;
    })
    .join(splitter);
  return insertContent + splitter;
}

export function removeDuplicates(insertItems: string[], content: string, splitter: string): string[] {
  const items = content.trim().split(splitter)
    .map((i) => i.trim())
    .filter((i) => !!i);
  return insertItems.filter((i) => {
    let i2 = i.trim();
    i2 = i2.endsWith(splitter) && splitter ? i2.substring(0, i2.length - 1) : i2;
    return !items.includes(i2);
  });
}

export function decode(tree: Tree, projectNs: Names) {
  visitNotIgnoredFiles(
    tree,
    getStatePath(projectNs),
    (path) => {
      const content = tree.read(path).toString();
      const newContent = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      if (content !== newContent) {
        tree.write(path, newContent);
      }
    }
  );
}

