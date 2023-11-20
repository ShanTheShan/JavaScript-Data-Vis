function drawPolarAxis(layout) {
  //x-axis. Uncomment to see x line
  //stroke("grey");
  noStroke();
  line(
    layout.leftMargin,
    layout.bottomMargin / 2 + 22.5,
    layout.rightMargin,
    layout.bottomMargin / 2 + 22.5
  );

  //y-axis Uncomment to see y line
  //stroke("grey");
  noStroke();
  line(layout.rightMargin / 2, layout.topMargin, layout.rightMargin / 2, layout.bottomMargin);
}

function drawPolarYAxisTickLabels(min, max, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign("right", "center");

  // Draw all axis grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + i * yTickStep;
    var y = mapFunction(value);

    if (layout.grid) {
      // Add grid line. Uncomment to see y grid lines
      //stroke(200);
      noStroke();
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawPolarYAxisText(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign("right", "center");

  // Draw all axis tick labels
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = i * yTickStep;
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces), layout.rightMargin / 2, y);
  }
}

function drawPolarXAxisTickLabels(min, max, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var xTickStep = range / layout.numXTickLabels;

  fill(0);
  noStroke();
  textAlign("center", "center");

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numXTickLabels; i++) {
    var value = min + i * xTickStep;
    var x = mapFunction(value) * 1.65;

    if (layout.grid) {
      // Add grid line. Uncomment to see grid lines
      //stroke(200);
      noStroke();
      line(x, layout.leftMargin, x, layout.rightMargin);
    }
  }
}

//to draw grid circles
function drawPolarCircumference(min, max, layout, mapFunction) {
  range = max - min;
  var xTickStep = range / layout.numYTickLabels;

  for (i = 0; i <= layout.numXTickLabels - 1; i++) {
    const value = min + i * xTickStep;
    var x = mapFunction(value);

    //drawing
    if (layout.grid) {
      noFill();
      stroke("grey");
      strokeWeight(0.2);
      ellipse(layout.rightMargin / 2, layout.bottomMargin / 2 + 22.5, x);
    }
  }
}

function plotPolarArcs(csv, values, layout, colours) {
  //calculate the angle of each arc
  arcAngle = 360 / csv.length;
  let lastAngle = 0;

  //points of the chart
  let centerX = layout.rightMargin / 2;
  let centerY = layout.bottomMargin / 2 + 22.5;

  //to determine arc distance and angle relative to mouse
  let mouseDist = dist(centerX, centerY, mouseX, mouseY);
  let mouseAngle = atan2(mouseY - centerY, mouseX - centerX);

  for (let i = 0; i < csv.length; i++) {
    //array to store each arc's radius,relative to the length of the CSV file
    arcRadius = [];
    for (let j = 0; j < values.length; j++) {
      stroke("white");
      fill(colours[j]);
      arc(
        centerX,
        centerY,
        map(values[j], 0, 1475, 0, 500),
        map(values[j], 0, 1475, 0, 500),
        lastAngle,
        lastAngle + radians(arcAngle), //pass arcAngle to determine angle start/end size
        PIE
      );

      lastAngle += radians(arcAngle);

      //using trigonometric formula x = cos(angle) * radius, to find the radius of each arc
      x = Math.abs((cos(60) * map(values[j], 0, 1475, 0, 500)) / 2);
      arcRadius.push(x);

      //for the mouse to be able to complete a full rotation, as when the mouse is in the first or second quadrant of the circle, its negative
      if (mouseAngle < 0) {
        mouseAngle = 2 * PI - Math.abs(mouseAngle);
      }

      //floor to get an index, starting from 0, so we can traverse the CSV data
      let mouseToArc = Math.floor(mouseAngle / radians(arcAngle));

      //if mouse is within an arc's angle and less than is radius,get value
      if (mouseDist < arcRadius[mouseToArc]) {
        push();
        fill("black");
        textSize(12);
        textAlign(LEFT, TOP);
        noStroke();
        rect(mouseX, mouseY, 45, 30);
        fill("white");
        text(values[mouseToArc], mouseX + 12, mouseY + 10);
        pop();
      }
    }
  }
}

function polarChartTitle(title, layout) {
  fill("black");
  noStroke();
  textSize(20);
  textStyle(NORMAL);
  text(title, layout.rightMargin - 170, layout.bottomMargin / 10);
}

//legend for both charts
function polarLegend(identity, data, i, colors) {
  const boxWidth = 20;
  const boxHeight = 20;
  const x_cord = 810;
  const y_cord = 100 + (boxHeight + 15) * i;

  //draw legend box
  noStroke();
  fill(colors);
  rect(x_cord, y_cord, boxWidth, boxHeight);

  //draw legend text
  fill("black");
  stroke(255);
  textStyle(ITALIC);
  textAlign("left", "center");
  textSize(15);
  text(identity, x_cord + boxWidth + 10, y_cord + boxWidth / 2);

  //data value
  dataString = "[" + data + "]";
  textSize(13);
  text(dataString, x_cord + boxWidth + 157, y_cord + boxHeight / 2);
}

//to draw methods polar chart title
//using JS arrow functions for cleaner looking codes
animMethodsTitle = () => {
  let animDuration = 100;
  noFill();
  stroke("black");
  strokeWeight(1);
  //using additional imported p5 library, anims.js
  animS.line("chartMethodTitle", animDuration, 687, 68, 1022, 68);
};

//to draw race polar chart title
//using JS arrow functions for cleaner looking codes
animRaceTitle = () => {
  let animDuration = 100;
  noFill();
  stroke("black");
  strokeWeight(1);
  //using additional imported p5 library, anims.js
  animS.line("chartRaceTitle", animDuration, 720, 68, 988, 68);
};
