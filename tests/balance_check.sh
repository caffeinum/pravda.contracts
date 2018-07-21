#!/bin/sh

CURDIR=`pwd`/$(dirname $0)
source $CURDIR/../setup_env

# test 1

BALANCE=`curl -s $NODE/balance?address=$ADDRESS`
echo $BALANCE

if [[ $BALANCE != 0 ]]; then
  echo '+ balance passed'
else
  echo '- balance failed'
fi
