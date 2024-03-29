# HappyPath - Remote Config

HappyPath provides developers with a simple way to create and manage remote configuration files to control any part of your application from the cloud. The values you change in your remote config will be updated on a specific time interval that you define, automatically.

You can host your own config file or manage it in the cloud by creating a free account on our website: [happypath.io](https://www.happypath.io/).

__➡️ ➡️ For more information, installation instructions, and examples, please visit our documentation website: [docs.happypath.io](https://docs.happypath.io/).__

## Installation

### Using NPM

`npm install @happypath-io/remote-config`

## Configuration

Import and initialize the client by specifying the configuration options:

```
import getClient from '@happypath-io/remote-config'

// Defaults to happypath.io configurations
const client = getClient({
  apiKey: 'YOUR-API-KEY', // get a free API key on app.happypath.io
})

// Use local file
const client = getClient({
  filePath: 'path/to/your/config.json',
})

// Host your own config
const client = getClient({
  remoteUrl: 'https://example.com/your-config.json',
})

// Provide config object
const client = getClient({
  config: {
    name: 'john doe',
    age: 30,
    otherAttributes: {
      otherLists: [
        "CA",
        "MD",
      ]
    }
  }
})

// Finally, initiallize config. This is an async function. This can be done whenever app is initialized.
await client.init();

// Alternatively, if you cannot await during initialization, you can await until it is loaded within your logic.
client.init();
// Then, before usage:
await client.waitUntilLoaded();
```

## Usage

By default, the client refreshes the configuration every 30 seconds. You can override this by passing the `refreshIntervalSeconds` parameter during client initialization.

The client exposes a single method `get`, which accepts a `key` and an optional default value. It returns the corresponding value from the config store. Note that the value is not a promise.

### TypeScript
```
const name = client.get<string>('name');
const isEnabled = client.get<boolean>('isEnabled', false);
const age = client.get<number>('age');
const list = client.get<string[]>('items', ['defaultValue']);
const person = client.get<Person>('person');
```

### JavaScript
```
const name = client.get('name');
const isEnabled = client.get('isEnabled', false);
const age = client.get('age');
const list = client.get('items', ['defaultValue']);
const person = client.get('person');
```

Please feel free to contact us at hello@happypath.io if you have any questions or issues.
