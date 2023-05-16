const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.router();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPostgresVersion() {
  const result = await sql`select version()`;
  console.log(result);
}
getPostgresVersion();

router.get('/', (req, res)=>{
    res.json({
        'hello':'hi'
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const query = sql`SELECT id FROM users WHERE username = ${username} AND password = ${password}`;
      const result = await query;
  
      console.dir(result[0].id);
      if (result[0].id >= 0) {
        res.status(200).json({ message: 'Login successful', userId: result[0].id });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

app.use('/.netlify/netlify/functions/api', router);
module.exports.handler = serverless(app);