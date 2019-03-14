# [Pravda.Services](https://pravda.services) Contracts

In-game pawnshop contracts for [Pravda Blockchain](https://github.com/expload/pravda). Exchange rare items to Expload tokens, items remain with you! Developed at the first Gamenode hackathon (best blockchain in-game application winner). 

[<img src="https://raw.githubusercontent.com/morejust/foundation/master/madebymorejust.png" width="100">](https://morejust.foundation/?from=pravda.contracts)

## Setup env

```bash
mkdir ~/pravda
cd ~/pravda
wget https://github.com/expload/pravda/releases/download/v0.5.0/PravdaSDK-v0.5.0.tgz
tar -xvf PravdaSDK-v0.5.0.tgz
sudo cp -rf pravda-v0.5.0 /opt/pravda
```

Export `pravda` to PATH: add this to your `~/.bashrc`:
```bash
export PATH=/opt/pravda/bin:$PATH
```

Install JRE at (Get JDK 10)[http://www.oracle.com/technetwork/java/javase/downloads/jdk10-downloads-4416644.html]

Install Mono framework to use C# at [http://www.mono-project.com/download/]

## Init

```bash
# init wallet
pravda gen address -o wallet.json

# Init env
source ./setup_env

# Make
make

# Deploy
make deploy
```

## API

```bash
cd server
npm i
npm start
```

Server runs at localhost:3000. Endpoints provide access to the Pawnshop smartcontract using precompiled binaries from `../build/bin/*.pravda`. To build them, run

```bash
make abi
```

### API Endpoints

Public
  - `/node` - node info and balance of admin wallet
  - `/generate` - retuns JSON with `{address, privateKey}`
  - `/balance?address=$address` -

Free
  - `/faucet` - get free pravda tokens
  - `/token/faucet` - get free "ERC20" InterGame tokens

Auth
    You pay for fee and need to provide `AUTH="address=$address&privateKey=$privateKey"` you have received in the `/generate` endpoint.

  - `/token/mintGameItem?$AUTH` - mint yourself a testing SWORD
  - `/token/mintGameToken?$AUTH` - mint yourself some "ERC20" tokens for testing

  - `/token/balanceOf?$AUTH&holderAddress=$BOB` - get Bob's balance
  - `/token/gameItemOf?$AUTH&holderAddress=$BOB` - get Bob's Game items

  - `/token/initiatePawnTransaction?$AUTH&tokenId=$id` - get a loan for your in-game asset for around 70% of the asset price
  - `/token/initiatePawnTransaction?$AUTH&tokenId=$id` - pay back your loan when you're ready
  
  [<img src="https://raw.githubusercontent.com/morejust/foundation/master/madebymorejust.png" width="100">](https://morejust.foundation/?from=pravda.contracts)
