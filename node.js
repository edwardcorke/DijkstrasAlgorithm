class Node{
  constructor(positionX, positionY, id) {
    this.position = createVector(positionX, positionY);
    this.id = id;
    this.diameter = 50;
    this.color = 255;
    this.lastPosition = this.position.copy();
    this.status = "visible";
    this.vertices = [];
  }

  update() {
    this.show();
    this.drag();
  }

  show() {
      if (this.status == 'visible') {
      fill(color(this.color));
      ellipse(this.position.x, this.position.y, this.diameter, this.size);
      fill(color(0));
      text(this.id, this.position.x, this.position.y);
    }
  }

  isClicked() {
    let distance = dist(mouseX, mouseY, this.position.x, this.position.y);
    // Divide diameter by 2 to get radius
    if(distance < (this.diameter / 2 )){
      // Confirmed click
      return true;
    } return false;
  }

  clicked() {
    if (this.isClicked()) {
      // console.log(this);
    }
  }

  drag() {
    if (this.isClicked() && mouseIsPressed) {
      this.position.x = mouseX;
      this.position.y = mouseY;
    }
  }

  release() {
    // Determine if the node has been dragged, clicked or nothing
    if (dist(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y) > (this.diameter / 2)) {
      console.log("This node has been dragged");
      this.lastPosition = this.position.copy();
    } else if (this.isClicked()) {
      // console.log("This node has been clicked")
      if (document.getElementById('select').checked) {
        selectNode(this);
      } else if (document.getElementById('delete').checked) {
        deleteNode(this);
      }
    }
  }
}
