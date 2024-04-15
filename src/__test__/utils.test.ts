import { getFileNameAndExt } from '@/utils'

it.each([
  ['foo/bar.ts', ['bar', 'ts']],
  ['foo/bar/baz.ts', ['baz', 'ts']],
  ['index.ts', ['index', 'ts']],
])('the file name and ext of %s should be %s', (path, expected) => {
  expect(getFileNameAndExt(path)).toEqual(expected)
})
