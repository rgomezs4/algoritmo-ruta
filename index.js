const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const findRoute = require("./mongo").findRoute;
const graph = require("./mongo").graph;
const astar = require("./astar").astar;
var util = require("util");

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

app.get("/path/getRelevantNodes", (req, res) => {
  let nodes = [];
  graph.forEachNode(node => {
    if (node.data.relevant == 1) {
      nodes.push(node);
    }
  });
  return res.status(200).send({
    nodes
  });
});

app.get("/path/test/:fromNode/:toNode", (req, res) => {
  let path = astar.search(graph, req.params.fromNode, req.params.toNode, null);
  path.forEach(node => {
    node.links = [];
    node.data = {
      x: node.data.x,
      y: node.data.y
    };
  });
  return res.status(200).send({
    path: path
  });
});

app.get("*", (req, res) =>
  res
    .status(200)
    .send(
      "<h2>Paths:</h2> <p>/path/findPath/:fromNode/:toNode.</p><p>/path/getAllNodes</p><p>/path/test/:fromNode/:toNode</p><p>/path/getRelevantNodes</p>"
    )
);

module.exports = app;
