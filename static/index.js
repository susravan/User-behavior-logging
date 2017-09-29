// Each pie chart is called separately to run the processes parallely
$(document).ready(function() {
    d3.json("/VisitsPiechart", function(error, data) {
        console.log(data)
        DrawPieChart(data, "#VisitsPiechart");
    });
});

$(document).ready(function() {
    d3.json("/AnswersPiechart", function(error, data) {
        DrawPieChart(data, "#AnswersPiechart");
    });
});

function DrawPieChart(data, BindingTag) {

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select(BindingTag)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
      
    // Add enabled property to each entry of dataset
    data.forEach(function(d) {
      d.enabled = true;
    })

    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.label);
      })                                                        
      .each(function(d) { this._current = d; })
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html(function() { return d.data.label + ", " + d.data.count
              });
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});            

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)                                   
      .on('click', function(label) {                           
        var rect = d3.select(this);                             
        var enabled = true;                                   
        var totalEnabled = d3.sum(data.map(function(d) {    
          return (d.enabled) ? 1 : 0;                         
        }));                                                  

        if (rect.attr('class') === 'disabled') {              
          rect.attr('class', '');                             
        } else {                                               
          if (totalEnabled < 2) return;                        
          rect.attr('class', 'disabled');                     
          enabled = false;                                    
        }                                                     

        pie.value(function(d) {                                
          if (d.label === label) d.enabled = enabled;           
          return (d.enabled) ? d.count : 0;                   
        });                                                    

        path = path.data(pie(data));                       

        path.transition()                                     
          .duration(750)                                       
          .attrTween('d', function(d) {                        
            var interpolate = d3.interpolate(this._current, d); 
            this._current = interpolate(0);                     
            return function(t) {                              
              return arc(interpolate(t));                       
            };                                                 
          });                                                   
      });

      legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; })
}

// Made this global variable to get the access to "change()" function also
var BarChartData = []

// Draw social bar chart
// Loads the data on page ready
$(document).ready(function() {
    d3.json("/barchartdata", function(data) {
        data.sort(function(a, b) {
          if (a.Index > b.Index) {
              return -1;
          } else {
              return 1;
          }
        });
        BarChartData = data
        DrawBarChart(data, "Visited");
    });
    
});

// Calls DrawBarChart passing the action that the user has selected
function change(action) {
    OptionVal = d3.select('input[name="dataset"]:checked').node().value
    DrawBarChart(BarChartData, OptionVal);
}

// Main function to draw the chart
function DrawBarChart(data, drawOnEvent) {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);
    
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    d3.select("#barchart_svg").remove();  // Remove previous chart binding
    
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#barchart")
        .append("svg")
        .attr("id", "barchart_svg")   // Used to remove the chart 
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.DateAxes; }));
    y.domain([0, d3.max(data, function(d) { return d[drawOnEvent]; }) + 15]);
    
    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.DateAxes); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[drawOnEvent]); })
        .attr("height", function(d) { return height - y(d[drawOnEvent]); })
        .on("mousemove", function(d){
          tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html(function() {
              val = d[drawOnEvent];
              if(val < 1)
                return 0 + "%";
              else
                return (d[drawOnEvent]).toPrecision(4) + "%"
            });
      })
      .on("mouseout", function(d){ tooltip.style("display", "none");});

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
}
