
// Draw pie chart 1
$(document).ready(function() {

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select('#chart')
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

    // Loading a file or getting data from an endpoint is an asynchronous operation, 
    // so we keep entire code dependent on it inside the a callback
    d3.json("/chartdataQA", function(error, data) {
      
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

    });
});


// Draw pie chart 2
$(document).ready(function() {

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var svg = d3.select('#chart2')
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

    // Loading a file or getting data from an endpoint is an asynchronous operation, 
    // so we keep entire code dependent on it inside the a callback
    d3.json("/chartdataPA", function(error, data) {
      
      // Add enabled property to each entry of dataset
      data.forEach(function(d) {
        d.enabled = true;
      })
      console.log(data);

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
        .text(function(d) { return d; });
    });
});



// Draw social bar chart
$(document).ready(function() {
    DrawBarChart();
    // var color = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499"]
    // // set the dimensions and margins of the graph
    // var margin = {top: 20, right: 20, bottom: 30, left: 40},
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;

    // // set the ranges
    // var x = d3.scaleBand()
    //           .range([0, width])
    //           .padding(0.1);
    // var y = d3.scaleLinear()
    //           .range([height, 0]);
    
    // var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // // append the svg object to the body of the page
    // // append a 'group' element to 'svg'
    // // moves the 'group' element to the top left margin
    // var svg = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", 
    //           "translate(" + margin.left + "," + margin.top + ")");

    // OptionVal = d3.select('input[name="dataset"]:checked').node().value
    // // console.log("OptionVal = ", OptionVal);

    // if(OptionVal === "Visits") {
    //   // get the data
    //   d3.json("barchartdataVisit", function(error, data) {
    //     // if (error) throw error;
    //     data.sort(function(a, b) {
    //       if (a.Index > b.Index) {
    //           return -1;
    //       } else {
    //           return 1;
    //       }
    //     });
        
    //     // Scale the range of the data in the domains
    //     x.domain(data.map(function(d) { return d.DateAxes; }));
    //     y.domain([0, d3.max(data, function(d) { return d.percent; }) + 15]);
    //     // y.domain([0, 100]);

    //     // append the rectangles for the bar chart
    //     svg.selectAll(".bar")
    //         .data(data)
    //         .enter().append("rect")
    //         .attr("class", "bar")
    //         .attr("x", function(d) { return x(d.DateAxes); })
    //         .attr("width", x.bandwidth())
    //         .attr("y", function(d) { return y(d.percent); })
    //         .attr("height", function(d) { return height - y(d.percent); })
    //         .on("mousemove", function(d){
    //           tooltip
    //             .style("left", d3.event.pageX - 50 + "px")
    //             .style("top", d3.event.pageY - 70 + "px")
    //             .style("display", "inline-block")
    //             .html(function() {
    //               val = d.percent;
    //               if(val < 1)
    //                 return 0 + "%";
    //               else
    //                 return (d.percent).toPrecision(4) + "%"
    //             });
    //       })
    //       .on("mouseout", function(d){ tooltip.style("display", "none");});

    //     // add the x Axis
    //     svg.append("g")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(d3.axisBottom(x));

    //     // add the y Axis
    //     svg.append("g")
    //         .call(d3.axisLeft(y));
    //   });
    // }
});

function change(action) {
    DrawBarChart();
}

function DrawBarChart() {
    var color = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499"]
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

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    console.log("removeing the svg tag")
    console.log(d3.select("#barchart").select("svg"));
    d3.select("#barchart_svg").remove();
    

    console.log($('#barchart'));
    var svg = d3.select("#barchart").append("svg").attr("id", "barchart_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    OptionVal = d3.select('input[name="dataset"]:checked').node().value
    // console.log("OptionVal = ", OptionVal);

    if(OptionVal === "Visits") {
      // get the data
      d3.json("barchartdataVisit", function(error, data) {
        // if (error) throw error;
        data.sort(function(a, b) {
          if (a.Index > b.Index) {
              return -1;
          } else {
              return 1;
          }
        });
      
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.DateAxes; }));
        y.domain([0, d3.max(data, function(d) { return d.percent; }) + 15]);
        // y.domain([0, 100]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.DateAxes); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.percent); })
            .attr("height", function(d) { return height - y(d.percent); })
            .on("mousemove", function(d){
              tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html(function() {
                  val = d.percent;
                  if(val < 1)
                    return 0 + "%";
                  else
                    return (d.percent).toPrecision(4) + "%"
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
      });
    }
    else if(OptionVal === "UpVotes") {
      // get the data
      d3.json("barchartdataUpVote", function(error, data) {
        // if (error) throw error;
        data.sort(function(a, b) {
          if (a.Index > b.Index) {
              return -1;
          } else {
              return 1;
          }
        });
      
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.DateAxes; }));
        y.domain([0, d3.max(data, function(d) { return d.percent; }) + 15]);
        // y.domain([0, 100]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.DateAxes); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.percent); })
            .attr("height", function(d) { return height - y(d.percent); })
            .on("mousemove", function(d){
              tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html(function() {
                  val = d.percent;
                  if(val < 1)
                    return 0 + "%";
                  else
                    return (d.percent).toPrecision(4) + "%"
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
      });
    }
    else if(OptionVal === "DownVotes") {
      // get the data
      d3.json("barchartdataDownVote", function(error, data) {
        // if (error) throw error;
        data.sort(function(a, b) {
          if (a.Index > b.Index) {
              return -1;
          } else {
              return 1;
          }
        });
      
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.DateAxes; }));
        y.domain([0, d3.max(data, function(d) { return d.percent; }) + 15]);
        // y.domain([0, 100]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.DateAxes); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.percent); })
            .attr("height", function(d) { return height - y(d.percent); })
            .on("mousemove", function(d){
              tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html(function() {
                  val = d.percent;
                  if(val < 1)
                    return 0 + "%";
                  else
                    return (d.percent).toPrecision(4) + "%"
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
      });
    }
    
}