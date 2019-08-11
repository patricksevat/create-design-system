import ejs from 'ejs';
import fse from 'fs-extra';
import glob from 'glob-promise';

import * as types from './types';

const globOptions = (compilerName) => ({
  dot: true,
  nodir: true,
  ignore: Object.keys(types.ComponentCompiler).reduce((accumulator, key) => {
    if (key !== compilerName) {
      accumulator.push(`${__dirname}/copy/${key}/**/*`);
      accumulator.push(`${__dirname}/templates/${key}/**/*`);
    }

    return accumulator;
  }, [])
});

export async function copyComponentCompilerFiles(options: types.ICliOptions) {
  try {
    const files = await glob(`${__dirname}/copy/**/*`, globOptions(options.componentCompiler));
    const promises = files.map((file) => {
      const relativePath = getRelativePath(file, 'copy', options.componentCompiler);
      const outputPath = `${process.cwd()}/${relativePath}`;
      return fse.copy(file, outputPath)
    });
    return Promise.all(promises);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function copyCompiledTemplateFiles(options: types.ICliOptions) {
  try {
    const files = await glob(`${__dirname}/templates/**/*`, globOptions(options.componentCompiler));
    const promises = files.map((file) => {
      const relativePath = getRelativePath(file, 'templates', options.componentCompiler);
      const outputPath = `${process.cwd()}/${relativePath}`;
      return createFileFromTemplate(file, outputPath, options)
    });
    return Promise.all(promises);
  } catch (e) {
    return Promise.reject(e);
  }
}

async function createFileFromTemplate(templatePath: string, outputPath: string, options: types.ICliOptions) {
  const compiled = await ejs.renderFile(templatePath, options, { async: true });
  await fse.ensureFile(stripExtension(outputPath));
  await fse.writeFile(stripExtension(outputPath), compiled);
}

function stripExtension(path: string): string {
  return path.replace('.ejs', '');
}

function getRelativePath(srcPath: string, pathSegmentToFilter: string, compilerName: types.ComponentCompiler) {
  const regex = new RegExp(`.*${pathSegmentToFilter}(\/${compilerName}\/)?(?<relative>.*)`);
  return srcPath.match(regex).groups.relative;
}