const _ = require("lodash");

var astar = {
  init: function(graph) {
    graph.forEachNode(node => {
      if (!node.data) {
        graph.removeNode(node.id);
        return;
      }
      node.data.f = 0;
      node.data.g = 0;
      node.data.h = 0;
      node.data.visited = false;
      node.data.closed = false;
      node.data.debug = "";
      node.data.parent = null;
    });
  },
  search: function(graph, start, end, heuristic) {
    astar.init(graph);
    heuristic = heuristic || astar.manhattan;

    startNode = graph.getNode(start);
    endNode = graph.getNode(end);

    var openList = [];
    openList.push(startNode);

    while (openList.length > 0) {
      var lowInd = 0;
      for (var i = 0; i < openList.length; i++) {
        if (openList[i].data.f < openList[lowInd].data.f) {
          lowInd = i;
        }
      }
      var currentNode = openList[lowInd];

      if (currentNode.id == endNode.id) {
        var curr = currentNode;
        var ret = [];
        while (curr.data.parent && curr.data.parent.id != curr.id) {
          ret.push(curr);
          curr = curr.data.parent;
        }
        return ret.reverse();
      }


      openList.splice(lowInd, 1);
      currentNode.closed = true;

      var neighbors = astar.neighbors(graph, currentNode);
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (neighbor.data.closed) {
          continue;
        }

        var gScore = currentNode.data.g + 1;
        var gScoreIsBest = false;

        if (!neighbor.data.visited) {

          gScoreIsBest = true;
          neighbor.data.h = heuristic(
            { x: neighbor.data.x, y: neighbor.data.y },
            { x: endNode.data.x, y: endNode.data.y }
          );
          neighbor.data.visited = true;
          openList.push(neighbor);
        } else if (gScore < neighbor.data.g) {
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          neighbor.data.parent = currentNode;
          neighbor.data.g = gScore;
          neighbor.data.f = neighbor.data.g + neighbor.data.h;
          neighbor.data.debug =
            "F: " +
            neighbor.f +
            "<br />G: " +
            neighbor.g +
            "<br />H: " +
            neighbor.h;
        }
      }
    }

    return [];
  },
  manhattan: function(pos0, pos1) {

    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  },
  neighbors: function(graph, node) {
    let neighbors = [];
    let nd = graph.getNode(node.id);
    nd.links.forEach(link => {
      if (link.fromId === node.id) {
        neighbors.push(graph.getNode(link.toId));
      }
    });

    return neighbors;
  }
};

module.exports = { astar: astar };
