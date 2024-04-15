import { ENTRY_NAME, ROOT_NAME } from './constants'
import type { NodeItem, ParseResults, TreeNode } from './types'

const REGEX_HAVE_PATHS = /.+\/(.+)\.(.+)$/
const REGEX_NO_PATHS = /(.+)\.(.+)$/

export function getFileNameAndExt(path: string) {
  return path.includes('/')
    ? REGEX_HAVE_PATHS.exec(path)?.slice(1)
    : REGEX_NO_PATHS.exec(path)?.slice(1)
}

export function cleanPath(path: string, sep: string) {
  if (path.startsWith(sep))
    path.slice(1)
  if (path.endsWith(sep))
    path.slice(0, -1)
  return path
}

export function parsePath<Data>(
  originalPath: string,
  sep: string,
  currentNode: TreeNode<Data>,
  getData?: (node: NodeItem<Data>) => Data,
): ParseResults<Data> {
  const path = cleanPath(originalPath, sep)
  const isDirectory = path.endsWith(sep)
  const parts = path.split(sep)
  const partsLen = parts.length

  let nodeItem: NodeItem<Data> | null = null

  for (let i = 0; i < partsLen; i++) {
    const part = parts[i]
    if (i === partsLen - 1 && !isDirectory) { // this is the last part of the path, so it's a file
      const [filename, ext] = getFileNameAndExt(part)!
      nodeItem = {
        path: originalPath,
        filename,
        ext,
        isEntry: filename === ENTRY_NAME,
        parent: currentNode,
        file: part,
      }
      nodeItem.data = getData?.(nodeItem)
      currentNode.items.push(nodeItem)
    }
    else { // this part is a directory
      if (!currentNode.subDirectory)
        currentNode.subDirectory = {}
      const fixedPart = part === '' ? sep : part
      if (fixedPart === sep)
        continue
      if (!currentNode.subDirectory[fixedPart]) {
        currentNode.subDirectory[fixedPart] = {
          name: fixedPart,
          items: [],
          subDirectory: null,
          parent: currentNode,
          path: `${currentNode.path}${fixedPart}${sep}`,
          relativePath: `${fixedPart}${sep}`,
          relativePathName: `${fixedPart}`,
        }
      }
      currentNode = currentNode.subDirectory[fixedPart]
    }
  }

  return nodeItem
    ? {
        type: 'file',
        node: nodeItem,
      }
    : {
        type: 'directory',
        node: currentNode,
      }
}

export function genRoot<T = unknown>(): TreeNode<T> {
  return {
    items: [],
    subDirectory: {},
    name: ROOT_NAME,
    path: '/',
    relativePath: '/',
    relativePathName: '',
  }
}

export function walkPathTree<Data>(node: TreeNode<Data>, callback: (node: TreeNode<Data>) => void) {
  callback(node)
  if (node.subDirectory) {
    for (const childNode of Object.values(node.subDirectory))
      walkPathTree(childNode, callback)
  }
}
