all:
	csc lib/expload.cs -target:Library -out:build/expload.dll
	csc token.cs -reference:build/expload.dll -out:build/token.exe
	pravda compile dotnet --input build/token.exe --output build/token.pravda

