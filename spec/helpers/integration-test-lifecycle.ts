import { ChildProcess, spawn } from 'child_process';

let slsOfflineProcess: ChildProcess;

export const startSlsOffline = (done: any) => {
  // Spawn sls as detached, so it leads the process group and kills DynamoDB when it gets SIGINT
  slsOfflineProcess = spawn('npm', ['start'], { detached: true });

  if (!slsOfflineProcess) {
    throw new Error('slsOfflineProcess did not spawn');
  }

  slsOfflineProcess.stdout?.pipe(process.stdout);

  console.log(`Serverless: Offline started with PID : ${slsOfflineProcess.pid}`);

  slsOfflineProcess.stdout?.on('data', (data) => {
    if (data.includes('Offline listening on')) {
      console.log(data.toString().trim());
      done();
    }
  });

  slsOfflineProcess.stderr?.on('data', (errData) => {
    console.log(`Error starting Serverless Offline:\n${errData}`);
    done(errData);
  });
};

export const stopSlsOffline = () => {
  const { pid } = slsOfflineProcess;

  if (typeof pid === 'number') {
    // Usage of negative PID kills the process group
    process.kill(-pid);
    console.log('Serverless Offline stopped');
  }
};
