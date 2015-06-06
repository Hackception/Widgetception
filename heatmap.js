var WIDTH = 600, HEIGHT = 400;

/*
function interpolateUserLine(userLine)

Given userLine, [{x:1, y:2}, {x:2, y:4}, ...]
produce a bitmap version of that line, using first
order linear interpolation.

The output will be like [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,1,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,1,0,0,0,1,0,1,0,0],
  [0,0,0,0,0,0,1,0,1,0,0,0,1,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]

The dimensions of this array shall be 400 rows by 600 cols
*/
function interpolateUserLine(userLine, xRange, yRange){
  return sparseToDense(interpolate(userLine), xRange, yRange);
}

/*
function interpolate(userLine)

Given userLine, [{x:1, y:2}, {x:2, y:4}, ...],
fill in the spaces between x-values with a linear interpolation.

We will target 400 rows, so we should cut that many x-slices.
*/
function interpolate(userLine){
  var xMin = userLine[0].x,
      xMax = userLine[userLine.length - 1].x,
      numInter = WIDTH / (xMax - xMin),
      pts = [userLine[0]],
      start, end;
  for (var ux=1; ux < userLine.length; ux++){
    start = pts[pts.length - 1];
    end = userLine[ux];
    for (var ix=1; ix <= numInter; ix++){
      pts.push({
        x: start.x + ((end.x - start.x) / numInter)*ix,
        y: start.y + ((end.y - start.y) / numInter)*ix
      });
    }
  }

  return pts;
}

/*
function sparseToDense(sparse)

Given an array [{x: 1, y:2}, {x:1.2, y:2.4}, ..]
Produces a dense 2d array of the values.
*/
function sparseToDense(sparse, xRange, yRange){
  var dense = dArray();
  sparse.forEach(function(d){
    var ix = Math.round(
      (d.x - xRange[0]) / (xRange[1] - xRange[0]) * WIDTH
    ),
        jx = Math.round(
      (d.y - yRange[0]) / (yRange[1] - yRange[0]) * HEIGHT
    );
    dense[Math.max(Math.min(jx, HEIGHT - 1), 0)]
         [Math.max(Math.min(ix, WIDTH - 1), 0)] = 1;
  });
  return dense;
}


function dArray(){
  var arr = []
  for (var ix = 0; ix < HEIGHT; ix++){
    arr.push([]);
    for (var jx = 0; jx < WIDTH; jx++){
      arr[ix].push(0);
    }
  }
  return arr;
}

function sumDenseArrays(a, b){
  var c = dArray(WIDTH, HEIGHT);
  for (var jx=0; jx < HEIGHT; jx++){
    for (var ix=0; ix< WIDTH; ix++){
      c[jx][ix] = a[jx][ix] + b[jx][ix];
    }
  }
  return c;
}
