/*
    Authors: Shivam Singla (Group Leader)
             Mohammad Qureshi
             Nickieda Johnson

    The purpose of this file is to provide the behaviours for 
    dropdown menus, canvases, sliders and readouts used in the HTML file.
    List of functions associated with this file:
      setup()
      elevationSetup()
      doElevation()
      createDoor()
      planSetup()
      doPlan()
      createPlanView()
      createPlanWindow()
      changeThickness()
      changeDTResistance()
      changeWTResistance()
      changeWindowArea()
      changeOTResistance()
      changeEOTResistance()
      changeAnnualEnergy()
      onSelectViewChapters()
      onSelectOpaqueConstructionMenu()
      onSelectDegreeDaysMenu()
      onSelectConceptsMenu()
      everythingVisible()
      everythingHidden()
      getConceptsInfo()
      loadP3()
*/

// global variable for Opaque Thickness
var thickness = 2;
// global variable for Door Thermal Resistance
var dtResistance = 2;
// global variable for Window Thermal Resistance
var wtResistance = 1;
// global variable for Window Area
var windowArea = 0;
// global variable for Opaque Construction Menu value
var opConsValue = 0;
// global variable for Places with Degree Days Manu value
var degree = 0;
// global variable to store JSON object with info for the Concepts Menu
var conceptsInfo;

/*    global variables for the canvas   */
// Plan View
var planObj, planCon;
// Elevation view
var elevationObj, elevationCon;

// global scaling constant
const SCL = 1.35;

// global Building Height constant
const BUILDING_HEIGHT = 132;

// global hidden and visible contants
const HIDDEN = "hidden";
const VISIBLE = "visible";

// global constant to save the server URL
const SERVER_URL = "http://ugdev.cs.smu.ca:3300";

/*    dropdown menu constants     */
//View Chapters Menu
const VIEW_CHAPTERS = "ViewChapters";
const INSULATION = "Insulation";

//Opaque Construction Menu
const OPAQUE_CONSTRUCTION = "OpaqueConstruction";
const CONTAINER = "Container";
const UNINSULATED = "Uninsulated";
const CELLULOSE = "Cellulose";
const FIBERGLASS = "Fiberglass";
const SPRAY_FOAM = "SprayFoam";

//Concepts Menu constants
const LOCAL_CONDITIONS = "LocalConditions";
const BUDGET = "Budget";
const DRAFTS_VENTILATION = "DraftsVentilation";
const INSULATION_HEAT_LOSS = "InsulationHeatLoss";
const MATERIALS_INSULATION = "MaterialsInsulation";
const ENVIRONMENTAL_IMPACT = "EnvironmentalImpact";

/*
    The purpose of this function is to initiate the objects and 
    context variables for plan and elevation view,
    start anonymous functions for sliders onchange,
    hiding eveything for insulation initially.
*/
function setup() {
  // plan view canvas setup
  planSetup();

  // elevaton view canvas setup
  elevationSetup();

  // Opaque Thickness Slider change function
  $("#opaqueThicknessSld").on("change", function () {
    thickness = $(this).val() / 2;

    changeThickness();
  });

  // Door Thermal Resistance Slider change function
  $("#dtResistanceSld").on("change", function () {
    dtResistance = $(this).val();

    changeDTResistance();
  });

  // Window Thermal Resistance Slider change function
  $("#wtResistanceSld").on("change", function () {
    wtResistance = $(this).val();

    changeWTResistance();
  });

  // Window Area Slider change function
  $("#windowAreaSld").on("change", function () {
    windowArea = $(this).val() / 2;

    changeWindowArea();
  });

  // getting the JSON object from the server with all the info for Concepts Menu
  getConceptsInfo();

  // To hide eveything initially
  everythingHidden();
}

/*
  The purpose of this function is to setup the initial elevation canvas.
*/
function elevationSetup() {
  // function to setup the elevation canvas

  elevationObj = document.getElementById("elevation");
  elevationCon = elevationObj.getContext("2d");
  $("#windowAreaReadout").val(0);
  createDoor();
}

