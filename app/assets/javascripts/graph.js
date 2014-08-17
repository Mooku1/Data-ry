$(document).on('ready page:load', function() {

			
	// ------ Set Up Dashboard Data ------ //

			//Specify the data
			var data = gon.question_json;

			//Specify the units in which the data is measured
			var units = gon.units;

			
			// --- Maximum Data Point --- //

			//Find the maximum value
			var maximumValue = d3.max(data, function(d) {
				return d.value
			});

			//Find the last date in which the maximum occurred
			for (i = 0; i < data.length; ++i){
				if (data[i].value == maximumValue) {
					var maximumDataPoint = data[i]
				}
			}
			

			// --- Minimum Data Point --- //
			
			//Find the last date in which the min
			var minimumValue = d3.min(data, function(d) {
				return d.value
			});
			
			//Find the last date in which the maximum occurred
			for (i = 0; i < data.length; ++i){
				if (data[i].value == minimumValue) {
					var minimumDataPoint = data[i]
				}
			}

			// --- Most Recent Data Value --- //
			var mostRecentValue = data[data.length-1].value;

			// --- Average Value --- //
			var dataAvg  = d3.mean(data, function(d){ return d.value}).toFixed(2);  //limit to two decimal places

			// --- Difference between most recent value and the average value --- //
			var avgDifference = (mostRecentValue - dataAvg).toFixed(2);  //limit to two decimal places

	// ------ Convert Dates ------ //
	//D3 is not recognizing the dates from Ruby properly, so we must convert them
	//to a readable format.

			//Convert latest date string in JSON to a new JavaScrit date by subsetting the string and evaluating it as new Date object
			var lastDate = new Date(
				data[data.length-1].date.substr(0,4),  //year substring
				eval(data[data.length-1].date.substr(5,2))-1,  //month substring
				data[data.length-1].date.substr(8,2));  //day substring
				
			//Convert earliest date string in JSON to a new JavaScript date
			var firstDate = new Date(
				data[0].date.substr(0,4),  //year substring
				eval(data[0].date.substr(5,2))-1,  //month substring
				data[0].date.substr(8,2));  //day substring

			//We need a function that wil convert each date to the proper date
			var convertDate = function(date){
				return new Date(
						date.substr(0,4),
						eval(date.substr(5,2))-1,
						date.substr(8,2));
			};

	// ------ Convert Dates to Strings ------ //
	//We can convert dates, but now we must also be able to convert them to strings in the 
	//format of our choosing.

			var dateString = function(date){
				var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

				return date.getDate() + " " + monthArray[date.getMonth()] + " " + date.getFullYear();
			};
			

	// ------ Count Total Days ------ //
	//We need to count the total days accounted for in the dataset so that we can
	//account for missing days in the graph.

			//Find number of days between first and last days
			var dayToMs = 1000 * 60 * 60 * 24;  //Convert days to milliseconds
			var totalDays = Math.round(Math.abs(lastDate.getTime() - firstDate.getTime())/dayToMs) + 1;
			

			

			// ------ Create Ticks for Graph ------ //
			//In order to include ticks for missing days, we need a function that pushes
			//missing dates into a ticks aray

			//Function used to determine ticks 
			var countTicks = function(data, steps){  //data is the data to pass through, steps indicate intervals
				var dateTicks = [];
				var day_to_ms = 1000 * 60 * 60 * 24;
					for (i = 0; i <= totalDays; ++i){
						if (i%steps == 0){  //Find out if the day is an even amount of days away from first date
							dateTicks.push(d3.time.day.offset(firstDate, i))  //If it is, push the date into the ticks array
						}
					}
					return dateTicks  //Pass the ticks to the tickValues method
				};

	// ------ Today vs. Average Graph ------ //

			averageGraph = function(){

				//Graph data
				var aData = [mostRecentValue, dataAvg];  //the only two values in our data set are the most recent value and the average of all values

				//Graph dimensions
				var w = document.getElementById("averageGraph").offsetWidth;
				var h = document.getElementById("averageGraph").offsetHeight;
				var padding = 140;

				//set x and y scales
				var xScale = d3.scale.linear()
							.domain([0, d3.max(aData, function(d){
								return d
							})]) //the domain is 0 to the max between the most recent value and the average of all values
							.range([10, w]);

				var yScale = d3.scale.linear()
							.domain([0, 2])  //there will only be two data values displayed
							.range([0, h]);

				//draw the SVG
				var svg = d3.select("#averageGraph")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

				//append the graph data
				svg.selectAll("rect")
						.data(aData)
						.enter()
						.append("rect")
						
						// The animation
						.transition()  //begin the animation
						.duration(1000)  //set the duration of the animation
						.each("start", function(d, i){ //specifies the starting attributes of the animation
							d3.select(this)
								//Set starting x position of each bar of the bar graph
								.attr("x", function(d){
									return w/2
								})
								.attr("width", 0)
								
								//set the fill color
								.attr("fill", function(){
									if (i == 0){
										return "rgb(242,233,225)"
									}
									else{
										return "rgb(28,20,13)"
									}
								})
						})
						
						.attr("x", function(d){
									return w/2 - (xScale(d)/2)
						})

						//Set the starting y position of each bar
						.attr("y", function(d, i) {
							return (padding/2) + (i * h/aData.length); //Starting position depends on the number of days between first and last
						})

						//Set the width of each bar
						.attr("height", h/aData.length - (padding/2))  //Make the width of each bar by dividing them evenly from the width of the svg element and subtracting the padding between each bar
						
						//Set the height of each bar
						.attr("width", function(d) {
							return xScale(d);
						});

						//Add labels
						svg.append("text")
							.text(dateString(convertDate(data[data.length-1].date)))
							
							//center the text
							.attr("dx", w/2)
							.attr("text-anchor", "middle")

							.attr("dy", padding/2.5)
							.attr("font-size", "24px");

						svg.append("text")
							.text("Average")

							//center the text
							.attr("dx", w/2)
							.attr("text-anchor", "middle")

							.attr("dy", h/2 + padding/2.5)
							.attr("font-size", "24px");


			};


			averageGraph();
			// --- Latest to Average String Function --- //

			
			//Create an average difference string
			var avgDifferenceString = function(){
					//put in string if the latest value does not equal the average value
					if (avgDifference > 0 ){
						return " " + avgDifference + " " + units + " greater than "
					}
					else if (avgDifference < 0){
						return " " + Math.abs(avgDifference) + " " + units + " less than "
					}
					else{
						return "equal to"
					}
				};

			var latestToAvg = function(){
				document.getElementById("latestDataValue").innerHTML = mostRecentValue + " " + units;
				document.getElementById("avgDifference").innerHTML = avgDifferenceString();
				document.getElementById("dataAvg").innerHTML = dataAvg + " " + units;
			};

			latestToAvg();


	// ------ High and Low Graph ------ //

			var highLowGraph = function(divId, dataPoint){

				//Feed the targeted div ID in as an argument in string form
				//so it knows where to populate the graph.
				//Feed in whether it is a minimum or maximum value so it knows
				//which data point to utilize

				//dataPoint = min, max, or latest

				//Data
				//Set by the argument dataPoint
				if (dataPoint == "min"){
					var hData = minimumValue;
				}
				else if (dataPoint == "latest"){
					var hData = mostRecentValue;
				}
				else if (dataPoint == "max"){
					var hData = maximumValue;
				};

				// --- Dimensions of the Graph --- //
				var w = 100;
				var h = 100;

				var stroke = 1;

				// --- Scale --- //

				//set up the scale to represent high and low
				//note: we do not need X and Y scales because it is a circle
				var scale = d3.scale.linear()
							.domain([Math.sqrt(minimumValue), Math.sqrt(maximumValue)])
							.range([10, w/2]);

				// --- Draw the SVG Element --- //

				var svg = d3.selectAll(divId)
						.append("svg")
						.attr("width", w)
						.attr("height", h);


				// --- Append Data to the Graph --- //

				svg.append("circle")
						
						// The animation
						.transition()  //begin the animation
						.duration(500)  //set the duration of the animation
						.each("start", function(){ //specifies the starting attributes of the animation
							d3.select(this)
								
								//center the circle within svg
								.attr("cx", w/2)
								.attr("cy", h/2)

								.attr("r", 0)
								.style("fill", "rgb(203,232,107)")
								.style("stroke", "rgb(100,100,100)")
								.style("stroke-width", "1px")

						})
						
						//Set the radius 
						.attr("r", scale(Math.sqrt(hData))-(stroke*2));

				//append another small circle to mark the center
				svg.append("circle")
						.attr("cx", w/2)
						.attr("cy", h/2)
						.attr("r", 1)
						.style("fill", "rgb(100,100,100)");

			};

			//call the functions to build each circle (low, latest, high)
			highLowGraph("#lowCircle", "min");
			highLowGraph("#latestCircle", "latest");
			highLowGraph("#highCircle", "max");


			//Create a string of our maximum data point date
			var maxDateString = dateString(convertDate(maximumDataPoint.date));

			//Create a string for most recent data point date

			var mostRecentDateString = dateString(convertDate(data[data.length-1].date));
		
			//Create a string of our maximum data point date
			var minDateString = dateString(convertDate(minimumDataPoint.date));

			document.getElementById("maxValue").innerHTML = maximumValue + " " + units;
			document.getElementById("maxValueDate").innerHTML = maxDateString;

			document.getElementById("mostRecentValue").innerHTML = mostRecentValue + " " + units;
			document.getElementById("mostRecentDate").innerHTML = mostRecentDateString;


			document.getElementById("minValue").innerHTML = minimumValue + " " + units;
			document.getElementById("minValueDate").innerHTML = minDateString;


	// ------ History Graph ------ //

			// --- Dimensions of the Graph --- //

			//Get height and width of svg div
			var w = document.getElementById("questionGraph").offsetWidth;
			var h = document.getElementById("questionGraph").offsetHeight;
			var padding = 5;
			var leftPadding = 30;
			var bottomPadding = 50;
			var topPadding = 20;


			// --- Scales and Axes --- //

			//Set up the x scale so that it includes the days we want it to include
			var xScale = d3.time.scale()
						.domain([firstDate, d3.time.day.offset(lastDate, 1)])
						.rangeRound([0 + leftPadding + padding*8, w]);

			//Set up the y scale so that the maximum is the highest value
			var yScale = d3.scale.linear()
						.domain([0, maximumValue])
						.range([h - bottomPadding, 0 + topPadding]);

			//Set up the x axis
			var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom")
						.ticks(d3.time.days, 1)
						.tickFormat(d3.time.format('%d %b'))
						.tickValues(countTicks(data, Math.ceil(totalDays/10))) //call the ticks function to create ticks
						.tickSize(0)
						.tickPadding(8);

			//Set up the y axis
			var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left")
						.ticks(5)
						.tickSize(0)
						.tickFormat(function(d){
							return d + " " + units
						})
			

	// ------ Draw the SVG element ------ //

			var svg = d3.select("#questionGraph")
						.append("svg")
						.attr("width", w)
						.attr("height", h);


			

	// ------ Append data to the SVG element ------ //

			svg.selectAll("rect")
						.data(data)
						.enter()
						.append("rect")
						
						// The animation
						.transition()  //begin the animation
						.duration(500)  //set the duration of the animation
						.each("start", function(){ //specifies the starting attributes of the animation
							d3.select(this)
								.attr("y", h - bottomPadding)
								.attr("height", 0)
								.attr("fill", "rgb(168,219,168)")
						})
						
						//Set starting x position of each bar of the bar graph
						.attr("x", function(d) {
							return xScale(convertDate(d.date)); //Starting position depends on the number of days between first and last
						})
						
						//Set the starting y position of each bar
						.attr("y", function(d) {
							return yScale(d.value);  //Starting y position needs to be set to the height of the svg element minus the height of the bar 
						})

						//Set the width of each bar
						.attr("width", w/(totalDays + 1) - padding)  //Make the width of each bar by dividing them evenly from the width of the svg element and subtracting the padding between each bar
						
						//Set the height of each bar
						.attr("height", function(d) {
							return yScale(0) - yScale(d.value);
						})

			//Append the axes
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - bottomPadding) + ")")
				.call(xAxis)
				.selectAll("text")
					.attr("font-size", 14)
					.attr("dx", (totalDays < 10 ? ((w/(totalDays + 1))/2 ) : -25) + "px")
					.attr("dy", (totalDays < 10 ? "10px" : (w/(totalDays + 1) - padding*4) + "px"))
					.attr("transform", function(){
						return "rotate("+(totalDays < 10 ? 0 : -90)+")"
					});

			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate("+(padding+leftPadding)+",0)")
				.call(yAxis)
				.selectAll("text")
					.attr("dx", 20)
					.attr("font-size", 14);



	// ------ Populate Data in the Dashboard ------ //

			//In order to get JavaScript month names, we need to set an array
			//of month names.
			
			


			//Show most recent data value


});