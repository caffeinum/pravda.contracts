all: dirs token pawnshop build_methods

# env
env:
	. ./setup_env

# LIB
expload: dirs
	csc lib/expload.cs -target:Library -out:build/lib/expload.dll

dirs:
	mkdir -p build
	mkdir -p build/lib
	mkdir -p build/win
	mkdir -p build/bin
	mkdir -p abi

# SMART CONTRACTS

token: expload dirs
	csc token.cs \
		-reference:build/lib/expload.dll \
		-out:build/win/token.exe
	pravda compile dotnet \
		--input build/win/token.exe \
		--output build/bin/token.pravda

pawnshop: expload dirs
	csc pawnshop.cs \
		-reference:build/lib/expload.dll \
		-out:build/win/pawnshop.exe
	pravda compile dotnet \
		--input build/win/pawnshop.exe \
		--output build/bin/pawnshop.pravda

# DEPLOY TO NET

deploy: token pawnshop env
	pravda broadcast deploy -l 60000 -p 1 \
		-w wallet.json -e ${NODE}/broadcast \
		-i build/bin/pawnshop.pravda

dry_run: token pawnshop env
	pravda broadcast deploy \
		-w wallet.json -e ${NODE}/broadcast \
		-i build/bin/pawnshop.pravda --dry-run

# ABI FOR BROWSER

build_methods: dirs
	pravda compile asm \
		--input methods/getBalance.asm \
		--output build/bin/getBalance.pravda
	pravda compile asm \
		--input methods/mintTokens.asm \
		--output build/bin/mintTokens.pravda
	pravda compile asm \
		--input methods/mintGameItem.asm \
		--output build/bin/mintGameItem.pravda
	pravda compile asm \
		--input methods/balanceOf.asm \
		--output build/bin/balanceOf.pravda
	pravda compile asm \
		--input methods/gameItemOf.asm \
		--output build/bin/gameItemOf.pravda
	pravda compile asm \
		--input methods/initiatePawnTransaction.asm \
		--output build/bin/initiatePawnTransaction.pravda
	pravda compile asm \
		--input methods/finishPawnTransaction.asm \
		--output build/bin/finishPawnTransaction.pravda
	pravda compile asm \
		--input methods/transfer.asm \
		--output build/bin/transfer.pravda
	pravda compile asm \
		--input methods/transferOwnership.asm \
		--output build/bin/transferOwnership.pravda
	pravda compile asm \
		--input methods/initContract.asm \
		--output build/bin/initContract.pravda


abi: build_methods
	base64 build/bin/getBalance.pravda > abi/getBalance.base64
	base64 build/bin/mintTokens.pravda > abi/mintTokens.base64
