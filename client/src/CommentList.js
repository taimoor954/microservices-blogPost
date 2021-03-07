import React from "react";

export default ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    if (comment.status == "approved") {
      content = comment.content;
    }
    if (comment.status == "pending") {
      content = "this comment is pending";  
    }
    if (comment.status == "rejected") {
      content = "this comment is rejected";
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
