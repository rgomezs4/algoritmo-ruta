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
    links: []
  });

  let coordinates = mongoose.model("coordinates", coordinatesSchema);
  let coords = await coordinates.find();

  var i = 1;
  coords.forEach(coord => {
    graph.addNode(coord._id, { x: coord.lng, y: coord.lat });
    if (coord._id === "london") return;
    coord.links.forEach(link => {
      graph.addLink(link.origen, link.destino, { velocidad: link.velocidad });
    });
    i++;
  });

  graph.forEachNode(node => {
    node.links.forEach(link => {});
  });

  let foundPath = pathFinder.find(
    "6 avenida 8 calle",
    "Avenida Bolivar 20 calle"
  );

  console.log(foundPath.reverse());
});

module.exports = { graph: graph };
