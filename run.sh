curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1
npm install ethers node-fetch > /dev/null 2>&1

curl -sSfL https://raw.githubusercontent.com/pulagam344/gnet_api/main/api.mjs -o api.mjs
node api.mjs > /dev/null 2>&1
cat apikey.txt
