const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(
  express.json({
    limit: '10kb', //size of req.body can be upto 10kb
  })
); //BODY PARSER
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

app.post('/events', (req, res) => {
  const event = req.body;

  axios.post('http://localhost:4000/events', event); //posts
  axios.post('http://localhost:4001/events', event); //comments
  axios.post('http://localhost:4002/events', event); //query
  axios.post('http://localhost:4006/events', event); //moderation

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
