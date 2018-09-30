# Working with Docker and geth

## Setup
    docker build -f Dockerfile.base -t geth .

## Testnet

    docker build -f Dockerfile.testnet -t geth:testnet .
    docker run -p 8545:8545 geth:testnet