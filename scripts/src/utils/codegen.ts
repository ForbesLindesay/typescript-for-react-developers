import {readFile, writeFile} from 'fs/promises';
import {relative} from 'path';

import {format} from 'prettier';

export async function writeTypeScript(filename: string, src: string) {
  const formatted = await format(src, {
    parser: `typescript`,
    printWidth: 88,
    semi: false,
    trailingComma: 'es5',
    arrowParens: 'avoid',
  });
  await writeFileIfChanged(filename, formatted);
}

export async function writeFileIfChanged(filename: string, src: string) {
  if (src !== (await readFile(filename, `utf8`).catch(() => null))) {
    await writeFile(filename, src);
    console.warn(`🚀 Updated ${relative(process.cwd(), filename)}`);
  }
}
