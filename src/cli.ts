import yargs from 'yargs';
import enquirer from 'enquirer';
import changeCase from 'change-case'
import ora from 'ora';

import * as types from './types';
import { copyFiles } from './copy';

const aliases = {
  componentCompiler: ['component', 'c'],
  documentationProvider: ['docs', 'documentation', 'd'],
  testingFramework: ['test', 't'],
};

yargs.alias(Object.assign({}, aliases, { name: ['n'], prefix: ['p'] } ));

export async function cli() {
  try {
    const options: types.ICliOptions = await prompt();

    const spinner = ora(`Creating general project files`).start();
    await copyFiles(options, 'project', true);
    spinner.succeed(`General project files created`);

    spinner.start(`Creating ${options.componentCompiler} files`);
    await copyFiles(options, 'component-compiler');
    spinner.succeed(`${options.componentCompiler} files created`);

    spinner.start(`Creating ${options.documentationProvider} files`);
    await copyFiles(options, 'documentation-provider');
    spinner.succeed(`${options.documentationProvider} files created`);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

}

function checkValue(value) {
  if (!value) {
    return 'This field is required'
  }

  return !!value
}

async function prompt(): Promise<types.ICliOptions> {
  const options: Record<string, any> = {};
  const { name, prefix } = yargs.argv;

  if (!name || !prefix) {
		options.templateConfig = await enquirer.prompt([{
			type: 'input',
			name: 'name',
			message: 'What\'s the package.json name of your project?',
			format: changeCase.paramCase,
			validate: checkValue,
		}, {
			type: 'input',
			name: 'prefix',
			message: 'Prefix / short name for your components. Will be used to prefix your Web Components: <foo-button>',
			format: changeCase.paramCase,
			validate: checkValue,
		}]);
	} else {
  	options.templateConfig = { name, prefix };
	}


	options.templateConfig.prefixPascalCase = changeCase.pascalCase(options.templateConfig.prefix);

  for (const key of Object.keys(aliases)) {
    const pascalKey = changeCase.pascalCase(key);
    options[key] = yargs.argv[key];

    if (!yargs.argv[key] || !types[pascalKey] || !types[pascalKey][options[key]]) {
      const answer = await enquirer.prompt({
        type: 'select',
        name: key,
        message: `Please pick a ${changeCase.noCase(key)}. In pre release choices are limited, sorry!`,
        choices: Object.values(types[pascalKey]) as string[],
      });

      options[key] = answer[key];
    }
  }

  return options as types.ICliOptions;
}
