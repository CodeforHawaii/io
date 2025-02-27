/*
  Impact Bubble Chart
*/

var iBubble = iBubble || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        helloWorld : function() {
            alert('Hello World! -' + _args[0]);
        },
        priorHash : function() {
          return ({}); // initially empty
            //return (getHash()); // Includes hiddenhash. Resides in localsite/localsite.js
        },

    };
}());

// `hashChangeEvent` event reside in multiple widgets. 
// Called by goHash +-++localsite.js
let dataObject1={};
var element = document.querySelector('#industry-list');
clickCount=-1
colors=['rgb(198,60,65)','rgb(21,192,191)','rgb(155,89,182)','rgb(52,152,219)','rgb(46,204,113)','rgb(241,196,15)','rgb(230,126,34)','rgb(52,73,94)','rgb(192,57,43)','rgb(22,160,133)']
//the selected bubbles sect_list starter
sect_list=[]

//state,county drop down, for Nazanin's reference
//dropdown population code
/*
drop_down_list();
$("#state").change(drop_down_list);
$(window).load(drop_down_list);
// Drop down code from: https://www.bitrepository.com/dynamic-dependant-dropdown-list-us-states-counties.html
function drop_down_list(){
  var state = $('#state').val();
  if(state == 'AK' || state == 'DC') // Alaska and District Columbia have no counties{
    $('#county_drop_down').hide();
    $('#no_county_drop_down').show();
  }else{
    $('#loading_county_drop_down').show(); // Show the Loading...
    $('#county_drop_down').hide(); // Hide the drop down
    $('#no_county_drop_down').hide(); // Hide the "no counties" message (if it's the case)
    $.getScript("js/states/"+ state.toLowerCase() +".js", function(){
      populate(document.form.county);

      $('#loading_county_drop_down').hide(); // Hide the Loading...
      $('#county_drop_down').show(); // Show the drop down
    });
  }
}

d3.selectAll("#county").on("change",function(){
  console.log("county changed")
    updateHash({"naics":d3.select("#county").node().value});
})*/


par={}
//attribute mutation observer instead of using hash
/*
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type == "attributes") {
      par.naics=document.getElementById('industry-list').getAttribute('data-naics').slice(0,10)
      console.log("parrrr"+par.naics)
      if(document.getElementById("mySelect").checked){
          midFunc(params.x,params.y,params.z,par,"region");
          document.querySelector('#sector-list').setAttribute('area', 'GAUSEEIO');
      }else{
          midFunc(params.x,params.y,params.z,par,"all");
          document.querySelector('#sector-list').setAttribute('area', 'USEEIO');
      }
    }
  });
});
*/

// Uncaught TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.
//observer.observe(element, {
//  attributes: true //configure it to listen to attribute changes
//});


let priorHash_bubble = {};
//refreshBubbleWidget();
document.addEventListener('hashChangeEvent', function (elem) {
  refreshBubbleWidget();
}, false);
document.addEventListener('hiddenhashChangeEvent', function (elem) {
  refreshBubbleWidget();
}, false);

function refreshBubbleWidget() {
    let hash = getHash(); // Includes hiddenhash
    //params = loadParams(location.search,location.hash); // Also used by loadIndustryData()

    //alert("refreshBubbleWidget() naics: " + hash.naics);

    /*
    // GET US

        geo_list[0]=params.geo
    if(geo_list[1]){
      lastgeo=geo_list[1]
      currgeo=geo_list[0]
      if(typeof lastgeo!='undefined'){
        if (lastgeo.includes(",")){
            lastgeo=lastgeo.split(",")
            lastgeo=(lastgeo[0].split("US")[1]).slice(0,2)
        }else{
            lastgeo=(lastgeo.split("US")[1]).slice(0,2)
        }
      }
      if(typeof currgeo!='undefined'){
        if (currgeo.includes(",")){
          currgeo=currgeo.split(",")
          currgeo=(currgeo[0].split("US")[1]).slice(0,2)
        }else{
          currgeo=(currgeo.split("US")[1]).slice(0,2)
        }
      }
    }else{
      lastgeo=[]
      currgeo=geo_list[0]
      if(typeof currgeo!='undefined'){
        if (currgeo.includes(",")){
          currgeo=currgeo.split(",")
          currgeo=(currgeo[0].split("US")[1]).slice(0,2)
        }else{
          currgeo=(currgeo.split("US")[1]).slice(0,2)
        }
      }
    }
    */
  
    if (priorHash_bubble.state != hash.state) {
        displayImpactBubbles(1); // Occurs on INIT
    } else if (priorHash_bubble.geo != hash.geo) {
        displayImpactBubbles(1);
    } else if (priorHash_bubble.naics != hash.naics) {
        displayImpactBubbles(1);
    } else if (priorHash_bubble.x != hash.x || priorHash_bubble.y != hash.y || priorHash_bubble.z != hash.z) {
        displayImpactBubbles(1);
    }
    priorHash_bubble = getHash();
}


