//circle location vars
var circleX, circleY;

//size of the circle
var circleSize;

var nodes = [];

let canvas;
function setup() {
  canvas = createCanvas(500,500);
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

function mouseClicked(){
  for (let node of nodes) {
    node.clicked();
  }
}

function mouseReleased() {
  // console.log("mouse released")
  for (let node of nodes) {
    node.release();
  }
}
