# HappyPath - Dynamic Config

HappyPath gives developers a simple way to create and manage dynamic configuration files to control any part of your application from the cloud. Host  your own config file, or manage it in the cloud for free on [happypath.io](https://docs.happypath.io)

See docs, installation and examples here: [docs.happypath.io](https://docs.happypath.io)

## Installation

### Using NPM
`npm install @happypath-io/dynamic-config`

## Configuration

Import & initialize client
```
import dynamicConfig from '@happypath-io/dynamic-config'

await dynamicConfig.init({
  apiKey: 'YOUR-API-KEY',
  environment: '<development | staging | production>'
})
```

## Usage

By default, the client will refresh configuration every 30 seconds. You can override that by passing `refreshIntervalSeconds` during initialization.

Client exposes single methods `get` which accepts `key` and optional default value. It returns corresponding value from its config.

```
import dynamicConfig from '@happypath-io/dynamic-config'

const name = dynamicConfig.get<string>('name');
const isEnabled = dynamicConfig.get<boolean>('isEnabled', false);
const age = dynamicConfig.get<number>('age');
const list = dynamicConfig.get<string[]>('items', ['defaultValue']);
const person = dynamicConfig.get<Person>('person');
```
