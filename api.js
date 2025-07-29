import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output file
const apiKeyPath = path.resolve(__dirname, 'apikey.txt');

// Random name generator for API key naming
const names = [
  'alex', 'john', 'mike', 'sam', 'ryan', 'james', 'paul', 'kevin', 'daniel', 'david',
  'chris', 'jason', 'mark', 'brian', 'steve', 'george', 'nathan', 'tyler', 'ben', 'jack',
  'lily', 'sara', 'tina', 'emma', 'olivia', 'ava', 'mia', 'ella', 'zoe', 'chloe'
];

function getRandomName() {
  const index = Math.floor(Math.random() * names.length);
  return names[index];
}

async function connectToGaia(wallet) {
  const msgObj = {
    wallet_address: wallet.address,
    timestamp: Date.now(),
  };

  const messageStr = JSON.stringify(msgObj);
  const signature = await wallet.signMessage(messageStr);

  const res = await fetch('https://api.gaianet.ai/api/v1/users/connect-wallet/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signature,
      message: msgObj,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to connect wallet: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data.access_token;
}

async function createApiKey(token) {
  const name = getRandomName();

  const res = await fetch('https://api.gaianet.ai/api/v1/users/apikey/create/', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create API key: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data.api_key;
}

async function run() {
  for (let i = 1; i <= 100; i++) {
    try {
      console.log(`\n🚀 Creating Wallet #${i}...`);
      const wallet = ethers.Wallet.createRandom();

      const token = await connectToGaia(wallet);
      const apiKey = await createApiKey(token);

      fs.appendFileSync(apiKeyPath, `${apiKey}\n`);
      console.log(`✅ API Key saved: ${apiKey}`);
    } catch (err) {
      console.error(`❌ Failed to process Wallet #${i}:`, err.message);
    }
  }

  console.log('\n🎉 Done! All API keys saved to apikey.txt');
}

run();
