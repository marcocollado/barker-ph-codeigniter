/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var map;
var marker
function initialize(mapcanvasid,lat,long) {
    var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(long));
//  var myLatlng = new google.maps.LatLng(14.535067,120.982153);
//  var myLatlng1 = new google.maps.LatLng(14.560833, 120.988333);
  var mapOptions = {
    zoom: 6,
    center: myLatlng
  }
  map = new google.maps.Map(document.getElementById(mapcanvasid), mapOptions);

  marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });
//var marker = new google.maps.Marker({
//      position: myLatlng1,
//      map: map,
//      title: 'Hello World!'});
}
