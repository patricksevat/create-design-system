import { exec } from "child_process";

export function asyncExec(cmd: string, opts: Record<any, any> = {}): Promise<any> {
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
