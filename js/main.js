/**
 * Created by alex.hans on 16.02.2017.
 */

// defines variables
Main = function() {

    // Self reference for events
    this.self = this;

    // Internal state
    this.is_initiated = false;

    // Three JS properties
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.ambientLight = null;
    this.controls = null;
    // this.stats = null;
    // this.keyboard = new KeyboardState();
    // this.clock = new THREE.Clock();

    // World properties (i.e. the world/scene we're drawing)
    this.land = null;
    this.Planet = null;
};

//sets up scene, cam, renderer, controls and lights
Main.prototype.init = function() {

    //
    // Scene
    this.scene = new THREE.Scene();

    //
    // Camera
    var screen_width = window.innerWidth;
    var screen_height = window.innerHeight;
    var view_angle = 45;
    var aspect = screen_width / screen_height;
    var near = 1;
    var far = 10000;
    var camera = new THREE.PerspectiveCamera( view_angle, aspect, near, far );
    this.scene.add( camera );
    camera.position.set( 200, 110, 100 );
    camera.lookAt( this.scene.position );
    this.camera = camera;

    //
    // Renderer
    this.renderer = new THREE.WebGLRenderer( {
        antialias: true,
        alpha: true
    } );
    this.renderer.setSize( screen_width, screen_height );
    // this.renderer.setClearColor( 0x55ff55, 0 );

    // // Shadows
    // if ( this.renderer.shadowMap ) {
    //
    //     this.renderer.shadowMap.enabled = true;
    //     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // }
    // else {
    //
    //     this.renderer.shadowMapEnabled = true;
    //     this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    // }

    //
    // Container
    this.container = document.getElementById( 'container' );
    this.container.appendChild( this.renderer.domElement );

    //
    // Events

    // automatically resize renderer
    THREEx.WindowResize( this.renderer, this.camera );

    //
    // Controls

    // toggle full-screen on given key press
    THREEx.FullScreen.bindKey( { charCode: 'm'.charCodeAt( 0 ) } );

    // move mouse and: left   click to rotate,
    //                 middle click to zoom,
    //                 right  click to pan
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

    //
    // Lighting
    // TODO: lighting feels like it's more of the scene/world than init stuff

    /*
     // create a small sphere to show position of light
     var lightbulb = new THREE.Mesh(
     new THREE.SphereGeometry( 5, 16, 8 ),
     new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
     );

     var light = new THREE.PointLight( 0xffffff, 0.75, 350 );
     light.position.set( -20, 80, -40 );
     light.add( lightbulb );
     this.scene.add( light );
     */
    var directional_light = new THREE.DirectionalLight( 0xffe9a0, 0.75 );
    directional_light.position.set( 50, 60, -25 );
    directional_light.castShadow = true;
    // directional_light.shadowDarkness = 0.2;
    // directional_light.shadowCameraVisible = false;
    // directional_light.shadowCameraNear = 10;
    // directional_light.shadowCameraFar = 250;
    // directional_light.shadowCameraRight = 100;
    // directional_light.shadowCameraLeft = -100;
    // directional_light.shadowCameraTop = 100;
    // directional_light.shadowCameraBottom = -100;
    // directional_light.shadowMapWidth = 5000;
    // directional_light.shadowMapHeight = 5000;
    this.scene.add( directional_light );

    this.ambientLight = new THREE.AmbientLight( 0x666666 );
    var intensity = 1.0;
    this.ambientLight.color.setRGB(
        this.ambientLight.color.r * intensity,
        this.ambientLight.color.g * intensity,
        this.ambientLight.color.b * intensity );
    this.scene.add( this.ambientLight );

    //
    // Start animation loop
    // this.animate();


    //
    // Done
};

Main.prototype.animate = function() {

    requestAnimationFrame( this.animate.bind( this ) );
    this.render();
    this.update();
};

Main.prototype.render = function() {

    this.renderer.render( this.scene, this.camera );
};

Main.prototype.update = function() {

    this.controls.update();

    // var radius = 250;
    // var time = performance.now() / 1000.0;
    // this.camera.position.set( radius*Math.sin(time/3), 200, radius*Math.cos(time/3) );
    // this.camera.lookAt( this.scene.position );

};

Main.prototype.recreate = function(  ) {

    // Ensure initiated
    this.init();

    // Clear existing world, if there is one. Don't want to reset the camera position, etc.
    // this.scene.remove( this.scene.getObjectByName( 'land' ) );
    // this.scene.remove( this.scene.getObjectByName( 'trees' ) );

    // Create new world
    // The elements of the scene have been divided into layers, just to help organise code. Inevitably, most layers
    // will need to know about the land layer as things are mostly relative to that.

    // Land
    this.Planet = new Planet( {
        tile_width_x: 25,
        tile_width_z: 20,
        target_highest_point: 250,
        noiseFunc: 'cellular',
        color_map: [
            [0xFFFFFF],
            [0xFF9A74],
            [0xBF594B],
            [0xD3E17F],
            [0x9EC457],
            [0x83AED0]
        ]
    } );
    this.Planet.compute_surface_points();
    var land = this.Planet.draw();
    land.name = 'land';
    land.translateX( this.Planet.get_center_x() * -1 );
    land.translateZ( this.Planet.get_center_z() * -1 );
    this.scene.add( land );

    // // Paper texture
    // var paper_texture = new PaperTexture( {
    //     width: 160, // TODO: base width on Planet width
    //     depth: 160,
    //     height: 50
    // } );
    // paper_texture.apply_to( land );

    this.animate();
};
