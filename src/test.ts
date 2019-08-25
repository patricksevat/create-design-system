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

		spinner.succeed().start('Running yarn test:e2e in packages/components');
		await asyncExec('yarn test', {
			cwd: path.resolve(process.cwd(), path.join('tmp', 'packages', 'components'))
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
    spinner.succeed();
    spinner.stop();
  } catch(e) {
    console.log('ERROR', e);
    throw e;
  }

}

function asyncExec(cmd: string, opts: Record<any, any> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const spawnedProcess = exec(`sh -c "${cmd}"`, opts,(err, stdout, stderr) => {
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
  })
}

executeTest()
.then(() => {
  console.log('TEST PASSED');
  process.exit(0);
}, () => {
  console.log('TEST FAILED');
  process.exit(1);
});
