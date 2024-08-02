const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');

require('dotenv').config();

//* Middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//* MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected successfully to MongoDB'))
.catch(err => console.error('Connection failed', err));

//* Schemas
const exerciseSchema = new mongoose.Schema({
  userId: String,
  username: String,
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,
});

const userSchema = new mongoose.Schema({
  username: String,
});

//* Models
const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

//* Endpoints

// Delete all users
app.get('/api/users/delete', async (_req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: 'All users have been deleted!', result });
  } catch (err) {
    console.error(err);
    res.json({ message: 'Deleting all users failed!' });
  }
});

// Delete all exercises
app.get('/api/exercises/delete', async (_req, res) => {
  try {
    const result = await Exercise.deleteMany({});
    res.json({ message: 'All exercises have been deleted!', result });
  } catch (err) {
    console.error(err);
    res.json({ message: 'Deleting all exercises failed!' });
  }
});

app.get('/', async (_req, res) => {
  res.sendFile(__dirname + '/views/index.html');
  await User.syncIndexes();
  await Exercise.syncIndexes();
});

// Get all users
app.get('/api/users', async (_req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.json({ message: 'There are no users in the database!' });
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.json({ message: 'Getting all users failed!' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  const inputUsername = req.body.username;
  try {
    const newUser = new User({ username: inputUsername });
    const user = await newUser.save();
    res.json({ username: user.username, _id: user._id });
  } catch (err) {
    console.error(err);
    res.json({ message: 'User creation failed!' });
  }
});

// Add a new exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id: userId } = req.params;
  const { description, duration, date } = req.body;
  const exerciseDate = date || new Date().toISOString().substring(0, 10);

  try {
    const userInDb = await User.findById(userId);
    if (!userInDb) {
      return res.json({ message: 'There are no users with that ID in the database!' });
    }

    const newExercise = new Exercise({
      userId: userInDb._id,
      username: userInDb.username,
      description,
      duration: parseInt(duration),
      date: exerciseDate,
    });

    const exercise = await newExercise.save();
    res.json({
      username: userInDb.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
      _id: userInDb._id,
    });
  } catch (err) {
    console.error(err);
    res.json({ message: 'Exercise creation failed!' });
  }
});

// Get a user's exercise log
app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id: userId } = req.params;
  const from = req.query.from || new Date(0).toISOString().substring(0, 10);
  const to = req.query.to || new Date().toISOString().substring(0, 10);
  const limit = Number(req.query.limit) || 0;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ message: 'User not found!' });
    }

    const exercises = await Exercise.find({
      userId,
      date: { $gte: from, $lte: to },
    })
    .select('description duration date')
    .limit(limit);

    const parsedDatesLog = exercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: parsedDatesLog.length,
      log: parsedDatesLog,
    });
  } catch (err) {
    console.error(err);
    res.json({ message: 'Fetching exercise log failed!' });
  }
});

//* Start the server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
