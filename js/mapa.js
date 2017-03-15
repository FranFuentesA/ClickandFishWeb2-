var map;
var map_general;

var positionFeature;
var pnoa2, cicle;
var cotos, panoramas,rios,aforos,tramos,osm;
var puntos_prueba;


var boya_id ,ext_id ,aforo_id ,panfold ,pano_id ,meteo_id, tramo_id;
ol.source.Vector.prototype.getFeatureInDistance =
    function(coordinate, distance) {
    // Find the closet feature with in the given distance
    // created from ol.source.Vector.prototype.getClosestFeatureToCoordinate
    var x = coordinate[0];
    var y = coordinate[1];
    var closestFeature = null;
    var previousCityBlockDistance = Infinity;
    var extent = [x-distance, y-distance, x+distance, y+distance];
    this.forEachFeatureInExtent(extent,function(feature) {
        var geo = feature.getGeometry();
        var coord = geo.getClosestPoint(coordinate);
        var minCityBlockDistance = Math.abs(x - coord[0]) + Math.abs(y - coord[1]);
        if (minCityBlockDistance <= distance &&
            minCityBlockDistance < previousCityBlockDistance) {
              previousCityBlockDistance = minCityBlockDistance;
              closestFeature = feature;
        }
    });
    return closestFeature;
};

ol.source.Vector.prototype.getFeaturesInDistance =
    function(coordinate, distance) {
    // Find the closet features with in the given distance
    // created from ol.source.Vector.prototype.getClosestFeatureToCoordinate
    var x = coordinate[0];
    var y = coordinate[1];
    var closestFeatures = [];
    var extent = [x-distance, y-distance, x+distance, y+distance];
    this.forEachFeatureInExtent(extent,function(feature) {
        var geo = feature.getGeometry();
        var coord = geo.getClosestPoint(coordinate);
        var minCityBlockDistance = Math.abs(x - coord[0]) + Math.abs(y - coord[1]);
        if (minCityBlockDistance <= distance ) {
              closestFeatures.push (feature);
        }
    });
    return closestFeatures;
};


//var SERVER='https://clicandfish.com'
var SERVER='https://www.riverview.es'
//var SERVER='http://localhost'
//var SERVER='http://82.223.68.220'

var getTramoInfoByCoords=function (){

  //var feature = cotos.getSource().getClosestFeatureToCoordinate(positionFeature.getGeometry().getCoordinates()) ;
  var feature = cotos.getSource().getFeatureInDistance(positionFeature.getGeometry().getCoordinates(),100) ;

  if (feature == null){   //Para asegurarse que carge
    setTimeout(function (){
        getTramoInfoByCoords();
    }, 3000) ;
  }

	if (feature == null)
		return "Libre";
	else {
  	console.log("Tipo: " + feature.get("tipo") +" " + feature.get("nombre") );

        $("#panorama_title").html(feature.get("tipo") +"<br/>" + feature.get("nombre"));
  	return feature.get("tipo") +"<br/>" + feature.get("nombre");
	}
}


/*
//var SERVER='https://clicandfish.com'
//var SERVER='https://www.riverview.es'
//var SERVER='http://localhost'

//var SERVER='http://82.223.68.220'

var getTramoInfoByCoords=function (){

  //var feature = cotos.getSource().getClosestFeatureToCoordinate(positionFeature.getGeometry().getCoordinates()) ;
  var feature = cotos.getSource().getFeatureInDistance(positionFeature.getGeometry().getCoordinates(),100) ;
	if (feature == null)
		return "Libre";
	else {
  	console.log("Tipo: " + feature.get("tipo") +" " + feature.get("nombre") );
  	return feature.get("tipo") +"<br/>" + feature.get("nombre");
	}
}
*/
var backtogeneralmap = function(){
  console.log("back");
  $("#textregiones").html("Regiones");
    $("#mapgeneralrow").show(1000);
    $("#maprow").hide (1000);
    $("#imagesrow").hide(1000);
}

