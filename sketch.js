let canvas;
let nodes = [];
let vertices = [];
let adjacencyMatrix = [];
let idCounter = 0;
let selectedNodes = [];


function setup() {
  canvas = createCanvas(500,500);
  canvas.mouseClicked(mouseClickedOnCanvas);
  // canvas.mouseOver(mouseOverFuncion);

  // for (let i = 0; i < 5; i++) {
  //   createNode(round(random(width)), round(random(height))));
  // }
}

function draw() {
  background(50);
  for (let node of nodes) {
    node.update();
  }
  for (let vertex of vertices) {
    vertex.show();
  }
}

function mouseClickedOnCanvas(){
  let totalNotPressed = 0;
  for (let node of nodes) {
    node.clicked();
    if (!node.isClicked()) { //TODO: && distance
      totalNotPressed++;
    }
  }
  if (totalNotPressed == nodes.length) {
    if (document.getElementById('select').checked) {
      createNode(mouseX, mouseY);
    }
  }
}

function mouseReleased() {
  // console.log("mouse released")
  for (let node of nodes) {
    node.release();
  }
}

function createNode(positionX, positionY) {
  nodes.push(new Node(positionX, positionY, idCounter++));//length of array);
  console.log("Node created")


  // Expand adjacencyMatrix (add row and column of null)
  adjacencyMatrix.push([]);
  for (let i=0; i < adjacencyMatrix.length; i++) {
    for (let j=adjacencyMatrix[i].length; j < idCounter; j++) {
      adjacencyMatrix[i].push(null);
    }
  }
  console.log(adjacencyMatrix);
}

function selectNode(node) {
  console.log("selected node")
  if (selectedNodes[selectedNodes.length - 1] !== node) {
    selectedNodes.push(node)
    node.color = 200;
  } else if (selectedNodes[selectedNodes.length - 1] == node) {
    selectedNodes.pop();
    node.color = 255;
  }
  if (selectedNodes.length == 2) {
    addVertex(selectedNodes[0], selectedNodes[1], round(random(20)));
    selectedNodes[0].color = 255;
    selectedNodes[1].color= 255;
    selectedNodes = [];
    }
  // console.log(selectedNodes)  // TODO: show in GUI
}

function deleteNode(node) {
  for (let i=0; i<nodes.length; i++) {
    if (nodes[i] == node) {
      console.log("Node deleted");
      nodes[i].status = "deleted";
      nodes.splice(i, 1);
      // Remove associated vertices
      for (let vertex of node.vertices) {
        deleteVertex(vertex);
      }
      // adjacencyMatrix[node.nodeA.id][node.nodeB.id] = null;
      // adjacencyMatrix[node.nodeB.id][node.nodeA.id] = null;
    }
  }
}

function addVertex(nodeA, nodeB, value) {
  // Create new vertex?
  if (adjacencyMatrix[nodeA.id][nodeB.id] == null && adjacencyMatrix[nodeB.id][nodeA.id] == null) {
    let newVertex = new Vertex(nodeA, nodeB);
    vertices.push(newVertex);
    nodeA.vertices.push(newVertex);
    nodeB.vertices.push(newVertex);
  }
  adjacencyMatrix[nodeA.id][nodeB.id] = value;
  adjacencyMatrix[nodeB.id][nodeA.id] = value;
  console.log(adjacencyMatrix);
}

function deleteVertex(vertex) {
  // Update adjacencyMatrix
  adjacencyMatrix[vertex.nodeA.id][vertex.nodeB.id] = null;
  adjacencyMatrix[vertex.nodeB.id][vertex.nodeA.id] = null;  
  // remove from (total) vertices
  for (let i=0; i<vertices.length; i++) {
    if(vertices[i] == vertex) {
      vertices.splice(i, 2);
    }
  }
  // remove vertex from each node
  for (let node of nodes) {
    for( let i=0; i<node.vertices; i++) {
      if (node.vertices[i] == vertex) {
        node.vertices.splice(i, 1);
      }
    }
  }
  console.log("Vertex deleted")
}
