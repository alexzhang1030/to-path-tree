import type { NodeItem, TreeNode } from './types'
import { DEFAULT_SEP } from './constants'
import { genRoot, parsePath } from './utils'

export function pathToTree<Data>(paths: string[], {
  sep = DEFAULT_SEP,
  getData,
}: {
  sep?: string
  getData?: (node: NodeItem<Data>) => Data
} = {}): TreeNode<Data> {
  const root: TreeNode<Data> = genRoot()

  let pathIndex = 0
  const pathLen = paths.length

  while (pathIndex < pathLen) {
    const originalPath = paths[pathIndex]
    pathIndex += 1
    const currentNode = root
    parsePath(originalPath, sep, currentNode, getData)
  }

  return root
}
