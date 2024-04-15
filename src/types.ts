export interface NodeItem<T> {
  path: string
  /**
   * e.g. index
   */
  filename: string
  /**
   * e.g. ts
   */
  ext: string
  /**
   * e.g. index.ts
   */
  file: string
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
  path: string
  /**
   * Relative to parent path
   */
  relativePath: string
  /**
   * Relative to root path, exclude sep
   */
  relativePathName: string
  name: string
}

export type ParseResults<T> = {
  type: 'file'
  node: NodeItem<T>
} | {
  type: 'directory'
  node: TreeNode<T>
}
