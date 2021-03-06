const mongoose = require("mongoose");
const createGraph = require("ngraph.graph");
const path = require("ngraph.path");
const graph = createGraph();
const _ = require("lodash");

mongoose.connect(
  "mongodb+srv://admin:adminadmin@eacluster-nxzrs.mongodb.net/test?retryWrites=true"
);

const pathFinder = path.aStar(graph, {
  distance(fromNode, toNode) {
    try {
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;

      return Math.sqrt(dx * dx + dy * dy);
    } catch (error) {
      return 99999999;
    }
  },
  heuristic(fromNode, toNode) {
    try {
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;

      return Math.sqrt(dx * dx + dy * dy);
    } catch (error) {
      return 99999999;
    }
  }
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to mongodb");
  let coordinatesSchema = mongoose.Schema({
    _id: String,
    lat: Number,
    lng: Number,
    relevant: Number,
    image: String,
    links: []
  });

  let coordinates = mongoose.model("coordinates", coordinatesSchema);
  let coords = await coordinates.find();

  var i = 1;
  coords.forEach(coord => {
    graph.addNode(coord._id, {
      x: coord.lng,
      y: coord.lat,
      f: 0,
      g: 0,
      h: 0,
      relevant: coord.relevant,
      image: coord.image,
      visited: false,
      closed: false,
      debug: "",
      parent: null
    });
    
    if (coord._id === "london") return;
    coord.links.forEach(link => {
      graph.addLink(link.origen, link.destino, { velocidad: link.velocidad });
    });
    i++;
  });
});

function findRoute(fromNode, toNode) {
  let foundPath = pathFinder.find(fromNode, toNode);

  return foundPath;
}

module.exports = { findRoute: findRoute, graph: graph };
