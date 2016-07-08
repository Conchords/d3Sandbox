
// globals

var w = 600;
var h = 200;
var padding = 30;
var margin = 5;

// global var for dataset

var ds; 

var salesTotal = 0.0;
var salesAvg = 0.0;
var metrics=[];

// globals transitions
var trans_ds = 0;
var curr_ds = 0;
var trans_duration = 500;

/*
var metrics = {
	"salesTotal":[],
	"salesAvg":[]
};
*/

function initialize() {
	// d3.queue()
	// 	.defer(loadCSV,"../static/Data/MonthlySales.csv")
	// 	.awaitAll(renderData);

	d3.queue()
		.defer(loadJSON,"../static/Data/MonthlySalesbyCategoryMultiple.json")
		.awaitAll(renderData);

	// d3.queue()
	// 	.defer(loadWEB,"https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json")
	// 	.awaitAll(renderData);
}

function loadCSV(filepath,callback) {
	d3.csv(filepath, function(error, data) {
		if (error) {
			console.log(error);
			callback(new Error("Unable to load CSV data."))
		}
		else {
			ds=data;
			console.log(ds);
			callback(null);
		}

	});
}


function loadJSON(filepath,callback) {
	d3.json(filepath, function(error, data) {
		if (error) {
			console.log(error);
			callback(new Error("Unable to load JSON data."))
		}
		else {
			ds=data.contents;
			console.log(ds);
			callback(null);
		}

	});
}

function loadWEB(url,callback) {
	d3.json(url, function(error, data) {
		if (error) {
			console.log(error);
			callback(new Error("Unable to load JSON data."))
		}
		else {
			var decodedData = JSON.parse(window.atob(data.content));
			ds = decodedData.contents;
			console.log(ds);
			callback(null);
		}

	});
};

function str2Date(intDate) {
	var strDate = new String(intDate);
	var year = strDate.substr(0,4);
	var month = strDate.substr(4,2)-1;
	var day = strDate.substr(6,2);

	return new Date(year, month, day);
}

function renderData(error) {
	if (error) {
		console.log(error);
		return 1;
	}
	// console.log("rendering")

	var leftDiv = d3.select(".left-viz");
	var centerDiv = d3.select(".center-viz");
	var rightDiv = d3.select(".right-viz");

	ds.forEach( function(d) {
		showHeader(leftDiv,d);
		plotLine(leftDiv,d);
	});

	showHeader(centerDiv,ds[0]);
	// plotLine(leftDiv,ds[0]);
	plotArea(centerDiv,ds[0]);

	// showHeader();
	// plotLine();
	// showMetrics();
}

// returns the header
function showHeader(div, ds) {
	/*
	d3.select(".d3-div").selectAll("h4")
		.data(ds)
		.enter()
		.append("h4")
		.text(function(d) { return d.category + " Sales (2013)" });
		*/
	// d3.select(".d3-div").append("h4")
	div.append("h4")
		.attrs({
			"class":"area-head"
		})
		.text(ds.category + " Sales (2013)" );
}

