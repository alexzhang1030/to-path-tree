export function getFileNameAndExt(path: string) {
  return path.includes('/')
    ? /.+\/(.+)\.(.+)$/.exec(path)?.slice(1)
    : /(.+)\.(.+)$/.exec(path)?.slice(1)
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
  const grouped: TreeNode<Data> = {
    items: [],
    subDirectory: null,
  }
  let pathIndex = 0
  const pathLen = paths.length
  while (pathIndex < pathLen) {
    const originalPath = paths[pathIndex]
    let path = originalPath
    if (path.startsWith('/'))
      path = path.slice(1)
    const parts = path.split(sep)
    let node = grouped
    let partIndex = 0
    const partLen = parts.length
    while (partIndex < partLen) {
      const part = parts[partIndex]
      if (part === parts.at(-1)) {
        // add to root
        node.items = node.items ?? []
        const [filename, ext] = getFileNameAndExt(path) ?? []
        const nodeItem: NodeItem<Data> = {
          path: originalPath,
          filename,
          ext,
          isEntry: filename === ENTRY_NAME,
          parent: node,
        }
        nodeItem.data = getData?.(nodeItem)
        node.items.push(nodeItem)
      }
      else {
        node.subDirectory = node.subDirectory ?? {}
        node.subDirectory[part] = node.subDirectory[part] ?? {
          subDirectory: null,
          parent: node,
        }
        node = node.subDirectory[part]
      }
      partIndex += 1
    }
    pathIndex += 1
  }
  return grouped
}

export function walkPathTree<Data>(node: TreeNode<Data>, callback: (node: TreeNode<Data>) => void) {
  callback(node)
  if (node.subDirectory) {
    for (const childNode of Object.values(node.subDirectory))
      walkPathTree(childNode, callback)
  }
}
