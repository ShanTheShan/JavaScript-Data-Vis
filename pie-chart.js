function PieChart(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 40;

  this.get_radians = function (data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function (data, labels, colours, title) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert("Data has length zero!");
    } else if (
      ![labels, colours].every((array) => {
        return array.length == data.length;
      })
    ) {
      alert(`Data (length: ${data.length})
            Labels (length: ${labels.length})
            Colours (length: ${colours.length})
            Arrays must be the same length!`);
    }

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      stroke("grey");
      strokeWeight(1);

      arc(this.x, this.y, this.diameter, this.diameter, lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      lastAngle += angles[i];
    }

    //to implement the mouse hover feature
    let mouseDist = dist(this.x, this.y, mouseX, mouseY);
    let mouseAngle = atan2(this.y - mouseY, this.x - mouseX) + PI;
    let mouseToArc = updateAngle(angles, mouseAngle);

    if (mouseDist < this.diameter / 2) {
      //checking if there is data
      let rawData = data[mouseToArc];
      switch (rawData) {
        case NaN:
          rawData = 0;
        case undefined:
          rawData = 0;
        default:
          rawData;
      }
      //rounding it to 1 d.p.
      let roundedData = rawData.toFixed(1);

      if (roundedData != 0) {
        //using push pop for separate drawings
        push();
        fill("black");
        textSize(15);
        textAlign(LEFT, TOP);
        noStroke();
        rect(mouseX, mouseY, 125, 30);
        fill("white");
        text(roundedData + "% are " + labels[mouseToArc], mouseX + 15, mouseY + 10);
        pop();
      }
    }

    if (title) {
      const xPos = this.x;
      const yPos = this.y - this.diameter * 0.6;
      noStroke();
      textAlign("center", "center");
      textSize(24);
      text(title, xPos, yPos);
      noFill();
      stroke("black");
      strokeWeight(1);
      //using additional imported p5 library, anims.js
      animS.rect(
        "piechartTitle",
        50,
        this.x / 1.7,
        this.y - this.diameter * 0.638,
        this.x / 1.25,
        30
      );
    }
  };

  this.makeLegendItem = function (label, i, colour) {
    const x = this.x + 90 + this.diameter / 2;
    const y = this.y + this.labelSpace * i - this.diameter / 3;
    const boxWidth = this.labelSpace / 2;
    const boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    stroke(255);
    textAlign("left", "center");
    textSize(12);
    textStyle(NORMAL);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };

  //this function takes the existing angles from function this.get_radians, and adds them to a new array, so that it all adds up to 360 degrees/6.28 radians, and the mouse traverses the array positively clockwise starting from index 0
  updateAngle = (defaultAngle, mouseAngle) => {
    let newAngles = [];

    for (let i = 0; i < defaultAngle.length; i++) {
      switch (i) {
        case 0:
          newAngles.push(defaultAngle[0]);
          break;
        //add the current index with the previous, then push
        default:
          let currentIndex = i;
          let currentValue = 0;
          while (currentIndex >= 0) {
            currentValue += defaultAngle[currentIndex];
            currentIndex--;
          }
          newAngles.push(currentValue);
          break;
      }
    }

    for (let i = 0; i < newAngles.length; i++) {
      switch (i) {
        //if we are in the first angle, just return the first angle
        case 0:
          if (mouseAngle < newAngles[0]) {
            return 0;
          }
          break;

        default:
          //determine which arc the mouse is in by measuring if the mouse is less than the current angle but more than the previous
          if (mouseAngle < newAngles[i] && mouseAngle > newAngles[i - 1]) {
            return i;
          }
          break;
      }
    }
  };
}
