/**
 * Created by alex.hans on 21.02.2017.
 */
Houses = function( options ) {

    // State
    this._planet = options.planet;
    this._house_height = options.house_height;
    this.houses = null;
    this._houseColors = options.houseColors;
};

Houses.prototype.get_trees = function() {

    return this.houses;
};

Houses.prototype.draw = function() {

    // If no land layer, cannot draw
    if ( this._planet == null ) {

        return null;
    }
    var land = this._planet.get_land();
    if ( land == null ) {

        return null;
    }

    var houses = new THREE.Object3D();

    // Match the land layer's position in world space
    houses.position.setX( land.position.x );
    houses.position.setZ( land.position.z );

    //Add trees to trees object
    for (var x = 0; x < this._planet._surface_points.length; x += 4) {
        for (var y = 0; y < this._planet._surface_points.length; y += 4) {

            // var bool2 = $.inArray(this._planet.get_color_map_index(this._planet._surface_points[x][y]), this._treeColors);
            var bool = this._houseColors.indexOf(this._planet.get_color_map_index(this._planet._surface_points[x][y])) > -1;
            if ( this._planet._surface_points[x][y] <= 0 ) bool = false;
            if(bool && (Math.random() < 0.4) ) {
                var pos = [x*this._planet._tile_width_x, this._planet._surface_points[x][y], y*this._planet._tile_width_z];
                var house = this.placeHouse( pos );
                if ( house != null ) {

                    houses.add( house );
                }
            }

        }

    }
    this.houses = houses;

    return houses;
};

Houses.prototype.placeHouse = function (pos) {

    var returnGroup = new THREE.Object3D();//create an empty container

    //Baumstamm

    var textures = [
        new THREE.TextureLoader().load( "images/front1.jpg" ),
        new THREE.TextureLoader().load( "images/front2.jpg" ),
        new THREE.TextureLoader().load( "images/front3.jpg" )
    ];
    textures[0].wrapS = THREE.RepeatWrapping;
    textures[0].wrapT = THREE.RepeatWrapping;
    textures[0].repeat.set( 1, 2 );
    textures[1].wrapS = THREE.RepeatWrapping;
    textures[1].wrapT = THREE.RepeatWrapping;
    textures[1].repeat.set( 1, 1 );
    textures[2].wrapS = THREE.RepeatWrapping;
    textures[2].wrapT = THREE.RepeatWrapping;
    textures[2].repeat.set( 1, 3 );

    var size = this._house_height;
    var rng = this._house_height/2;
    size += rng*Math.random() - rng/2;
    var skyScraperGeometry = new THREE.BoxGeometry( size/3, size, size/3 );
    var skyScraperMaterial = new THREE.MeshPhongMaterial( {map: textures[Math.floor(Math.random()*3)], color: 0xDDC9A8, shading: THREE.FlatShading, transparent: true });
    // var skyScraperMaterial = new THREE.MeshPhongMaterial( {color: 0xDDC9A8, shading: THREE.FlatShading, transparent: true });
    var block = new THREE.Mesh( skyScraperGeometry, skyScraperMaterial );
    block.castShadow  = true;
    block.receiveShadow  = true;
    var x = pos[0];
    var yEnd = pos[1] + size/2 - 5;
    var y = 3000;
    var z = pos[2];
    block.position.set(x, y, z);
    returnGroup.add( block );

    // //Baumkrone
    //
    // var bushSize = size/5;
    // var bushGeometry = bushGeo(bushSize);
    // var bushMaterial = new THREE.MeshPhongMaterial( {color: 0xffd7a0, shading: THREE.FlatShading, transparent: true } );
    // var bush = new THREE.Mesh( bushGeometry, bushMaterial );
    // bush.castShadow  = true;
    // bush.receiveShadow  = true;
    // bush.position.set(x, y + size/2, z);
    // returnGroup.add( bush );


    var delay = 4 + 4*Math.random() - 3.5;
    TweenMax.to( returnGroup.position, 2, {y: yEnd-y, ease: Elastic.easeOut, delay: delay, repeat:0});

    return returnGroup;
};