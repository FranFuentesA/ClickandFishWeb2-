var host = "https://www.riverview.es/clicnfish"
//var host = "http://localhost:3000/"
//var host = "http://192.168.1.36:3000/"

var api_getsensors = function (){
   $.getJSON(host +"/sensors/", function(data){
     console.log(data)

   })

}

var api_getaforo=function(est_id, meas_id){
   $.getJSON(host + "/aforos/" + est_id + "/" + meas_id+"/", function(data){
     console.log(data)
     $("#"+meas_id).html ( data[0].valor);
   })

};

var api_getmagnitude= function (est_id, magn_id, label_id){
  $.getJSON(host + "/sensors/"+est_id+"/"+magn_id+"/last", function (data){
    if (magn_id=="temp"){
      $("#"+label_id).html ( data.value + "ºC" );
    }else{
      $("#"+label_id).html ( data.value );
    }
    $("#fechaupdate").html(data.fecha +" -- ");
 });

};

var api_getmeteo = function (est_id){
  $.getJSON(host+"/sensors/meteo/"+est_id+"/", function (data){
    console.log  (data.current_observation.temp_c);
    data.current_observation.relative_humidity
    $("#temp_val").html(data.current_observation.temp_c+" ºC");
    $("#hum_val").html(data.current_observation.relative_humidity);
    $("#pres_val").html(data.current_observation.pressure_mb+" mbar");
  })
};
var api_getpano = function (id_tramo, id_pano, cbFn){
    $.getJSON(host + "/panoramas/"+id_tramo+"/"+id_pano, function (data){
      cbFn(data);
    }) .fail(function() {
    console.log( "error" );
  });

};
var api_updtepano= function (id_tramo,id_pano, rot, elev, azim,cbFn){

				var projData = {'pano':{'rot': rot,'elev':elev,'azim':azim}};

				$.ajax({
					url: host+ '/panoramas/'+id_tramo+'/'+id_pano+'/',
					type: 'POST',
					data: JSON.stringify(projData),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
//					beforeSend : function( xhr ) {
//						xhr.setRequestHeader( 'Authorization', 'BEARER ' + ApiConfig.TOKEN  );
//					},
					success: function(data){
						console.log(data);
						if(cbFn) {
							cbFn(data);
						}
					},
					error: function() {
						console.log('Error connecting to server');
						if(cbFn) {
							cbFn();
						}
					},
					failure: function(errMsg) {
						console.log(errMsg);
						if(cbFn) {
							cbFn();
						}
					}
				});
};
