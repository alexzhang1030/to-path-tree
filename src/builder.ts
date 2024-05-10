import { DEFAULT_SEP, ROOT_NAME } from './constants'
import type { NodeItem, ParseResults, TreeNode } from './types'
import { genRoot, parsePath } from './utils'

export class PathTreeBuilder<T extends Record<string, unknown>> {
  #root: TreeNode<T> = genRoot()
  #mapping = new Map<string, ParseResults<T>>()

  #sep
  #getData
  #autoResolveDir

  /**
   * @param options
   * @param options.sep - default `/`
   * @param options.getData - function to get data from node
   * @param options.autoResolveDir - will auto resolve directory when adding file path, but not added dir path, default `true`
   */
  constructor(options?: {
    sep?: string
    getData?: (node: NodeItem<T>) => T
    autoResolveDir?: boolean
  }) {
    const { sep = DEFAULT_SEP, getData, autoResolveDir = true } = options ?? {}

    this.#sep = sep
    this.#getData = getData
    this.#autoResolveDir = autoResolveDir
  }

  /**
   *
   * @param path
   * @param userData pass this will override default getData passed in constructor
   */
  addPath(path: string, userData?: T) {
    const nodeItem = parsePath(
      path,
      this.#sep,
      this.#root,
      userData
        ? () => userData
        : this.#getData,
    )
    this.#mapping.set(nodeItem.node.path, nodeItem)
    if (this.#autoResolveDir)
      this.#resolveDir(nodeItem)
  }

  #resolveDir(node: ParseResults<T>) {
    let dirNode: ParseResults<T>['node'] | undefined = node.node
    while (dirNode.parent) {
      dirNode = dirNode?.parent
      if (!this.#mapping.has(dirNode.path)) {
        this.#mapping.set(dirNode.path, {
          node: dirNode,
          type: 'directory',
        })
      }
    }
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
    if (path === ROOT_NAME)
      return this.#root.items
    const node = this.#mapping.get(getStrictPath(path))
    if (!node)
      return []
    return node.type === 'file'
      ? []
      : node.node.items
  }

  getSubDirectories(path: string) {
    if (path === ROOT_NAME)
      return this.#root.subDirectory
    const node = this.getNode(getStrictPath(path), false)
    if (!node)
      return null
    return node.subDirectory
  }

  get tree() {
    return this.#root
  }
}

function getStrictPath(path: string) {
  return path.startsWith('/') ? path : `/${path}`
}
