import { pathToTree, walkPathTree } from '..'
import input from './fixtures/input.json'

describe('test', () => {
  it('paths to tree', () => {
    expect(pathToTree(input)).toMatchSnapshot()
  })
  it('walker', () => {
    const tree = pathToTree(input)
    walkPathTree(tree, (node) => {
      for (const item of node.items) {
        if (item.path === 'src/a/b/d/index.ts')
          expect(node.parent?.items).toMatchSnapshot()
      }
    })
  })
})

it('should add directories', () => {
  const tree = pathToTree([
    '/a/',
    '/a/b/',
  ])
  expect(tree).toMatchSnapshot()
})
