# Working with Docker and geth

## Setup

    docker build -t geth .

## Run

    docker run -it -p 8545:8545 geth:latest

## Testnet

    geth --testnet  --datadir ./eth_common/testnet/ --ws --wsport "8545" --wsaddr "0.0.0.0" --wsorigins "*"

## Private

    geth --networkid 15 --datadir ./eth_common/privatenet/ --ws --wsport "8545" --wsaddr "0.0.0.0" --wsorigins "*"