var clicTramoInfo = function(pixel) {
  var features = [];
  document.body.style.cursor = '';

  map_general.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === tramos ){
      features.push(feature);
    }
  });


  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      map.getView().setCenter(features[i].getGeometry().getCoordinates())
      $("#textregiones").html(features[i].get('tramo'));
      $("#map_title").html(features[i].get('tramo'));
      $("#textregiones2").html("Esta es la información en tiempo real de: "+features[i].get('tramo'));
      boya_id = features[i].get('idboya');
      ext_id = features[i].get('idext');
      aforo_id = features[i].get('idaforo');
      panfold = features[i].get('panfold');
      pano_id = features[i].get('panoid');
      meteo_id = features[i].get('idmeteo');
      tramo_id = features[i].get('id');
      current_tramo = parseInt(tramo_id);
      current = parseInt(pano_id);
      console.log("current_tramo:"+current_tramo+" current pano_id:"+current);

	api_getpano(tramo_id,pano_id,function(data){
        console.log("api_getpano"+JSON.stringify(data));
        set_material(panfold+data.file,current_tramo, current);
        rotate_sphere(data.rot,data.elev,data.azim);
      });

      var feature = gotoFeature(current_tramo,current);
      if (feature){
	console.log("Sí hay feats");
  	//update_panorma(feature);
	//positionFeature.setGeometry( feature.getGeometry());
      }

      _refresh();
      $("#mapgeneralrow").hide(1000);
      $("#maprow").show(1000);
      $("#imagesrow").show(1000,function(){
        document.body.style.cursor = '';
      });
     // var desc_tramo = getTramoInfoByCoords();
     // $("#panorama_title").html(desc_tramo);

      break;
    }
  }
};
var displayTramoInfo = function(pixel) {
  var features = [];
  //var fids = [];
  map_general.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === tramos){
      //if (fids.indexOf(feature.get("ogc_fid"))<0){
        features.push(feature);
      // fids.push(feature.get("ogc_fid"))
      //}
    }
  });
  if (features.length > 0) {
    //document.body.style.cursor = "pointer";
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      //console.log("Tipo: " + features[i].get("tramo") +" " + features[i].get("NOMBRE") );
      if (features[i].get('tramo')) info.push("<div>"+
                                             features[i].get("tramo") + "</div>");
    }
    document.getElementById('tramo_info').innerHTML = info.join(', ') || '&nbsp;';
    document.body.style.cursor = 'pointer';
    $("#tramo_info").show(100);
    $("#tramo_info").css({top: pixel[1]-20, left: pixel[0]+20});
  } else {
    document.getElementById('tramo_info').innerHTML = '&nbsp;';
    document.body.style.cursor = '';
    $("#tramo_info").hide(100);
  }
};


var clicFeatureInfo = function(pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === panoramas ){
      features.push(feature);
    }
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      console.log("Tipo: " + features[i].get("TIPO") + " FILE: " + features[i].get('file'));
      if (features[i].get('file')) {
        console.log (features[i].getGeometry());
        positionFeature.setGeometry( features[i].getGeometry());
        //map.
        console.log(features[i].get('file'));
        update_panorma(features[i]);
        //set_material("data/VegasDelCondado/"+features[i].get('file'));
        //var desc_tramo = getTramoInfoByCoords();
        //$("#panorama_title").html(desc_tramo);

        break;
      }
    }
  }
};

