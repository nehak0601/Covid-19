$(document).ready(function(){
		chart_['columns'] = ['country', 'confirmed', 'deaths', 'recovered'];
		render_multiline('#chart', chart_);	
});

function render_multiline(selector, data){
	// Set the dimensions of the canvas / graph
	// Set the dimensions of the canvas / graph
	//console.log(data)
	var svg = d3.select(selector),
        margin = {top: 20, right: 40, bottom: 40, left: 50},
        width = $(selector).width() - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    svg = svg.append('svg')
    			.attr('width', width + margin.left + margin.right)
    			.attr('height', height + margin.top + margin.bottom)
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scalePoint().range([0, width]),
        y = d3.scaleLinear();
        z = d3.scaleOrdinal()
             .range(["green", "steelblue", "red"]);  ;   

    // Define the div for the tooltip
    // var div = d3.select("body").append("div") 
    //     .attr("class", "tooltip") 
    //     .style("opacity", 0);

    var line = d3.line()
        .x(function(d) { return x(d.country); })
        .y(function(d) { return y(d.expression); })

      var znfs = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {country: d.country, expression: d[id]};
          })
        };
      });
      console.log([d3.min(data, function (d) { return d.confirmed; }), d3.max(data, function (d) { return d.confirmed; })])
      // data=[data.map(d=>d.confirmed)]
      // console.log(data)
      console.log()
      x.domain(data.map(d=>d.country));
      y.domain([d3.min(data, function (d) { return d.confirmed; }), d3.max(data, function (d) { return d.confirmed; })]).range([height,0]);
      z.domain(znfs.map(function(c) { return c.name; }));

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height + 15) + ")")
			    .call(d3.axisBottom(x))
			    .selectAll("text")
			    .attr("y", 0)
			    .attr("x",8)
			    .attr("dy", ".35em")
			    .attr("transform", "rotate(-90)")
			    .style("text-anchor", "end")
			   ;
      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("fill", "#000")
          .text("Total identified cases");
          
      var city = g.selectAll(".city")
        .data(znfs)
        .enter().append("g")
        .attr("class", "city")
        

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .attr("title", function(d) { return d.id + ' : ' + data.map(d=>d.country) })   // Return tooltip value
          .style("stroke", function(d) { return z(d.id); })
          .on("mouseover", function(d) {    
                div.transition()    
                    .duration(200)    
                    .style("opacity", .9);    
                div .html(d.id)  
                    .style("left", (d3.event.pageX) + "px")   
                    .style("top", (d3.event.pageY - 28) + "px");  
                })          
            .on("mouseout", function(d) {   
                div.transition()    
                    .duration(500)    
                    .style("opacity", 0); 
            });
    $('[title]').tooltip();
}