function initialize() {
  var styles = [
    {
      stylers: [
        { hue: "#135d50" },
        { saturation: -60 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "poi",
      elementType: "all",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});
  var myLatLng = new google.maps.LatLng(-37.819647, 144.957328);
  var mapOptions = {
    zoom: 15,
    center: myLatLng,
    scrollwheel: false,
     disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  var map = new google.maps.Map(document.getElementById('googleMap'),
    mapOptions);
  var image = 'images/marker.png';
  var myMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image
  });
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
}
google.maps.event.addDomListener(window, 'load', initialize);