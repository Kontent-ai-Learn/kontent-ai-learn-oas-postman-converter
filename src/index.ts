import { exec } from 'child_process';
// @ts-ignore
import timeout from 'connect-timeout';
import express from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import {
  log,
  prettify,
} from './utils';

let runningWorkerPromise: Promise<string> | null = null;

const getWorkerPromise = (): Promise<string> => {
  if (!runningWorkerPromise) {
    runningWorkerPromise = new Promise<string>(resolve => {
      exec(`npx cross-env babel-node --extensions '.ts','.tsx','.js' src/workerScript.ts`, (error, stdout, stderr) => {
        if (error) {
          resolve(prettify({
            fail: 'FAIL! Sorry...',
            error,
            stdout,
            stderr,
          }));
        }
        else {
          log('Debug log:');
          log(stderr);
          resolve(stdout);
        }
      });
    }).finally(() => {
      runningWorkerPromise = null;
    });
  }

  return runningWorkerPromise;
};

const main = async () => {
  const app = express();
  app.use(timeout('120s'));
  // Set up logging
  app.use(morgan('dev'));
  const router = express.Router();

  router.get('/collection.json', async (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.write(' ');
    const ping = setInterval(() => {
      log('ping');
      res.write(' ');
    }, 5000);

    const response = await getWorkerPromise();

    clearInterval(ping);
    res.end(response);
  });

  app.use(router);


  // Launch server
  app.set('port', process.env.PORT || 3000);
  const server = app.listen(app.get('port'), () => {
    const port = (server.address() as AddressInfo).port;
    log(`Express server listening on port '${port}'.`);
  });
};

main();
