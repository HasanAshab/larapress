const mongoose = require('mongoose');
if (process.env.DB_CONNECT === "true") {
  const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/test';
  mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB!');
  }).catch((error) => {
    console.log('could not connect to database!')
    console.error(error);
  });
}