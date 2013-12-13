function multiBarGraph() {
  var margin = {top: 15, right: 20, bottom: 80, left: 30}
  var width = 200;
  var height = 100;
  var duration = 100;
  var xScale = d3.time.scale();
  var yScale = d3.scale.linear();
  var xAttr = 'x';
  var yAttr = 'y';
  var mouseclick;
  var xAxisTickFormat = d3.time.format('%a %d');
  var labelBars = false;
  var isTimeSeries = true;
  var showLegend = true;
  var xAxis = d3.svg.axis();
  var yAxis = d3.svg.axis();

  function maxValue(data, key) {
    return d3.max(data, function(d) {
      return d3.max(d.values, function(val) {
        return val[key];
      });
    });
  };

  function minValue(data, key) {
    return d3.min(data, function(d) {
      return d3.min(d.values, function(val) {
        return val[key];
      });
    });
  };

  function setXAxisTicks(data) {
    if (isTimeSeries) {
      xAxis
        .ticks(d3.time.day, 2)
        .tickFormat(xAxisTickFormat);
    }
  }

  var _isEmpty = function(data) {
    return !data.every(function(d) {
      return d.values.length > 0
    });
  };

  var calculateWidth = function(svg) {
    return svg[0][0].parentNode.clientWidth;
  };
  var calculateHeight = function(svg) {
    return svg[0][0].parentNode.clientHeight;
  };

  function chart() {
    chart.width(calculateWidth(this));
    chart.height(calculateHeight(this));
    var data = this.datum();
    var selection = this;

    if (_isEmpty(data)) {
      return emptyChart(selection);
    }

    var barWidth = (width - margin.left - margin.right) /
      data[0].values.length / data.length;
    var minBarHeight = 2;
    var barPositioning = barWidth/2;
    var tickSpacing = 30;
    var barSpacing = barWidth/4;
    var chartTopPadding = margin.top;
    var hasTooltip = true;

    var maxYValue = maxValue(data, yAttr);
    var maxXValue = maxValue(data, xAttr);
    var minXValue = minValue(data, xAttr);

    yScale.domain([0, maxYValue])
      .range([(height - chartTopPadding - margin.bottom - margin.top), minBarHeight])

    xScale.domain([minXValue, maxXValue])
      .range([0, width - margin.left - margin.right]);

    var numberYTicks = height / tickSpacing;

    setXAxisTicks();
    xAxis.scale(xScale)
      .tickSize(0)

    yAxis
      .scale(yScale)
      .ticks(numberYTicks)
      .tickSize(0)
      .orient('left');

    var svg = selection
      .selectAll('g')
      .classed('multibar', true)
      .data(data);

    var sets = svg.enter()
      .append('g')
      .attr('width', width)
      .attr('height', height)
      .attr('class', function(d, i) {
        return 'bar-set' + i;
      })
      .classed('bar-set', true)
      .attr('style', function(d) {
        if (d.color){
          return 'fill:' +d.color+';';
        }
      });

    selection.selectAll('.bar-set')
      .transition().duration(duration)
      .attr("transform", function(d, i) {
        return 'translate('+ (margin.left + (i * (barPositioning))) + ')';
      });

    // draw rects for each group
    var rects = sets.selectAll('rect.multibar-rect')
      .data(function(d) { return d.values; })
      .enter()
      .append('rect');

    rects
      .attr('height', function(d) {
        return height - chartTopPadding - margin.top - margin.bottom - yScale(d[yAttr]) + minBarHeight;
      })
      .classed('multibar-rect', true)
      .attr('y', function(d) { return yScale(d[yAttr]) + chartTopPadding - minBarHeight});

    svg.selectAll('rect.multibar-rect')
      .transition().duration(duration)
      .attr('width', barWidth/2)
      .attr('x', function(d, i) {
        return i*(barWidth*data.length) + barSpacing;
      });

    // mouseclick action
    if (typeof mouseclick !== 'undefined') {
      rects.on('click', null);
      rects.on('click', mouseclick);
      rects.style('cursor', 'pointer');
    }

    // draw tooltips
    if (hasTooltip) {
      var tip = tooltip()
        .xAttr(xAttr)
        .yAttr(yAttr)
        .isTimeSeries(isTimeSeries)
        .yLabel('Count');
      rects.on('mouseover', null);
      rects.on('mouseover', function(d) { selection.call(tip)});
      rects.on('mouseout', function(d) { tip.remove(selection); });
      rects.style('cursor', 'pointer');
    }

    // draw axes
    selection.append('g')
      .classed('x-axis', true)
      .classed('axis', true)

    selection.select('g.x-axis')
      .transition()
      .duration(0)
      .attr('transform', 'translate('+ margin.left +','+(height - margin.top - margin.bottom)+')')
      .call(xAxis);

    selection.append('g')
      .classed('y-axis', true)
      .classed('axis', true)

    selection.select('g.y-axis')
      .attr('transform', 'translate('+margin.left+', '+chartTopPadding+')')
      .call(yAxis);

    if(showLegend) {
      var legend = chartLegend().width(width).height(height);
      selection.append('g')
        .classed('legend', true)
      selection.select('g.legend').call(legend);
    }
  }

  function emptyChart(selection) {
    selection.append('text')
      .attr('x', width/2)
      .attr('y', height/3)
      .attr('text-anchor', 'middle')
      .text('No Data Available');
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

  chart.xAxisTickFormat = function(value) {
    if(!arguments.length) return xAxisTickFormat;
    xAxisTickFormat = value;
    return chart;
  }

  chart.hasTooltip = function(value) {
    if(!arguments.length) return hasTooltip;
    hasTooltip = value;
    return chart;
  }

  chart.duration = function(value) {
    if(!arguments.length) return duration;
    duration = value;
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

  chart.labelBars = function(value) {
    if(!arguments.length) return value;
    labelBars = value;
    return chart;
  }

  chart.isTimeSeries = function(value) {
    if(!arguments.length) return isTimeSeries;
    isTimeSeries = value;
    if(isTimeSeries == false) {
      xScale = d3.scale.linear();
    }
    return chart;
  }

  chart.showLegend = function(value) {
    if(!arguments.length) return showLegend;
    showLegend = value;
    return chart;
  }

  return chart;
}
