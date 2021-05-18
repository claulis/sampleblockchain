const express=require('express');
const Blockchain =require('./blockchain');
const { v4: uuidv4  } = require('uuid');
const app = express();
const coin = new Blockchain();
const bodyParser =require('body-parser');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const nodeAddress= uuidv4().split('-').join('');

app.get('/blockchain',function(req,res)
{
 res.send(coin);
});
app.post('/transaction',function(req,res)
{
    let blockIndex = coin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipent);
    res.json({note:'Transação adicionada no indice'+blockIndex.toString()})
    

   
});
app.get('/mine',function(req,res)
{
    let lastBlock= coin.getLastBlock();
    let previousBlockHash = lastBlock['hash'];
    let currentBlockData={
        transactions:coin.pendingTransactions,
        index:lastBlock['index']+1
    };
    let nonce=coin.proofOfWork(previousBlockHash,currentBlockData);
    let blockHash= coin.hashBlock(previousBlockHash,currentBlockData,nonce);
    let newBlock=coin.createNewBlock(nonce,previousBlockHash,blockHash);
    res.json({
        note:"bloco minerado com sucesso",
        block:newBlock
    });
    coin.createNewTransaction(12.5,"00",nodeAddress);
});
app.listen(3000,function (params) {
    console.log('rodando 3000');
});
