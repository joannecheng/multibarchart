function lineGraph() {
  var margin = {top: 15, right: 20, bottom: 80, left: 30}
  var width = 200;
  var height = 100;
  var duration = 100;
  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  var xAttr = 'x';
  var yAttr = 'y';
  var mouseclick;
  var xAxis = d3.svg.axis();
  var yAxis = d3.svg.axis();
  var drawPoints = true;
  var xTickFormat = function(d) { return d; }
  var isTimeSeries = true;

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

  function numberOfValues(data) {
    return data[0].values.length;
  };

  function _isEmpty(data) {
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
    var svg = this;

    var tickSpacing = 30;
    var numberYTicks = height / tickSpacing;
    var maxYValue = maxValue(data, yAttr);
    var minXValue = minValue(data, xAttr);
    var maxXValue = maxValue(data, xAttr);

    yScale.domain([0, maxYValue])
      .range([(height - margin.bottom - margin.top), margin.top])

    xScale.domain([minXValue, maxXValue])
      .range([0, width - margin.left - margin.right]);

    xAxis.scale(xScale)
      .tickSize(0)
      .tickFormat(xTickFormat);

    yAxis
      .scale(yScale)
      .ticks(numberYTicks)
      .tickSize(0)
      .orient('left');

    var sets = svg
      .append('g')
      .classed('line-set', true)

    var line = d3.svg.line()
      .y(function(d) { return yScale(d[yAttr]) })
      .x(function(d, i) { return xScale(d[xAttr]); });

    var lines = svg.selectAll('path.linegraph-line')
      .data(data).enter()
      .append('path')
      .attr('class', function(d, i) {
        return 'linegraph-line'+i;
      })
      .classed('linegraph-line', true)
      .attr('transform', 'translate('+ margin.left +')');

    svg.selectAll('path.linegraph-line')
      .transition().duration(duration)
      .attr('d', function(d) { return line(d.values); });

    var points = svg.selectAll('g.linegraph-points')
      .data(data).enter()
      .append('g')
      .attr('class', function(d, i) {
        return 'linegraph-point'+i;
      })
      .classed('linegraph-points', true)
    .selectAll('circle.linegraph-point')
      .data(function(d) {
        return d.values;
      }).enter()
      .append('circle')
      .classed('linegraph-point', true)
      .attr('transform', 'translate('+ margin.left +')');

    svg.selectAll('circle.linegraph-point')
      .transition().duration(duration)
      .attr('r', 4)
      .attr('cy', function(d) { return yScale(d[yAttr]); })
      .attr('opacity', function() {
        if(drawPoints) {
          return 1;
        }
        return 0;
      })
      .attr({
        cx: function(d, i) {
          return xScale(d[xAttr]); }
      });

    points.on('click', null);
    points.style('cursor', null);
    var tip = tooltip()
      .xAttr(xAttr)
      .yAttr(yAttr)
      .xLabel(xAttr)
      .isTimeSeries(isTimeSeries)
      .yLabel('Count');

    points.on('mouseover', function() {
      d3.select(this)
        .classed('selected-point', true)
      svg.call(tip);
    });
    points.on('mouseout', function() {
      d3.select(this)
        .classed('selected-point', false)
      tip.remove(svg);
    });

    if(mouseclick) {
      points.on('click', mouseclick);
      points.style('cursor', 'pointer');
    }

    // draw axes
    svg.append('g')
      .classed('x-axis', true)
      .classed('axis', true)

    svg.select('g.x-axis')
      .transition()
      .duration(0)
      .attr('transform', 'translate('+ margin.left +','+(height - margin.bottom - margin.top)+')')
      .call(xAxis);

    svg.append('g')
      .classed('y-axis', true)
      .classed('axis', true)

    svg.select('g.y-axis')
      .attr('transform', 'translate('+margin.left+')')
      .call(yAxis);

    var legend = chartLegend().width(width).height(height)
      .colorClass('linegraph-point')

    svg.append('g')
      .classed('legend', true)

    svg.select('g.legend').call(legend);
  }

  function emptyChart(svg) {
    svg.append('text')
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

  chart.xAxisFormat = function(value) {
    if(!arguments.length) return xAxisFormat;
    xAxisFormat = value;
    return chart;
  }

  chart.drawPoints = function(value) {
    if(!arguments.length) return drawPoints;
    drawPoints = value;
    return chart;
  }

  chart.xTickFormat = function(value) {
    if(!arguments.length) return xTickFormat;
    xTickFormat = value;
    return chart;
  }

  chart.hasTooltip = function(value) {
    if(!arguments.length) return hasTooltip;
    hasTooltip = value;
    return chart;
  }

  chart.isTimeSeries = function(value) {
    if(!arguments.length) return isTimeSeries;
    isTimeSeries = value;
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

  return chart;
}