console.log("Bubble js loaded");
$(document).ready(function () {
  console.log("Bubble gets doc ready");
  //getting the listof indicators and populating the x and y dropdown options
  let dropdown = $('#graph-picklist-x');
  dropdown.empty();
  const url = '/io/build/api/USEEIOv2.0/indicators.json';
  // Populate dropdown with list of provinces
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      dropdown.append($('<option></option>').attr('value', entry.code).text(entry.name));
    })
  });

  let dropdown2 = $('#graph-picklist-y');
  dropdown2.empty();
  // Populate dropdown with list of provinces
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      dropdown2.append($('<option></option>').attr('value', entry.code).text(entry.name));
    })
  });

  let dropdown3 = $('#graph-picklist-z');
  dropdown3.empty();
  // Populate dropdown with list of provinces
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      dropdown3.append($('<option></option>').attr('value', entry.code).text(entry.name));
    })
  });
});


var parentId = "#graph-wrapper";
var animDuration = 1200;
var margin = {top: 40, right: 50, bottom: 68, left: 95};
var width = 1000 - margin.left - margin.right
var height = 450 - margin.top - margin.bottom;
var xScale, yScale, zScale, line;
var myTickFormat, xAxis, yAxis;
var rolloverDiv;
var bubbleSvg, bubbleGradient;

function getDimensions(x,y,z){

  var returnX=[];
  var returnY=[];
  var returnZ=[];
  var returnPairs = [];
  if (allData) {
    allData.forEach(function(d){
      var pair = {x: d[x],y: d[y],z:d[z],industry_detail:d["industry_detail"],industry_code:d["industry_code"],ACID:d["ACID"],
      ENRG:d["ENRG"],ETOX:d["ETOX"],EUTR:d["EUTR"],FOOD:d["FOOD"],GCC:d["GCC"],HAPS:d["HAPS"],
      HAZW:d["HAZW"],HC:d["HC"],HNC:d["HNC"],HRSP:d["HRSP"],HTOX:d["HTOX"],JOBS:d["JOBS"],
      LAND:d["LAND"],METL:d["METL"],MINE:d["MINE"],MSW:d["MSW"],NREN:d["NREN"],OZON:d["OZON"],
      PEST:d["PEST"],REN:d["REN"],SMOG:d["SMOG"],VADD:d["VADD"],WATR:d["WATR"],GHG:d["GHG"]}; // CUSTOM, appended year for chart, the rest for popup
      returnPairs.push(pair);
      returnX.push(d[x]);
      returnY.push(d[y]);
      returnZ.push(d[z]);
    });
    return {x:returnX,y:returnY,z:returnZ,pairs:returnPairs};
  } else {
    console.log("ERROR: Bubble.js allData undefined.")
  }
}

