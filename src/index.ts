// @ts-ignore
import timeout from 'connect-timeout';
import express from 'express';
import morgan from 'morgan';
import {AddressInfo} from 'net';
import {log, prettify,} from './utils';
import {work} from "./workerScript";

let runningWorkerPromise: Promise<string> | null = null;

const getWorkerPromise = (): Promise<string> => {
  if (!runningWorkerPromise) {
    runningWorkerPromise = work().then(collection => {
      return collection;
    }).catch(error => {
      return prettify({
        fail: 'FAIL! Sorry...',
        error,
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
    log('Got a request.');
    res.setHeader('Content-Type', 'application/json');
    res.write(' ');
    const ping = setInterval(() => {
      log('ping');
      res.write(' ');
    }, 5000);

    try {
      log('Launching the promise.');
      const response = await getWorkerPromise();
      log('Got the promise result.');
      res.end(response);
    } finally {
      clearInterval(ping);
    }
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
