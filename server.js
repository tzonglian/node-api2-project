const express = require("express");
const postsRouter = require("./posts-router.js");

const server = express();
server.use(express.json());
server.use(postsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2> Node Api2 Project - Posts API </h>
    <p> Ganbatte! </p>
  `);
});

module.exports = server;
