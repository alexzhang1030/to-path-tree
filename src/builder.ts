import { DEFAULT_SEP } from './constants'
import type { NodeItem, ParseResults, TreeNode } from './types'
import { genRoot, parsePath } from './utils'

export class PathTreeBuilder<T extends Record<string, unknown>> {
  #root: TreeNode<T> = genRoot()
  #mapping = new Map<string, ParseResults<T>>()

  #sep
  #getData

  /**
   * @param options
   * @param options.sep - default `/`
   * @param options.getData - function to get data from node
   */
  constructor(options?: {
    sep?: string
    getData?: (node: NodeItem<T>) => T
  }) {
    const { sep = DEFAULT_SEP, getData } = options ?? {}

    this.#sep = sep
    this.#getData = getData
  }

  addPath(path: string) {
    const nodeItem = parsePath(path, this.#sep, this.#root, this.#getData)
    this.#mapping.set(path, nodeItem)
  }

  removePath(path: string) {
    const nodeItem = this.#mapping.get(path)
    if (!nodeItem)
      return
    const { node, type } = nodeItem
    if (type === 'file')
      node.parent?.items.splice(node.parent.items.indexOf(node), 1)
    else
      Reflect.deleteProperty(node.parent!.subDirectory!, node.name)
  }

  /**
   *
   * @param path path to get node
   * @param _isFile pass isFile for better type inference
   */
  getNode<const IF extends boolean>(path: string, _isFile: IF = true as IF) {
    const node = this.#mapping.get(path)
    if (!node)
      return null
    return node.node as IF extends true ? NodeItem<T> : TreeNode<T>
  }

  getItems(path: string) {
    const node = this.#mapping.get(path)
    if (!node)
      return []
    return node.type === 'file'
      ? []
      : node.node.items
  }

  get tree() {
    return this.#root
  }
}