var gotoFeature = function (id_tramo, id_pano){
  console.log("gotofeature:"+id_pano+" tramo: "+id_tramo);
 if (id_pano == 231 && id_tramo == 2) return; //Parche. Para ignorar el pano por defecto del init (de index y pano.js)
var features=panoramas.getSource().getFeatures();

console.log("nº pano-features: "+features.length);
var filename = name.substr(name.length - 8);//FIXME ESTO NO VA A FUNCIONAR CON VARIOS TRAMOS
//  var rot = 0, lat = 0, lon = 0;
  if (id_pano && features.length != 0){
  for(var f=0;f<features.length;f++) {
 /*   var aa=features[f].get("tramo");
    var bb=features[f].get("id");
    console.log("f.get(\"tramo\"): "+aa+
                " id_tramo: "+id_tramo+
                " f.get(\"id\"): "+bb+
                " id_pano: "+id_pano)*/;
    if(features[f].get("tramo")  == id_tramo &&
          features[f].get("id")  == id_pano ) {
 console.log ("pano position found");

 positionFeature.setGeometry(features[f].getGeometry());
update_panorma(features[f]);
//      rot = features[f].get("rot");
//      lon = features[f].get("azim");
//      lat = features[f].get("elev");
      return features[f];
      //      selectFeatureControl.select(panoramas.features[f]);
      break;

 }

}
console.log ("no pano position found"); //Si no ha encontrado ese pano, repite

setTimeout(function (){
        var tid_tramo = id_tramo;
        var tid_pano = id_pano;
        gotoFeature(tid_tramo,tid_pano);
    }, 3000) ;
 }else{
console.log ("no pano position found"); //Si no hay features, repite

setTimeout(function (){
        var tid_tramo = id_tramo;
        var tid_pano = id_pano;
        gotoFeature(tid_tramo,tid_pano);
    }, 3000) ;
}
  //console.log ("no features found");
  return ;
}
var displayFeatureInfo = function(pixel) {
  var features = [];
  var fids_rios =[];
  var fids_cotos =[];

  var fids_puntosPrueba = [];

  document.body.style.cursor = '';
  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === rios){
      if (fids_rios.indexOf(feature.get("ogc_fid"))<0){ //indexOf returns -1 if the item is not found.

        features.push(feature);
        fids_rios.push(feature.get("ogc_fid"))
      }
    }

    if (layer === cotos){
      if (fids_cotos.indexOf(feature.get("ogc_fid"))<0){ //indexOf returns -1 if the item is not found.
        features.push(feature);

        fids_cotos.push(feature.get("ogc_fid"))
      }
    }

    if (layer === panoramas){
       document.body.style.cursor = 'pointer';
    }

    if (layer === puntos_prueba){
      if (fids_puntosPrueba.indexOf(feature.get("id"))<0){ //indexOf returns -1 if the item is not found.
        features.push(feature);
        fids_puntosPrueba.push(feature.get("id"))
      }
    }

  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    console.log("num feats: " + features.length);
    for (i = 0, ii = features.length; i < ii; ++i) {
      console.log("Tipo: " + features[i].get("tipo") +" " + features[i].get("nombre") );
      if (features[i].get('tipo')) info.push("<div>"+
                                             features[i].get("tipo") +
                                             "<br> " + features[i].get("nombre")
                                             +"</div>");

      if (features[i].get('point_type')) info.push("<div>"+
                                             features[i].get("point_type") +
                                             "<br> " + features[i].get("name")
                                             +"</div>");
    }
    document.getElementById('map_info').innerHTML = info.join(', ') || 'Libre';
        $("#map_info").show(100);
    $("#map_info").css({top: pixel[1]-20, left: pixel[0]+20});
    //document.body.style.cursor = 'pointer';
    //map.getTarget().style.cursor = 'pointer';
  } else {
    $("#map_info").hide(100);
    document.getElementById('map_info').innerHTML = '&nbsp;';
    //map.getTarget().style.cursor = '';
    //document.body.style.cursor = '';
  }
};