function plotLine(div, ds) {
	
	// console.log(ds);

	var minDate = str2Date(ds.monthlySales[0].month);
	var maxDate = str2Date(ds.monthlySales[ds.monthlySales.length - 1].month);

	// console.log("min: " + minDate);
	// console.log("max: " + maxDate);

	var xScale = d3.scaleTime()
					.domain([minDate,maxDate])
					.range([padding + margin,w - padding])
					.nice();

	var yScale = d3.scaleLinear()
					.domain([
						0, d3.max(ds.monthlySales, function(d) { return d.sales; })
						])
					.range([h - padding,10])
					.nice();

	var lineFun = d3.line()
		.x(function (d) { return xScale(str2Date(d.month)); })
		.y(function (d) { return yScale(d.sales); });
		// .x(function (d) { return ((d.month-20130001)/3.25); })
		// .y(function (d) { return h-d.sales; });

	// var xTicks = xScale.ticks(ds.monthlySales.length);
	// var yTicks = xScale.ticks(5);
	// var xTickFormat = xScale.tickFormat(5,)

	var xAxis = d3.axisBottom(xScale).ticks(ds.monthlySales.length).tickFormat(d3.timeFormat("%b"));
	var yAxis = d3.axisLeft(yScale).ticks(5);

	// var svg = d3.select(".d3-div").append("svg").attr("width",w).attr("height",h);
	var svg = div.append("svg").attr("width",w).attr("height",h);
/*
	var viz = svg.selectAll("path")
		.data(ds)
		.enter()
		.append("path")
		.attrs({
			d:function(d) { return lineFun(d.monthlySales) },
			"stroke":"purple",
			"stroke-width":2,
			"fill":"none"
		});
		*/

	var drawXAxis = svg.append("g").call(xAxis)
				.attrs({
					"class":"axis",
					"transform":"translate(0, " + (h - padding) + ")"
				});

	var drawYAxis = svg.append("g").call(yAxis)
				.attrs({
					"class":"axis",
					"transform":"translate(" + padding + ",0)"
				});

	var viz = svg.append("path")
		.attrs({
			d: lineFun(ds.monthlySales),
			"stroke":"purple",
			"stroke-width":2,
			"fill":"none"
		});

}

function plotArea(div, ds) {

	var minDate = str2Date(ds.monthlySales[0].month);
	var maxDate = str2Date(ds.monthlySales[ds.monthlySales.length - 1].month);

	var xScale = d3.scaleTime()
					.domain([minDate,maxDate])
					.range([padding + margin,w - padding])
					.nice();

	var yScale = d3.scaleLinear()
					.domain([
						0, d3.max(ds.monthlySales, function(d) { return d.sales; })
						])
					.range([h - padding,10])
					.nice();



	var xAxis = d3.axisBottom(xScale).ticks(ds.monthlySales.length).tickFormat(d3.timeFormat("%b"));
	var yAxis = d3.axisLeft(yScale).ticks(5);

	// var svg = d3.select(".d3-div").append("svg").attr("width",w).attr("height",h);
	var svg = div.append("svg").attr("width",w).attr("height",h);


	var drawXAxis = svg.append("g").call(xAxis)
				.attrs({
					"class":"axis",
					"id":"area-xAxis",
					"transform":"translate(0, " + (h - padding) + ")"
				});

	var drawYAxis = svg.append("g").call(yAxis)
				.attrs({
					"class":"axis",
					"id":"area-yAxis",
					"transform":"translate(" + padding + ",0)"
				});


	var areaFun = d3.area()
		.x(function(d) { return xScale(str2Date(d.month)); })
		.y0(h - padding - margin)
		.y1(function (d) { return yScale(d.sales); });

	var areaFunFlat = d3.area()
		.x(function(d) { return xScale(str2Date(d.month)); })
		.y0(h - padding - margin)
		.y1(h - padding - margin);

	var viz = svg.append("path")
		.attrs({
			d: areaFunFlat(ds.monthlySales),
			"stroke":"purple",
			"fill":"purple",
			"class":"area"
		});

	viz.transition()
		.attrs({
			d: areaFun(ds.monthlySales),
			"stroke":"purple",
			"fill":"purple",
			"class":"area"
		})
		.duration(trans_duration);
}


function nextDS() {

	console.log("current ds:" + trans_ds);
	curr_ds = trans_ds;
	trans_ds = (++trans_ds) % ds.length;
	console.log("next ds:" + trans_ds);
	nextPlot();
	nextHeader();
}

