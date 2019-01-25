
window.onload = function () {

    //---Complete example, with this page being the large job map, but being altered to fit in a modal or frame when called by a parent page
    var ga = new GoogleInfo('AIzaSyCveeL0WsuLVrnupJFkn0eM1DOKAzKYPAk');

    //two different job markers, because two buids
    var jm = new Array();            
    jm.push(new JobMarker(18176, 'Mohawk Industries', 'jobmap/images/mohawk.png', null));
    jm.push(new JobMarker(26029, 'Mohawk Industries', 'jobmap/images/mohawk.png', null));
    var jms = new JobMarkers(jm);

    //generic cluster markers, with black font
    var cm = new Array();
    cm.push(new ClusterMarker('small', 'jobmap/images/cluster_small-de2.png', 0, 0, 0, 0, '#333333', 11));
    cm.push(new ClusterMarker('medium', 'jobmap/images/cluster_medium-de2.png', 0, 0, 0, 0, '#333333', 13));
    cm.push(new ClusterMarker('large', 'jobmap/images/cluster_large-de2.png', 0, 0, 0, 0, '#333333', 15));
    var cms = new ClusterMarkers(cm);

    //pretty footer
    var f = new Footer(80, 'Mohawk Industries', '#ffffff', 5, '#CCCCCC', 'https://dn9tckvz2rpxv.cloudfront.net/mohawk/img/logo2.png', '', -20, 20, 400, 200, '#3b3835');

    //go with the default legend, not going to show anyway, as the two company job markers are the same         

    //lovely white styling
    var s = new Style([{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": -30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "hue": "white" }, { "lightness": -30 }, { "saturation": -30 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#B3CEFF" }, { "lightness": 20 }, { "saturation": 0 }] }]);

    //no need for a mode, default clusters

    //center of the us
    var c = new Center(39.5, -98.35, false, true);

    //setting because i want the cookie to retain
    var z = new ZoomLevels(3, 10, 19, 1, false);

    //CircleDraw i don't care at this point, let it default


    var d = new DestinationParameters('//mohawkindustries.jobs/jobs/', '', '', '_self', '');
    
    //https://mohawkindustries.jobs/jobs/feed/rss <--also works xml?  -- can delete on,'','_self'

    //create the map wrapper
    mapw = new MapWrapper(ga, jms, cms, z, d, c, f, s);

    //don't include the buid in the return search
    mapw.SetIgnoreJobGroupOnReturn();

    //cookie and url
    mapw.AlterProperties();
    mapw.UseFriendlyLocations=true;

    //----getting data and drawing the map           
    mapw.RetrieveJobData();
    mapw.SetDivClass('jobMapDiv');
    mapw.SetEnvironment('https://d12wqovxet6953.cloudfront.net/');
    //http://d12wqovxet6953.cloudfront.net/
    mapw.DrawMap('jobMapDiv');            
    mapw.Map.setZoomToAllJobsTooltip("Zoom to all jobs");

}