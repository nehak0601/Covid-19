$(document).ready(function(){
    chart_['columns'] = ['country', 'confirmed', 'deaths', 'recovered'];
    if(mode == 'country') {
      render_multiline('#chart', chart_); 
  }

});

function render_multiline(selector, data){
 // $.each(data, function(index,value){
 //  console.log(value.country)
 // });

  var svg = d3.select(selector),
        margin = {top: 20, right: 40, bottom: 100, left: 50},
        width = $(selector).width() - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    svg = svg.append('svg')
          .attr('width', "100%")
          .attr('height', height + margin.top + margin.bottom)
          .attr('viewBox', "0 0 " + ($(selector).width()) + " " + (height +  margin.bottom))
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scalePoint().range([0, width]),
        y = d3.scaleLinear();
        z = d3.scaleOrdinal()
             .range(['#008000', '#FFA500', '#FF0000']);  


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

     // console.log([d3.min(data, function (d) { return d.confirmed; }), d3.max(data, function (d) { return d.confirmed; })])
      x.domain(data.map(d=>d.country));
      y.domain([d3.min(data, function (d) { return d.confirmed; }), d3.max(data, function (d) { return d.confirmed; })]).range([height,0]);
      z.domain(znfs.map(function(c) { return c.name; }));
      
      //set legends
      var legends = ["Confirmed Cases", "Recovered Cases","Total Death"];
      var color = d3.scaleOrdinal()
                    .range(['orange', 'green', 'red']);
      var legend = svg.selectAll(".legend")
        .data(legends)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 17 + ")";
        });
      
        legend.append("rect")
          .attr("x", width - (-70))
          .attr("width", 12)
          .attr("height", 12)
          .style("fill", function(d, i){return color(i)});

        legend.append("text")
          .attr("x", width - (-65))
          .attr("y", 5)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d, i) {
            return d;
          });

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height + 10) + ")")
          .style("font", "14px times")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("y", 0)
          .attr("x",-10)
          .attr("dy", ".35em")
          .attr("transform", "rotate(-65)")
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
      var div = d3.select("body").append("div") 
        .attr("class", "tooltip1")       
        .style("opacity", 1);

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return z(d.id); })
          .on("mouseover", function(d, i) {    
                div.transition()    
                    .duration(0)    
                    .style("opacity", 1);  
                var mouse = d3.mouse(this);
                var _filterdata = get_hovered_country(mouse);
                div.html(get_tooltip(_filterdata))  
                    .style("left", (d3.event.pageX) + "px")   
                    .style("top", (d3.event.pageY - 28) + "px");  
                })          
            .on("mouseout", function(d) {   
                div.transition()    
                    .duration(2000)    
                    .style("opacity", 0); 
            });

function get_hovered_country(mouse) {
  var x_cordinate = parseInt(mouse[0]);
  var pos = [], val = [];
  $('.x.axis>.tick').each(function(i, node){
      var legend = $('.x.axis>.tick').eq(i).text();
      var x_pos = parseInt($(this).attr('transform').slice(10).split(',')[0]);
      pos.push(Math.abs(parseInt(mouse) - x_pos));
      val.push(legend);
    })
  var index = pos.indexOf(Math.min.apply(Math, pos));
  var filterdata = data.filter(function(obj) {
    return (obj.country === val[index]);
  });
  return filterdata
}

function get_tooltip(_filterdata) {
  _html = "<table class='table-tooltip table'>";
  _html += "<tr><td>Country</td><td>" + _filterdata[0]['country'] + "</td></tr>";
  _html += "<tr><td>Comfirmed</td><td>" + _filterdata[0]['confirmed'] + "</td></tr>";
   _html += "<tr><td>Recovered</td><td>" + _filterdata[0]['recovered'] + "</td></tr>";
    _html += "<tr><td>Deaths</td><td>" + _filterdata[0]['deaths'] + "</td></tr>";
  _html += "</table>"
  return _html;
}

}