function init_mapa(){

  var categories_cotos4326 = {"Agua en Régimen Especial": [ new ol.style.Style({
    stroke: new ol.style.Stroke({color: "rgba(85,0,255,1.0)",
                                 lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
  })],
                              "Agua en Régimen Especial con Extracción Controlada": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(85,0,255,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Aguas en Régimen Especial": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(85,0,255,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Aguas Trucheras": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(204,103,48,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Coto de ciprínidos": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(126,202,91,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Escenario Deportivo Social": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(236,29,195,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Intensivo": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(255,123,0,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Régimen tradicional": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(123,219,157,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Régimen tradicional / Sin Muerte": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(78,139,58,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Sin Muerte": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(0,0,0,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Tramo Libre Sin Muerte": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(252,87,211,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "Vedado": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(255,170,0,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })],
                              "": [ new ol.style.Style({
                                stroke: new ol.style.Stroke({color: "rgba(197,122,231,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
                              })]};

  var styleCache_cotos4326={}
  var style_cotos4326 = function(feature, resolution){
    var value = feature.get("tipo");
    var style = categories_cotos4326[value];
    if ("") {
      var labelText = "";
    } else {
      var labelText = ""
      }
    var key = value + "_" + labelText

    if (!styleCache_cotos4326[key]){
      var text = new ol.style.Text({
        font: '10.725px Calibri,sans-serif',
        text: labelText,
        textBaseline: "center",
        textAlign: "left",
        offsetX: 5,
        offsetY: 3,
        fill: new ol.style.Fill({
          color: "rgba(0, 0, 0, 255)"
        }),
      });
      styleCache_cotos4326[key] = new ol.style.Style({"text": text})
    }
    var allStyles = [styleCache_cotos4326[key]];
    allStyles.push.apply(allStyles, style);
    return allStyles;
  };

    var categories_puntosPrueba = {
    "Restaurante": [ new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: "img/google.png"})
    })],
    "Aparcamiento": [ new ol.style.Style({
            image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: "img/twitter.png"})
    })]/*,
    "": [ new ol.style.Style({
      stroke: new ol.style.Stroke({color: "rgba(197,122,231,1.0)", lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 4})
    })]*/};

var styleCache_puntosPrueba={}
var style_puntosPrueba = function(feature, resolution){
    var value = feature.get("point_type");
    var zoom_min = feature.get("zoom_min");
    console.log("Zoom_min de "+value+" "+feature.get("name")+": "+zoom_min);
    console.log("Zoom actual: "+ map.getView().getZoom());
    if (zoom_min < map.getView().getZoom())
      var style = categories_puntosPrueba[value];
    if ("") {
      var labelText = "";
    } else {
      var labelText = ""
      }
    var key = value + "_" + labelText

    if (!styleCache_puntosPrueba[key]){
      var text = new ol.style.Text({
        font: '10.725px Calibri,sans-serif',
        text: labelText,
        textBaseline: "center",
        textAlign: "left",
        offsetX: 5,
        offsetY: 3,
        fill: new ol.style.Fill({
          color: "rgba(0, 0, 0, 255)"
        }),
      });
      styleCache_puntosPrueba[key] = new ol.style.Style({"text": text})
    }
    var allStyles = [styleCache_puntosPrueba[key]];
    allStyles.push.apply(allStyles, style);
    return allStyles;
  };


  vectorSourceCotos = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      var url = SERVER+'/cgi-bin/mapserv?map=/var/opt/clickfish/maps/cf_mapfile.map&&service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=cotos&' +
          'outputFormat=geojson&' +
          'format_options=callback:cotos_callback&callback=cotos_callback&' +
          'srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
      // use jsonp: false to prevent jQuery from adding the "callback"
      // parameter to the URL
      $.ajax({url: url, dataType: 'jsonp', jsonp: false}).done(function( response ) {
        vectorSourceCotos.addFeatures(geojsonFormat.readFeatures(response));
      });
    },
    format: ol.format.GeoJSON,
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      maxZoom: 19
    }))
  });


  cotos = new ol.layer.Vector({
//    source: new ol.source.ImageVector({
      //title: "Tramos",
      source: vectorSourceCotos,

//    })
    style: style_cotos4326
  })

  aforos = new ol.layer.Vector({
    //title: "Aforos",
    source: new ol.source.Vector({
      url: 'clicnfish/data/aforamientos3.kml',
      format: new ol.format.KML()
    })
  });
  /*panoramas = new ol.layer.Vector({
    //title: 'panoramas',
    visible: true,
    source: new ol.source.Vector({
      url: 'data/panoramapoint.kml',
      format: new ol.format.KML()
    })
  });*/
  var panostyle = new ol.style.Style({
         image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 0.75,
          src: "img/circle.png"})
        });

  vectorSourcePanoramas = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      var url = SERVER+'/cgi-bin/mapserv?map=/var/opt/clickfish/maps/cf_mapfile.map&&service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=panoramas&' +
          'outputFormat=geojson&' +
          'format_options=callback:pano_callback&callback=pano_callback&' +
          'srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
      // use jsonp: false to prevent jQuery from adding the "callback"
      // parameter to the URL
      $.ajax({url: url, dataType: 'jsonp', jsonp: false}).done(function( response ) {
        vectorSourcePanoramas.addFeatures(geojsonFormat.readFeatures(response));
      });
    },
    format: ol.format.GeoJSON,
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      maxZoom: 19
    }))
  });

  panoramas = new ol.layer.Vector({
    //title: 'panoramas',
    visible: true,
    source: vectorSourcePanoramas,
    style: panostyle
  });

  /*var panoramas_l = new ol.layer.Vector({
    //title: 'panoramas',
    source: new ol.source.Vector({
      url: 'data/panoramaline.kml',
      format: new ol.format.KML()
    })
  });*/
  /*rios = new ol.layer.Vector({
    //title: 'Rios',
    source: new ol.source.Vector({
      url: 'data/rios.kml',
      format: new ol.format.KML()
    })
  });*/
  var riosstyle = new ol.style.Style({//  My style definition
          fill: new ol.style.Fill({
          //color: 'rgba(159, 211, 239, 1)'
          color: 'rgba(0, 150, 255, 0.3)',
          }),
          stroke: new ol.style.Stroke({
          //color: 'rgba(159, 211,239, 1)',
	  color: 'rgba(0, 150, 255, 0.3)',
          width: 5
          })
     });

  var geojsonFormat = new ol.format.GeoJSON();

  vectorSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      var url = SERVER+'/cgi-bin/mapserv?map=/var/opt/clickfish/maps/cf_mapfile.map&&service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=rios&' +
          'outputFormat=geojson&' +
          'format_options=callback:loadFeatures&' +
          'srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
      // use jsonp: false to prevent jQuery from adding the "callback"
      // parameter to the URL
      $.ajax({url: url, dataType: 'jsonp', jsonp: false}).done(function( response ) {
        vectorSource.addFeatures(geojsonFormat.readFeatures(response));
      });
    },
    format: ol.format.GeoJSON,
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      maxZoom: 19
    }))
  });
