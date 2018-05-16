const createGraph = require("ngraph.graph");
const graph = createGraph();

graph.addNode("Aaron_s_Hill|Surrey", { x: -0.63098, y: 51.18291 });
graph.addNode("Abbas_Combe|Somerset", { x: -2.41825, y: 51.00283 });
graph.addNode("Abberley|Worcestershire", { x: -2.37574, y: 52.30522 });
graph.addNode("Abberton|Essex", { x: 0.91066, y: 51.8344 });
graph.addNode("Abberton|Worcestershire", { x: -2.00817, y: 52.17955 });

graph.addLink("Aaron_s_Hill|Surrey", "Abbas_Combe|Somerset");
graph.addLink("Aaron_s_Hill|Surrey", "Abberley|Worcestershire");
graph.addLink("Aaron_s_Hill|Surrey", "Abberton|Essex");
graph.addLink("Abbas_Combe|Somerset", "Abberton|Essex");
graph.addLink("Abbas_Combe|Somerset", "Abberley|Worcestershire");
graph.addLink("Abberton|Essex", "Abbas_Combe|Somerset");
graph.addLink("Abberton|Essex", "Aaron_s_Hill|Surrey");
graph.addLink("Abberton|Worcestershire", "Aaron_s_Hill|Surrey");

module.exports = { graph: graph };
