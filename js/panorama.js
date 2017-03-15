/*panorma web static*/
var camera, scene, renderer;
var container;
var groupArrows;
//var icono_puntoPrueba,texto_puntoPrueba;
var ficonos_puntosPrueba;
var iconos_puntosPrueba=[];
//var mesh1,canvas1,context1,texture1,material1;
var meshTexto_puntoPrueba=[],canvasTexto_puntoPrueba=[],contextTexto_puntoPrueba=[],textureTexto_puntoPrueba=[],materialTexto_puntoPrueba=[];
var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;
var lat_off = 0, lon_off = 0, rot_off = 0;

var thheight;
var fullScreen;

var mesh, mesh2;
var material_file;
var current=0;
var current_tramo=0;
function set_material2(file){
  mesh.material.map.dispose();
  mesh.material.dispose();
  var material = new THREE.MeshBasicMaterial( {
    map: THREE.ImageUtils.loadTexture( file )
  } );
  mesh.material = material;
  material_file = file;
  current = parseInt(material_file.substr(material_file.length - 8, 4 ));
}

function update_panorma(feature){
//fixme panfold esta definida en mapa.js viene de cuando se pulsa un tramo
  set_material(panfold+feature.get('file'),
              feature.get('tramo'),feature.get('id'));
  var desc_tramo = getTramoInfoByCoords();
  console.log("desc_tramo: " + desc_tramo);
  $("#panorama_title").html(desc_tramo);
  rotate_sphere(feature.get('rot'), feature.get('elev') ,feature.get('azim'));
  if ($("#pano_rot").length ) {
    $("#pano_rot").val(feature.get('rot'));
    $("#pano_elev").val(feature.get('elev'));
    $("#pano_azim").val(feature.get('azim'));
   console.log("id:" + feature.get('id') +
              " r e a: " + feature.get('rot') +" "+
                          feature.get('elev') +" "+
                          feature.get('azim'));
  }

  var obj, k;
  for ( k = scene.children.length - 1; k >= 0 ; k -- ) {
    obj = scene.children[ k ];
    if ( obj !== groupArrows && obj !== camera && obj !== mesh) {
      scene.remove(obj);
    }
  }

  //ftextos_puntosPrueba = puntos_prueba.getSource().getFeatures();
  ficonos_puntosPrueba = puntos_prueba.getSource().getFeaturesInDistance(positionFeature.getGeometry().getCoordinates(),1000) ;
  console.log("Numero de iconos cerca: " + ficonos_puntosPrueba.length);
  if (ficonos_puntosPrueba.length > 0) {

    var materialPuntoPrueba1 = new THREE.MeshBasicMaterial( {
      map: THREE.ImageUtils.loadTexture( 'img/twitter.png' ),transparent: true,color: 0xffffff
    } );
    var materialPuntoPrueba2 = new THREE.MeshBasicMaterial( {
      map: THREE.ImageUtils.loadTexture( 'img/google.png' ),transparent: true,color: 0xffffff
    } );

    console.log("Nº de iconos cerca: " + ficonos_puntosPrueba.length);
    var i, ii;
    var posPano, posPunto, posIconX, posIconY;
    posPano = positionFeature.getGeometry().getCoordinates();

    for (i = 0, ii = ficonos_puntosPrueba.length; i < ii; ++i) {

      if(ficonos_puntosPrueba[i].get('point_type') == 'Aparcamiento')
      iconos_puntosPrueba[i] = new THREE.Mesh( new THREE.PlaneGeometry( 30, 30), materialPuntoPrueba1);
      else if(ficonos_puntosPrueba[i].get('point_type') == 'Restaurante')
      iconos_puntosPrueba[i] = new THREE.Mesh( new THREE.PlaneGeometry( 30, 30), materialPuntoPrueba2);
      iconos_puntosPrueba[i].material.side = THREE.DoubleSide;

      posPunto = ficonos_puntosPrueba[i].getGeometry().getCoordinates();

      posIconX = posPunto[0] - posPano[0];
      posIconY = posPunto[1] - posPano[1];


      console.log("PosIconX: " + posIconX);
      console.log("PosIconY: " + posIconY);
      /*
    var posPanoX,posPanoY,posPanoZ, posPuntoX,posPuntoY,posPuntoZ, posIconX,posIconY,posIconZ;

    posPanoX = 6371000 * Math.sin(THREE.Math.degToRad(90 - positionFeature.getGeometry().getCoordinates()[0])) * Math.cos(THREE.Math.degToRad(positionFeature.getGeometry().getCoordinates()[1]));
    posPanoY = 6371000 * Math.sin(THREE.Math.degToRad(90 - positionFeature.getGeometry().getCoordinates()[0])) * Math.sin(THREE.Math.degToRad(positionFeature.getGeometry().getCoordinates()[1]));
    posPanoZ = 6371000 * Math.cos(THREE.Math.degToRad(90 - positionFeature.getGeometry().getCoordinates()[0]));

    for (i = 0, ii = iconos_puntosPrueba.length; i < ii; ++i) {
      iconos_puntosPrueba[i] = new THREE.Mesh( new THREE.PlaneGeometry(1000, 1000), materialPuntoPrueba);

      posPuntoX = 6371000 * Math.sin(THREE.Math.degToRad(90 - iconos_puntosPrueba[i].getGeometry().getCoordinates()[0])) * Math.cos(THREE.Math.degToRad(iconos_puntosPrueba[i].getGeometry().getCoordinates()[1])); //mirar si está bien así
      posPuntoY = 6371000 * Math.sin(THREE.Math.degToRad(90 - iconos_puntosPrueba[i].getGeometry().getCoordinates()[0])) * Math.sin(THREE.Math.degToRad(iconos_puntosPrueba[i].getGeometry().getCoordinates()[1])); //mirar si está bien así
      posPuntoZ = 6371000 * Math.cos(THREE.Math.degToRad(90 - iconos_puntosPrueba[i].getGeometry().getCoordinates()[0])); //mirar si está bien así

      posIconX = posPuntoX - posPanoX;
      posIconY = posPuntoY - posPanoY;
      posIconZ = posPuntoZ - posPanoZ;

      iconos_puntosPrueba[i].position.set(posIconX,posIconY,posIconZ);
*/

      //iconos_puntosPrueba[i].position.set(posIconX,posIconY,30);

      iconos_puntosPrueba[i].position.set(-posIconY,50,-posIconX);
      iconos_puntosPrueba[i].rotateX(THREE.Math.degToRad(rot_off));
      iconos_puntosPrueba[i].rotateZ(THREE.Math.degToRad(lat_off));
      iconos_puntosPrueba[i].rotateY(THREE.Math.degToRad(lon_off));
      //rotate_iconos(feature.get('rot'), feature.get('elev') ,feature.get('azim'),i);
      iconos_puntosPrueba[i].lookAt(new THREE.Vector3(0,0,0));
      scene.add (iconos_puntosPrueba[i]);


      canvasTexto_puntoPrueba[i] = document.createElement('canvas');
      canvasTexto_puntoPrueba[i].width = 350;
      contextTexto_puntoPrueba[i] = canvasTexto_puntoPrueba[i].getContext('2d');
      contextTexto_puntoPrueba[i].font = "Bold 30px Arial";
      contextTexto_puntoPrueba[i].fillStyle = "rgba(255,255,255,0.95)";
      contextTexto_puntoPrueba[i].strokeStyle = "rgba(0,150,0,0.95)";
      console.log("Tipo icono: " + ficonos_puntosPrueba[i].get('point_type'));
      var texto = ficonos_puntosPrueba[i].get('point_type') + '\n' + ficonos_puntosPrueba[i].get('name');
      var x = 60;
      var y = 30;
      var lineheight = 30;
      var lines = texto.split('\n');

      for (var j = 0; j<lines.length; j++){
        contextTexto_puntoPrueba[i].fillText(lines[j], x, y + (j*lineheight) );
        contextTexto_puntoPrueba[i].strokeText(lines[j], x, y + (j*lineheight) );
      }
      //contextTexto_puntoPrueba[i].fillText(ficonos_puntosPrueba[i].get('point_type') , 0, 50);
      //contextTexto_puntoPrueba[i].strokeText(ficonos_puntosPrueba[i].get('point_type') , 0, 50);

      // canvas contents will be used for a texture
      textureTexto_puntoPrueba[i] = new THREE.Texture(canvasTexto_puntoPrueba[i]);
      textureTexto_puntoPrueba[i].needsUpdate = true;

      materialTexto_puntoPrueba[i] = new THREE.MeshBasicMaterial( {map: textureTexto_puntoPrueba[i], side:THREE.DoubleSide } );
      materialTexto_puntoPrueba[i].transparent = true;

      meshTexto_puntoPrueba[i] = new THREE.Mesh(
        new THREE.PlaneGeometry(150, 100),
        materialTexto_puntoPrueba[i]
      );
      meshTexto_puntoPrueba[i].position.set(-posIconY,70,-posIconX);
      meshTexto_puntoPrueba[i].lookAt(camera.position);
      scene.add( meshTexto_puntoPrueba[i] );

    }
  }

}
function set_material (file,tramo_id,pano_id){

  // instantiate a loader
  var loader = new THREE.TextureLoader();
  loader.crossOrigin = '';

  // load a resource
  loader.load(
    // resource URL
    host +"/" + file,
    // Function when resource is loaded
    function ( texture ) {
      mesh.material.map.dispose();
      mesh.material.dispose();
      // do something with the texture
      var material = new THREE.MeshBasicMaterial( {
        map: texture
      } );
      mesh.material = material;
      material_file = file;
      current = pano_id;//parseInt(material_file.substr(material_file.length - 8, 4 ));
      current_tramo=tramo_id;
    },
    // Function called when download progresses
    function ( xhr ) {
      //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    function ( xhr ) {
      console.log( 'An error happened' );
    }
  );
}

