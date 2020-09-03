//circle location vars
var circleX, circleY;

//size of the circle
var circleSize;

var nodes = [];

let canvas;
function setup() {
  canvas = createCanvas(500,500);
  canvas.mouseClicked(mouseClickedOnCanvas);
  // canvas.mouseOver(mouseOverFuncion);

  for (let i = 0; i < 5; i++) {
    nodes.push(new Node(round(random(width)), round(random(height))));
  }
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
      nodes.push(new Node(mouseX, mouseY));
      console.log("Node created")
    }
  }
}

function mouseReleased() {
  // console.log("mouse released")
  for (let node of nodes) {
    node.release();
  }
}

function deleteNode(node) {
  for (let i=0; i<nodes.length; i++) {
    if (nodes[i] == node) {
      console.log("Node deleted");
      nodes.splice(i, 1);
    }
  }
}
