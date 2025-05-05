// Create this as debug-auth.js in the backend/routes folder
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

async function debugAuth() {
  try {
    const credentialsPath = path.resolve(__dirname, '../credentials/save-n-savor-990e41e5a1bd.json');
    
    console.log('Credentials path:', credentialsPath);
    console.log('File exists:', fs.existsSync(credentialsPath));
    
    // Read and display the credentials file to check format
    const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log('Project ID:', creds.project_id);
    console.log('Client Email:', creds.client_email);
    console.log('Has Private Key:', !!creds.private_key);
    
    const auth = new GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/generative-language']
    });
    
    // Get client info
    const client = await auth.getClient();
    console.log('Got client:', !!client);
    
    // Test token retrieval
    const token = await client.getAccessToken();
    console.log('Token object:', token);
    
    // Test if token is valid by making a simple API call
    const { default: axios } = await import('axios');
    const headers = {
      'Authorization': `Bearer ${token.token}`,
      'Content-Type': 'application/json'
    };
    
    try {
      const response = await axios.get('https://generativelanguage.googleapis.com/v1beta/models', { headers });
      console.log('API call successful:', response.status);
    } catch (apiError) {
      console.error('API call failed:', apiError.response?.data || apiError.message);
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

debugAuth();