function rotate_sphere(rot, lat, lon){
  mesh.rotateY(THREE.Math.degToRad(-lon_off));
  mesh.rotateZ(THREE.Math.degToRad(-lat_off));
  mesh.rotateX(THREE.Math.degToRad(-rot_off));
  rot_off = rot;
  lat_off = lat;
  lon_off = lon;
  mesh.rotateX(THREE.Math.degToRad(rot_off));
  mesh.rotateZ(THREE.Math.degToRad(lat_off));
  mesh.rotateY(THREE.Math.degToRad(lon_off));
}

function rotate_iconos(rot, lat, lon,j){

    iconos_puntosPrueba[j].rotateY(THREE.Math.degToRad(-lon_off));
  iconos_puntosPrueba[j].rotateZ(THREE.Math.degToRad(-lat_off));
  iconos_puntosPrueba[j].rotateX(THREE.Math.degToRad(-rot_off));
  rot_off = rot;
  lat_off = lat;
  lon_off = lon;
  iconos_puntosPrueba[j].rotateX(THREE.Math.degToRad(rot_off));
  iconos_puntosPrueba[j].rotateZ(THREE.Math.degToRad(lat_off));
  iconos_puntosPrueba[j].rotateY(THREE.Math.degToRad(lon_off));

}

function init(init_file,init_tramo, init_current) {

  container = document.getElementById( 'panorama' );

  camera = new THREE.PerspectiveCamera( 75, container.clientWidth / thheight, 1, 1100 );
  camera.target = new THREE.Vector3( 0, 0, 0 );

  scene = new THREE.Scene();

  var geometry = new THREE.SphereGeometry( 500, 60, 40 );
  geometry.scale( - 1, 1, 1 );
  material_file=init_file;
  current=init_current;
  current_tramo=init_tramo;

  var material = new THREE.MeshBasicMaterial( {
    map: THREE.ImageUtils.loadTexture( material_file )
  } );

  mesh = new THREE.Mesh( geometry, material );

  scene.add( mesh );

  var feature = gotoFeature(current_tramo,current);
  if (feature){
    update_panorma(feature);
  }
  //rotate_sphere(offsets[0],offsets[1],offsets[2]);
  // White directional light at half intensity shining from the top.

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 0, 1, 0 );
  scene.add( directionalLight );

  var materialarrow = new THREE.MeshBasicMaterial( {
    map: THREE.ImageUtils.loadTexture( 'img/arrow.png' ),transparent: true,color: 0xffffff
    //map: THREE.ImageUtils.loadTexture( 'data/s-velilla_08.jpg' )
    //map: THREE.ImageUtils.loadTexture( 'data/2294472375_24a3b8ef46_o.jpg' )
  } );

  groupArrows = new THREE.Object3D();

  plane = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50), materialarrow );
  plane.material.side = THREE.DoubleSide;

  plane.rotateX(-3.14149/2);
  plane.position.set( -30, 0, 0 );
