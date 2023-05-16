const { default: axios } = require('axios');

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
    const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

    const response = await axios.post(URL, {
      query: `
        SELECT id FROM users WHERE username = '${username}' AND password = '${password}'
      `,
    });

    const { id } = response.data.data[0];

    if (id) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', userId: id }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid username or password' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};

