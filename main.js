const {BlockChain, Transaction} = require('./blockchain')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const myKey = ec.keyFromPrivate('a8dc0d62a0a9ad28ecab870166e39b46b8f965ae634ed692cf2efa355424f3fe')
const myWalletAddress = myKey.getPublic('hex')

let erginCoin = new BlockChain()

const tx1 = new Transaction(myWalletAddress, 'address2', 10)
tx1.signTransaction(myKey)
erginCoin.addTransaction(tx1)

console.log(`Starting the miner...`)
erginCoin.minePendingTransactions(myWalletAddress)
console.log(`\nBalance of bob is ${erginCoin.getBalanceOfAddress(myWalletAddress)}`)
console.log(`pending transactions -> ${JSON.stringify(erginCoin.getPendingTransactions())}`)