function chartLegend() {
  var colorClass;

  function legend() {
    var data = this.datum();
    var selection = this;
    var legendSpacing = 80;
    var legendMarkerWidth = 10;

    function widthCalcuation(d, i) {
      return width - (i + 1) * legendSpacing;
    }

    var rect = selection
      .selectAll('rect.legend')
      .data(data)

    var text = selection
      .selectAll('text.legend')
      .data(data)

    rect.enter()
      .append('rect')
      .attr('fill', function(d) { return d.color; })
      .attr('class', function(d, i) {
        if(colorClass) {
          return colorClass + i;
        }
      })
      .classed('legend', true)
      .attr('width', legendMarkerWidth)
      .attr('height', legendMarkerWidth)
      .attr('y', 3);

    rect.transition()
      .attr('x', widthCalcuation);

    text.enter()
      .append('text')
      .classed('legend', true)
      .attr('y', 11)
      .attr('transform', 'translate('+(legendMarkerWidth+5) +')')
      .text(function(d) { return d.key; });

    text.transition()
      .attr('x', widthCalcuation)
  }

  legend.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return legend;
  }

  legend.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return legend;
  }

  legend.colorClass = function(value) {
    if (!arguments.length) return colorClass;
    colorClass = value;
    return legend;
  };

  return legend;
}