/*
  The purpose of this function is to make the elevation view canvas.
*/
function doElevation() {
  createDoor();

  if (windowArea > 1) {
    // Elevation window frame
    elevationCon.fillStyle = "black";
    elevationCon.fillRect(
      80 * SCL - windowArea * SCL,
      25 * SCL,
      2 * windowArea * SCL + Number(6),
      Number(((3 * windowArea) / 2) * SCL) + Number(4)
    );
    elevationCon.fillStyle = "#a3bcfd";
    elevationCon.fillRect(
      81 * SCL - windowArea * SCL,
      26 * SCL,
      2 * windowArea * SCL + Number(3),
      Number(((3 * windowArea) / 2) * SCL) + Number(1)
    );
    // elevation window
    elevationCon.fillStyle = "black";
    elevationCon.fillRect(
      82 * SCL - windowArea * SCL,
      27 * SCL,
      2 * windowArea * SCL,
      Number(((3 * windowArea) / 2) * SCL) - 2
    );
    elevationCon.fillStyle = "#a3bcfd";
    elevationCon.fillRect(
      83 * SCL - windowArea * SCL,
      28 * SCL,
      2 * windowArea * SCL - 2,
      Number(((3 * windowArea) / 2) * SCL) - 4
    );
  }
}

/*
  The purpose of this function is to clear and create a door
  in the elevation canvas.
*/
function createDoor() {
  // function to create door
  elevationCon.clearRect(0, 0, elevationObj.width, elevationObj.height);

  elevationCon.fillStyle = "#a3bcfd"; // blue
  elevationCon.fillRect(0, 0, elevationObj.width, elevationObj.height);
  // door Frame
  elevationCon.fillStyle = "black";
  elevationCon.fillRect(158 * SCL, 25 * SCL, 40 * SCL, 84 * SCL);

  elevationCon.fillStyle = "#a3bcfd";
  elevationCon.fillRect(159 * SCL, 26 * SCL, 38 * SCL, 82 * SCL);

  // door
  elevationCon.fillStyle = "black";
  elevationCon.fillRect(160 * SCL, 27 * SCL, 36 * SCL, 80 * SCL);

  elevationCon.fillStyle = "#a3bcfd";
  elevationCon.fillRect(161 * SCL, 28 * SCL, 34 * SCL, 78 * SCL);

  // door handle
  elevationCon.strokeStyle = "black";
  elevationCon.lineWidth = 1;
  elevationCon.beginPath();
  elevationCon.arc(255, 90, 3, 0, 2 * Math.PI);
  elevationCon.stroke();
}

/* 
  The purpose of this function is to setup the initial Plan canvas.
*/
function planSetup() {
  planObj = document.getElementById("plan");
  planCon = planObj.getContext("2d");

  $("#thicknessReadout").val(2);
  $("#dtResReadout").val(2);
  $("#wtResReadout").val(1);
  doPlan();
}

/*
  The purpose of this function is to call the functions to create
  a Plan view with the Window.
*/
function doPlan() {
  createPlanView();
  createPlanWindow();
}

