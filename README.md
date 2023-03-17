# HappyPath - Remote Config

HappyPath gives developers a simple way to create and manage remote configuration files to control any part of your application from the cloud. Host  your own config file, or manage it in the cloud by creating a free account here: [app.happypath.io](https://app.happypath.io/#auth-sign-up)

See docs, installation and examples here: [docs.happypath.io](https://docs.happypath.io)

## Installation

### Using NPM
`npm install @happypath-io/remote-config`

## Configuration

Import & initialize client
```
import getClient from '@happypath-io/remote-config'

// Defaults to happypath.io configurations
const remoteConfig = getClient({
  apiKey: 'YOUR-API-KEY',
})

// Use local file
const remoteConfig = getClient({
  customFilePath: 'path/to/your/config.json',
})

// Host your own config
const remoteConfig = getClient({
  customRemoteUrl: 'https://example.com/your-config.json',
})

// Provide config object
const remoteConfig = getClient({
  customConfig: {
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

// Finally, initiallize config. This is an async function.
await remoteConfig.init()
```

## Usage

By default, the client will refresh configuration every 30 seconds. You can override that by passing `refreshIntervalSeconds` during client initialization.

Client exposes single methods `get` which accepts `key` and optional default value. It returns corresponding value from config store. Note that value is not a promise.

```
import remoteConfig from '@happypath-io/remote-config'

const name = remoteConfig.get<string>('name');
const isEnabled = remoteConfig.get<boolean>('isEnabled', false);
const age = remoteConfig.get<number>('age');
const list = remoteConfig.get<string[]>('items', ['defaultValue']);
const person = remoteConfig.get<Person>('person');
```
