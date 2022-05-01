// main.js
// start date: 4/2/2022
//
// A simple Blockchain implementation in Node that uses Proof-of-Work mining.
// (Code not tested for production)
const SHA256 = require('crypto-js/sha256')

/////////////////////////////////////////////////////////////////////
// A simplified transaction object that contains from, to, amount:
/////////////////////////////////////////////////////////////////////
class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = amount
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
		
		// difficulty controls time it takes to mine new blocks
		this.difficulty = 5

		// amount of rewards (eg. in erginCoin) miners receive
		this.miningRewards = 100
	}

	createGenesisBlock() {
		return new Block("01/01/2022", "Genesis block", "0")
	}

	getLatestBlock() {
		return this.chain[this.chain.length-1]
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
	}

	isChainValid() {
		for( let i = 1; i < this.chain.length; i++ ) {
			const currentBlock = this.chain[i]
			const previousBlock = this.chain[i-1]
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

let erginCoin = new BlockChain()

// console.log(`Mining block 1...`)
// erginCoin.addBlock(new Block(1, "04/21/2022", {amount: 4 }))

// console.log(`Mining block 2...`)
// erginCoin.addBlock(new Block(2, "04/30/2022", {amount: 10 }))



