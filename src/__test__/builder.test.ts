import { PathTreeBuilder } from '@/builder'
import { ROOT_NAME } from '..'

it('simple builder', () => {
  const builder = new PathTreeBuilder()
  builder.addPath('/a/')
  builder.addPath('/a/b/')
  builder.addPath('/a/b/index.ts')
  builder.addPath('/a/b/foo.ts')
  expect(builder.tree).toMatchSnapshot('simple-builder add path')
  builder.removePath('/a/b/')
  builder.removePath('/a/b/foo.ts')
  builder.removePath('/a/b/baz.ts') // remove non-exist path
  expect(builder.tree).toMatchSnapshot('simple-builder remove path')
})

it('get items w/autoResolveDir = false', () => {
  const builder = new PathTreeBuilder({ autoResolveDir: false })
  builder.addPath('/a/')
  builder.addPath('/a/index.ts')
  expect(builder.tree).toMatchSnapshot()
  expect(builder.getItems('/a/')).toMatchSnapshot()
  // get items from file, should return []
  expect(builder.getItems('/a/index.ts')).toEqual([])
  // get non-exist path, should return []
  expect(builder.getItems('/a/b/')).toEqual([])
})

it('get items w/autoResolveDir = true', () => {
  const builder = new PathTreeBuilder()
  builder.addPath('src/index.ts')
  builder.addPath('src/a/index.ts')
  builder.removePath('src/index.ts')
  builder.addPath('src/b/')
  expect(builder.getItems('src/a/')).toMatchSnapshot()
  expect(builder.getSubDirectories('src/')).toMatchSnapshot()
  // get root items
  expect(builder.getItems(ROOT_NAME)).toMatchSnapshot()
  // get root sub directories
  expect(builder.getSubDirectories(ROOT_NAME)).toMatchSnapshot()
  // get sub directories but pass file path
  expect(builder.getSubDirectories('src/index.ts')).toBeNull()
})

it('custom separator', () => {
  const builder = new PathTreeBuilder({ sep: '$' })
  builder.addPath('$a$')
  builder.addPath('$a$b$')
  builder.addPath('$a$b$index.ts')
  builder.addPath('$a$b$foo.ts')
  builder.addPath('$a$z$index.ts')
  expect(builder.tree).toMatchSnapshot('custom-separator add path')
  builder.removePath('$a$b$')
  builder.removePath('$a$b$foo.ts')
  builder.removePath('$a$b$baz.ts') // remove non-exist path
  expect(builder.tree).toMatchSnapshot('custom-separator remove path')
})

it('get data', () => {
  const builder = new PathTreeBuilder({
    getData: node => ({ data: node.ext }),
  })
  builder.addPath('/a/index.ts')
  // override default
  builder.addPath('/a/foo.ts', { data: 'hello world' })
  const node = builder.getNode('/a/index.ts', true)
  expect(node?.data).toStrictEqual({
    data: 'ts',
  })
  expect(builder.getNode('/a/foo.ts', true)?.data).toStrictEqual({
    data: 'hello world',
  })
  // get non-exist path, should return null
  expect(builder.getNode('/a/b/index.ts')).toBeNull()
})
