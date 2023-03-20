import test from 'ava';
import getClient from '../src';

test('Client not initialized', (t) => {
  const client = getClient({
    apiKey: '1337',
  });
  const age = client.get<number | undefined>('age');
  t.is(age, undefined);
});

test('Client eventually consistent', async (t) => {
  const client = getClient({
    apiKey: '1337',
  });
  client.init();
  const maybeAge = client.get<number | undefined>('age');
  t.is(maybeAge, undefined);
  await client.waitUntilLoaded();
  const age = client.get<number>('age');
  t.is(typeof age, 'number');
});

test('Client initialization using API key', async (t) => {
  const client = getClient({
    apiKey: '1337',
  });
  await client.init();
  const age = client.get<number>('age');
  t.is(typeof age, 'number');
});

test('Client initialization using remote URL', async (t) => {
  const client = getClient({
    remoteUrl:
      'https://storage.googleapis.com/happypath-public/configs/1337/config.json',
  });
  await client.init();
  const age = client.get<number>('age');
  t.is(typeof age, 'number');
});

test('Client initialization using local file', async (t) => {
  const client = getClient({
    filePath: `${__dirname}/data/sample.config.json`,
  });
  await client.init();
  const age = client.get<number>('age');
  t.is(typeof age, 'number');
});

test('Client initialized using in memory object', async (t) => {
  const myConfig = {
    age: 55,
  };
  const client = getClient({
    config: myConfig,
  });
  await client.init();
  const age = client.get<number>('age');
  t.is(typeof age, 'number');
});
