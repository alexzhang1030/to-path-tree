import { getFileNameAndExt, pathToTree, walkPathTree } from '..'
import input from './fixtures/input.json'

describe('test', () => {
  test('paths to tree', () => {
    expect(pathToTree(input)).toMatchSnapshot()
  })
  test('walker', () => {
    const tree = pathToTree(input)
    walkPathTree(tree, (node) => {
      for (const item of node.items) {
        if (item.path === 'src/a/b/d/index.ts')
          expect(node.parent?.items).toMatchSnapshot()
      }
    })
  })
})

test.each([
  ['foo/bar.ts', ['bar', 'ts']],
  ['foo/bar/baz.ts', ['baz', 'ts']],
  ['index.ts', ['index', 'ts']],
])('the file name and ext of %s should be %s', (path, expected) => {
  expect(getFileNameAndExt(path)).toEqual(expected)
})
