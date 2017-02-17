(function(global) {
  var module = global.cell_noise = {};

  module.N = 0;
  module.res = 0;
  module.maxOrder = 5;
  module.centers = [];
  module.data = [];

  var distNeighbor = function (x, y) {
    var dMin  = [];
    for (var i=0; i<module.maxOrder; i++) {
      dMin[i] = 9999999;
    }

    for (var j=0; j<module.maxOrder; j++) {
      for (var i=0; i<module.N; i++) {
        var c = module.centers[i];
        var d = Math.sqrt(Math.pow(x-c.x, 2) + Math.pow(y-c.y, 2));

        if (j==0) {
          if (d < dMin[j]) {
            dMin[j] = d;
          }
        }
        if (d < dMin[j] && d > dMin[j-1]) {
          dMin[j] = d;
        }
      }
    }
    return dMin;
  };

  module.recalc = function (N, res) {
    module.N = N;
    module.res = res;
    for (var i=0; i<N; i++) {
      module.centers[i] = {
        x: Math.random(),
        y: Math.random()
      };
    }

    for (var i=0; i<module.res; i++) {
      module.data[i] = [];
      for (var j=0; j<module.res; j++) {
        module.data[i][j] = distNeighbor (i/module.res, j/module.res);
      }
    }
  };

 // get distance from point (x,y) to nth neighbor
  module.value = function (x, y, n) {
    var i = Math.floor(x*module.res);
    var j = Math.floor(y*module.res);
    if (i>module.res-1) i = module.res-1;
    if (j>module.res-1) j = module.res-1;
    if (i<0) i = 0;
    if (j<0) j = 0;
    return module.data[i][j][n];
  };

  module.cellularMap = function (side_length, res) {

      module.recalc(side_length, res);

      // Create empty map
      var map = new Array( side_length );
      for ( var i = 0; i < side_length; i++ ) {

          map[i] = new Array( side_length );
          for (var j = 0; j < side_length; j++) {
              map[i][j] = module.data[i][j][3];
          }
      }
      return map;
  }

})(this);
