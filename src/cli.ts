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

    const spinner = ora(`Creating general project files`).start();
    await copyComponentCompilerFiles(options, 'project', true);
    await copyCompiledTemplateFiles(options, 'project', true);
    spinner.succeed(`General project files created`);

    spinner.start(`Creating ${options.componentCompiler} files`);
    await copyComponentCompilerFiles(options, 'component-compiler');
    await copyCompiledTemplateFiles(options, 'component-compiler');
    spinner.succeed(`${options.componentCompiler} files created`);

    spinner.start(`Creating ${options.documentationProvider} files`);
    await copyComponentCompilerFiles(options, 'documentation-provider');
    await copyCompiledTemplateFiles(options, 'documentation-provider');
    spinner.succeed(`${options.documentationProvider} files created`);

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