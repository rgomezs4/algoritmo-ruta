var graph = require("./graph").graph;
var path = require("ngraph.path");

var pathFinder = path.aStar(graph, {
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

var foundPath = pathFinder.find(
  "Aaron_s_Hill|Surrey",
  "Abberton|Worcestershire"
);

console.log(foundPath);
