#!/bin/sh

CURDIR=`pwd`/$(dirname $0)
ROOT=$CURDIR/..
source $ROOT/setup_env

PROGRAM=`base64 $ROOT/build/bin/mintTokens.pravda`
SIGNTX="f7222366439fa320ce3117ca628c59e939dc0688749b2017bdba56bd424693c6eaff7f4c1e180c3acdeefcbd57457194c2688b57e90f679bc3d4d03abe81ab03"

echo GET $NODE/broadcast\
?from=$ADDRESS\
\&signature=$SIGNTX\
\&nonce=183232263\
\&wattLimit=10000\
\&wattPrice=1
echo
# CONSTRUCT TX
# --trace-ascii /dev/stdout \
curl -H "Content-Type: application/base64" \
    --data "$PROGRAM" \
    $NODE/broadcast\
?from=$ADDRESS\
\&signature=$SIGNTX\
\&nonce=183232263\
\&wattLimit=10000\
\&wattPrice=1

echo
