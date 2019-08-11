import yargs from 'yargs';
import enquirer from 'enquirer';
import changeCase from 'change-case'
import ora from 'ora';

import * as types from './types';
import { copyCompiledTemplateFiles, copyComponentCompilerFiles } from './copy';

const aliases = {
  componentCompiler: ['component', 'c'],
  documentationProvider: ['docs', 'documentation', 'd'],
  testingFramework: ['test', 't'],
};

yargs.alias(aliases);

export async function cli() {
  try {
    const options: types.ICliOptions = await prompt();
    const spinner = ora('Creating files').start();
    await copyComponentCompilerFiles(options);
    await copyCompiledTemplateFiles(options);

    spinner.succeed('files created');

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

}

async function prompt(): Promise<types.ICliOptions> {
  const options = {
    templateConfig: {
      name: 'foobaz',
      prefix: 'foo',
      prefixPascalCase: changeCase.pascalCase('foo'),
    }
  };

  for (const key of Object.keys(aliases)) {
    const pascalKey = changeCase.pascalCase(key);
    options[key] = yargs.argv[key];

    if (!yargs.argv[key] || !types[pascalKey] || !types[pascalKey][options[key]]) {
      const answer = await enquirer.prompt({
        type: 'select',
        name: key,
        message: `Please pick a ${changeCase.noCase(key)}`,
        choices: Object.values(types[pascalKey]) as string[],
      });

      options[key] = answer[key];
    }
  }

  return options as types.ICliOptions;
}