//  scene.add(plane);

  plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50), materialarrow );
  plane2.material.side = THREE.DoubleSide;
  plane2.rotateX(-3.14149/2);
  plane2.rotateY(3.14149);
  plane2.position.set( 30, 0, 0 );
  //  scene.add(plane2);

  groupArrows.add( plane );
  groupArrows.add( plane2 );
  scene.add(groupArrows);

/*
	var canvas1 = document.createElement('canvas');
	var context1 = canvas1.getContext('2d');
	context1.font = "Bold 40px Arial";
	context1.fillStyle = "rgba(255,0,0,0.95)";
    context1.fillText('Hello, world!', 0, 50);

	// canvas contents will be used for a texture
texture1 = new THREE.Texture(canvas1);
	texture1.needsUpdate = true;

    material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        material1
      );
	mesh1.position.set(30,30,30);
  mesh1.lookAt(camera.position);
	scene.add( mesh1 );
*/
  var materialPuntoPrueba = new THREE.MeshBasicMaterial( {
    map: THREE.ImageUtils.loadTexture( 'img/twitter.png' ),transparent: true,color: 0xffffff
  } );

  ficonos_puntosPrueba = puntos_prueba.getSource().getFeaturesInDistance(positionFeature.getGeometry().getCoordinates(),2000) ;