/*
  The purpose of this function is to make the plan view canvas.
*/
function createPlanView() {
  planCon.clearRect(0, 0, planObj.width, planObj.height);

  // slab
  planCon.fillStyle = "#d2cbcd"; // concrete porch
  planCon.fillRect(0, 0, planObj.width, planObj.height);
  // outer skin
  planCon.fillStyle = "#3104fb"; // blue
  planCon.fillRect(0, 0, planObj.width, BUILDING_HEIGHT);

  // planObj interior wall changing the color based on insulation selected
  // insulation selection is stored in the local variable choice
  let choice = $("#opaqueConstructionMenu").find(":selected").val();

  if (choice === CELLULOSE) {
    planCon.fillStyle = "#e8e5e4"; // white
  } else if (choice === FIBERGLASS) {
    planCon.fillStyle = "#fec7d4"; // pink
  } else if (choice === SPRAY_FOAM) {
    planCon.fillStyle = "#fdfaaa"; // yellow
  } else {
    planCon.fillStyle = "#d2cbcd"; // concrete
  }

  planCon.fillRect(1, 1, planObj.width - 2, BUILDING_HEIGHT - 2);

  // inner skin
  planCon.fillStyle = "#3104fb";
  planCon.fillRect(
    thickness * SCL + Number(2),
    thickness * SCL + Number(2),
    planObj.width - 2 * thickness * SCL - 4,
    BUILDING_HEIGHT - 2 * thickness * SCL - 4
  );
  // interior floor
  planCon.fillStyle = "#d2cbcd"; // concrete
  planCon.fillRect(
    thickness * SCL + Number(3),
    thickness * SCL + Number(3),
    planObj.width - 2 * thickness * SCL - 6,
    BUILDING_HEIGHT - 2 * thickness * SCL - 6
  );

  planCon.fillStyle = "#d2cbcd"; // concrete
  planCon.fillRect(
    100 * SCL - windowArea * SCL,
    planObj.height - thickness * SCL - 2 * SCL,
    2 * windowArea * SCL,
    thickness * SCL + Number(2 * SCL)
  );

  //plan door block
  planCon.fillStyle = "#d2cbcd"; //concrete
  planCon.fillRect(160 * SCL, 128, 36 * SCL, 4);

  //plan door entrance dot line
  planCon.beginPath();
  planCon.strokeStyle = "#000000"; //black
  planCon.setLineDash([3, 3]);
  planCon.moveTo(160 * SCL, 132);
  planCon.lineTo(196 * SCL, 132);
  planCon.stroke();

  planCon.fillStyle = "#000000"; //black
  planCon.fillRect(160 * SCL, 127, 4, 37 * SCL);

  //plan door swing dotted line
  planCon.beginPath();
  planCon.strokeStyle = "#000000"; //black
  planCon.setLineDash([3, 3]);
  planCon.arc(160 * SCL, 128, 36 * SCL, 0, Math.PI / 2);
  planCon.stroke();

  //plan inner door opening clear
  planCon.fillStyle = "#d2cbcd"; //concrete
  planCon.fillRect(160 * SCL, 70, 50, 45 * SCL);

  //plan inner door door entrance
  planCon.beginPath();
  planCon.strokeStyle = "#000000"; //black
  planCon.moveTo(160 * SCL, BUILDING_HEIGHT - 1 * thickness * SCL - 2.5);
  planCon.lineTo(196 * SCL, BUILDING_HEIGHT - 1 * thickness * SCL - 2.5);
  planCon.stroke();
}

/*
  The purpose of this function is to create the Window on the Plan View canvas.
*/
function createPlanWindow() {
  // plan window
  planCon.fillStyle = "#07ebf8"; // glass
  planCon.fillRect(
    75 * SCL - windowArea * SCL,
    planObj.height - thickness * SCL - 2 * SCL - 46,
    2 * windowArea * SCL,
    thickness * SCL + Number(2 * SCL)
  );

  // plan window inner threshold
  planCon.setLineDash([4, 3]);
  planCon.beginPath();
  planCon.moveTo(
    75 * SCL - windowArea * SCL,
    planObj.height - thickness * SCL - 2 * SCL - 46
  );
  planCon.lineTo(
    75 * SCL + Number(windowArea * SCL),
    planObj.height - thickness * SCL - 2 * SCL - 46
  );
  planCon.stroke();
  // plan window outer threshold
  planCon.beginPath();
  planCon.moveTo(75 * SCL - windowArea * SCL, planObj.height - 46);
  planCon.lineTo(75 * SCL + Number(windowArea * SCL), planObj.height - 46);
  planCon.stroke();
}

