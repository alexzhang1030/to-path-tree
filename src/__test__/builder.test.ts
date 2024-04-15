import { PathTreeBuilder } from '@/builder'

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

it('get items', () => {
  const builder = new PathTreeBuilder()
  builder.addPath('/a/')
  builder.addPath('/a/index.ts')
  expect(builder.tree).toMatchInlineSnapshot(`
    {
      "items": [],
      "name": "root",
      "subDirectory": {
        "a": {
          "items": [
            {
              "data": undefined,
              "ext": "ts",
              "filename": "index",
              "isEntry": true,
              "parent": [Circular],
              "path": "/a/index.ts",
            },
          ],
          "name": "a",
          "parent": [Circular],
          "subDirectory": {},
        },
      },
    }
  `)
  expect(builder.getItems('/a/')).toMatchInlineSnapshot(`
    [
      {
        "data": undefined,
        "ext": "ts",
        "filename": "index",
        "isEntry": true,
        "parent": {
          "items": [Circular],
          "name": "a",
          "parent": {
            "items": [],
            "name": "root",
            "subDirectory": {
              "a": [Circular],
            },
          },
          "subDirectory": {},
        },
        "path": "/a/index.ts",
      },
    ]
  `)
  // get items from file, should return []
  expect(builder.getItems('/a/index.ts')).toEqual([])
  // get non-exist path, should return []
  expect(builder.getItems('/a/b/')).toEqual([])
})

it('custom separator', () => {
  const builder = new PathTreeBuilder({ sep: '$' })
  builder.addPath('$a$')
  builder.addPath('$a$b$')
  builder.addPath('$a$b$index.ts')
  builder.addPath('$a$b$foo.ts')
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
  const node = builder.getNode('/a/index.ts', true)
  expect(node?.data).toStrictEqual({
    data: 'ts',
  })
  // get non-exist path, should return null
  expect(builder.getNode('/a/b/index.ts')).toBeNull()
})
