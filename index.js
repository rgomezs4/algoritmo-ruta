const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const findRoute = require("./mongo").findRoute;
const graph = require("./mongo").graph;

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

app.get("/path/getAllNodes", (req, res) => {
  let nodes = [];
  graph.forEachNode(node => {
    nodes.push(node);
  });
  return res.status(200).send({
    nodes
  });
});

app.get("*", (req, res) =>
  res
    .status(200)
    .send(
      "<h2>Paths:</h2> <p>/path/findPath/:fromNode/:toNode.</p><p>/path/getAllNodes</p>"
    )
);

module.exports = app;