console.log("Numero de iconos cerca: " + ficonos_puntosPrueba.length);
  if (ficonos_puntosPrueba.length > 0) {
console.log("Numero de iconos cerca: " + ficonos_puntosPrueba.length);
var i, ii;
    var posPano, posPunto, posIconX, posIconY;
    posPano = positionFeature.getGeometry().getCoordinates();

    for (i = 0, ii = ficonos_puntosPrueba.length; i < ii; ++i) {
    iconos_puntosPrueba[i] = new THREE.Mesh( new THREE.PlaneGeometry( 48, 48), materialPuntoPrueba);
    posPunto = ficonos_puntosPrueba[i].getGeometry().getCoordinates();

    posIconX = posPunto[0] - posPano[0];
    posIconY = posPunto[1] - posPano[1];
    console.log("PosIconX: " + posIconX);
    console.log("PosIconY: " + posIconY);

/*    var posPanoX,posPanoY,posPanoZ, posPuntoX,posPuntoY,posPuntoZ, posIconX,posIconY,posIconZ;

    posPanoX = 6371000 * Math.sin(THREE.Math.degToRad(90 - positionFeature.getGeometry().getCoordinates()[0])) * Math.cos(THREE.Math.degToRad(positionFeature.getGeometry().getCoordinates()[1]));
    posPanoY = 6371000 * Math.sin(THREE.Math.degToRad(90 - positionFeature.getGeometry().getCoordinates()[0])) * Math.sin(THREE.Math.degToRad(positionFeature.getGeometry().getCoordinates()[1]));
    posPanoZ = 6371000 * Math.cos(THREE.Math.degToRad(90 - positionFeature.getGeometry().getCoordinates()[0]));

    for (i = 0, ii = iconos_puntosPrueba.length; i < ii; ++i) {
      iconos_puntosPrueba[i] = new THREE.Mesh( new THREE.PlaneGeometry(10000, 10000), materialPuntoPrueba);

      posPuntoX = 6371000 * Math.sin(THREE.Math.degToRad(90 - iconos_puntosPrueba[i].getGeometry().getCoordinates()[0])) * Math.cos(THREE.Math.degToRad(iconos_puntosPrueba[i].getGeometry().getCoordinates()[1])); //mirar si está bien así
      posPuntoY = 6371000 * Math.sin(THREE.Math.degToRad(90 - iconos_puntosPrueba[i].getGeometry().getCoordinates()[0])) * Math.sin(THREE.Math.degToRad(iconos_puntosPrueba[i].getGeometry().getCoordinates()[1])); //mirar si está bien así
      posPuntoZ = 6371000 * Math.cos(THREE.Math.degToRad(90 - iconos_puntosPrueba[i].getGeometry().getCoordinates()[0])); //mirar si está bien así

      posIconX = posPuntoX - posPanoX;
      posIconY = posPuntoY - posPanoY;
      posIconZ = posPuntoZ - posPanoZ;

      iconos_puntosPrueba[i].position.set(posIconX,posIconY,posIconZ);
*/
      iconos_puntosPrueba[i].position.set(posIconX,posIconY,30);
      iconos_puntosPrueba[i].lookAt(new THREE.Vector3(0,0,0));
      scene.add (iconos_puntosPrueba[i]);

    }

  }

  //icono_puntoPrueba = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50), materialPuntoPrueba);
  //scene.add(icono_puntoPrueba);

  /*
  var materialcircle = new THREE.MeshBasicMaterial( {
    map: THREE.ImageUtils.loadTexture( 'img/circle2.png' ),transparent: true,color: 0xffffff
  } );

  circle = new THREE.Mesh( new THREE.PlaneGeometry( 60, 60), materialcircle );
  circle.material.side = THREE.DoubleSide;
  circle.rotateX(-3.14149/2);
  circle.position.set( 0, -40, 0 );
  scene.add(circle);
  */

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(container.clientWidth, thheight );
  container.appendChild( renderer.domElement );

  container.addEventListener( 'mousedown', onDocumentMouseDown, false );
  container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  container.addEventListener( 'mouseup', onDocumentMouseUp, false );
  //document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
  container.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);

  container.addEventListener("touchstart", ontouchstart, false);
  container.addEventListener("touchend", ontouchend, false);
  container.addEventListener("touchmove",ontouchmove, false);
  container.addEventListener("touchcancel", ontouchend, false);

  //
