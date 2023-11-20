function WafflesDiet() {
  //name for vis to appear in the menu bar
  this.name = "Waffles Diet";
  //unique id
  this.id = "waffles-diet";
  //property to represent if data has been loaded
  this.loaded = false;

  //array to store all waffles when pushed
  var waffles = [];

  //Preload the data
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/waffles/finalData.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    let values = [
      "Take-away",
      "Cooked from fresh",
      "Ready meal",
      "Ate out",
      "Skipped meal",
      "Left overs",
    ];

    for (var i = 0; i < days.length; i++) {
      if (i < 4) {
        waffles.push(new Waffle(20 + i * 250, 30, 220, 220, 11, 11, this.data, days[i], values)); //this.data calls data in preload function
      }
      if (i > 3) {
        waffles.push(
          new Waffle(70 + (i - 4) * 250, 300, 220, 220, 11, 11, this.data, days[i], values)
        );
      }
    }
  };
  //calling the waffle.js file and drawing the waffles chart
  this.draw = function () {
    background(255);
    stroke(0);
    for (let i = 0; i < waffles.length; i++) {
      if (waffles) {
        waffles[i].draw();
      }
    }

    //passing in the checkMouse function for each waffle from waffle.js
    for (let i = 0; i < waffles.length; i++) {
      waffles[i].checkMouse(mouseX, mouseY);
    }

    let legend_values = [
      "Take-away",
      "Cooked From Fresh",
      "Ready Meal",
      "Ate Out",
      "Skipped Meal",
      "Left Overs",
    ];
    for (let i = 0; i < legend_values.length; i++) {
      var colours = ["red", "green", "blue", "purple", "yellow", "orange"];
      this.legend(legend_values[i], i, colours[i]);
    }
  };
  //display legend
  this.legend = (values, i, colours) => {
    const boxWidth = 30;
    const boxHeight = 30;
    const x = 850;
    const y = 300 + (boxHeight + 10) * i;

    //draw legend box
    stroke(0);
    fill(colours);
    rect(x, y, boxWidth, boxHeight);

    //draw legend text
    fill("black");
    stroke(255);
    textAlign("left", "center");
    textSize(15);
    text(values, x + boxWidth + 10, y + boxWidth / 2);
  };
}