/**
 * JSONP WFS callback function.
 * @param {Object} response The response object.
 */
   window.my_callback = function(response) {
    //console.log(response)
    vectorSource.addFeatures(geojsonFormat.readFeatures(response));
  };
   window.pano_callback = function(response) {
    //console.log(response)
    vectorSourcePanoramas.addFeatures(geojsonFormat.readFeatures(response));
  };
  window.tramo_callback = function(response) {
    //console.log(response)
    vectorSourceTramos.addFeatures(geojsonFormat.readFeatures(response));
  };
  window.cotos_callback = function(response) {
    //console.log(response)
    vectorSourceCotos.addFeatures(geojsonFormat.readFeatures(response));
  };

  window.puntos_prueba_callback = function(response) {
    console.log(response)
    vectorSourcePuntos_prueba.addFeatures(geojsonFormat.readFeatures(response));
  };

  rios = new ol.layer.Vector({
  visible: true,
  source:vectorSource,
  style: riosstyle
});
/*rios = new ol.layer.Image({
  visible: true,
  source: new ol.source.ImageVector({
    source:vectorSource,
    style: riosstyle
  })
});*/
/*  rios = new ol.layer.Vector({
    visible: true,
    //source: new ol.source.ImageVector({
      source: new ol.source.Vector({
        url: 'data/rios.geojson',
        format: new ol.format.GeoJSON()
      }),
      style: riosstyle
    //})
  }); */

    vectorSourceTramos = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      var url = SERVER+'/cgi-bin/mapserv?map=/var/opt/clickfish/maps/cf_mapfile.map&&service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=tramos&' +
          'outputFormat=geojson&' +
          'format_options=callback:tramo_callback&callback=tramo_callback&' +
          'srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
      // use jsonp: false to prevent jQuery from adding the "callback"
      // parameter to the URL
      $.ajax({url: url, dataType: 'jsonp', jsonp: false}).done(function( response ) {
        vectorSourceTramos.addFeatures(geojsonFormat.readFeatures(response));
      });
    },
    format: ol.format.GeoJSON,
    strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
      maxZoom: 19
    }))
  });

   var tramostyle = new ol.style.Style({
         image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: "img/iconoriver.png"})
        });
  tramos = new ol.layer.Vector({
    //title: 'panoramas',
    visible: true,
    source: vectorSourceTramos,
    style: tramostyle
  });

  vectorSourcePuntos_prueba = new ol.source.Vector({
  loader: function(extent, resolution, projection) {
    var url = SERVER+'/cgi-bin/mapserv?map=/var/opt/clickfish/maps/cf_mapfile.map&&service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=puntos_prueba&' +
        'outputFormat=geojson&' +
        'format_options=callback:puntos_prueba_callback&callback=puntos_prueba_callback&' +
        'srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
    // use jsonp: false to prevent jQuery from adding the "callback"
    // parameter to the URL
    $.ajax({url: url, dataType: 'jsonp', jsonp: false}).done(function( response ) {
      vectorSourcePuntos_prueba.addFeatures(geojsonFormat.readFeatures(response));
    });
  },
  format: ol.format.GeoJSON,
  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
    maxZoom: 19
  }))
});

