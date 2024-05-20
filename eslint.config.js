import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-misleading-capturing-group': 'off',
  },
})
