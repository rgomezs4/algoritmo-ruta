const mongoose = require("mongoose");
const createGraph = require("ngraph.graph");
const path = require("ngraph.path");
const graph = createGraph();

mongoose.connect(
  "mongodb+srv://admin:adminadmin@eacluster-nxzrs.mongodb.net/test?retryWrites=true"
);

const pathFinder = path.aStar(graph, {
  distance(fromNode, toNode) {
    // In this case we have coordinates. Lets use them as
    // distance between two nodes:
    let dx = fromNode.data.x - toNode.data.x;
    let dy = fromNode.data.y - toNode.data.y;

    return Math.sqrt(dx * dx + dy * dy);
  },
  heuristic(fromNode, toNode) {
    // this is where we "guess" distance between two nodes.
    // In this particular case our guess is the same as our distance
    // function:
    let dx = fromNode.data.x - toNode.data.x;
    let dy = fromNode.data.y - toNode.data.y;

    return Math.sqrt(dx * dx + dy * dy);
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
    //console.log(graph.getNode(coord._id));
    if (coord._id === "london") return;
    //console.log(i);
    //console.log(coord._id);
    coord.links.forEach(link => {
      //console.log(link);
      graph.addLink(link.origen, link.destino, { velocidad: link.velocidad });
    });
    i++;
  });

  graph.forEachNode(node => {
    node.links.forEach(link => {});
  });

  let foundPath = pathFinder.find("6 avenida 8 calle", "8 avenida 6 calle");

  console.log(foundPath.reverse());
});

module.exports = { graph: graph };