/*
  The purpose of this function is to:
  - display Opaque Thickness in the Opaque Thickness Readout
  - change the Plan View canvas according to the values from the Opaque Thickness slider
*/
function changeThickness() {
  if (thickness >= 4) {
    $("#thicknessReadout").val(thickness);
  }

  // The selection in Opaque Construction Menu is stored in choice
  let choice = $("#opaqueConstructionMenu").find(":selected").val();
  if (choice !== OPAQUE_CONSTRUCTION) {
    changeOTResistance();
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  }

  // Code to change the Window area in both the canvases.
  doPlan();
  doElevation();
}

/*
  The purpose of this function is to:
  - display Door Thermal Resistance in the Door Thermal Resistance Readout
*/
function changeDTResistance() {
  $("#dtResReadout").val(dtResistance);

  // The selection in Opaque Construction Menu is stored in choice
  let choice = $("#opaqueConstructionMenu").find(":selected").val();
  if (choice !== OPAQUE_CONSTRUCTION) {
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  }
}

/*
  The purpose of this function is to:
  - display Window Thermal Resistance in the Window Thermal Resistance Readout
*/
function changeWTResistance() {
  $("#wtResReadout").val(wtResistance);

  // The selection in Opaque Construction Menu is stored in choice
  let choice = $("#opaqueConstructionMenu").find(":selected").val();
  if (choice !== OPAQUE_CONSTRUCTION) {
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  }
}

/*
  The purpose of this function is to:
  - calculate and display Window Area in the Window Area Readout
  - change both the canvases according to the values from the Window Area slider
*/
function changeWindowArea() {
  // window area converted in square feet is stored in local variable window
  let window = (windowArea / 12) * ((windowArea / 12) * 3);
  // window area is truncated to one decimal place and stored in local variable windowAreaTrunc
  let windowAreaTrunc = Math.trunc(Number(window) * 10) / 10;
  $("#windowAreaReadout").val(windowAreaTrunc);

  // The selection in Opaque Construction Menu is stored in choice
  let choice = $("#opaqueConstructionMenu").find(":selected").val();
  if (choice !== OPAQUE_CONSTRUCTION) {
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  }

  // Code to change the Window area in both the canvases.
  if (windowAreaTrunc >= 1.5) {
    doPlan();
    doElevation();
  } else {
    createDoor();
    createPlanView();
  }
}

/*
  The purpose of this function is to:
  - calculate and display the Opaque Thermal Resistance in the
    Opaque Thermal Resistance Readout
*/
function changeOTResistance() {
  // calculations are computed and stored in local variable result
  let result = 0;
  if (thickness >= 4) {
    result = thickness - 2;
    result = result * opConsValue;
    result = result + Number(2);
    $("#otResReadout").val(result);
  }
}

/*
  The purpose of this function is to:
  - calculate and display the Effective Overall Thermal Resistance in the
    Effective Overall Thermal Resistance Readout
*/
function changeEOTResistance() {
  // getting the Readout values
  // Window Area Readout value is stored in local variable windowAreaReadout
  let windowAreaReadout = $("#windowAreaReadout").val();
  // Opaque Thermal Resistance Readout value is stored in local variable otResReadout
  let otResReadout = $("#otResReadout").val();

  // calculations for Effective Overall Thermal Resistance are stored in local variable result
  let result = 0;
  if (thickness >= 4) {
    result = (800 - windowAreaReadout) / otResReadout;
    result = result + windowAreaReadout / wtResistance;
    result = result + 20 / dtResistance;
    result = result / 820;
    result = 1 / result;
    $("#eotResReadout").val(Math.round(result));
  }
}

/*
  The purpose of this function is to:
  - calculate and display the Annual Energy in the Annual Energy Readout
*/
function changeAnnualEnergy() {
  // getting the Readout value
  // Effective Overall Thermal Resistance Readout value is stored in local variable eotResReadout
  let eotResReadout = $("#eotResReadout").val();

  // calculations for Annual Energy are stored in local variable result
  let result = 820 * degree * 1.8 * 24;
  result = result / eotResReadout;
  result = result + degree * 1.8 * 24 * 65;
  result = result / 3412;
  result = result + 3000;
  $("#annualEnergyReadout").val(Math.round(result));
}

