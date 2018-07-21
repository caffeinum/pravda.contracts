# Setup env

```bash
mkdir ~/pravda
cd ~/pravda
wget https://github.com/expload/pravda/releases/download/v0.5.0/PravdaSDK-v0.5.0.tgz
unzip PravdaSDK-v0.5.0.tgz
sudo cp -rf pravda-v0.5.0 /opt/pravda
```

Export `pravda` to PATH: add this to your `~/.bashrc`:
```bash
export PATH=/opt/pravda/bin:$PATH
```

# Init wallet

```bash
pravda gen address -o wallet.json
```

# Make

```bash
make
```

# Deploy
```bash
```