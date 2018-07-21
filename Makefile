all: dirs token abi

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
			--output build/win/token.pravda

pawnshop: expload dirs
	csc pawnshop.cs \
		-reference:build/lib/expload.dll \
		-out:build/win/pawnshop.exe
	pravda compile dotnet \
		--input build/win/pawnshop.exe \
		--output build/bin/pawnshop.pravda

# DEPLOY TO NET

deploy_all: token
	pravda broadcast deploy -l 28000 -p 1 \
		-w wallet.json -e ${NODE}/broadcast \
		-i build/bin/pawnshop.pravda

dry_run: token
	pravda broadcast deploy \
		-w wallet.json -e ${NODE}/broadcast \
		-i build/bin/pawnshop.pravda --dry-run

# ABI FOR BROWSER

abi: dirs
	pravda compile asm \
		--input methods/getBalance.asm \
		--output build/bin/getBalance.pravda
	hexdump -e '"%x"' build/bin/getBalance.pravda > abi/getBalance.hex
