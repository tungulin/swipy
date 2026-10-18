import { eslint } from '@siberiacancode/eslint';

export default eslint({
  ignores: ['.claude/**'],
  typescript: true,
  react: true,
  jsx: true,
  jsxA11y: true,
  rules: {
    'es-tooling/no-axios': 'off'
  }
});
