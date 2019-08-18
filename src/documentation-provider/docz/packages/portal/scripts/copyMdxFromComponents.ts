import glob from 'glob-promise';
import fse from 'fs-extra';

async function copyMdxFiles() {
  const files = await glob('../components/**/*.mdx');
  const outputPath = './copied/';

  const promises = files.map((filePath) => {
    const fileName = filePath.split('/').pop();
    return fse.copy(filePath, `${outputPath}/${fileName}`);
  });

  return Promise.all(promises);
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