/*
  container.addEventListener( 'dragover', function ( event ) {

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

  }, false );

  container.addEventListener( 'dragenter', function ( event ) {

    document.body.style.opacity = 0.5;

  }, false );

  container.addEventListener( 'dragleave', function ( event ) {

    document.body.style.opacity = 1;

  }, false );

  container.addEventListener( 'drop', function ( event ) {

    event.preventDefault();

    var reader = new FileReader();
    reader.addEventListener( 'load', function ( event ) {

      material.map.image.src = event.target.result;
      material.map.needsUpdate = true;

    }, false );
    reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

    document.body.style.opacity = 1;

  }, false );
*/
  //

  window.addEventListener( 'resize', onWindowResize, false );

}
function onWindowResize() {

  camera.aspect = container.clientWidth / thheight;
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, thheight);

}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function onDocumentMouseDown( event ) {

  event.preventDefault();

  isUserInteracting = true;

  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;
  console.log(event);
  onPointerDownLon = lon;
  onPointerDownLat = lat;
  //vector from camera to mouse
  var vectorMouse = new THREE.Vector2( );
  vectorMouse.x=(event.offsetX/container.clientWidth)*2-1;
  vectorMouse.y=1-(event.offsetY/thheight)*2;

  var raycaster = new THREE.Raycaster();
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( vectorMouse, camera );

  // calculate objects intersecting the picking ray
  intersects = raycaster.intersectObjects( [plane, plane2],true );
  console.log("inter:"+intersects.length);
  for( var i = 0; i < intersects.length; i++ ) {
    var intersection = intersects[ i ];
    obj = intersection.object;
    console.log("intersect");
    current = parseInt(current);
    if (obj === plane ){
      current = current -1;
      if (current < 0 ) current = 0;
    }else{
      current = current +1;
    }
    //var tmp_file =material_file.substr(0 ,material_file.length-8)+pad(current,4)+".jpg";
    //set_material(tmp_file);
    var feature = gotoFeature(current_tramo,current);
    if (feature){
      update_panorma(feature);
    }

    //var desc_tramo = getTramoInfoByCoords();
    //$("#panorama_title").html(desc_tramo);
    //rotate_sphere(offsets.rot, offsets.lat, offsets.lon);
    //obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
  }
}

