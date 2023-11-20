//to plot chart x & y axis
jobTitlesAxes = (layout) => {
  let animationDuration = 50;

  stroke(200);
  strokeWeight(2);
  //y-axis
  animS.line(
    "jobtitles-y-axis",
    animationDuration,
    layout.width - 50,
    50,
    layout.width - 50,
    layout.height
  );

  //x-axis
  animS.line(
    "jobtitles-x-axis",
    animationDuration,
    50 + layout.pad,
    layout.height - 50,
    layout.width - layout.pad,
    layout.height - 50
  );
};

//to plot x-axis labels
jobTitlesXLabels = (layout, data) => {
  const firstLabel = data.get(0, "job_type");
  noStroke();
  fill("black");
  textSize(12);
  text(firstLabel, 120 + layout.pad, height - 30);

  //Job Type: Professional Occupations
  const secondLabel = data.get(3, "job_type");
  noStroke();
  fill("black");
  textSize(12);
  text(secondLabel, 460 + layout.pad, height - 30);

  //Job Type: Admin and Secretarial
  const thirdLabel = data.get(11, "job_type");
  noStroke();
  fill("black");
  textSize(12);
  text(thirdLabel, 710 + layout.pad, height - 30);
};

//to plot chart legend
jobTitlesLegend = (layout) => {
  textStyle(ITALIC);

  //male
  noStroke();
  fill(0, 128, 255);
  animS.square("maleCol", 100, layout.width / 2.7, layout.height / 10, 20);
  fill("black");
  textSize(17);
  textAlign(LEFT, CENTER);
  text("Male", layout.width / 2.5, layout.height / 8.2);

  //female
  noStroke();
  fill("pink");
  animS.square("femaleCol", 100, layout.width / 1.5, layout.height / 10, 20);
  fill("black");
  textSize(17);
  textAlign(LEFT, CENTER);
  text("Female", layout.width / 1.43, layout.height / 8.2);
};

//draw the Directors and Managers Bars
drawDirectors = (layout, animationDuration, totalMale, totalFemale) => {
  //male
  noStroke();
  fill(0, 128, 255);
  animS.rect(
    "maleDirectors",
    animationDuration,
    150 + layout.pad,
    layout.height / 4.1,
    80,
    map(totalMale, 0, totalMale, layout.height - 50, layout.height / 1.5)
  );

  //female
  noStroke();
  fill("pink");
  animS.rect(
    "femaleDirectors",
    animationDuration,
    230 + layout.pad,
    layout.height / 1.5,
    80,
    map(totalFemale, 0, totalFemale, layout.height - 50, layout.height / 4.1)
  );
};

//draw the Professional Occupation Job Bars
drawProfOccup = (layout, animationDuration, totalMale, totalFemale) => {
  //male
  noStroke();
  fill(0, 128, 255);
  animS.rect(
    "maleProf",
    animationDuration,
    450 + layout.pad,
    layout.height / 3.5,
    80,
    map(totalMale, 0, totalMale, layout.height - 50, layout.height / 1.6)
  );

  //female
  noStroke();
  fill("pink");
  animS.rect(
    "femaleProf",
    animationDuration,
    530 + layout.pad,
    layout.height / 4.1,
    80,
    map(totalFemale, 0, totalFemale, layout.height - 50, layout.height / 1.5)
  );
};

//draw the Admins and Secretarial Job Bars
drawAdminsAndSecret = (layout, animationDuration, totalMale, totalFemale) => {
  //male
  noStroke();
  fill(0, 128, 255);
  animS.rect(
    "maleAdmins",
    animationDuration,
    750 + layout.pad,
    layout.height / 1.5,
    80,
    map(totalMale, 0, totalMale, layout.height - 50, layout.height / 4.1)
  );
  //female
  noStroke();
  fill("pink");
  animS.rect(
    "femaleAdmins",
    animationDuration,
    830 + layout.pad,
    layout.height / 4.1,
    80,
    map(totalFemale, 0, totalFemale, layout.height - 50, layout.height / 1.5)
  );
};
