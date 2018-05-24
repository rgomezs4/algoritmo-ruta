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
      // Grab the lowest f(x) to process next
      var lowInd = 0;
      for (var i = 0; i < openList.length; i++) {
        if (openList[i].data.f < openList[lowInd].data.f) {
          lowInd = i;
        }
      }
      var currentNode = openList[lowInd];

      // End case -- result has been found, return the traced path
      if (currentNode.id == endNode.id) {
        var curr = currentNode;
        var ret = [];
        while (curr.data.parent && curr.data.parent.id != curr.id) {
          ret.push(curr);
          curr = curr.data.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors

      openList.splice(lowInd, 1);
      currentNode.closed = true;

      var neighbors = astar.neighbors(graph, currentNode);
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (neighbor.data.closed) {
          // not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        var gScore = currentNode.data.g + 1; // 1 is the distance from a node to it's neighbor
        var gScoreIsBest = false;

        if (!neighbor.data.visited) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;
          neighbor.data.h = heuristic(
            { x: neighbor.data.x, y: neighbor.data.y },
            { x: endNode.data.x, y: endNode.data.y }
          );
          neighbor.data.visited = true;
          openList.push(neighbor);
        } else if (gScore < neighbor.data.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.  Store info on how we got here and
          //  just how good it really is...
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

    // No result was found -- empty array signifies failure to find path
    return [];
  },
  manhattan: function(pos0, pos1) {
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

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
