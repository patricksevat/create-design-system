import ejs from 'ejs';
import fse from 'fs-extra';
import glob from 'glob-promise';
import changeCase from 'change-case';

import * as types from './types';

const globOptions = (compilerName, skipIgnore) => ({
  dot: true,
  nodir: true,
  ignore: Object.keys(types.ComponentCompiler).reduce((accumulator, key) => {
    if (key !== compilerName && !skipIgnore) {
      accumulator.push(`${__dirname}/${key}/**/*`);
      // accumulator.push(`${__dirname}/templates/${key}/**/*`);
    }

    return accumulator;
  }, [])
});

export async function copyFiles(options: types.ICliOptions, toolingType: string, skipIgnore?: boolean) {
  try {
    const files = await getFilePaths(options, toolingType, skipIgnore);

    const promises = files.map((file) => {
      const relativePath = getRelativePath(file, !skipIgnore && options[changeCase.camel(toolingType)]);
      const outputPath = `${process.cwd()}/${relativePath}`;

      if (file.includes('.ejs')) {
        return createFileFromTemplate(file, outputPath, options)
      }

      return fse.copy(file, outputPath)
    });
    return Promise.all(promises);
  } catch (e) {
    return Promise.reject(e);
  }
}

function getFilePaths(options, toolingType, skipIgnore): Promise<string[]> {
  const toolingName = changeCase.camel(toolingType);
  const globPattern = `${__dirname}/${toolingType}/**/*`;
  return glob(globPattern, globOptions(options[toolingName], skipIgnore));
}

async function createFileFromTemplate(templatePath: string, outputPath: string, options: types.ICliOptions) {
  const compiled = await ejs.renderFile(templatePath, options, { async: true });
  await fse.ensureFile(stripExtension(outputPath));
  await fse.writeFile(stripExtension(outputPath), compiled);
}

function stripExtension(path: string): string {
  return path.replace('.ejs', '');
}

function getRelativePath(srcPath: string, toolName?: string) {
  const regex = new RegExp(`.*\/${toolName ? toolName + '\/' : ''}(?<relative>.*)`);
  return srcPath.match(regex).groups.relative;
}