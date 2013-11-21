function multiBarChart() {
  var margin = {top: 20, right: 20, bottom: 40, left: 30}
  var width = 200;
  var height = 100;
  var xScale = d3.time.scale();
  var yScale = d3.scale.linear();
  var xAttr = 'x';
  var yAttr = 'y';
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

  var calculateWidth = function(svg) {
    return $(svg[0][0]).parent().width();
  };
  var calculateHeight = function(svg) {
    return $(svg[0][0]).parent().height();
  };

  function chart() {
    chart.width(calculateWidth(this));
    chart.height(calculateHeight(this));
    var data = this.datum();
    var barWidth = (width - margin.left - margin.right) /
      data[0].values.length / data.length;
    var minBarHeight = 2;
    var barPositioning = barWidth/2;
    var tickSpacing = 20;
    var barSpacing = 0;

    var selection = this;
    var maxYValue = maxValue(data, yAttr);
    var maxXValue = maxValue(data, xAttr);
    var minXValue = minValue(data, xAttr);

    yScale.domain([0, maxYValue])
      .range([(height - margin.bottom - margin.top), minBarHeight])
    xScale.domain([minXValue, maxXValue])
    .range([0, width - margin.left - margin.right]);

    var numberYTicks = height / tickSpacing;
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(d3.time.days, 1)
      .tickSubdivide(false);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(numberYTicks)
      .orient('left');

    var svg = selection
      .selectAll('g')
      .data(data);

    var sets = svg.enter()
      .append('g')
      .attr('width', width)
      .attr("transform", function(d, i) {
        return 'translate('+ (margin.left + (i * (barPositioning))) + ', 0)';
      })
      .attr('class', function(d, i) {
        return 'bar-set' + i;
      })
      .attr('style', function(d) {
        if (d.color){
          return 'fill:' +d.color+';';
        }
      });

    // draw rects for each group
    var rects = sets.selectAll('rect.multibar-rect')
      .data(function(d) { return d.values; }).enter()
      .append('rect');

    rects
      .attr('width', barWidth/2)
      .attr('height', function(d) {
        return height - margin.bottom - margin.top - yScale(d[yAttr]) + minBarHeight;
      })
      .classed('multibar-rect', true)
      .attr('x', function(d, i) {
        return i * (barWidth * data.length + barSpacing) + barPositioning;
      })
      .attr('y', function(d) { return yScale(d[yAttr]) - minBarHeight});

    // mouseclick action
    if (typeof mouseclick !== 'undefined') {
      rects.on('click', mouseclick);
    }

    // draw axes
    svg.enter().append('g')
      .classed('x-axis', true)
      .classed('axis', true)
      .attr('transform', 'translate('+ margin.left +',' +
            (height - margin.bottom - margin.top)+ ')')
      .call(xAxis);

    svg.enter().append('g')
      .classed('y-axis', true)
      .classed('axis', true)
      .attr('transform', 'translate('+margin.left+',0)')
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
    return chart;
  }

  chart.xAttr = function(value) {
    if(!arguments.length) return xAttr;
    xAttr = value;
    return chart;
  }

  chart.yAttr = function(value) {
    if(!arguments.length) return yAttr;
    yAttr = value;
    return chart;
  }

  chart.mouseclick = function(value) {
    if(!arguments.length) return value;
    mouseclick = value;
    return chart;
  }

  chart.mouseover = function(value) {
    if(!arguments.length) return value;
    mouseover = value;
    return chart;
  }

  return chart;
}
