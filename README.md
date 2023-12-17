# Blockchain Node.js POW

This is a testing/educational implementation of a Node.js Blockchain crytocurrency that uses the Proof-of-Work consensus algorithm.

## Features

* Simple proof-of-work algorithm
* Verify blockchain (to prevent tampering)
* Generate wallet (private/public key)
* Sign transactions

## Dependencies

- Node v17.4.0+
- Yarn v1.22.18+

## Installation & Build Scripts

In the project directory, you can run:

### `yarn`

Downloads and installs all required project dependencies

### `yarn run test` or `yarn test`

Runs the test application.

### Sample Output

```js
$ yarn test
yarn run v1.22.19
$ echo "Testing package...
" && node ./src/main.js
Testing package...

Starting the miner...
Block mined: 00000789c4091882771b14c500fd2c48b6f8be15fbe2f05e617446041ec8250b
Block successfully mined!

Balance of bob is 90
pending transactions -> []
```
