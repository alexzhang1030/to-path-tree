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

it('should handle files without extensions like .gitignore', () => {
  const tree = pathToTree([
    '.gitignore',
    '.env',
    'README.md',
    'package.json',
  ])

  // Check that .gitignore is properly parsed
  const gitignoreItem = tree.items.find(item => item.path === '.gitignore')
  expect(gitignoreItem).toBeDefined()
  expect(gitignoreItem?.filename).toBe('.gitignore')
  expect(gitignoreItem?.ext).toBe('')
  expect(gitignoreItem?.isEntry).toBe(false)

  // Check that .env is properly parsed
  const envItem = tree.items.find(item => item.path === '.env')
  expect(envItem).toBeDefined()
  expect(envItem?.filename).toBe('.env')
  expect(envItem?.ext).toBe('')
  expect(envItem?.isEntry).toBe(false)

  // Check that README.md is properly parsed
  const readmeItem = tree.items.find(item => item.path === 'README.md')
  expect(readmeItem).toBeDefined()
  expect(readmeItem?.filename).toBe('README')
  expect(readmeItem?.ext).toBe('md')
  expect(readmeItem?.isEntry).toBe(false)

  // Check that package.json is properly parsed
  const packageItem = tree.items.find(item => item.path === 'package.json')
  expect(packageItem).toBeDefined()
  expect(packageItem?.filename).toBe('package')
  expect(packageItem?.ext).toBe('json')
  expect(packageItem?.isEntry).toBe(false)
})
