/* global d3:true */
'use strict';

// Directive Function
function d3Chart($timeout, $window) {

  function d3ChartCtrl() {

    var WIDTH = 600, HEIGHT = 400;

    d3.argmin = function(arr, acc){
      return _.zip(arr.map(acc), arr).sort(function(a,b){
        return d3.ascending(a[0], b[0]);
      })[0][1];
    };

    function lineChart(){
      var width_ = 850, height_ = 500,
          margin = {top: 20, right: 20, bottom: 30, left: 40};

      var xRange = [0, 100, 10],
          yRange = [0, 100, 10],
          xLabel = 'Sepal Width (cm)',
          yLabel = 'Sepal Length (cm)';

      var x = d3.scale.linear();

      var y = d3.scale.linear();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var userLine = [],
          trueLine = [
        {x: 0, y: 20},
        {x: 10, y: 25},
        {x: 20, y: 27},
        {x: 30, y: 32},
        {x: 40, y: 34},
        {x: 50, y: 39},
        {x: 60, y: 42},
        {x: 70, y: 59},
        {x: 80, y: 68},
        {x: 90, y: 72},
        {x: 100, y: 79}
      ];

      // reserve some variables inside the closure for
      // methods that will be defined within chart()
      var drawTrueLine, drawHeatmap, drawUserLine, xChoices, flashMissing;

      function chart() {
        var width = width_ - margin.left - margin.right,
            height = height_ - margin.top - margin.right;
        x.domain([xRange[0], xRange[1]])
          .range([0, width]);
        y.domain([yRange[0], yRange[1]])
          .range([height, 0]);

        var line = d3.svg.line()
            .interpolate('cardinal')
            .x(function(d){return x(d.x);})
            .y(function(d){return y(d.y);});

        xChoices = d3.range.apply(null, xRange);
        //user expects fully closed interval rather than half-open
        xChoices.push(xRange[1]);
        var canvas = this.selectAll('canvas')
          .data([undefined]);

        var svg = this.selectAll('svg')
          .data([undefined]);

        canvas.enter().append('canvas');

        canvas
          .attr('width', width)
          .attr('height', height)
          .style('left', margin.left + 'px')
          .style('top', margin.top + 'px')
          .style('width', width + 'px')
          .style('height', height + 'px');

        //Create the skeletal chart, if it doesn't already exist.
        var gEnter = svg.enter().append("svg").append('g');
        gEnter.append('g').attr('class', 'x axis')
          .append('text').attr('class', 'x label');
        gEnter.append('g').attr('class', 'y axis')
          .append('text').attr('class', 'y label');
        gEnter.append('g').attr('class', 'warn-missing');
        gEnter.append('rect').attr('class', 'drag-target');
        gEnter.append('g').attr('class', 'user-line')
          .append('path').attr('class', 'interpolation');
        gEnter.append('g').attr('class', 'true-line')
          .append('path').attr('class', 'true-interpolation');

        svg
          .attr("width", width_)
          .attr("height", height_);
        var g = svg.select('g')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        flashMissing = function(){
          var missingXs = _.difference(xChoices, _.pluck(userLine, 'x'));
          if (missingXs.length === 0) return;

          var rectWidth = x(1.0) - x(0);
          var warningRect = g.select('g.warn-missing')
            .selectAll('rect.warning')
            .data(missingXs);
          warningRect.enter()
            .append('rect').attr('class', 'warning');
          warningRect.exit().remove();
          warningRect
            .attr('x', function(d, ix){
              if (d === 0){
                return x(d);
              }
              else if (d === xChoices[xChoices.length - 1]){
                return x(d) - rectWidth/2;
              }
              return x(d) - rectWidth/2;
             })
            .attr('height', height)
            .attr('width', function (d, ix){
              return d === 0 ? rectWidth/2 :
                     d === xChoices[xChoices.length - 1] ? rectWidth/2 :
                     rectWidth;
             })
            .attr('fill', 'orange')
            .attr('fill-opacity', 0.3)
          .transition()
            .duration(2000)
            .attr('fill-opacity', 0)
            .each('end', function(){
              d3.select(this).remove();
            });
        };


        g.select("g.x.axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .select("text.label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(xLabel);

        g.select("g.y.axis")
            .call(yAxis)
          .select("text.label")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yLabel);


        g.select('rect.drag-target')
          .attr('width', width)
          .attr('height', height)
          .style('fill-opacity', 0.0);

        drawUserLine = function(){
          var dots = g.select('g.user-line').selectAll('.dot')
              .data(userLine);
          dots.enter().append('circle').attr('class', 'dot');
          dots.exit().remove();
          dots
              .attr("r", 3.5)
              .attr("cx", function(d) { return x(d.x); })
              .attr("cy", function(d) { return y(d.y); })
              .style("fill", 'tomato');
          userLine.sort(function(a,b){
            return d3.ascending(a.x, b.x);
          });
          g.select('path.interpolation')
            .attr('d', line(userLine));
        };

        function setClosestPoint(){
          var e = d3.event,
            pxX = e.x,
            pxY = e.y,
            scaleX = x.invert(pxX),
            scaleY = Math.max(yRange[0], Math.min(yRange[1], y.invert(pxY))),
            snapToX = d3.argmin(xChoices, function(c){
              return Math.abs(scaleX - c);
            });
          // Remove any values with that x choice
          userLine = _.reject(userLine, function(d){ return d.x === snapToX; });
          // Add the new values
          userLine.push({x: snapToX, y:scaleY});
          drawUserLine();
        }
        var drag = d3.behavior.drag()
            .on('drag', setClosestPoint)
            .on('dragend', flashMissing);
        g.select('rect.drag-target').call(drag)

        drawTrueLine = function(){
          var dots = g.select('g.true-line').selectAll('.dot')
              .data(trueLine);
          dots.enter().append('circle').attr('class', 'dot');
          dots.exit().remove();
          dots
              .attr("r", 3.5)
              .attr("cx", function(d) { return x(d.x); })
              .attr("cy", function(d) { return y(d.y); })
              .style("fill", 'steelblue');
          g.select('path.true-interpolation')
            .attr('d', line(trueLine));
        };

        drawHeatmap = function(){
          /* A brief review of the coordinate systems
            we have in play:
              - WIDTH x HEIGHT: this is the coordinate
              system for the heatmap. It is uniform across
              all clients and persists to our database.
              - width x height: this is the coordinate
              system for the svg pixels.
              - xRange x yRange: this coordinate system is
              user defined. It is the numbers drawn on the
              axes on the page. The server was kind enough
              to convert from this system to the heatmap
              system, so we can avoid thinking about it.

            We have a 2d array in heatmap coords, and we need
            to project it into a canvas image in svg coords.

            We'll make some scales to do this.
          */
          var xScale = d3.scale.linear()
              .domain([0, WIDTH])
              .range([0, width]),
            yScale = d3.scale.linear()
              .domain([0, HEIGHT])
              .range([height, 0]);

          var ctx = canvas.node().getContext('2d'),
              image = ctx.createImageData(width, height);

          for (var yix = 0, p = -1; yix < height; ++yix) {
            for (var xix = 0; xix < width; ++x) {
             var c = d3.rgb(color(heatmap[y][x]));
             image.data[++p] = c.r;
             image.data[++p] = c.g;
             image.data[++p] = c.b;
             image.data[++p] = 255;
            }
          }

          ctx.putImageData(image, 0, 0);

        };

      }

      //attach public methods;
      chart.drawTrueLine = function(){
        return drawTrueLine();
      };
      chart.height = function(_){
        if (!arguments.length) return height_;
        height_ = _; return chart;
      };
      chart.width = function(_){
        if (!arguments.length) return width_;
        width_ = _; return chart;
      };
      chart.margins = function(changes){
        if (!arguments.length)  return margin;
        _.extend(margin, changes); return chart;
      };
      chart.xRange = function(_){
        if (!arguments.length) return xRange;
        xRange = _; return chart;
      };
      chart.yRange = function(_){
        if (!arguments.length) return yRange;
        yRange = _; return chart;
      };
      chart.xLabel = function(_){
        if (!arguments.length) return xLabel;
        xLabel = _; return chart;
      };
      chart.yLabel = function(_){
        if (!arguments.length) return yLabel;
        yLabel = _; return chart;
      };
      chart.userLine = function(_){
        if (!arguments.length) return userLine;
        userLine = _;
        drawUserLine();
        return chart;
      };
      chart.trueLine = function(_){
        if (!arguments.length) return trueLine;
        trueLine = _; return chart;
      };
      chart.drawHeatmap = function(){
        drawHeatmap();
      };
      chart.isComplete = function(){
        return userLine.length === xChoices.length;
      };
      chart.flashMissing = function(){
        return flashMissing();
      };

      return chart;

    }

    _.extend(this, {
      lineChart: lineChart
    });



  }

  function link(scope, element, attrs, ctrl) {
    _.extend(scope, {
      height: 400,
      width: 800,
      margins: {}
    });

    var theChart = ctrl.lineChart()
            .height(scope.height)
            .width(scope.width)
            .margins(scope.margins)
            .xLabel(scope.labelX)
            .yLabel(scope.yLabel)
            .xRange(scope.rangeX)
            .yRange(scope.yRange);

    d3.select('d3-chart').call(theChart);

    var dereg = scope.$watch('showResults', function (value) {
      if (value) {
        theChart.trueLine(scope.trueLine);
        theChart.drawTrueLine();
        dereg();
      }
    });

    scope.$watch('showHeatmap', function (value) {
      if (value) {
        theChart.drawHeatmap();
      } else {
        // theChart.hideHeatmap();
      }
    });

    scope.$watch('clearData', function (value) {
      if (value) {
        scope.clearData = !value;
        theChart.userLine([]);
      }
    });

    scope.$on('d3chart::getUserLine', function () {
      scope.$emit('d3chart::sendUserLine', theChart.userLine());
    });

    // $window.addEventListener('resize', function () {
    //
    // })
  }

  return {
    template: '',
    restrict: 'EA',
    scope: {
      height: '=',
      width: '=',
      margins: '=',
      labelX: '@',
      yLabel: '@',
      rangeX: '=',
      yRange: '=',
      showHeatmap: '=',
      showResults: '=',
      clearData: '=',
      trueLine: '='
    },
    controller: d3ChartCtrl,
    controllerAs: 'vm',
    link: link
  };
}

angular.module('lockerdomeApp')
  .directive('d3Chart', [
    '$timeout',
    '$window',
    d3Chart
  ]);
