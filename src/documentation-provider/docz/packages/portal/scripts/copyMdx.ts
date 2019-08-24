import { createSymlink } from './utils';
import path from 'path';
import glob from 'glob-promise';

async function copyMdxFiles() {
  const docDirs = await glob('../components/src/**/docs/', );
  const destDir = path.join(process.cwd(), 'component-docs/');

  return Promise.all(docDirs.map((dir) => {
    const matches = dir.match(new RegExp('.*\/src\/(.*)\/docs'));
    return createSymlink(dir, path.join(destDir, matches[1]));
  }))
}

copyMdxFiles()
.then(() => {
  console.log('copied .mdx files from components');
  process.exit(0);
})
.catch((e) => {
  console.error(e);
  process.exit(1);
});
