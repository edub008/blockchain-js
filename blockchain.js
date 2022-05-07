// blockchain.js
// start date: 4/3/2022
//
// A simple Blockchain implementation in Node that uses Proof-of-Work mining.
// (Code not tested for production)
const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

/////////////////////////////////////////////////////////////////////
// A simplified transaction object that contains from, to, amount:
/////////////////////////////////////////////////////////////////////
class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = amount
	}

	calculateHash() {
		return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
	}

	signTransaction(signingKey) {
		if( signingKey.getPublic('hex') !== this.fromAddress ) {
			throw new Error('You cannot sign transactions for other wallets!')
		}

		const hashTx = this.calculateHash()
		const sig = signingKey.sign(hashTx, 'base64')
		this.signature = sig.toDER('hex')
	}

	isValid() {
		if( this.fromAddress === null ) return signature

		if( !this.signature || !this.signature.length ) {
			throw new Error('No signature in this transaction.')
		}

		const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
		return publicKey.verify(this.calculateHash(), this.signature)
	}
}

/////////////////////////////////////////////////////////////////////
// Our Fundamental block that holds transaction and other data:
/////////////////////////////////////////////////////////////////////
class Block {
	constructor(timestamp, transactions, previousHash = '') {
		this.timestamp = timestamp
		this.transactions = transactions
		this.previousHash = previousHash
		this.hash = this.calculateHash()
		this.nonce = 0
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
	}

	mineBlock(difficulty) {
		while( this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0") ) {
			this.nonce++
			this.hash = this.calculateHash()
		}

		console.log(`Block mined: ${this.hash}`)
	}

	hasValidTransactions() {
		for( const tx of this.transactions ) {
			if( !tx.isValid() ) {
				return false
			}
		}
		return true
	}
}

/////////////////////////////////////////////////////////////////////
// Our List/Array based Blockchain implementation:
/////////////////////////////////////////////////////////////////////
class BlockChain {
	constructor() {

		// our initial (genesis) block
		this.chain = [this.createGenesisBlock()]
		
		// list of pending transactions before the latest block is created
		this.pendingTransactions = []
		
		// difficulty controls time it takes to mine new blocks (ie. proof-of-work)
		this.difficulty = 5

		// amount of rewards (eg. in erginCoin) miners receive
		this.miningReward = 100
	}

	// the default genesis block with null data
	createGenesisBlock() {
		return new Block("01/01/2022", "Genesis block", "0")
	}

	getLatestBlock() {
		return this.chain[this.chain.length-1]
	}

	minePendingTransactions(miningRewardAddress) {
	  const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
	  this.pendingTransactions.push(rewardTx);

	  const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
	  block.mineBlock(this.difficulty);

	  console.log('Block successfully mined!');
	  this.chain.push(block);
	  this.pendingTransactions = [];
	}

	addTransaction(transaction) {
		if( !transaction.fromAddress || !transaction.toAddress ) {
			throw new Error('Transaction must include from and to address!')
		}
		if( !transaction.isValid() ) {
			throw new Error('Cannot add invalid transaction to chain!')
		}
		this.pendingTransactions.push(transaction)
	}

	getBalanceOfAddress(address) {
		let balance = 0
		for( const block of this.chain) {
			for( const trans of block.transactions ) {
				if( trans.fromAddress === address ) {
					balance -= trans.amount
				}

				if( trans.toAddress === address ) {
					balance += trans.amount
				}
			}
		}
		return balance
	}

	getPendingTransactions() {
		return this.pendingTransactions
	}

	isChainValid() {
		for( let i = 1; i < this.chain.length; i++ ) {
			const currentBlock = this.chain[i]
			const previousBlock = this.chain[i-1]

			if( !currentBlock.hasValidTransactions() ) {
				return false
			}

			if( currentBlock.hash !== currentBlock.calculateHash() ) {
				return false
			}
			if( currentBlock.previousHash !== previousBlock.hash ) {
				return false
			}
		}
		// else chain is valid
		return true
	}
}

module.exports.BlockChain = BlockChain
module.exports.Transaction = Transaction

