class Node{
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
    this.diameter = 50;
    this.color = random(255)
    this.name = "circle " + round(random(128));  // TODO: use(switch) to id
    this.lastPosition = this.position.copy();
  }

  update() {
    this.show();
    this.drag();
  }

  show() {
    ellipse(this.position.x, this.position.y, this.diameter, this.size, color(this.color));
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
      console.log("This node has been clicked")
      if (document.getElementById('delete').checked) {
        deleteNode(this);
      }
    }
  }
}