function nextPlot() {

	nextds = ds[trans_ds];
	currds = ds[curr_ds];

	var minDate = str2Date(nextds.monthlySales[0].month);
	var maxDate = str2Date(nextds.monthlySales[nextds.monthlySales.length - 1].month);

	var xScale = d3.scaleTime()
					.domain([minDate,maxDate])
					.range([padding + margin,w - padding])
					.nice();

	var yScale = d3.scaleLinear()
					.domain([
						0, d3.max(nextds.monthlySales, function(d) { return d.sales; })
						])
					.range([h - padding,10])
					.nice();


	var areaFun = d3.area()
		.x(function(d) { return xScale(str2Date(d.month)); })
		.y0(h - padding - margin)
		.y1(function (d) { return yScale(d.sales); });

	var areaFunFlat = d3.area()
		.x(function(d) { return xScale(str2Date(d.month)); })
		.y0(h - padding - margin)
		.y1(h - padding - margin);


	var xAxis = d3.axisBottom(xScale).ticks(nextds.monthlySales.length).tickFormat(d3.timeFormat("%b"));
	

	var currminDate = str2Date(currds.monthlySales[0].month);
	var currmaxDate = str2Date(currds.monthlySales[currds.monthlySales.length - 1].month);

	var currxScale = d3.scaleTime()
					.domain([currminDate,currmaxDate])
					.range([padding + margin,w - padding])
					.nice();

	var currareaFunFlat = d3.area()
		.x(function(d) { return currxScale(str2Date(d.month)); })
		.y0(h - padding - margin)
		.y1(h - padding - margin);



	// var yAxis = d3.axisLeft(yScale).ticks(7);

		
	// trans axis to red
	/*
	d3.select(".center-viz").select("#area-yAxis").selectAll("text").transition()
		.style("fill","rgb(255,0,0)")
		.duration(1000);
	d3.select(".center-viz").select("#area-yAxis").selectAll("line").transition()
		.style("stroke","rgb(255,0,0)")
		.duration(1000);
	d3.select(".center-viz").select("#area-yAxis").selectAll("path").transition()
		.style("stroke","rgb(255,0,0)")
		.duration(1000);
*/

	d3.select(".center-viz").select("#area-xAxis").transition()
		.call(xAxis)
		.duration(trans_duration);

	var t0 = d3.select(".center-viz").select(".area").transition()
		.attrs({
			d: currareaFunFlat(currds.monthlySales),
			"stroke":"purple",
			"fill":"purple",
			"class":"area"
		})
		.duration(trans_duration);

	// d3.select(".center-viz").select(".area").transition()
	var t1 = t0.transition();
		t1.attrs({
			d: areaFunFlat(nextds.monthlySales),
			"stroke":"purple",
			"fill":"purple",
			"class":"area"
		})
		// .delay(trans_duration)
		.duration(0)
		;

	// d3.select(".center-viz").select(".area").transition()
	var t2 = t1.transition();
		t2.attrs({
			d: areaFun(nextds.monthlySales),
			"stroke":"purple",
			"fill":"purple",
			"class":"area"
		})
		.duration(trans_duration)
		.delay(20);
}

function nextHeader() {

	nextds = ds[trans_ds];
	// console.log(nextds);
	// trans_head.transition()
	d3.select(".center-viz").select(".area-head").transition()
		.text(nextds.category + " Sales (2013)" )
		.delay(trans_duration - 100)
		.duration(trans_duration); //this duration does nothing, apparently theres no interpolation for this
}









function showMetrics() {
	
	// console.log(metrics.salesTotal[0]);
	// console.log(ds[0].monthlySales[0].sales*1);
	// var t = d3.select(".d3-div").append("table");
	/*
	var i;
	var j;
	var tempSum;
	var tempAvg;
	//get total
	for (i in ds) {

		tempSum = 0.0;
		// console.log("i: " + i);
		for (j in ds[i].monthlySales) {
			console.log("[i][J]: " + i + " " + j);
			tempSum += ds[i].monthlySales[j].sales*1; //convert to num
			console.log("tempSum: " + tempSum);
		}
		metrics.salesTotal.push(tempSum.toFixed(2));
		metrics.salesAvg.push( (tempSum / ds[i].monthlySales.length).toFixed(2) );
		console.log(metrics);
	}
*/

	// add metrics to table
	/*
	var tr = t.selectAll("tr")
				.data(metrics)
				.enter()
				.append("tr")
				.append("td")
				.text(function(d) { return d.; });
	*/
}










