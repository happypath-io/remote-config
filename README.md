# HappyPath - Dynamic Config

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

### Usage
```
import dynamicConfig from '@happypath-io/dynamic-config'

const name = dynamicConfig.get<string>('name');
const isEnabled = dynamicConfig.get<boolean>('isEnabled');
const age = dynamicConfig.get<number>('age');
const list = dynamicConfig.get<string[]>('items');
const person = dynamicConfig.get<Person>('person');
```
