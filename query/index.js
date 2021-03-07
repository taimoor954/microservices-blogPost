const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


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

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

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

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