function updateTitle(x,y,z) {
  return; // Not currently adding extra title

  var unitx, unity, unitz;
  console.log("updateTitle " + x + " " + y + " " + z);
  //let params = loadParams(location.search,location.hash);
  d3.json("/io/build/api/USEEIOv2.0/indicators.json").then(function(consdata){
    console.log("attempt");
    var filteredData = consdata.filter(function(d) {
      if(d["id"]==x) {
        unitx=d["unit"]
      }
      if(d["id"]==y) {
        unity=d["unit"]
      }
      if(d["id"]==z) {
        unitz=d["unit"]
      }
    })
    $(document).ready(function () { 
      if(dataObject1.stateshown==13){
        document.getElementById("bubble-graph-title").innerHTML = "Comparison of 3 indicators for Georgia Industries - X: " + hash.x + " &nbsp;Y: " + hash.y + " &nbsp;Z: " + hash.z;
      }else{
        document.getElementById("bubble-graph-title").innerHTML = "US Industries"
      }
      //$("#impactText").html(z + "<br>" + y + "<br>" + x);
      //$("#impactText2").html(z + "<br>" + y + "<br>" + x); // Using jquery avoid error if element is not in page.
      document.getElementById("unit-x").innerHTML = unitx;
      document.getElementById("unit-y").innerHTML = unity;
      document.getElementById("unit-z").innerHTML = unitz;
    });
  })
}


// returns slope, intercept and r-square of the line
//Pulled from http://bl.ocks.org/benvandyke/8459843
function leastSquares(xSeries, ySeries) {
  var reduceSumFunc = function(prev, cur) { return prev + cur; };
  
  var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
  var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

  var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
    .reduce(reduceSumFunc);
  
  var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
    .reduce(reduceSumFunc);
    
  var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
    .reduce(reduceSumFunc);
    
  var slope = ssXY / ssXX;
  var intercept = yBar - (xBar * slope);
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
  
  return [slope, intercept, rSquare];
}

