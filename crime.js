function ViolentCrime() {
  //name for vis to appear on menu bar
  this.name = "Violent Crimes US";

  //unique id
  this.id = "violent-crimes-methods";

  // Title to display above the plot.
  this.title = "Methods of Violent Crimes in America";

  //property to check whether the data is loaded
  this.loaded = false;

  let marginSize = 45;

  //color arrays to be used for give each arc a unique color
  this.arcColours = [];

  this.preload = function () {
    var self = this;
    //loading first CSV file
    this.dataMethods = loadTable(
      "./data/crime/MODIFIED_METHODS_CRIME.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
    //loading second CSV file
    this.dataRace = loadTable(
      "./data/crime/MODIFIED_RACE_CRIME.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  //graph properties
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize,
    rightMargin: width,
    topMargin: marginSize,
    bottomMargin: height,
    pad: 5,

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 10,
  };

  this.setup = function () {
    //arc angle calculation
    angleMode(RADIANS);

    //numerical range of axis
    this.startValue = -1500;
    this.endValue = 1500;

    //create a radio DOM element to select between 2 charts
    this.select = createRadio();
    this.select.option("Methods");
    this.select.option("Race");
    this.select.style("width", "100px");
    this.select.position(420, 100);
    //setting default button to methods
    this.select.selected("Methods");

    //create dropdown option element
    this.options = createSelect();
    this.options.position(425, 150);

    //gather years for dropdown option
    var gatherYears = [2000, 2001, 2002, 2003, 2004, 2005];
    //populate with years
    for (let i = 0; i < gatherYears.length; i++) {
      this.options.option(gatherYears[i]);
    }

    //pushing random colors into arcColor array
    for (var i = 0; i < this.dataMethods.getRowCount(); i++) {
      this.arcColours.push(color(random(0, 255), random(0, 255), random(0, 255)));
    }
  };

  this.destroy = function () {
    this.select.remove();
    this.options.remove();
  };

  //drawing of chart
  this.draw = function () {
    //drawing of axis
    drawPolarAxis(this.layout);

    //drawing y-axis
    drawPolarYAxisTickLabels(
      this.startValue,
      this.endValue,
      this.layout,
      this.mapValueToYAxis.bind(this)
    );
    //drawing y-axis tick text
    drawPolarYAxisText(
      this.startValue,
      this.endValue,
      this.layout,
      this.mapValueToYAxis.bind(this)
    );

    //drawing x-axis
    drawPolarXAxisTickLabels(
      this.startValue,
      this.endValue,
      this.layout,
      this.mapValueToXAxis.bind(this)
    );

    //drawing of grid circumference
    drawPolarCircumference(
      this.startValue,
      this.endValue,
      this.layout,
      this.mapValueToXAxis.bind(this)
    );

    //get the CSV we data we want to load from radio button
    var getData = this.select.value();

    //determine which chart to load
    if (getData == "Methods") {
      const typeMethods = this.dataMethods.getColumn("methods");

      const typeValues = this.dataMethods.getColumn(this.options.value());

      //generate chart title for this data
      const methodsTitle = "Methods of Violent Crimes in America";

      //drawing of title
      polarChartTitle(methodsTitle, this.layout);
      //animate chart title
      animMethodsTitle();

      //draw the selected data
      plotPolarArcs(typeMethods, typeValues, this.layout, this.arcColours);

      //draw legend
      let methods_legend = this.dataMethods.getColumn("methods");
      for (let i = 0; i < methods_legend.length; i++) {
        polarLegend(methods_legend[i], typeValues[i], i, this.arcColours[i]);
      }
    }
    //determine which chart to load
    if (getData == "Race") {
      const raceTypes = this.dataRace.getColumn("Race");

      const raceValues = this.dataRace.getColumn(this.options.value());

      //generate chart title for this data
      const raceTitle = "Violent Crimes Offender Race";

      //drawing of title
      polarChartTitle(raceTitle, this.layout);
      //animate title
      animRaceTitle();

      //draw the selected data
      plotPolarArcs(raceTypes, raceValues, this.layout, this.arcColours);

      //draw legend
      let race_legend = this.dataRace.getColumn("Race");
      for (let i = 0; i < race_legend.length; i++) {
        polarLegend(race_legend[i], raceValues[i], i, this.arcColours[i]);
      }
    }
    //if radio button cannot retrieve the CSV file/data
    else if (getData == undefined) {
      alert("CSV Data has not been loaded correctly.");
      noLoop();
    }
  };

  this.mapValueToXAxis = function (value) {
    return map(
      value,
      this.endValue,
      this.startValue,
      this.layout.bottomMargin,
      this.layout.topMargin
    );
  };

  this.mapValueToYAxis = function (value) {
    return map(
      value,
      this.startValue,
      this.endValue,
      this.layout.bottomMargin,
      this.layout.topMargin
    );
  };
}
