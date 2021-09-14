var Web3 = require('web3');
const abiDecoder = require('abi-decoder');
const schedule = require('node-schedule');
var moment = require('moment');

// var web3 = new Web3('http://localhost:8545');
// var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://eth-rinkeby.ws.alchemyapi.io/v2/B3oGU45an_kzPmFJIBWkiEQlHB-CR8Tf'));
var web3 = new Web3('wss://eth-mainnet.alchemyapi.io/v2/lWK5IwNRukmD7g2uGy4ohYi92XIH92m8');

var abi = require('../abi/loot.json');
var contractAddress = '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7';
var contract = new web3.eth.Contract(abi, contractAddress);
const LIMIT = 10;
let block = false;

var { pool } = require('../config/database');

async function updateBlockNumber(startBlock) {
    let sql = `SELECT * from loot_owner where tokenId = -1`;
    let [rows] = await pool.query(sql);
    let data = {
        block_number: Number(startBlock) + LIMIT,
    };
    if (rows.length == 0) {
        sql = `INSERT INTO loot_owner set ?`;
        data.tokenId = -1;
        await pool.query(sql, data);
    } else {
        sql = `UPDATE loot_owner set ? where tokenId = -1`;
        await pool.query(sql, data);
    }
}

async function main() {
    if (block) return;
    block = true;
    let sql = `SELECT * from loot_owner ORDER BY block_number desc LIMIT 1`;
    let [rows] = await pool.query(sql);
    if (rows.length == 0) {
        startBlock = 13108887;
    } else {
        startBlock = Number(rows[0].block_number) + 1;
    }
    contract.getPastEvents('allEvents', {
        fromBlock: startBlock,
        toBlock: Number(startBlock) + LIMIT,
    }, async (error, events) => {
        if (events.length > 0) {
            let conn = null;
            let matchData = [];
            try {
                // 开启事物，同时向数据库记录一个区块的数据
                conn = await pool.getConnection();
                await conn.beginTransaction();
                for (let item of events) {
                    let txInfo = await web3.eth.getTransaction(item.transactionHash);
                    abiDecoder.addABI(abi);
                    let decodeData = abiDecoder.decodeMethod(txInfo.input);
                    if (decodeData && decodeData.name == 'claim') {
                        matchData.push(item);
                        // 判断交易是否执行成功
                        let receiptInfo = await web3.eth.getTransactionReceipt(item.transactionHash);
                        if (receiptInfo && receiptInfo.status == 1 && receiptInfo.logs.length != 0) {
                            let blockInfo = await web3.eth.getBlock(item.blockNumber);
                            let data = {
                                tokenId: decodeData.params[0].value,
                                hash: txInfo.hash,
                                claimed_by: txInfo.from,
                                claim_time: moment(blockInfo.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
                                block_number: item.blockNumber,
                                block_hash: txInfo.blockHash,
                                hash: txInfo.hash,
                            }
                            let sql = `INSERT INTO loot_owner set ?`;
                            console.log(`sql: ${sql} tokenId: ${data.tokenId} block_number: ${data.block_number}`);
                            await conn.query(sql, data);
                        }
                    }
                }
                await conn.commit();
            } catch (error) {
                if (conn) await conn.rollback();
                console.log('error' + startBlock);
                console.log('error' + Number(startBlock) + LIMIT);
                throw error;
            } finally {
                block = false;
                if (conn) await conn.release();
            }
            if (matchData.length == 0) {
                await updateBlockNumber(startBlock);
                block = false;
            }
        } else {
            // 如果当前区块没有数据，记录一下区块高度，下次查询从最新区块开始
            await updateBlockNumber(startBlock);
            block = false;
        }
    })
    pool.end();
};

schedule.scheduleJob('*/1 * * * * *', async function (fireDate) {
    await main();
});