//http://snipplr.com/view/37687/random-number-float-generator/
function randomFloatBetween(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

//"draw" the line with many points respecting the calculated bubble-graph-equation
function calculateLineData(leastSquares,xRange,iterations){
  var returnData = [];
  for(var i=0; i<iterations; i++){
    var randomX = randomFloatBetween(xRange[0],xRange[1]);
    returnData.push({
      xVal:randomX,
      yVal: (randomX*leastSquares[0])+leastSquares[1]
    });
  }
  return returnData;
}


$(document).on("click", "#mySelect", function(event) {
//document.getElementById("mySelect").onchange = function() { // "mySelect" comes from info-template, which might not be loaded into DOM yet.
  $("#mySelect").toggle(this.checked);
  myFunction();
});
function myFunction() {
  if(document.getElementById("mySelect").checked){
    console.log("mySelect checked");
    // Show for region
    midFunc(d3.select("#graph-picklist-x").node().value,d3.select("#graph-picklist-y").node().value,d3.select("#graph-picklist-z").node().value, hash,"region")
    //document.querySelector('#sector-list').setAttribute('area', 'GAUSEEIO');
  }else{
    console.log("mySelect unchecked");
    // Show for all
    midFunc(d3.select("#graph-picklist-x").node().value,d3.select("#graph-picklist-y").node().value,d3.select("#graph-picklist-z").node().value, hash,"all")
    //document.querySelector('#sector-list').setAttribute('area', 'USEEIO');
  }
}


var allData;
let geo_list={};
counter=0;

function displayImpactBubbles(attempts) {
  //console.log("displayImpactBubbles");


  if (typeof customD3loaded !== 'undefined') {

    //if (typeof customD3loaded === 'undefined') {
    //  console.log("BUGBUG: D3 not yet available"); // Could loop again if/when this occurs
    //}

    if (typeof bubbleGradient === 'undefined') {
      // Avoid calling declarations twise. Loading other twice so rollover works.

      xScale = d3.scaleLog()
        .range([0,width])
        .clamp(true);

      yScale = d3.scaleLog()
        .range([height, 0])
        .clamp(true);

      zScale = d3.scalePow()
        .exponent(0.2)
          .range([2,40]);

      line = d3.line();

      myTickFormat = function (d) {//Logic to reduce big numbers
        var f = d3.format(".1f");
        var limits = [1000000000, 1000000, 1000];
        var shorteners = ['B','M','K'];
        if(d>=1000){
          for(var i in limits) {
            if(d > limits[i]) {
              d=(d/limits[i]).toFixed(2) + shorteners[i];
            }
          }
        }else if(d>=0.000001 && d<1000){
          d=parseFloat((d).toFixed(7).toString())
        }else{
          for(j=-6;j>=-24;j--){
            if(d>=Math.pow(10,j-1) && d<Math.pow(10,j)){
              d=(d*Math.pow(10,1-j)).toFixed(1)+"*10^-"+(1-j)
            }
          }
          
        }
        return d;
      };

      xAxis = d3.axisBottom()
        .scale(xScale)
        .tickSize(-height)
        .tickPadding(8)

        
        .ticks(8,myTickFormat)

      yAxis = d3.axisLeft()
        .scale(yScale)
        .tickSize(-width)
        .tickPadding(8)
        .ticks(5,myTickFormat)

      // For rollover popup
      rolloverDiv = d3.select(parentId).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



      bubbleSvg = d3.select(parentId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","svg-parent")
        .append("g")
        .attr("id","graph-plane")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      bubbleSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")

        .call(xAxis.ticks(8,myTickFormat))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)").style("text-anchor", "start");

      bubbleSvg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("  +0+ ",0)")
        .call(yAxis.ticks(5,myTickFormat));

      bubbleSvg.append("path")
        .attr("class","trendline")
        .attr("stroke-width", 1)
        .style("stroke","steelblue")
        .style("fill","none");

      bubbleGradient = bubbleSvg.append("svg:defs")
        .append("svg:radialGradient")
        .attr("id", "gradient")
        .attr("cx", "50%")    //The x-center of the gradient
        .attr("cy", "50%")    //The y-center of the gradient
        .attr("r", "50%")  //The radius of the gradient
        .attr("spreadMethod", "pad");

      bubbleGradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#F6BDC0")
        .attr("stop-opacity", 1);

      bubbleGradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);


    }



    // TODO: Activate Georgia option when ready
    //dataObject1.stateshown=13;
    //let params = loadParams(location.search,location.hash);
    let hash = getHash();

    if(hash.geo){
      if (hash.geo.includes(",")){
          let geos=hash.geo.split(",");
          dataObject1.stateshown=(geos[0].split("US")[1]).slice(0,2)
      }else{
          dataObject1.stateshown=(hash.geo.split("US")[1]).slice(0,2)
      }
    }
    if(dataObject1.stateshown=='13'){
      model='_GA'
    }else{
      model=''
    }
    var community_data_root = "https://model.earth";

    // Probably needs to be regenerated for USSEEIOv2.0
    // https://github.com/modelearth/community-data/tree/master/us/indicators

    let sectorCSV = community_data_root + "/community-data/us/indicators/indicators_sectors"+model+".csv";
    
    // Not working with the new file Wes provided
    //let sectorCSV = local_app.localsite_root() + "../io/charts/bubble/data/indicators_sectors"+model+".csv";
    //alert(sectorCSV);
    d3.csv(sectorCSV ).then(function(data){
      data.forEach(function(d) {
        d.ACID=+d.ACID
        d.ENRG=+d.ENRG
        d.ETOX=+d.ETOX
        d.EUTR=+d.EUTR
        d.FOOD=+d.FOOD
        d.GCC=+d.GCC
        d.HAPS=+d.HAPS
        d.HAZW=+d.HAZW
        d.HC=+d.HC
        d.HNC=+d.HNC
        d.HRSP=+d.HRSP
        d.HTOX=+d.HTOX
        d.JOBS=+d.JOBS
        d.LAND=+d.LAND
        d.METL=+d.METL
        d.MINE=+d.MINE
        d.MSW=+d.MSW
        d.NREN=+d.NREN
        d.OZON=+d.OZON
        d.PEST=+d.PEST
        d.REN=+d.REN
        d.SMOG=+d.SMOG
        d.VADD=+d.VADD
        d.WATR=+d.WATR
        d.GHG=+d.GHG
      });

      allData = data;

      applyToBubbleHTML(hash,1);

    });

  } else if (attempts<100) { // Wait a milisecond and try again
    setTimeout( function() {
      consoleLog("try displayImpactBubbles again")
      displayImpactBubbles(attempts+1);
    }, 10 );
  } else {
    consoleLog("ERROR: displayImpactBubbles exceeded 100 attempts.");
  }
};

