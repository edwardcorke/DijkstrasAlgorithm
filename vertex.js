class Vertex {
  constructor(nodeA, nodeB, id) {
    this.id = id;
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.value;
    this.status = "visible";
    this.color = 200;
  }

  show() {
    fill(color(this.color));

    if (this.nodeA.status == "visible" && this.nodeB.status == "visible") {
      strokeWeight(3);
      line(this.nodeA.position.x, this.nodeA.position.y, this.nodeB.position.x, this.nodeB.position.y);

      // Calculate middle point between nodes
      let x =  (this.nodeA.position.x + this.nodeB.position.x) / 2;
      let y =  (this.nodeA.position.y + this.nodeB.position.y) / 2;

      // Update value of vertex
      this.value = adjacencyMatrix[this.nodeA.id][this.nodeB.id];
      try {
        strokeWeight(0);
        text(this.value, x, y)
      } catch {
        console.log("error drawing for nodes: " + this.nodeA.id + " and " + this.nodeB.id)
      }
    }
  }
}