/*
  This function is called when a selection is made on View Chapters Menu
*/
function onSelectViewChapters() {
  // The selection in View Chapters Menu is stored in choice
  let choice = $("#viewChaptersMenu").find(":selected").val();
  // The text for the selection in View Chapters Menu is stored in choiceText
  let choiceText = $("#viewChaptersMenu").find(":selected").text();

  if (choice === VIEW_CHAPTERS) {
    everythingHidden();
    loadP3();
  } else if (choice === INSULATION) {
    everythingVisible();
  } else {
    alert(choiceText + " is under construction.");
    loadP3();
  }
}

/*
  This function is called when a selection is made on Opaque Construction Menu
*/
function onSelectOpaqueConstructionMenu() {
  // The selection in Opaque Construction Menu is stored in choice
  let choice = $("#opaqueConstructionMenu").find(":selected").val();

  if (choice === CONTAINER || choice === UNINSULATED) {
    opConsValue = 0;
    changeOTResistance();
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  } else if (choice === CELLULOSE || choice === FIBERGLASS) {
    opConsValue = 3;
    changeOTResistance();
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  } else if (choice === SPRAY_FOAM) {
    opConsValue = 6;
    changeOTResistance();
    changeEOTResistance();
    onSelectDegreeDaysMenu();
  } else {
    opConsValue = 0;
  }

  doPlan();
}

/*
  This function is called when a selection is made on Degree Days Menu
*/
function onSelectDegreeDaysMenu() {
  // The selection in Places with Degree Days Menu is stored in choice
  let choice = $("#degreeDaysMenu").find(":selected").val();

  if (choice === "DegreeDays") {
    degree = 0;
  } else {
    degree = Number(choice);
    // The selection in Opaque Construction Menu is stored in opChoice
    let opChoice = $("#opaqueConstructionMenu").find(":selected").val();
    if (opChoice !== OPAQUE_CONSTRUCTION && thickness >= 4) {
      changeAnnualEnergy();
    }
  }
}
/*
  This function is called when a selection is made on Concepts Menu
*/
function onSelectConceptsMenu() {
  // The selection in Concepts Menu is stored in choice
  let choice = $("#conceptsMenu").find(":selected").val();

  $("#conceptsInfo").show();
  if (choice === LOCAL_CONDITIONS) {
    $("#conceptsInfo").html(conceptsInfo.localConditions);
  } else if (choice === BUDGET) {
    $("#conceptsInfo").html(conceptsInfo.budget);
  } else if (choice === DRAFTS_VENTILATION) {
    $("#conceptsInfo").html(conceptsInfo.draftsVentilation);
  } else if (choice === INSULATION_HEAT_LOSS) {
    $("#conceptsInfo").html(conceptsInfo.insulationHeatLoss);
  } else if (choice === MATERIALS_INSULATION) {
    $("#conceptsInfo").html(conceptsInfo.materialsInsulation);
  } else if (choice === ENVIRONMENTAL_IMPACT) {
    $("#conceptsInfo").html(conceptsInfo.environmentalImpact);
  }
}

