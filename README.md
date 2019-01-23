# GRUUT SERVICE ENDPOINT

'Gruut service endpoint' helps you make transactions and find specific block and transaction.

## Requirements

* Node ≥ v10.11.0
  
* NPM ≥ v6.5.0

* MariaDB

> We have tested on 'Ubuntu 18.04', 'macOS Mojave 10.14.2.'

## Installation

### 1. Setting a environment file

We are using a [dotenv](https://github.com/motdotla/dotenv) package.
```shell
$ vim ${yourProjectRoot}/.env
```

Sample environment file
```
# ${yourProjectRoot}/.env

SEQUELIZE_USER="root"
SEQUELIZE_PASSWORD="1111"
NODE_ENV="development"
PORT="49090"
MERGER_ADDRESS1="127.0.0.1:50051"
MERGER_ADDRESS2="127.0.0.1:50052"
MERGER_ADDRESS3="127.0.0.1:50053"
GA_ADDRESS="127.0.0.1"
GA_PORT="3000"
MY_ID="GENTSE-1"
```

### 2. Install dependencies

```shell
$ npm install
$ sequelize db:create
$ sequelize db:migrate
$ npm run prod
```
