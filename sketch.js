let canvas;
let nodes = [];
let vertices = [];
let adjacencyMatrix = [];
let idCounter = 0;
let selectedNodes = [];
let defaultNodeColor;
let animationSlider;
let startNode, endNode;

function setup() {
  canvas = createCanvas(100,100);
  canvas.style.position = "absolute";
  canvas.parent('canvasWrapper')
  canvas.mouseClicked(mouseClickedOnCanvas);
  defaultNodeColor = color(255);

  animationSlider = createSlider(0,1,0,0.1).parent('animationControls'); // TODO: adjust increment to number of steps

  windowResized(); // This needs to be called to fill any gaps whilst page is loading
}

function windowResized() {
  let animationControlsWidth = document.getElementById("animationControls").offsetWidth;
  let infoWrapperHeight = document.getElementById("infoWrapper").offsetHeight;
  // Resize canvas
  resizeCanvas(document.getElementById("canvasWrapper").offsetWidth, infoWrapperHeight);
  // Resize animation elements
  animationSlider.style('width', animationControlsWidth - 5 + "px");
}

function draw() {
  background(50);
  for (let node of nodes) {
    node.update();
  }

  for (let vertex of vertices) {
    if (vertex.status == "visible") {
      vertex.show();
    }
  }

  drawAdjacencyMartrix();
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

function mouseClicked() {
  drawSelectedNodesInfo();
}

function mouseReleased() {
  for (let node of nodes) {
    node.release();
  }
}

function createNode(positionX, positionY) {
  nodes.push(new Node(positionX, positionY, idCounter++));
  console.log("Node created")


  // Expand adjacencyMatrix (add row and column of null)
  adjacencyMatrix.push([]);
  for (let i=0; i < adjacencyMatrix.length; i++) {
    for (let j=adjacencyMatrix[i].length; j < idCounter; j++) {
      if (getNodeById(i).status == 'deleted') {
        adjacencyMatrix[i].push(-1);
      } else {
        adjacencyMatrix[i].push(0);
      }
    }
  }
  for (let node of nodes) {
    if (node.status == "deleted") {
      flagDeleteRowColumnInAdjacencyMatric(node.id);
    }
  }
}

function selectNode(node) {
  if (selectedNodes[selectedNodes.length - 1] !== node) {
    selectedNodes.push(node)
    node.borderColor = color(0,0,255);
  } else if (selectedNodes[selectedNodes.length - 1] == node) {
    node.pop();
    node.borderColor = color(0);
    // // recolor node (depending if it is a start, end or standard node)
    // if (startNode == node) {
    //   node.color = color(0,255,0);
    // } else if (endNode == node) {
    //   node.color = color(255,0,0);
    // } else {
    //   node.color = 255;
    // }
  }
  if (selectedNodes.length == 2) {
    addVertex(selectedNodes[0], selectedNodes[1], round(random(20)));
    selectedNodes[0].borderColor = color(0);
    selectedNodes[1].borderColor = color(0);
    selectedNodes = [];
    }
}

function deleteNode(node) {
  for (let i=0; i<nodes.length; i++) {
    if (nodes[i] == node) {
      console.log("Node deleted");
      flashMessage("Node deleted", 5000)
      nodes[i].status = "deleted";
      // Remove associated vertices
      for (let j=0; j<node.vertices.length; j++) {
        deleteVertex(node.vertices[j]);
      }
    }
  }
  flagDeleteRowColumnInAdjacencyMatric(node.id);
  //remove from selectedNodes
  selectedNodes.pop();
}

function addVertex(nodeA, nodeB, value) {
  // Create new vertex?
  if (adjacencyMatrix[nodeA.id][nodeB.id] == 0 && adjacencyMatrix[nodeB.id][nodeA.id] == 0) {
    let newVertex = new Vertex(nodeA, nodeB, vertices.length);
    vertices.push(newVertex);
    nodeA.vertices.push(newVertex.id);
    nodeB.vertices.push(newVertex.id);
  }
  adjacencyMatrix[nodeA.id][nodeB.id] = value;
  adjacencyMatrix[nodeB.id][nodeA.id] = value;
}

function deleteVertex(vertexId) {
  let vertex = vertices[vertexId];
  vertex.status = "deleted";
  // remove vertex from each node
  for (let node of nodes) {
    for(let i=0; i<node.vertices.length; i++) {
      if (node.vertices[i] == vertexId) {
        node.vertices.splice(i, 1);
      }
    }
  }
  adjacencyMatrix[vertex.nodeA.id][vertex.nodeB.id] = 0;
  adjacencyMatrix[vertex.nodeB.id][vertex.nodeA.id] = 0;
  console.log("Vertex deleted")
}

function flagDeleteRowColumnInAdjacencyMatric(nodeId) {
  // Set column
  for (let i=0; i<adjacencyMatrix.length; i++) {
    adjacencyMatrix[i][nodeId] = -1;
  }
  // Set row
  for (let i=0; i<adjacencyMatrix[nodeId].length; i++) {
    adjacencyMatrix[nodeId][i] = -1;
  }
}

function drawAdjacencyMartrix() {
  let aMTable = document.getElementById("adjacencyMatrixTable");
  aMTable.innerHTML = ''; // clear table contents

  let tableBody = document.createElement('tbody');

  for (let rowIndex=0; rowIndex < adjacencyMatrix.length; rowIndex++) {
    let rowData = adjacencyMatrix[rowIndex];
    let row = document.createElement('tr');

    for (let cellIndex=0; cellIndex < adjacencyMatrix[rowIndex].length; cellIndex++) {
      // let cellData = "[" + rowIndex + "," + cellIndex + "]: " + adjacencyMatrix[rowIndex][cellIndex] + "||";
      if (adjacencyMatrix[rowIndex][cellIndex] != -1) {
        let cellData = adjacencyMatrix[rowIndex][cellIndex];
        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      }
    }

    tableBody.appendChild(row);
  }
  aMTable.appendChild(tableBody);
}

function drawSelectedNodesInfo() {
  let nodeInfoDiv = document.getElementById("selectedNodeInfo");
  nodeInfoDiv.innerHTML = '';
  let node = selectedNodes[0];
  if (node != null) {
    // Node title with id
    let nodeHeader = document.createElement('h2');
    nodeHeader.appendChild(document.createTextNode("Node: " + node.id));
    // Delete node button
    let deleteNodeButton = document.createElement("BUTTON");
    deleteNodeButton.classList.add("nodeInfoButton");
    deleteNodeButton.appendChild(document.createTextNode("delete"));
    deleteNodeButton.onclick = function() {
      deleteNode(node);
    }
    // Set node as start button
    let setStartButton = document.createElement("BUTTON");
    setStartButton.classList.add("nodeInfoButton");
    setStartButton.appendChild(document.createTextNode("set as start"));
    setStartButton.onclick = function() {
      setStartNode(node);
    }
    nodeHeader.appendChild(setStartButton);
    // Set node as start button
    let setEndButton = document.createElement("BUTTON");
    setEndButton.classList.add("nodeInfoButton");
    setEndButton.appendChild(document.createTextNode("set as end"));
    setEndButton.onclick = function() {
      setEndNode(node);
    }
    nodeHeader.appendChild(setEndButton);

    let nodeInfoBody = document.createElement('nodeInfoBody');

    if (node.vertices.length > 0) {
      nodeInfoBody.appendChild(document.createTextNode('Vertices: '));
      nodeInfoBody.appendChild(document.createElement("BR"));  // line break
      for (let i=0; i<node.vertices.length; i++) {
        let vertex = vertices[node.vertices[i]];
        let cell = document.createElement('tr');
        let infoString = " ‣ " + vertex.nodeA.id + " - " + vertex.nodeB.id + " (" + vertex.value + ")";
        cell.appendChild(document.createTextNode(infoString));
        let deleteButton = document.createElement("BUTTON");
        deleteButton.classList.add("vertexDeleteButton")
        deleteButton.appendChild(document.createTextNode("delete"));
        deleteButton.onclick = function() {
          deleteVertex(vertex.id);
        }
        cell.appendChild(deleteButton);
        nodeInfoBody.appendChild(cell);
      }
    } else {
      nodeInfoBody.appendChild(document.createTextNode('No vertices'));
    }
    nodeInfoDiv.appendChild(nodeHeader);
    nodeInfoDiv.appendChild(nodeInfoBody);
  }
}

function getNodeById(id) {
  return nodes[id];
}

function flashMessage(message, timeout) {
  let flashMessageDiv = document.createElement("DIV");
  flashMessageDiv.classList.add("flashMessage");
  flashMessageDiv.appendChild(document.createTextNode(message));
  document.getElementById("flashWrapper").appendChild(flashMessageDiv);
  window.setTimeout(function () {
    flashMessageDiv.remove();
    windowResized();
  }, timeout);
}

function setStartNode(node) {
  try {
    startNode.color = defaultNodeColor;
  } catch {}
  startNode = node;
  node.color = color(0,255,0);
}

function setEndNode(node) {
  try {
    endNode.color = defaultNodeColor;
  } catch {}
  endNode = node;
  node.color = color(255,0,0);
}
