const sha256= require('sha256');

class Blockchain
{
    constructor()
    {
        this.chain=[];
        this.pendingTransactions=[];
        this.createNewBlock(100,'0','0');
    }

    createNewBlock= function(nonce,prevBlockHash,hash) 
    {
        const newBlock={
            index:this.chain.length+1,
            timestamp:Date.now(),
            transactions:this.pendingTransactions,
            nonce:nonce,
            hash:hash,
            prevBlockHash:prevBlockHash
        };

        this.pendingTransactions=[];
        this.chain.push(newBlock);
        return newBlock;
    }
    getLastBlock =function (params) {
        return this.chain[this.chain.length-1];
    }
    createNewTransaction=function (amount,sender,recipent) {
        const newTransaction =
        {
            amount:amount,
            sender:sender,
            recipent:recipent
        }
        this.pendingTransactions.push(newTransaction);
        return this.getLastBlock()['index']+1;
    }

    hashBlock =function (previousBlockHash,currentBlockData,nonce) {
        const dataAsString= previousBlockHash+nonce.toString()+JSON.stringify(currentBlockData);
        //console.log(dataAsString);
        const hash= sha256(dataAsString);
        return hash;
    }

    proofOfWork = function (previousBlockHash,currentBlockData) 
    {
     let nonce = 0;
     let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);

     while (hash.substring(0,5)!=='00000') 
     {
       console.log(hash.substring(0,1)!=='0');  
       nonce++;
       console.log(nonce);
       hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);    
       console.log(hash +" "+ nonce);
     }  
     return nonce; 
    }

}

module.exports = Blockchain;