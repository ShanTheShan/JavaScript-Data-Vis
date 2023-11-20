function NutrientsData() {
  this.name = "Nutrients Intake: 1974-2016";

  this.id = "nutrients-timeseries";

  this.title = "Nutrient Intake: 1974-2016";

  //title to display above the plot
  this.xAxisLabel = "year";
  this.yAxisLabel = "%";

  this.colors = [];

  var marginSize = 35;

  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize + 100,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    //Boolean to enable/disable background grid
    grid: true,

    //Number of axis tick labels to draw so that they are not drawn
    //on top of one another
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  this.preload = function () {
    var self = this;
    this.data = loadTable("./data/food/nutrients74-16.csv", "csv", "header", function (table) {
      self.loaded = true;
    });
  };

  this.setup = function () {
    textSize(16);
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    for (var i = 0; i < this.data.getRowCount(); i++) {
      this.colors.push(color(random(0, 255), random(0, 255), random(0, 255)));
    }

    //set the min and max %
    this.minPercentage = 80;
    this.maxPercentage = 400;
  };

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minPercentage,
      this.maxPercentage,
      this.layout,
      this.mapNutrientsToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Plot all nutrients between startYear and endYear via
    // width minus margins.
    var numYears = this.endYear - this.startYear;

    // Loop over rows and draw a line from the previous value to current
    for (var i = 0; i < this.data.getRowCount(); i++) {
      //for each nurtients value

      var row = this.data.getRow(i);
      var previous = null;
      var title = row.getString(0); //name of the nutrients

      for (var j = 1; j < numYears; j++) {
        //loop through each year to get the value
        // year object to store data for the current year.
        var current = {
          year: this.startYear + j - 1,
          percentage: row.getNum(j),
        };

        if (previous != null) {
          // Draw line segment connecting previous year to current year
          stroke(this.colors[i]);
          line(
            this.mapYearToWidth(previous.year),
            this.mapNutrientsToHeight(previous.percentage),
            this.mapYearToWidth(current.year),
            this.mapNutrientsToHeight(current.percentage)
          );

          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

          // Draw the tick label marking the start of the previous year.
          if (i % xLabelSkip == 0) {
            let currentTextSize = textSize();
            textSize(9);
            drawXAxisTickLabel(previous.year, this.layout, this.mapYearToWidth.bind(this));
            textSize(currentTextSize);
          }
        } else {
          this.legend(title, i, this.colors[i]);
          fill(this.colors[i]);
          text(title, 100, this.mapNutrientsToHeight(current.percentage));
        }
        // Assign current year to previous year so that it is available
        // during the next iteration of this loop to give us the start
        // position of the next line segment.
        previous = current;
      }
    }
    //mouse hover function
    this.drawYearonMouse();
  };

  this.drawTitle = function () {
    fill(0);
    textAlign("center", "center");
    text(
      this.title,
      this.layout.plotWidth() / 2 + this.layout.leftMargin,
      this.layout.topMargin - this.layout.marginSize / 2
    );
  };

  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin,
      this.layout.rightMargin
    );
  };

  this.mapNutrientsToHeight = function (value) {
    return map(
      value,
      this.minPercentage,
      this.maxPercentage,
      this.layout.bottomMargin,
      this.layout.topMargin
    );
  };

  //display year on mouse hover
  this.drawYearonMouse = function () {
    let year = this.mapMouseXToYear(mouseX);
    fill("black");
    stroke(255);
    text(year, mouseX, mouseY);
  };

  this.mapMouseXToYear = function (value) {
    return int(
      map(value, this.layout.leftMargin, this.layout.rightMargin, this.startYear, this.endYear)
    );
  };

  //legend of chart
  this.legend = function (label, i, color) {
    let boxWidth = 50;
    let boxHeight = 10;
    let x = 800;
    let y = 50 + (boxHeight + 2) * i;
    stroke(255);
    fill(color);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    stroke(255);
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxHeight / 2);
  };
}