/*
// scatter plot

	var monthlySales = [
		{"month":10, "sales":100},
		{"month":20, "sales":130},
		{"month":30, "sales":250},
		{"month":40, "sales":300},
		{"month":50, "sales":265},
		{"month":60, "sales":225},
		{"month":70, "sales":180},
		{"month":80, "sales":120},
		{"month":90, "sales":145},
		{"month":100, "sales":130},
	];


	function colorPicker(v) {
		if (v < 250) {
			return "#666666";
		}
		else if ( v >= 250) {
			return "#33cc66";
		}
	}

	function showMinMax(ds, col, val, type) {
		var max = d3.max(ds, function(d) { return d[col]; });
		var min = d3.min(ds, function(d) { return d[col]; });

		if (type == 'minmax' && (val == max || val == min)) {
			return val;
		}
		else if (type == 'all') {
			return val;
		}
	}

	var svg = d3.select(".d3-div").append("svg").attr("width",w).attr("height",h)
	var dots = svg.selectAll("circle")
		.data(monthlySales)
		.enter()
		.append("circle")
		.attrs({
			cx: function(d) { return d.month*3 },
			cy: function(d) { return h - d.sales; },
			r: 5,
			"fill": function(d) { return colorPicker(d.sales); }
		});


	// labels
	var labels = svg.selectAll("text")
		.data(monthlySales)
		.enter()
		.append("text")
		.text(function(d) { return showMinMax(monthlySales, 'sales', d.sales, 'all'); })
		.attrs({
			x: function(d) { return (d.month*3) - 28 },
			y: function(d) { return h - d.sales; },
			"font-size": "12px",
			"font-family": "sans-serif",
			"fill": "#666666",
			"text-anchor": "start"
		});
*/

















/*
// line chart

	var lineFun = d3.line()
		.x(function(d) {return d.month*3;})
		.y(function(d) {return h-d.sales;});
		// .curve(d3.curveCatmullRom.alpha(0.5));

	var svg = d3.select(".d3-div").append("svg").attr("width",w).attr("height",h)
	var viz = svg.append("path")
		.attrs({
			"d": lineFun(monthlySales),
			"stroke": "purple",
			"stroke-width": 2,
			"fill": "none"
		});

	//add labels
	var labels = svg.selectAll("text")
		.data(monthlySales)
		.enter()
		.append("text")
		.text(function(d) { return d.sales; })
		.attrs({
			"x": function(d) { return d.month * 3 - 25; },
			"y": function(d) { return h - d.sales; },
			"font-size": "12px",
			"font-family": "sans-serif",
			"fill": "#666666",
			"text-anchor": "start",
			"dy": ".35em",
			"font-weight": function(d,i) {
				if ( i == 0 || i == (monthlySales.length - 1) ) {
					return "bold";
				}
				else {
					return "normal";
				}
			}
		})
*/

















/*
// bar chart
	// var padding = 2;
	// var dataset = [5,10,13,19,21,25,11,25,22,18,7];

	function colorPicker(v) {
		if (v <= 20) {
			return "#666666";
		}
		else if ( v > 20) {
			return "#ff0033";
		}
	}

	// draw bars
	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attrs({
			"x": function(d,i) {return i * (w / dataset.length);},
			"y": function(d) {return h - (d*4);},
			"width": function() {return w / dataset.length - padding;},
			"height": function(d) {return d*4;},
			"fill": function(d) {return colorPicker(d);}
		});


	// label with values
	svg.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(function(d) {return d;})
		.attrs({
			"text-anchor": "middle",
			"x": function(d,i) {return i * (w / dataset.length) + (w / dataset.length - padding) / 2;},
			"y": function(d) {return h - (d*4) + 14;},
			"font-family": "sans-serif",
			"font-size": 12,
			"fill": "#ffffff"
		});
*/
