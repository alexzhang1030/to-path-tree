# to-path-tree

<a href="https://www.npmjs.com/package/to-path-tree" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/v/to-path-tree" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/to-path-tree" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/dt/to-path-tree" alt="NPM Downloads" /></a>
<a href="https://github.com/alexzhang1030/to-path-tree/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/alexzhang1030/to-path-tree" alt="License" /></a>
<a href="https://codecov.io/gh/alexzhang1030/to-path-tree" ><img src="https://codecov.io/gh/alexzhang1030/to-path-tree/graph/badge.svg?token=NQ8S2Z38OB"/></a>

Convert a file path array to a tree.

## Installation

```bash
pnpm i to-path-tree
```

## Usage

### Function usage

```ts
import { pathToTree } from 'to-path-tree'

const paths = [
  'src/index.ts',
  'src/a/index.ts',
  'src/a/b/index.ts',
  'src/a/b/d/index.ts',
  'src/foo.ts',
  'src/b/index.js',
  'src/b/c/index.ts',
  'a/index.ts',
  'a/b.ts',
  'a/b/index.js'
]

const tree = pathToTree(paths)
```

### Builder usage

```ts
import { PathTreeBuilder } from 'to-path-tree'

const builder = new PathTreeBuilder()
builder.addPath('src/index.ts')
builder.addPath('src/a/index.ts')
builder.removePath('src/index.ts')
builder.getItems('src/a/') // get all file items under 'src/a/'
builder.getSubDirectories('src/') // get all subdirectories under 'src/'
```

### Tree types

The data structure of the tree is as follows:

```ts
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
  name: string
  path: string
  /**
   * Relative to parent path
   */
  relativePath: string
  /**
   * Relative to root path, exclude sep
   */
  relativePathName: string
  subDirectory: {
    [key: string]: TreeNode<T>
  } | null
  parent?: TreeNode<T>
}
```

### Traverse the tree

You can use `walkPathTree` to traverse the tree.

For example:

```ts
import { pathToTree, walkPathTree } from 'to-path-tree'

const tree = pathToTree(input)
walkPathTree(tree, (node) => {
  for (const item of node.items) {
    if (item.path === 'src/a/b/d/index.ts') {
      // do something...
    }
  }
})
```

## License

MIT
