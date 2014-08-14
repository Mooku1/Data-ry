$(document).on('ready page:load', function() {

			//Specify the data
			var data = gon.question_json;

			//Get height and width of svg div
			var w = document.getElementById("questionGraph").offsetWidth;
			var h = document.getElementById("questionGraph").offsetHeight;
			var padding = 5;
			var leftPadding = 10;
			var bottomPadding = 50;

			
			

			// ------ Convert Dates ------ //
			//D3 is not recognizing the dates from Ruby properly, so we must convert them.

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

			
			

			// ------ D3 Graph Details ------ //

			//Set up the x scale so that it includes the days we want it to include
			var xScale = d3.time.scale()
						.domain([firstDate, d3.time.day.offset(lastDate, 1)])
						.rangeRound([0, w]);

			//Set up the y scale so that the maximum is the highest value
			var yScale = d3.scale.linear()
						.domain([0, d3.max(data, function(d) { return d.value })])
						.range([0, h - bottomPadding]);

			//Set up the x axis
			var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom")
						.ticks(d3.time.days, 1)
						.tickFormat(d3.time.format('%d %b'))
						.tickValues(countTicks(data, Math.ceil(totalDays/10))) //call the ticks function to create ticks
						.tickSize(1)
						.tickPadding(8);

			//Set up the y axis
			var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left")
						.ticks(5)
						.tickSize(1)
			

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
							return xScale(convertDate(d.date)) + padding; //Starting position depends on the number of days between first and last
						})
						
						//Set the starting y position of each bar
						.attr("y", function(d) {
							return h - yScale(d.value) - bottomPadding;  //Starting y position needs to be set to the height of the svg element minus the height of the bar 
						})

						//Set the width of each bar
						.attr("width", w/(totalDays + 1) - padding)  //Make the width of each bar by dividing them evenly from the width of the svg element and subtracting the padding between each bar
						
						//Set the height of each bar
						.attr("height", function(d) {
							return yScale(d.value);
						})

						//Set the fill color of the bars
						.attr("fill", "rgb(168,219,168)");

			//Append the axes
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - bottomPadding) + ")")
				.call(xAxis)
				.selectAll("text")
					.attr("font-size", 14)
					.attr("dx", (totalDays < 10 ? (w/(totalDays + 1) - padding) : -25) + "px")
					.attr("dy", (totalDays < 10 ? "10px" : (w/(totalDays + 1) - padding*4) + "px"))
					.attr("transform", function(){
						return "rotate("+(totalDays < 10 ? 0 : -90)+")"
					});

			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate("+(padding+leftPadding)+",0)")
				.call(yAxis)
				.selectAll("text")
					.attr("font-size", 14);


});