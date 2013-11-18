function multiBarChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 30}
  var width = 200;
  var height = 100;
  var xScale = d3.time.scale();
  var yScale = d3.scale.linear();
  var mouseclick;

  var maxValue = function(data, key) {
    var maxVal = -1;
    for(var i=0; i<data.length;i++) {
      var d = data[i];
      for(var j=0; j<d.values.length; j++) {
        var val = d.values[j][key];
        if (val > maxVal) {
          maxVal = val;
        }
      }
    }
    return maxVal;
  };

  var minValue = function(data, key) {
    var minVal = Infinity;
    for(var i=0; i<data.length;i++) {
      var d = data[i];
      for(var j=0; j<d.values.length; j++) {
        var val = d.values[j][key];
        if (val < minVal) {
          minVal = val;
        }
      }
    }
    return minVal;
  };

  function chart() {
    var barWidth = (width - margin.left)/data[0].values.length/data.length;
    var barSpacing = 4;

    var selection = this;
    var maxYValue = maxValue(data, 'y');
    var maxXValue = maxValue(data, 'x');
    var minXValue = minValue(data, 'x');

    yScale.domain([0, maxYValue]).range([height, 2])
    xScale.domain([minXValue, maxXValue]).range([0, width - margin.left]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(d3.time.days, 1)
      .tickSubdivide(false);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(10)
      .orient('left')

    var svg = selection
      .selectAll('g')
      .data(data);

    // draw group for each set
    var sets = svg.enter()
      .append('g')
      .attr('width', width)
      .attr("transform", function(d, i) { return 'translate('+ (margin.left + (i * (barWidth))) + ', 0)'; })
      .attr('class', function(d, i) {
        return 'bar-set' + i;
      });

    // draw rects for each group
    var rects = sets.selectAll('rect')
      .data(function(d) { return d.values; }).enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', function(d) { return height - yScale(d.y) })
      .attr('x', function(d, i) { return i * (barWidth * data.length + barSpacing); })
      .attr('y', function(d) { return yScale(d.y) });

    // mouseclick action
    if (typeof mouseclick !== 'undefined') {
      rects.on('click', mouseclick);
    }

    // draw axes
    svg.enter().append('g')
      .classed('x-axis', true)
      .classed('axis', true)
      .attr('transform', 'translate('+ margin.left +',' + height + ')')
      .call(xAxis);

    svg.enter().append('g')
      .classed('y-axis', true)
      .classed('axis', true)
      .attr('transform', 'translate('+margin.left +',0)')
      .call(yAxis);
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  }

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  }

  chart.margin = function(value) {
    if(!arguments.length) return margin;
    margin = value;
    return margin;
  }

  chart.mouseclick = function(value) {
    if(!arguments.length) return value;
    mouseclick = value;
    return value;
  }

  return chart;
}
