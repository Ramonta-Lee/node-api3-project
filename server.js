const express = require("express");

const server = express();

// Middleware - Global
server.use(express.json()); // built-in Middleware
server.use(helmet());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware - need 4 total

function logger(req, res, next) {}

module.exports = server;
