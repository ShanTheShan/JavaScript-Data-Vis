function PayGapByJob2017() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Pay gap by job: 2017";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "pay-gap-by-job-2017";

  //title
  this.title = "Pay Gap By Job 2017";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 10;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  //animation timer
  let animationDuration = 100;

  //Graph points
  this.payGaplayout = {
    pad: 10,
    width: width,
    height: height,
  };

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
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
    //create a radio DOM element to select between 2 charts
    this.select = createRadio();
    this.select.option("Pay Discrepancies");
    this.select.option("Job Titles");
    this.select.position(1400, 200);
    this.select.style("width", "160px");

    //setting default button to display bubble chart first
    this.select.selected("Pay Discrepancies");
  };

  this.destroy = function () {
    this.select.remove();
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    //determine the radio button when clicked by user
    var getData = this.select.value();

    if (getData == "Pay Discrepancies") {
      //call the function to draw chart
      this.plotPayDiscrepancies();
    }
    if (getData == "Job Titles") {
      //call the function to draw chart
      this.plotJobTitles();
    }
  };

  //function that creates the pay gap chart
  this.plotPayDiscrepancies = () => {
    // Draw the axes.
    this.PayGapAxes();

    //Draw legend
    this.payGaplegend(this.payGaplayout);

    // Get data from the table object.
    var jobs = this.data.getColumn("job_subtype");
    var propFemale = this.data.getColumn("proportion_female");
    var payGap = this.data.getColumn("pay_gap");
    var numJobs = this.data.getColumn("num_jobs");

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255, 0, 0);
    stroke(0);
    strokeWeight(1);

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      // x = propFemale
      // y = payGap
      // size = numJobs
      ellipse(
        map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad),
        map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad),
        map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax)
      );
    }
  };

  //function to draw pay gap axis
  this.PayGapAxes = function () {
    animationDuration = 100;
    stroke(200);
    // Add vertical line.
    strokeWeight(2);
    animS.line(
      "paygap-y-axis",
      animationDuration,
      width / 2,
      0 + this.pad,
      width / 2,
      height - this.pad
    );

    // Add horizontal line.
    animS.line(
      "paygap-x-axis",
      animationDuration,
      0 + this.pad,
      height / 2,
      width - this.pad,
      height / 2
    );
  };
  //legend to explain the pay gap chart
  this.payGaplegend = (payGaplayout) => {
    //points on the chart
    const middleX = payGaplayout.width / 2;
    const middleY = payGaplayout.height / 2;
    fill("black");
    noStroke();
    textSize(15);
    textStyle(ITALIC);
    textAlign(LEFT, CENTER);
    text("men are paid more", middleX * 1.6, middleY / 1.6);
    text("women are paid more", middleX * 1.55, middleY * 1.6);
  };

  //function that creates Job Titles chart
  this.plotJobTitles = () => {
    //calling axis function
    jobTitlesAxes(this.payGaplayout);

    //calling legend function
    jobTitlesLegend(this.payGaplayout);

    //calling x label function
    jobTitlesXLabels(this.payGaplayout, this.data);

    //Job Type: Managers,Directors,SR Officials
    let fetchMaleDirectors = {
      job1: parseFloat(this.data.get(0, "num_jobs_male")),
      job2: parseFloat(this.data.get(1, "num_jobs_male")),
    };

    const totalMaleDirectors = fetchMaleDirectors.job1 + fetchMaleDirectors.job2;

    let fetchFemaleDirectors = {
      job1: parseFloat(this.data.get(0, "num_jobs_female")),
      job2: parseFloat(this.data.get(1, "num_jobs_female")),
    };

    const totalFemaleDirectors = fetchFemaleDirectors.job1 + fetchFemaleDirectors.job2;

    //plotting the data
    drawDirectors(this.payGaplayout, animationDuration, totalMaleDirectors, totalFemaleDirectors);

    //Job Type: Professional Occupations
    let fetchMaleProf = {
      job1: parseFloat(this.data.get(2, "num_jobs_male")),
      job2: parseFloat(this.data.get(3, "num_jobs_male")),
      job3: parseFloat(this.data.get(4, "num_jobs_male")),
      job4: parseFloat(this.data.get(5, "num_jobs_male")),
    };

    const totalMaleProf =
      fetchMaleProf.job1 + fetchMaleProf.job2 + fetchMaleProf.job3 + fetchMaleProf.job4;

    let fetchFemaleProf = {
      job1: parseFloat(this.data.get(2, "num_jobs_female")),
      job2: parseFloat(this.data.get(3, "num_jobs_female")),
      job3: parseFloat(this.data.get(4, "num_jobs_female")),
      job4: parseFloat(this.data.get(5, "num_jobs_female")),
    };

    const totalFemaleProf =
      fetchFemaleProf.job1 + fetchFemaleProf.job2 + fetchFemaleProf.job3 + fetchFemaleProf.job4;

    //plotting the data
    drawProfOccup(this.payGaplayout, animationDuration, totalMaleProf, totalFemaleProf);

    //Job Type: Admin and Secretarial
    let fetchMaleAdmins = {
      job1: parseFloat(this.data.get(11, "num_jobs_male")),
      job2: parseFloat(this.data.get(12, "num_jobs_male")),
    };

    const totalMaleAdmins = fetchMaleAdmins.job1 + fetchMaleAdmins.job2;

    let fetchFemaleAdmins = {
      job1: parseFloat(this.data.get(11, "num_jobs_female")),
      job2: parseFloat(this.data.get(12, "num_jobs_female")),
    };

    const totalFemaleAdmins = fetchFemaleAdmins.job1 + fetchFemaleAdmins.job2;

    //plotting the data
    drawAdminsAndSecret(this.payGaplayout, animationDuration, totalMaleAdmins, totalFemaleAdmins);
  };
}
