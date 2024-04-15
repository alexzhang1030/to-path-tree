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
  path: string
  name: string
}

export type ParseResults<T> = {
  type: 'file'
  node: NodeItem<T>
} | {
  type: 'directory'
  node: TreeNode<T>
}