/*
  The purpose of this function is to make everything
  visible once Insulation is selected.
*/
function everythingVisible() {
  // Plan View and Elevation View Canvas
  document.getElementById("plan").style.visibility = VISIBLE;
  document.getElementById("elevation").style.visibility = VISIBLE;

  // Places with degree-days Menu
  $("#degreeDaysMenu").parent().show();

  // Opaque Construction With R Menu
  $("#opaqueConstructionMenu").parent().show();

  // Opaque Thickness Slider, Readout and Label
  $("#opaqueThicknessSld").parent().show();
  $("#thicknessReadout").parent().show();
  $("#thicknessLbl").parent().show();

  // Opaque Thermal Resistence Readout and Label
  $("#otResReadout").parent().show();
  $("#otResistanceLbl").parent().show();

  // Door Thermal Resistence Slider, Readout and Label
  $("#dtResistanceSld").parent().show();
  $("#dtResReadout").parent().show();
  $("#dtResistanceLbl").parent().show();

  // Window Thermal Resistence Slider, Readout and Label
  $("#wtResistanceSld").parent().show();
  $("#wtResReadout").parent().show();
  $("#wtResistanceLbl").parent().show();

  // Window Area Slider, Readout and Label
  $("#windowAreaSld").parent().show();
  $("#windowAreaReadout").parent().show();
  $("#windowAreaLbl").parent().show();

  // Effective Overall Thermal Resistence Readout and Label
  $("#eotResReadout").parent().show();
  $("#eotResistanceLbl").parent().show();

  // Annual Energy Readout and Label
  $("#annualEnergyReadout").parent().show();
  $("#annualEnergyLbl").parent().show();

  // Graphs Menu
  $("#graphsMenu").parent().show();

  // Readouts Menu
  $("#readoutsMenu").parent().show();

  // Concepts Menu
  $("#conceptsMenu").parent().show();
}

/*
  The purpose of this function is to make everything 
  hidden onload and when View Chapters is selected.
*/
function everythingHidden() {
  // Plan View and Elevation View Canvas
  document.getElementById("plan").style.visibility = HIDDEN;
  document.getElementById("elevation").style.visibility = HIDDEN;

  // Places with degree-days Menu
  $("#degreeDaysMenu").parent().hide();

  // Opaque Construction With R Menu
  $("#opaqueConstructionMenu").parent().hide();

  // Opaque Thickness Slider, Readout and Label
  $("#opaqueThicknessSld").parent().hide();
  $("#thicknessReadout").parent().hide();
  $("#thicknessLbl").parent().hide();

  // Opaque Thermal Resistence Readout and Label
  $("#otResReadout").parent().hide();
  $("#otResistanceLbl").parent().hide();

  // Door Thermal Resistence Slider, Readout and Label
  $("#dtResistanceSld").parent().hide();
  $("#dtResReadout").parent().hide();
  $("#dtResistanceLbl").parent().hide();

  // Window Thermal Resistence Slider, Readout and Label
  $("#wtResistanceSld").parent().hide();
  $("#wtResReadout").parent().hide();
  $("#wtResistanceLbl").parent().hide();

  // Window Area Slider, Readout and Label
  $("#windowAreaSld").parent().hide();
  $("#windowAreaReadout").parent().hide();
  $("#windowAreaLbl").parent().hide();

  // Effective Overall Thermal Resistence Readout and Label
  $("#eotResReadout").parent().hide();
  $("#eotResistanceLbl").parent().hide();

  // Annual Energy Readout and Label
  $("#annualEnergyReadout").parent().hide();
  $("#annualEnergyLbl").parent().hide();

  // Graphs Menu
  $("#graphsMenu").parent().hide();

  // Readouts Menu
  $("#readoutsMenu").parent().hide();

  // Concepts Menu
  $("#conceptsMenu").parent().hide();

  // Hiding information for the Concepts Menu
  $("#conceptsInfo").hide();
}

/*
  The purpose of this function is to access the server and get the
  JSON object with all the info for Concepts Menu
*/
function getConceptsInfo() {
  // jQuery http get function
  //
  // First argument : The complete URL (not just the root)
  // Second argument: The callback function ("data" is a reference to the returned JSON object)
  //                  The function is run only after .get() has finished and returned either
  //                  a valid result or an error.
  //
  //                  On error, the .fail() function executes.
  $.get(SERVER_URL + "/P3ServerID", function (data) {
    conceptsInfo = data;
  }).fail(function (error) {
    alert(error.responseText);
  });
}

/*
  The purpose of this function is to reload P1.html page
  to reinitialize the application.
*/
function loadP3() {
  window.location.replace("./P1.html");
}