function applyToBubbleHTML(hash,attempts) {

  if($('#bubble-graph-id').length > 0) {
    console.log("#bubble-graph-id found")
    $('#bubble-graph-id').show();
    
    if (hash.x && hash.y && hash.z) {
      $("#graph-picklist-x").val(hash.x);
      $("#graph-picklist-y").val(hash.y);
      $("#graph-picklist-z").val(hash.z);
    } else { // Same as below
      $("#graph-picklist-x").val('ENRG');
      $("#graph-picklist-y").val('WATR');
      $("#graph-picklist-z").val('JOBS');
    }

    // Initial load
    // To do: invoke the following when something like param load=true reside in embed
    
    if(document.getElementById("mySelect").checked){
      midFunc(d3.select("#graph-picklist-x").node().value,
      d3.select("#graph-picklist-y").node().value,
      d3.select("#graph-picklist-z").node().value,
      hash,"region");
      //document.querySelector('#sector-list').setAttribute('area', 'GAUSEEIO');
    }else{
      midFunc(d3.select("#graph-picklist-x").node().value,
      d3.select("#graph-picklist-y").node().value,
      d3.select("#graph-picklist-z").node().value,
      hash,"all");
      //document.querySelector('#sector-list').setAttribute('area', 'USEEIO');
    }
    
    d3.selectAll(".graph-picklist").on("change",function(){
      // Update hash and trigger hashChange event. Resides in localsite.js
      goHash({"x":$("#graph-picklist-x").val(),"y":$("#graph-picklist-y").val(),"z":$("#graph-picklist-z").val()});
      //updateChart(d3.select("#graph-picklist-x").node().value,
      ///  d3.select("#graph-picklist-y").node().value,
      //  d3.select("#graph-picklist-z").node().value);
    }) 
  } else if (attempts <= 100) {

    //alert("Bubble HTML #bubble-graph-id not available yet.");
    setTimeout( function() {
      consoleLog("try applyToBubbleHTML again")
      applyToBubbleHTML(hash,attempts+1);
    }, 20 );

  } else {
    consoleLog("applyToBubbleHTML failed. Attempts: " + attempts);
  }
}


//not used here
/*
var ordinalDomain = ["1-100m", "100-500m", "500m-1km", "1-5km", "5-10km", "Over 10km"];
var ordinal = d3.scaleOrdinal() // Becomes scaleOrdinal in v4
  .domain(ordinalDomain)
  .range(["blue","#7479BC","#BDE7AE","#ECF809","orange","magenta"]); // Not in use here, from wind/js/regression.js
*/

function midFunc(x,y,z,hash,boundry){

  //let hash = getHash(); // includes hiddenhash

  if (hash.naics) {
    $(".switch-text").show();
  } else {
    $(".switch-text").hide();
  }
  //alert("hash.x " + hash.x + " midFunc hiddenhash.naics in bubble.js: " + hiddenhash.naics);
  //alert("iBubble.priorHash.x " + iBubble.priorHash.x);

  // BUG - This prevented toggle - Moved to hashchange above
  //if (hash.naics != iBubble.priorHash.naics || hash.x != iBubble.priorHash.x || hash.y != iBubble.priorHash.y || hash.z != iBubble.priorHash.z) {
    console.log("midFunc hash.naics change in bubble.js from getHash(): " + hash.naics);
    if (hash.naics) {
      naicsList = hash.naics.split(",");
      useeioList = [];
      useeiodetail = [];
      // TO DO: Add a path root here
      d3.csv("/io/charts/bubble/data/Crosswalk_MasterCrosswalk.csv").then( function(consdata) {
        var filteredData = consdata.filter(function(d) {
          for(i=0;i<naicsList.length;i++){
            if(d["2012_NAICS_Code"]==naicsList[i]) {
                useeioList.push(d["USEEIO1_Code"])
                useeiodetail.push(d["USEEIO1_Commodity"])
            }
          }
        })
        updateChart(x,y,z,useeioList,boundry);
      })
    } else {
      updateChart(x,y,z,[],boundry);
    }
  //}
  iBubble.priorHash = jQuery.extend(true, {}, hash); // Make a detached copy of hadh object
}

