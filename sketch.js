let canvas;
let nodes = [];
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

  // Expand adjacencyMatrix
  for (let i=0; i<idCounter; i++) {
    adjacencyMatrix[i] = [];
    for (let j=0; j<idCounter; j++) {
      adjacencyMatrix[i][j] = 0;
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
    addVertex(selectedNodes[0].id, selectedNodes[1].id, round(random(20)));
    selectedNodes[0].color = 255;
    selectedNodes[1].color= 255;
    selectedNodes = [];
    }
  console.log(selectedNodes)
}

function deleteNode(node) {
  for (let i=0; i<nodes.length; i++) {
    if (nodes[i] == node) {
      console.log("Node deleted");
      nodes.splice(i, 1);
    }
  }
}

function addVertex(i, j, value) {
  adjacencyMatrix[i][j] = value;
  console.log(adjacencyMatrix);
}
