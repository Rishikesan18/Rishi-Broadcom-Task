const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


app.use(express.static(path.join(__dirname, 'FE')));

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'lo.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

 
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    
    const foundUser = await User.findOne({ username: username });

    if (!foundUser) {
      return res.status(400).send('User not found.');
    }

    if (foundUser.password !== password) {
      return res.status(400).send('Incorrect password.');
    }

    res.sendFile(path.join(__dirname,'FE' ,'rishi.html'));
  } catch (err) {
    res.status(500).send('Error occurred while checking user.');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