function updateChart(x,y,z,useeioList,boundry){

  if (!(x && y && z)) { // Same as above
    x = 'ENRG';
    y = 'WATR';
    z = 'JOBS';
  }

  //alert("updateChart " + x + " hiddenhash.naics in bubble.js: " + hiddenhash.naics);

  //Fetch data
  var records = getDimensions(x,y,z);
  updateTitle(x,y,z);
  x1=x;
  y1=y;
  z1=z;
  boundry1=boundry;
  useeioList1=useeioList;
  (records.y).sort(function(a,b){return a-b});
  var l = (records.y).length;
  var low = Math.round(l * 0.010);
  var high = l - low;
  records.y = (records.y).slice(low,high);

  (records.x).sort(function(a,b){return a-b});
  var l = (records.x).length;
  var low = Math.round(l * 0.010);
  var high = l - low;
  records.x = (records.x).slice(low,high);

  (records.pairs).sort(function(a,b){return a-b});
  var l = (records.pairs).length;
  var low = Math.round(l * 0.010);
  var high = l - low;
  records.pairs = (records.pairs).slice(low,high);
  
  yScale.domain(d3.extent(records.y));
  xScale.domain(d3.extent(records.x));
  zScale.domain(d3.extent(records.z));
  //re-assign data (or assign new data)

  var selectedCircles = d3.select("#graph-plane")
    .selectAll(".circles")
    .data(records.pairs)
    .attr('pointer-events', 'auto')

  //give a transition on the existing elements
  selectedCircles
    .transition().duration(animDuration)

    .attr("transform",function(d){return "translate("+xScale(d.x)+","+yScale(d.y)+")";})
    .attr("r",function(d){
      return zScale(d.z)+2
    })
    .style('fill', function (d) { 
      if(boundry1=="region"){
        if(useeioList1.length>0){
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            if (useeioList1.includes( d.industry_code) ) {
              return "url(#gradient)";
            } else {
              return "#aaa";
            }
          } else { return colors[d3.select(this).attr("class").split("circles selected")[1]]}
        } else {
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
              //return "#303030";
              return "#aaa";
          } else { return colors[d3.select(this).attr("class").split("circles selected")[1]]}
        }
      } else {
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          //return "url(#gradient)";
          return "#ccc";
        }else{
          //return colors[d3.select(this).attr("class").split("circles selected")[1]]
          return "#ccc";
        }
      }
    })
    .style("stroke","black")
    .attr("stroke-width", function (d) { 
      if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
        return 1
      }else{return 6}
    })
    .attr("stroke-opacity", function (d) { 
      if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
        return 0.7
      }else{
          return 1
      }
    })
    .style("fill-opacity" , function (d) { 
      if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
        return 0.5
      }else{
          return 1
      }
    })
    
    //Append any new elements and transition them as well

    // BUGBUG - load occurs initially, but none of the following until the second time called.
    selectedCircles.enter()
      .append("circle")
      .style('fill', function (d) { 
        if(boundry1=="region"){
          if(useeioList1.length>0){
            if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
              if (useeioList1.includes( d.industry_code) ) {

                return "url(#gradient)";
              } else {
                return "#303030";
              }
            }else{return colors[d3.select(this).attr("class").split("circles selected")[1]]}
          }else{
            if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
              return "#303030";
            }else{
              return colors[d3.select(this).attr("class").split("circles selected")[1]]
            }
          }
        }else{
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            return "url(#gradient)";
          }else{
            return colors[d3.select(this).attr("class").split("circles selected")[1]]
          }
        }
      })
      .attr("stroke-width", function (d) { 
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          return 1
        }else{
          return 6
        }
      })
      .attr("stroke-opacity", function (d) { 
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          return 0.7
        }else{
          return 1
        }
      })
      .style("fill-opacity" , function (d) { 
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          return 0.5
        }else{
          return 1
        }
      })

      .on("mouseover", function(d) {
        //alert("mouse")
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          d3.select(this)
          .transition()
          .style("fill-opacity",1)
          .attr('stroke-width', 4)
          .attr("stroke-opacity", 1)
        }
        rolloverDiv.transition()
          .duration(200)
          .style("opacity", .9);               
        rolloverDiv.html('<span style="color: black" >'+"<b style='font-size:1.3em'>" + d.industry_detail + "</b><br/><b> " +x1+":</b> "+d.x+ "<br/><b> " +y1+":</b> "+ d.y + "<br/><b>" +z1+":</b> "+ d.z+'</span >')
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");                     
      })


      .on("click", function(d,i) {
        //alert("click")
        clickCount+=1;
        //d3.selectAll(".circles").classed("selected", false);
        d3.selectAll(".circles").style('fill', function (d) { 

          if(boundry1=="region"){

            if(useeioList1.length>0){
              console.log("usseeee")
              console.log("class"+d3.select(this).attr("class"))
              if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){

                if (useeioList1.includes( d.industry_code) ) {
                  console.log("nullllll")
                  return "url(#gradient)";
                } else {
                  return "#303030";
                }
              }else{
                return colors[d3.select(this).attr("class").split("circles selected")[1]]
                console.log(colors[d3.select(this).attr("class").split("circles selected")[1]])
              }
            }else{
              if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null) {
                return "#303030";
              }else{
                return colors[d3.select(this).attr("class").split("circles selected")[1]]
              }
           }
          }else{
            if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
              return "url(#gradient)";
            }else{
              return colors[d3.select(this).attr("class").split("circles selected")[1]]
            }
          }
        })
        .attr("stroke-width", function (d) { 
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            return 1
          }else{
            return 6
          }
        })
        .attr("stroke-opacity", function (d) { 
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            return 0.7
          }else{
              return 1
          }
        })
        .style("fill-opacity" , function (d) { 
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            return 0.5
          }else{
              return 1
          }
        })

        d3.select(this)
          .transition()
          .style("fill",colors[clickCount])
          .style("fill-opacity",1)
          .attr('stroke-width', 6)
          .attr("stroke-opacity", 1)
        d3.select(this).classed("selected"+clickCount, true)
        $("#impactTextIntro").hide();
        $("#impactText").html($("#impactText").html() + "<br>"+ '<font size="5">'+d.industry_detail+"</font>"+"<br>"+z1 +":"+d.z+ "<br>" + y1 +":"+d.y+ "<br>" + x1+":"+d.x + "<br>");
        $("#impact-chart").show();
        create_bar(d,x,y,z,x1,y1,z1);
        sect_list.push(d.industry_code.toUpperCase())
        console.log("sects"+sect_list)
        console.log(typeof sect_list[0])
        //document.querySelector('#sector-list').setAttribute('sector', sect_list);
      })

      .on("mouseout", function(d) {
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          d3.select(this)
          .transition()
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.7)
          .style("fill-opacity" , 0.5)
        } 
        rolloverDiv.transition()
          .duration(500)
          .style("opacity", 0);
                        
      })

      .attr("class","circles")
      .attr("r",function(d){
        return zScale(d.z)+2
      })
      .style("stroke","black")
      .attr("stroke-opacity", 0.7)
      .style("fill-opacity" , 0.5)
      .transition().duration(animDuration)
      .attr("transform",function(d){return "translate("+xScale(d.x)+","+yScale(d.y)+")";});

      //Remove any dom elements which are no longer data bound
      selectedCircles.exit().remove();
                  
      //Update Axes
      d3.select(parentId).select(".x.axis").transition().duration(animDuration).call(xAxis.ticks(8,myTickFormat))
        .selectAll("text").attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)").style("text-anchor", "start");
      d3.select(parentId).select(".y.axis").transition().duration(animDuration).call(yAxis.ticks(5,myTickFormat));
    }

    //create the costum vertical 3 line barchart
    function create_bar(d,x,y,z,x1,y1,z1){
      d3.select("#selected_bar").remove();
      var svg3 = d3.select("#barchart")
        .append("svg")
        .attr("width", width)
        .attr("height", 380)
        .attr("class", "bar-chart")
        .attr('id', 'selected_bar');
      maxim=Math.max(d.x,d.y,d.z)      
      var rect_scale = d3.scaleLinear().range([300,0]).domain([maxim,0]);
      var axis_scale = d3.scaleLinear().range([300,0]).domain([0,maxim]);
      var other_scale = d3.scaleBand().range([0, 300]).domain([x1,y1,z1]);
      var chart_2 = svg3.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(325, 60)').call(d3.axisLeft(axis_scale));

      chart_2.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,300)').call(d3.axisBottom(other_scale));

      chart_2.append("text")
        .attr('class', 'label')
        .attr("transform", "translate(150, 350)")
        .text("Attr").attr("fill", "black").style("font-size", "25px");

      chart_2.append("text")
        .attr('class', 'title')
        .style('text-anchor','middle')
        .attr('transform', 'translate(130,-30)')
        .text( d.industry_detail)
        .attr("fill", "black").style("font-size", "20px");

      svg3.append("rect").attr("y", 360 - rect_scale(d.x)).attr("x", 355)
        .attr("width", 50).attr("height", rect_scale(d.x)).attr("fill", "red");

      svg3.append("rect").attr("y", 360 - rect_scale(d.y)).attr("x", 450)
        .attr("width", 50).attr("height", rect_scale(d.y)).attr("fill", "green");

      svg3.append("rect").attr("y", 360 - rect_scale(d.z)).attr("x", 550)
        .attr("width", 50).attr("height", rect_scale(d.z)).attr("fill", "blue");

}


