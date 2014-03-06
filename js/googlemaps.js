/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var map;
var marker1;
var marker2;
function initialize(mapcanvasid, lat1, long1, lat2, long2) {
    var myLatlng1 = new google.maps.LatLng(parseFloat(lat1), parseFloat(long1));
    var myLatlng2 = new google.maps.LatLng(parseFloat(lat2), parseFloat(long2))

    var mapOptions = {
        zoom: 10,
        center: myLatlng1
    };
    map = new google.maps.Map(document.getElementById(mapcanvasid), mapOptions);

    marker1 = new google.maps.Marker({
        position: myLatlng1,
        map: map,
        title: 'Hello World!'
    });
    marker2 = new google.maps.Marker({
        position: myLatlng2,
        map: map,
        title: 'Hello World!'});
}
