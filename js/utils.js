randomBottom = function (length, rockiness) {

     var radius = length/2;

    // Create empty map
    var map = new Array( length );
    for ( var i = 0; i < length; i++ ) {

        map[i] = new Array( length );
        for (var j = 0; j < length; j++) {
            if(Math.pow(1.3*(i - radius),2) + Math.pow((j - radius),2) > Math.pow(length/3,2)) {
                map[i][j] = 0;
            }
            else {
                var xScale = Math.pow(radius, 2) - (Math.pow(1.3*(i - radius),2) + Math.pow((j - radius),2));
                xScale += rockiness*Math.random() - rockiness/2;
                map[i][j] = xScale;
            }
        }
    }
    return map;
};