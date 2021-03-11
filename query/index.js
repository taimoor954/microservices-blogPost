const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

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
app.use(cors());

const posts = {};

const eventsHandler = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];

    const comment = post.comments.find((e) => {
      return e.id == id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  eventsHandler(type, data);

  res.send({});
});

//incase if query is not working for some time, we store all the events in an array inside events>index
//and just when query start listening at port 4002 we request by using get method on http://localhost:4005/events
// then send each event in eventHandler function

app.listen(4002, async () => {
  console.log("Listening on 4002");
  const response = await axios.get("http://localhost:4005/events");
  console.log(response.data);
  for (let event of response.data) {
    console.log(`Processing Event : ${event.type}`);
    const { type, data } = event;
    console.log(type);
    eventsHandler(type, data);
  }
});