var puntos_pruebastyle = new ol.style.Style({
         image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: "img/twitter.png"}) // Cambiar segun tipo de punto
        });

  puntos_prueba = new ol.layer.Vector({
    //title: 'panoramas',
    visible: true,
    source: vectorSourcePuntos_prueba,
    //style: puntos_pruebastyle
    style: style_puntosPrueba
  });


  var cicle2 = new ol.layer.Tile({
    title:"topo",
    source: new ol.source.XYZ({
      attributions: ["thunderforest"],
      url: 'https://tile.thunderforest.com/cycle/${z}/${x}/${y}.png'
    })
  })
  var projection = ol.proj.get('EPSG:3857');
  var projectionExtent = projection.getExtent();
  var size = ol.extent.getWidth(projectionExtent) / 256;
  var resolutions = new Array(20);
  var matrixIds = new Array(20);
  for (var z = 0; z < 20; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
  }
  //console.log(resolutions);
  //console.log(matrixIds);
  pnoa2=   new ol.layer.Tile({
    title:"Ortofoto",
    type: 'base',
    opacity: 0.7,
    source: new ol.source.WMTS({
      //attributions: [attribution],
      url: 'http://www.ign.es/wmts/pnoa-ma',
      layer: 'OI.OrthoimageCoverage',
      matrixSet: 'EPSG:3857',
      format: 'image/png',
      projection: projection,
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
      }),
      style: 'default',
      wrapX: true
    })
  })
  cicle =new ol.layer.Tile({
    title: 'Topo',
    type: 'base',
    source: new ol.source.OSM({
      attributions: [
        new ol.Attribution({
          html: 'Tiles &copy; <a href="http://www.opencyclemap.org/">' +
          'OpenCycleMap</a>'
        }),
        ol.source.OSM.ATTRIBUTION
      ],
      url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
    })
  })

  osm = new ol.layer.Tile({ title: "osm",	type: 'base',  source: new ol.source.OSM() })

  positionFeature = new ol.Feature();
  positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  }));

 map_general = new ol.Map({
    layers: [
      new ol.layer.Group({
        //title: 'Base maps',
        layers: [ osm ]
      }),

        new ol.layer.Group({
        //title: 'Overlays',
        layers: [rios]}) ,

      new ol.layer.Group({
        //title: 'Overlays',
        layers: [tramos]}) ,

    ],
    controls: ol.control.defaults({
      attributionOptions:  ({
        collapsible: false
      })
    }),
    target: 'map_general',
    view: new ol.View({
      center: [ -600000.0,
               5230000.0],
      zoom: 9,
      minZoom: 9,//minimo zoom que el usuario puede hacer
      maxZoom: 15 //maximo zoom que el usuario puede hacer
    })
  });

 map = new ol.Map({
    layers: [
      new ol.layer.Group({
        //title: 'Base maps',
        layers: [ pnoa2, osm
                ]
      }),new ol.layer.Group({
        //title: 'Overlays',
        layers: [panoramas,rios, cotos,aforos]}) ,
        new ol.layer.Group({
        //title: 'Overlays',
        //layers: [puntos_prueba]}) ,
        layers: []}) ,

    ],
    controls: ol.control.defaults({
      attributionOptions: ({
        collapsible: false
      })
    }),
    target: 'map',
    view: new ol.View({
      center: [ -600000.0,
               5260000.0],
      zoom: 14,
      minZoom: 14,//minimo zoom que el usuario puede hacer
      maxZoom: 17 //maximo zoom que el usuario puede hacer
    })
  });

  var featuresOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: [ positionFeature]
    })
  });
  setPosition( "none");
  //var layerSwitcher = new ol.control.LayerSwitcher({
  //  tipLabel: 'Légende' // Optional label for button
  //});
  //map.addControl(layerSwitcher);

  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
  });

  map.on('click', function(evt) {
    clicFeatureInfo(evt.pixel);
  });

  ///este trozo de codigo marca que capa de base map se ve en cada momento
  map.on('moveend', function(evt) {
    //console.log("moove end"+map.getView().getZoom()+": "+map.getView().getResolution() +" "+map.getView().getCenter());
    var zoom = map.getView().getZoom();
    if (zoom < 15) { //15 es el nivel de zoom a partir del cual se deja de ver la orto
      osm.setVisible (true);
      pnoa2.setVisible ( false);
    }else{
      osm.setVisible(false);
      pnoa2.setVisible( true);
    }
  });

  map_general.on('click', function(evt) {
    clicTramoInfo(evt.pixel);
  });

  map_general.on('pointermove', function(evt) {
    var pixel = map_general.getEventPixel(evt.originalEvent);
    displayTramoInfo(pixel);
  });
}

var setPosition= function ( filename){
  var coordinates = [ -596380.4964903995, 5262856.910281289]
  positionFeature.setGeometry(coordinates ?
                              new ol.geom.Point(coordinates) : null);

}
