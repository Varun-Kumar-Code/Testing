require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// First try to build the service account from environment variables (recommended)
// Fall back to a JSON file in the backend directory if env vars are not present.
let serviceAccount;
if (process.env.SERVICE_ACCOUNT_PRIVATE_KEY && process.env.SERVICE_ACCOUNT_CLIENT_EMAIL) {
  // Private key in .env will have literal "\n" sequences; convert them to real newlines
  const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
  serviceAccount = {
    type: process.env.SERVICE_ACCOUNT_TYPE || 'service_account',
    project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
    token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
    universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
  };
} else {
  // look for a JSON file in this directory as a fallback
  const serviceAccountEnv = process.env.SERVICE_ACCOUNT_PATH;
  let serviceAccountPath;
  if (serviceAccountEnv) {
    serviceAccountPath = path.isAbsolute(serviceAccountEnv) ? serviceAccountEnv : path.join(__dirname, serviceAccountEnv);
  } else {
    const files = fs.readdirSync(__dirname);
    const match = files.find(f => f.startsWith('genai-973e8-firebase-adminsdk-fbsvc') && f.endsWith('.json'));
    if (match) {
      serviceAccountPath = path.join(__dirname, match);
    }
  }

  if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
    console.error('Firebase service account JSON not found and SERVICE_ACCOUNT_* env vars are not set.');
    console.error('Set the SERVICE_ACCOUNT_* env vars or provide SERVICE_ACCOUNT_PATH pointing at the JSON file.');
    process.exit(1);
  }

  serviceAccount = require(serviceAccountPath);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.SERVICE_ACCOUNT_PROJECT_ID
});

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
