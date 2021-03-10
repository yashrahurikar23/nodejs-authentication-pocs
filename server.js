require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./helpers/auth')

const app = express();
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const users = [];

app.get('/users', authenticateToken, async (req, res) => {
  res.status(200).send(users);
})

app.post('/users', async (req, res) => {
  const { name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, password: hashedPassword };
    users.push(newUser);
    res.status(201).send(newUser);
  } catch(error) {
    res.json(error);
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name = req.body.name);
  if(user == null) {
    return res.status(400).send('User does not exists');
  }

  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN);
      res.status(200).send({ accessToken: accessToken });
    } else {
      res.status(400).send('User is not autheticated!');
    }
  } catch(error) {
    res.status(500).send(error);
  }
})

app.listen(3000);