# Working with Docker and geth

## Setup

    docker build -t geth .

## Run

    docker run -it -p 8545:8545 geth:latest

## Open new shell
    
    docker exec -it <container> bash

## Mainnet

    geth init eth_common/frontier.json
    geth --networkid 1 --datadir .ethereum/testnet/ --rpc 

## Testnet

    geth --testnet --datadir .ethereum/testnet/ --rpc 

## Private

    geth --networkid 15 --datadir .ethereum/privatenet/ --rpc 

## Connect to running geth

    geth attach ipc:.ethereum/privatenet/geth.ipc

## Creating a new account and starting miner

    var account = personal.newAccount("aPassword")
    miner.setEtherbase(account)
    miner.start(1)