export function getFileNameAndExt(path: string) {
  return path.includes('/')
    ? /.+\/(.+)\.(.+)$/.exec(path)?.slice(1)
    : /(.+)\.(.+)$/.exec(path)?.slice(1)
}

interface NodeItem<T> {
  path: string
  filename: string
  ext: string
  data?: T
  isEntry: boolean // the entry is index
}

interface TreeNode<T> {
  items: NodeItem<T>[]
  subDirectory: {
    [key: string]: TreeNode<T>
  } | null
  parent?: TreeNode<T>
}

const ENTRY_NAME = 'index'

export function pathsToTree<Data>(paths: string[], {
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
  for (const path of paths) {
    const parts = path.split(sep)
    let node = grouped
    for (const part of parts) {
      if (part === parts.at(-1)) {
        // add to root
        node.items = node.items ?? []
        const [filename, ext] = getFileNameAndExt(path) ?? []
        const nodeItem: NodeItem<Data> = {
          path,
          filename,
          ext,
          isEntry: filename === ENTRY_NAME,
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
    }
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