function onDocumentMouseMove( event ) {

  if ( isUserInteracting === true ) {

    lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

  }else{
    //vector from camera to mouse
    var vectorMouse = new THREE.Vector2( );
    vectorMouse.x=(event.offsetX/container.clientWidth)*2-1;
    vectorMouse.y=1-(event.offsetY/thheight)*2;

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( vectorMouse, camera );

    // calculate objects intersecting the picking ray
    intersects = raycaster.intersectObjects( [plane, plane2],true );
    //console.log("inter:"+intersects.length);
    if (intersects.length > 0 ){
      //console.log("intersect");
      document.body.style.cursor = 'pointer';
    }else{
      document.body.style.cursor = '';
    }

  }

}


function onDocumentMouseUp( event ) {

  isUserInteracting = false;

}

function ontouchstart(ev){
  isUserInteracting = true;
  onPointerDownPointerX = ev.touches[0].pageX;
  onPointerDownPointerY = ev.touches[0].pageY;
  onPointerDownLon = lon;
  onPointerDownLat = lat;
}

function ontouchend(ev){
  isUserInteracting = false;
}

function ontouchmove(ev){
  if ( isUserInteracting === true ) {
    lon = ( onPointerDownPointerX - ev.touches[0].pageX) * 0.1 + onPointerDownLon;
    lat = ( ev.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
  }
}

function onDocumentMouseWheel( event ) {

  // WebKit

  if ( event.wheelDeltaY ) {

    camera.fov -= event.wheelDeltaY * 0.05;

    // Opera / Explorer 9

  } else if ( event.wheelDelta ) {

    camera.fov -= event.wheelDelta * 0.05;

    // Firefox

  } else if ( event.detail ) {

    camera.fov += event.detail * 1.0;

  }

  camera.updateProjectionMatrix();

}

function animate() {

  requestAnimationFrame( animate );
  update();

}

function update() {

  //if ( isUserInteracting === false ) {

  //lon += 0.1;

  //}

  fullScreen=($("#panoramablock").hasClass("fullscreen"));
  if (fullScreen){
    thheight=window.innerHeight-80;
  }
  else{
    thheight=500;
  }
   onWindowResize();

  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = THREE.Math.degToRad( 90 - lat );
  theta = THREE.Math.degToRad( lon );

  camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
  camera.target.y = 500 * Math.cos( phi );
  camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

  camera.lookAt( camera.target );
  //icono_puntoPrueba.position.set(x_icon,y_icon,z_icon); //Crearlas y asignarlas la resta de coordendas

  //icono_puntoPrueba.position.set(200,200,200);
  //icono_puntoPrueba.lookAt(new THREE.Vector3(0,0,0));

//plane2.position.set( 100*Math.cos(theta), -40, 100*Math.sin(theta) );
//  groupArrows.position.set( 120*Math.cos(theta), -Math.sqrt(16000-Math.sqr(120*(Math.cos(theta)+Math.sin(theta))/2)), 120*Math.sin(theta) );
  groupArrows.position.set( 120*Math.cos(theta), 127*Math.sin(-(0.32+phi-3.14159/2)), 120*Math.sin(theta) );
  /*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/

  renderer.render( scene, camera );

}
