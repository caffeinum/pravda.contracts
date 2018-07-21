all: token erc721basic

token: expload
	csc token.cs -reference:build/expload.dll -out:build/token.exe
	pravda compile dotnet --input build/token.exe --output build/token.pravda

erc721: expload
	csc ERC721Basic.cs -reference:build/expload.dll -out:build/erc721basic.exe
	pravda compile dotnet --input build/erc721basic.exe --output build/erc721basic.pravda

expload:
	mkdir build
	csc lib/expload.cs -target:Library -out:build/expload.dll

deploy_token:
	pravda broadcast deploy -l 60000 -p 1 \
		-w wallet.json -e ${NODE}/broadcast \
		-i build/token.pravda
