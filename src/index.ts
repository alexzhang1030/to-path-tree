const REGEX_HAVE_PATHS = /.+\/(.+)\.(.+)$/
const REGEX_NO_PATHS = /(.+)\.(.+)$/

export function getFileNameAndExt(path: string) {
  return path.includes('/')
    ? REGEX_HAVE_PATHS.exec(path)?.slice(1)
    : REGEX_NO_PATHS.exec(path)?.slice(1)
}

export interface NodeItem<T> {
  path: string
  filename: string
  ext: string
  data?: T
  isEntry: boolean // the entry is index
  parent: TreeNode<T>
}

export interface TreeNode<T> {
  items: NodeItem<T>[]
  subDirectory: {
    [key: string]: TreeNode<T>
  } | null
  parent?: TreeNode<T>
}

const ENTRY_NAME = 'index'

export function pathToTree<Data>(paths: string[], {
  sep = '/',
  getData,
}: {
  sep?: string
  getData?: (node: NodeItem<Data>) => Data
} = {}): TreeNode<Data> {
  const root: TreeNode<Data> = { items: [], subDirectory: {} }

  let pathIndex = 0
  const pathLen = paths.length
  while (pathIndex < pathLen) {
    const originalPath = paths[pathIndex]
    pathIndex += 1
    const path = originalPath.startsWith('/') ? originalPath.slice(1) : originalPath
    const parts = path.split(sep)

    let currentNode = root
    const partsLen = parts.length
    for (let i = 0; i < partsLen; i++) {
      const part = parts[i]
      if (i === partsLen - 1) { // this is the last part of the path, so it's a file
        const [filename, ext] = getFileNameAndExt(part) ?? []
        const nodeItem: NodeItem<Data> = {
          path: originalPath,
          filename,
          ext,
          isEntry: filename === ENTRY_NAME,
          parent: currentNode,
        }
        nodeItem.data = getData?.(nodeItem)
        currentNode.items.push(nodeItem)
      }
      else { // this part is a directory
        if (!currentNode.subDirectory)
          currentNode.subDirectory = {}

        if (!currentNode.subDirectory[part]) {
          currentNode.subDirectory[part] = {
            items: [],
            subDirectory: null,
            parent: currentNode,
          }
        }
        currentNode = currentNode.subDirectory[part]
      }
    }
  }

  return root
}

export function walkPathTree<Data>(node: TreeNode<Data>, callback: (node: TreeNode<Data>) => void) {
  callback(node)
  if (node.subDirectory) {
    for (const childNode of Object.values(node.subDirectory))
      walkPathTree(childNode, callback)
  }
}
