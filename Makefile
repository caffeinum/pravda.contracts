all: token

token: expload
	csc token.cs -reference:build/expload.dll -out:build/token.exe
	pravda compile dotnet --input build/token.exe --output build/token.pravda

expload:
	mkdir build
	csc lib/expload.cs -target:Library -out:build/expload.dll

deploy_token:
	pravda broadcast deploy -l 60000 -p 1 \
		-w wallet.json -e ${NODE}/broadcast \
		-i build/token.pravda
