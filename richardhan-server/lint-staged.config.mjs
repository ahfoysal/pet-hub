export default {
  '**/*.{js,ts,mjs}': ['eslint --fix --no-warn-ignored', 'prettier --write'],
  '**/*.{json,md}': ['prettier --write'],
};