function clearBubbleSelection(){
  for(l=0;l<=clickCount;l++){
    d3.selectAll(".circles").classed("selected"+l, false);
  }
  
  clickCount=-1
    d3.selectAll(".circles").style('fill', function (d) { 
      if(boundry1=="region"){
        if(useeioList.length>0){
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            if (useeioList.includes( d.industry_code) ) {
              return "url(#gradient)";
            } else {
              return "#303030";
            }
          }else{return colors[clickCount]}
        }else{
          if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
            return "#303030";
          }else{return colors[clickCount]}
        }
      }else{
        if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
          return "url(#gradient)";
        }else{
          return colors[clickCount]
        }
      }
    })
    .attr("stroke-width", function (d) { 
      if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
        return 1
      }else{
        return 6
      }
    })
    .attr("stroke-opacity", function (d) { 
      if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
        return 0.7
      }else{
        return 1
      }
    })
    .style("fill-opacity" , function (d) { 
      if(d3.select(this).attr("class")=="circles" || d3.select(this).attr("class")==null){
        return 0.5
      }else{
        return 1
      }
    })

    //document.getElementById("impactText").innerHTML ="";
    selected_sector=[]
    sect_list=[]
    //document.querySelector('#sector-list').setAttribute('sector', sect_list);
    d3.select("#selected_bar").remove();
    $("#impactText").html("");
    $("#impactTextIntro").show();
    $("#impact-chart").hide();

    //impactchart clear
    d3.select("#imp").remove();
    var svg3 = d3.select("#impact-chart")
      .append("div")
      .attr('id', 'imp');
    var config = useeio.urlConfig();
      var modelID = config.get().model || selected_model;
      var model = useeio.model({
        endpoint: './api',
        model: modelID,
        asJsonFiles: true,
      });
      var impactChart = useeio.impactChart({
        model: model,
        selector: '#imp',
        columns: 3,
        width: 800,
        height: 300,
      });
      impactChart.update({
        sectors: [selected_sector],      
      });
}

// INIT
/*
if (hiddenhash.naics) { // Set in naics.js
    console.log("bubble chart init. hiddenhash.naics value: " + hiddenhash.naics);
    $(document).ready(function(){
      alert("hiddenhash.naics " + hiddenhash.naics)
       displayImpactBubbles(1); // Resides in bubble.js
    });
}
*/
