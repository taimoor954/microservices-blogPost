const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { response } = require("express");

const app = express();
app.use(
  express.json({
    limit: "10kb", //size of req.body can be upto 10kb
  })
); //BODY PARSER
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  axios.post("http://posts-clusterip-srv:4000/events", event); //posts
  axios.post("http://comments-srv:4001/events", event); //comments
  axios.post("http://query-srv:4002/events", event); //query
  axios.post("http://moderation-srv:4006/events", event); //moderation

  res.send({ status: "OK" });
});

app.get("/events", (request, response) => {
  console.log(events);
  response.status(200).send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
