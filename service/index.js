var Web3 = require('web3');
const abiDecoder = require('abi-decoder');
const schedule = require('node-schedule');

// var web3 = new Web3('http://localhost:8545');
// var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://eth-rinkeby.ws.alchemyapi.io/v2/B3oGU45an_kzPmFJIBWkiEQlHB-CR8Tf'));
var web3 = new Web3('wss://eth-rinkeby.ws.alchemyapi.io/v2/B3oGU45an_kzPmFJIBWkiEQlHB-CR8Tf');

var abi = require('../abi/trlabmarket.json');
var contractAddress = '0xd926021cf5958BaAe33F00cc766bfBca2795982F';
var contract = new web3.eth.Contract(abi, contractAddress);

// const job = schedule.scheduleJob('*/1 * * * * *', async function (fireDate) {
contract.getPastEvents('allEvents', {
    filter: { _from: '0x39a0b1032CD076fF1791B748F9DF543f357BF9c6' },
    fromBlock: 0,
    toBlock: 'latest'
}, async (error, events) => {
    for (let item of events) {
        let txInfo = await web3.eth.getTransaction(item.transactionHash);
        abiDecoder.addABI(abi);
        let decodeData = abiDecoder.decodeMethod(txInfo.input);
        // console.log(decodeData);
        // web3.eth.getBlock(item.blockNumber).then(res => {
        //   console.log(res);
        // })
        let blockInfo = await web3.eth.getBlock(item.blockNumber);
        // console.log(blockInfo);
        if (decodeData.name == 'bidNft') {
            // console.log(item);
            // console.log(txInfo);
            // console.log(decodeData);
            let nft_contract = decodeData.params.find(item => {
                return item.name == 'nftContract'
            });
            let nft_index = decodeData.params.find(item => {
                return item.name == 'nftIndex'
            });
            let data = {
                transaction_hash: item.transactionHash,
                value: web3.utils.fromWei(txInfo.value, 'ether'),
                to: txInfo.to,
                from: txInfo.from,
                nft_contract: nft_contract.value,
                nft_index: nft_index.value,
                block_number: item.blockNumber,
                timestamp: blockInfo.timestamp,
            };
            console.log(data);
        }
    }
});
// });
