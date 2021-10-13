const fetch = require('cross-fetch');

const exchangeCodeForToken = async (oauthCode) => {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'applicaiton/json',
      'Content-Type': 'applicaiton/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: oauthCode,
    }),
  });

  const tokenBody = await res.json();

  return tokenBody.access_token;
};

const getUserProfile = async (token) => {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  const profileBody = await res.json();

  return profileBody;
};

module.exports = { exchangeCodeForToken, getUserProfile };
