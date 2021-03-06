const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const users = [];

app.get('/users', async (req, res) => {
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
      res.status(200).send('User is authenticated!');
    } else {
      res.status(400).send('User is not autheticated!');
    }
  } catch(error) {
    res.status(500).send(error);
  }
})

app.listen(3000);