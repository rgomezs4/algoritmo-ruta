const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const findRoute = require("./mongo").findRoute;

const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/path/findPath/:fromNode/:toNode", async (req, res) => {
  let path = await findRoute(req.params.fromNode, req.params.toNode);
  return res.status(200).send({
    path
  });
});

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to findPath."
  })
);

module.exports = app;