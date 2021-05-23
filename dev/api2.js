var restify = require('restify');
const Blockchain =require('./blockchain');
const { v4: uuidv4  } = require('uuid');
const coin = new Blockchain();
const bodyParser =require('body-parser');
const nodeAddress= uuidv4().split('-').join('');
const port =3000;

var server = restify.createServer();
server.get('/blockchain', (req, res, next)=>
{
  res.send(coin);
});

server.post('/transaction',(req,res)=>
{
    let blockIndex = coin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipent);
    res.json({note:'Transação adicionada no indice'+blockIndex.toString()})   
});

server.get('/mine',(req,res)=>
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

server.listen(port, function() {
  console.log('%s rodando at %s', server.name,port);
});