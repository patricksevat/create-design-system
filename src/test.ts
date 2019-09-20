import fsExtra from 'fs-extra';
import { exec } from 'child_process';
import path from 'path';
import ora from 'ora';

// Note: Please be patient, test can take 5 min easily
// Note for windows users: Git Bash or Mingw is required.
async function executeTest() {
  try {
    const spinner = ora('cleaning tmp folder').start();
    await fsExtra.remove('./tmp');
    await fsExtra.ensureDir('./tmp');

    spinner.succeed().start('Executing bin/design-system');
    await asyncExec('../bin/design-system -c stencil -d docz -t jest -n foo-ds -p foo', {
      cwd: path.resolve(process.cwd(), path.join('tmp')),
    });

    spinner.succeed().start('Creating git repo in tmp folder');
    await asyncExec('git init', {
      cwd: path.resolve(process.cwd(), path.join('tmp')),
      maxBuffer: 1024 * 1024 * 5
    });

    spinner.succeed().start('Running yarn install in tmp folder');
    await asyncExec('yarn', {
      cwd: path.resolve(process.cwd(), path.join('tmp')),
      maxBuffer: 1024 * 1024 * 5
    });

    spinner.succeed().start('Running yarn build in packages/components');
    await asyncExec('yarn build', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components'))
    });

    spinner.succeed().start('Running yarn test in packages/components');
    await asyncExec('yarn test', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components'))
    });

    spinner.succeed().start('Running yarn test:e2e against yarn start in packages/components');
    await runE2eTests();

    spinner.succeed().start('Running yarn install in portal folder');
    await asyncExec('yarn', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'portal')),
      maxBuffer: 1024 * 1024 * 5
    });

    spinner.succeed().start('Running yarn start in packages/portal');
    await asyncExec('yarn start', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'portal')),
      killMatcher: (data) => data.match(/You can now view .* in the browser/)
    });

    spinner.succeed().start('Running yarn build in packages/portal');
    await asyncExec('yarn build:portal', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'portal'))
    });

    spinner.succeed().start('Checking dev tooling');
    const dest = path.resolve(process.cwd(), path.join('tmp', 'packages', 'components', 'src', 'test.js'));
    await fsExtra.writeFile(dest,
      `const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu magna accumsan, laoreet orci nec, bibendum dui. Curabitur iaculis et metus non fermentum. Vestibulum mollis purus lorem. Proin laoreet suscipit hendrerit.';`,
      'utf-8');

    await asyncExec( 'git add test.js', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components', 'src'))
    });

    await asyncExec( 'git commit -m "feat(components): initial commit"', {
      cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components', 'src'))
    });

    spinner.succeed();
    spinner.stop();
  } catch(e) {
    console.log('ERROR', e);
    throw e;
  }

}

function asyncExec(cmd: string, opts: Record<any, any> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const spawnedProcess = exec(`sh -c '${cmd}'`, opts,(err, stdout, stderr) => {
      if (stderr) console.log(stderr);
      console.log(stdout);

      if (err) reject(err);
      resolve();
    });

    if (opts.killMatcher) {
      spawnedProcess.stdout.on('data', (data) => {
        if (opts.killMatcher(data)) {
          spawnedProcess.kill();
        }
      });

      spawnedProcess.on('exit', () => {
        resolve()
      });
    }

    if (opts.readyCb) {
      spawnedProcess.stdout.on('data', (data) => {
        if (opts.readyCb(data)) {
          resolve(spawnedProcess);
        }
      });
    }
  })
}

async function runE2eTests() {
  const startProcess = await asyncExec('yarn start', {
    cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components')),
    readyCb: (data) => data.includes('build finished, watching for changes')
  });

  await asyncExec('yarn test:e2e', {
    cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components'))
  });

  startProcess.on('exit', () => {
    console.log('killed yarn start components');
    return;
  });

  startProcess.kill();
}

executeTest()
.then(() => {
  console.log('TEST PASSED');
  process.exit(0);
}, () => {
  console.log('TEST FAILED');
  process.exit(1);
});
