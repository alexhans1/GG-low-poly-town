randomMap = function (side_length) {
    // Create empty map
    var map = new Array( side_length );
    for ( var i = 0; i < side_length; i++ ) {

        map[i] = new Array( side_length );
        for (var j = 0; j < side_length; j++) {
            map[i][j] = Math.random()*6;
        }
    }
    return map;
};