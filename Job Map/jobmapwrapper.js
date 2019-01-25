//TODO functionality
//friendlyaddress

//TODO bugs
//prevent name mapping from killing facets
//toughen up regexes to handle spaces on either side of the colon, and quotes or not on the value

function FriendlyLocation(lat, lng, lo, ti) {
    this.ObjectName = 'friendlylocation';
    this.Lat = lat;
    this.Lng = lng;
    this.Location = lo;
    this.Titles = ti || [];    
}
function FriendlyLocations() {
    this.ObjectName = 'friendlylocations';    
}
FriendlyLocations.prototype.Add = function (k,fl) {
    this[k] = fl;    
}
function JobMarker(cid, cn, iu, ap) {
	this.ObjectName = 'jobmarker';	
	this.CompanyId = cid || 1;
	this.CompanyName = cn || '';	
	this.IconUrl = iu || 'jobmap/images/defaultcomp.png';	 
	this.AnchorPoint = ap || null;	
}
function JobMarkers(jms){
	this.ObjectName = 'jobmarkers';	
	if(typeof jms == 'string'){
		var o = JSON.parse(jms);
		this.Markers = [];
		for(var i=0;i<o.length;i++){
		    this.Markers.push(new JobMarker(o[i].companyID, o[i].companyName, o[i].iconUrl, o[i].anchorPoint));
		}
		if(this.Markers.length==0){
			this.Markers.push(JobMarker());			
		}
	}
	else{		
	    this.Markers = jms || new Array(new JobMarker());	    
	}	
}
JobMarkers.prototype.GetOptionsString = function(o){ 
	var p = new Object();
	var a = new Array();
	for(var i = 0;i<this.Markers.length;i++){
		var q = new Object();		
		q["companyID"] = this.Markers[i].CompanyId;	
		q["companyName"] = this.Markers[i].CompanyName;	
		q["iconUrl"] = this.Markers[i].IconUrl;		
		q["anchorPoint"] = this.Markers[i].AnchorPoint;	
		a.push(q);
	}
	o["jobMarkers"] = a;	
}
function ClusterMarker(size,iu,h,w,apx,apy,tc,ts){
	this.ObjectName = 'clustermarker';
	this.Size = size || 'small';
	switch(this.Size){
		case 'small':
		    this.IconUrl = iu || 'jobmap/images/cluster_small.png';
			this.Height = h || 50;
			this.Width = w || 50;
			this.AnchorPointX = apx || 0;
			this.AnchorPointY = apy || 0;
			this.TextColor = tc || '#000000';
			this.TextSize = ts || 11;
			break;
		case 'medium':
			this.IconUrl = iu || 'jobmap/images/cluster_medium.png';
			this.Height = h || 60;
			this.Width = w || 60;
			this.AnchorPointX = apx || 0;
			this.AnchorPointY = apy || 0;
			this.TextColor = tc || '#FF0000';
			this.TextSize = ts || 13;
			break;
		case 'large':
		    this.IconUrl = iu || 'jobmap/images/cluster_large.png';
			this.Height = h || 70;
			this.Width = w || 70;
			this.AnchorPointX = apx || 0;
			this.AnchorPointY = apy || 0;
			this.TextColor = tc || '#0000FF';
			this.TextSize = ts || 15;
			break;
	}	
}
function ClusterMarkers(cms){
	this.ObjectName = 'clustermarkers';
	this.Small = new ClusterMarker('small');
	this.Medium = new ClusterMarker('medium');
	this.Large = new ClusterMarker('large');
	if(cms){
		for(var i=0;i<cms.length;i++){
			switch(cms[i].Size){
				case 'small':
					this.Small = cms[i];
					break;
				case 'medium':
					this.Medium = cms[i];
					break;
				case 'large':
					this.Large = cms[i];
					break;
			}
		}
	}
}
ClusterMarkers.prototype.GetOptionsString = function(o){ 
	var p = new Object();
	var a = new Array();	
			
	var q = new Object();
	q["iconUrl"] = this.Small.IconUrl;	
	q["height"] = this.Small.Height;	
	q["width"] = this.Small.Width;	
	var r = new Object();
	r["x"] = this.Small.AnchorPointX;	
	r["y"] = this.Small.AnchorPointY;
	q["anchorPoint"] = r;	
	q["textColor"] = this.Small.TextColor;	
	q["textSize"] = this.Small.TextSize;
	a.push(q);
	
	var q = new Object();
	q["iconUrl"] = this.Medium.IconUrl;	
	q["height"] = this.Medium.Height;	
	q["width"] = this.Medium.Width;	
	var r = new Object();
	r["x"] = this.Medium.AnchorPointX;	
	r["y"] = this.Medium.AnchorPointY;
	q["anchorPoint"] = r;	
	q["textColor"] = this.Medium.TextColor;	
	q["textSize"] = this.Medium.TextSize;
	a.push(q);
	
	var q = new Object();
	q["iconUrl"] = this.Large.IconUrl;	
	q["height"] = this.Large.Height;	
	q["width"] = this.Large.Width;	
	var r = new Object();
	r["x"] = this.Large.AnchorPointX;	
	r["y"] = this.Large.AnchorPointY;
	q["anchorPoint"] = r;	
	q["textColor"] = this.Large.TextColor;	
	q["textSize"] = this.Large.TextSize;
	a.push(q);
	
	o["clusterMarkers"] = a;	
}
function Footer(h,cn,fc,tbh,tbc,liu,riu,rix,riy,tlm,trm,tc){
	this.ObjectName = 'footer';	
	//needs defaults
	
	this.Height = h || 80;
	this.CompanyName = cn || '';
	this.FillColor = fc || '#FFFFFF';
	this.TopBorderHeight = tbh || 5;
	this.TopBorderColor = tbc || '#CCCCCC';
	this.LeftImageUrl = liu || '';	
	this.RightImageUrl = riu || '';	
	this.RightImageX = rix || -20;
	this.RightImageY = riy || 20;
	this.TextLeftMargin = tlm || 160;
	this.TextRightMargin = trm || 200;
	this.TextColor = tc || '#EFEFEF';
}
Footer.prototype.GetOptionsString = function(o){  
	var p = new Object();
	var q = new Object();
	p["height"] = this.Height;	
	p["fillColor"] = this.FillColor;	
	p["topBorderHeight"] = this.TopBorderHeight;	
	p["topBorderColor"] = this.TopBorderColor;	
	p["leftImageUrl"] = this.LeftImageUrl;	
	p["rightImageUrl"] = this.RightImageUrl;	
	q["x"] = this.RightImageX;
	q["y"] = this.RightImageY;
	p["rightImagePos"] = q;	
	p["textLeftMargin"] = this.TextLeftMargin;	
	p["textRightMargin"] = this.TextRightMargin;	
	p["textColor"] = this.TextColor;		
	p["companyName"] = this.CompanyName;	
	o["footer"] = p;	
}
function Legend(hc,htc,fc,tc){
	this.ObjectName = 'legend';	
	this.HeaderColor = hc || '#444444';
	this.HeaderTextColor = htc || '#EFEFEF';
	this.FillColor = fc || '#FFFFFF';
	this.TextColor = tc || '#000000';
}
Legend.prototype.GetOptionsString = function(o){ 	
	var p = new Object();
	p["headerColor"] = this.HeaderColor;	
	p["headerTextColor"] = this.HeaderTextColor;	
	p["fillColor"] = this.FillColor;	
	p["textColor"] = this.TextColor;	
	o["legend"] = p;		
}
function Style(s,c){
	this.ObjectName = 'style';
	this.Json = s || '';
	this.DivClass = c || 'mapFullScreen';
}
Style.prototype.GetOptionsString = function(o){ 	
    o["mapStyles"] = this.Json;   
}; 
function Mode(c){	
    this.ObjectName = 'mode';
    if (!c) {
        c = false;
    }
	this.Clustering = c;
}
function CircleDraw(v,bc,pc,pw,o){
	this.ObjectName = 'circledraw';
	this.Visible = v || false;
	this.BrushColor = bc || '#FFFF00';
	this.PenColor = pc || '#000000';
	this.PenWidth = pw || 3;
	this.Opacity = o || 0.6;	
}
CircleDraw.prototype.GetOptionsString = function(o){ 	
	var p = new Object();
	p["visible"] = this.Visible;	
	p["brushColor"] = this.BrushColor;	
	p["penColor"] = this.PenColor;	
	p["penWidth"] = this.PenWidth;
	p["opacity"] = this.Opacity;		
	o["circleDrawTool"] = p;		
}
function Center(lat,lng,geol,ret){
	this.ObjectName = 'center';	
	this.Lat = lat || 39.1;
	this.Lng = lng || -77.045379;
	this.GeoLocation = geol || false;
	this.Retain = ret || false;
}
Center.prototype.GetOptionsString = function(o){ 	
	var p = new Object();
	p["lat"] = Number(this.Lat);	
	p["lng"] = Number(this.Lng);		
	o["center"] = p;
	o["geolocation"] = this.GeoLocation;	
}
Center.prototype.SetToCookie = function(){  	
	if(this.Retain){
		docCookies.setItem('JobMapCenter','Lat='+escape(this.Lat) + '&Lng=' + escape(this.Lng), Infinity, '/');
	}
};  
Center.prototype.GetFromCookie = function(){  
	var c=docCookies.getItem('JobMapCenter'); 
	if(c && this.Retain){
		var qp = GetQsParams(c);
		if("Lat" in qp && !isNaN(qp["Lat"][0])){
		    this.Lat = Number(qp["Lat"][0]);
		}
		if ("Lng" in qp && !isNaN(qp["Lng"][0])) {
		    this.Lng = Number(qp["Lng"][0]);
		}
	}
};  
function ZoomLevels(zl,cxzl,xzl,nzl,ret){
	this.ObjectName = 'zoomlevels';	
	this.ZoomLevel = zl || 3;
	this.ClusterMaxZoomLevel = cxzl || 10;
	this.MaxZoomLevel = xzl || 19;
	this.MinZoomLevel = nzl || 1;
	this.Retain = ret || false;
}
ZoomLevels.prototype.GetOptionsString = function(o){ 
	o["zoomLevel"] = Number(this.ZoomLevel);	
	o["clusterMaxZoomLevel"] = Number(this.ClusterMaxZoomLevel);	
	o["minZoomLevel"] = Number(this.MinZoomLevel);	
	o["maxZoomLevel"] = Number(this.MaxZoomLevel);		
}
ZoomLevels.prototype.SetToCookie = function(){  	
    if(this.Retain && !isNaN(this.ZoomLevel)){
		docCookies.setItem('JobMapZoomLevel',Number(this.ZoomLevel), Infinity, '/');
	}
}; 
ZoomLevels.prototype.GetFromCookie = function(){  
	var c=docCookies.getItem('JobMapZoomLevel'); 
	if (c && !isNaN(c) && this.Retain) {	    
		this.ZoomLevel = Number(c);		
	}
};  
function GoogleInfo(key,ga,s,m,c){
	this.ObjectName = 'googleinfo';	
	this.Key = key;	
	this.GA = ga || null;
	this.Source = s || null;
	this.Medium = m || null;
	this.Campaign = c || null;
}
GoogleInfo.prototype.GetOptionsString = function(o){ 	
	o["googleMapsApiKey"] = this.Key;	
}; 
GoogleInfo.prototype.GetCampaignParameters = function(){    
    return (this.Source != null ? '&utm_source=' + escape(this.Source) : '') + (this.Medium != null ? '&utm_medium=' + escape(this.Medium) : '') + (this.Campaign != null ? '&utm_campaign=' + escape(this.Campaign) : '');
}; 

//sort out ajax and return url
function DestinationParameters(u, q, l, n, s) {
    this.ObjectName = 'destinationparameters';
    this.Url = u || location.href;    
	this.Q = q || '';
	this.Location = l || '';	
	//string of names to be tried in order, new window is named _jobmapchild
	//values are window.open values, plus others
	//_blank,_parent,_self,_top,_jobmapchild,_opener
	this.Name =  n || '_top';
	this.Specs = s || null;    

	this.ReturnUrl = this.Url;
	this.ReturnQ = '';
	this.ReturnLocation = '';
	this.ChildName = '_jobmapchild';
	this.FriendlyLocations = new FriendlyLocations();
    this.LocationAlias = ''
}
DestinationParameters.prototype.OpenWindow = function(utm){  
	var url = this.GetReturnUrl()+utm;
	var childName = this.ChildName;
	var specs = this.Specs;
	
	var names = this.Name.split(',');
	var name = '';
	var found = false;
	for(var i=0;i<names.length;i++){
		switch(names[i]){			
			case '_blank':	
			    var w = window.open(url, names[i], specs);
				w.focus();
				found = true;
				break;GetReturnUrl
			case '_top':
			case '_self':
				window.open(url,names[i]);
				found = true;
				break;
			case '_parent':
				if(window.parent){
					window.open(url,names[i]);
					found = true;
				}
				break;			
			case '_jobmapchild':
				var w = window.open(url,childName,specs);
				w.focus();
				break;
			case '_opener':	
				var w = window.opener;
				if(w){
					w.location = url;
					w.focus();
					found = true;
				}
				break;				
		}
		if(found){
			break;
		}
	}
	if (!found) {
	    window.open(url, '_top');
	}
}
DestinationParameters.prototype.GetReturnUrl = function () {
    this.ReturnUrl = this.Url;
    if (this.ReturnLocation.length > 0) {
        return this.StripLocationFacet(this.ReturnUrl) + '?' + 'q=' + escape(this.ReturnQ) + '&location=' + escape(this.ReturnLocation);
    }
    else {
        return this.ReturnUrl + '?' + 'q=' + escape(this.ReturnQ);
    }
}
DestinationParameters.prototype.StripLocationFacet = function () {
    if (this.ReturnLocation.length > 0) {
        var url = this.ReturnUrl;
        var indicator = '/jobs/';
        var firstSlash = url.indexOf('/',10);
        var jobsIndicator = url.indexOf(indicator);
        var lastSlash = 0;
        if(jobsIndicator>-1 && firstSlash>-1){
            //url contains slashes, and jobs indicator
            if(firstSlash != jobsIndicator){
                //there's something in between .jobs and the jobs indicator
                var stringStart = firstSlash + 1;                
                var midString = url.substring(stringStart, jobsIndicator);                
                var indicators = ['careers','jobs-in','new-jobs'];
                var paths = midString.split('/');
                for (var i = paths.length - 1; i >= 0; i--) {                    
                    if(indicators.indexOf(paths[i])==-1){
                        paths.splice(i,1);
                    }
                    else{
                        break;
                    }
                }
                if(paths.length==0){
                    //stripped everything, was only location, keep /jobs/
                    url = this.GetRootUrl() + indicator;
                }
                else{
                    url = this.GetRootUrl() + '/' + paths.join('/') + url.substring(jobsIndicator+5);
                }             
            }
        }      
    }    
    return url;
}


//deal with how destinationparameters gets set, whether it's passed in or gather from the page
DestinationParameters.prototype.GetQueryFromPage = function(){  
    if (document.getElementById('q')) {
        var q, g, b, a;
        q = document.getElementById('q').value;

        g = q.indexOf('GeoLocation');
        if (g > -1) {
            //contains geolocation
            a = q.indexOf(' && ');
            if(g==0){
                if(a==-1){
                    //geolocation alone
                    q = '';
                }
                else{
                    //geolocation first
                    q = q.substring(q.indexOf(') && ')+5);
                }
            }
            else{
                //geolocation not first
                q = q.substring(0,q.indexOf(' && GeoLocation')) + q.substring(q.indexOf(')',g) + 1);
            }
            
            
        }

        b = q.indexOf('(buid:');
        if (b > -1) {
            //contains buid
            a = q.indexOf(' && ');
            if(b==0){
                if(a==-1){
                    //buid alone
                    q = '';
                }
                else{
                    //buid first
                    q = q.substring(q.indexOf(') && ')+5);
                }
            }
            else{
                //buid not first
                q = q.substring(0,q.indexOf(' && (buid:')) + q.substring(q.indexOf(')',b) + 1);
            }       
        }
		this.Q = q;
	}	
}
DestinationParameters.prototype.GetRootUrl = function () {
    var slash = this.Url.indexOf('/', 10);
    if (slash == -1) {
        slash = this.Url.length - 1;
    }    
    return this.Url.substring(0, slash);
}
DestinationParameters.prototype.GetPath = function(){  
	return this.Url.indexOf('?')>-1?this.Url.substring(this.Url.indexOf('/',10),this.Url.indexOf('?')):this.Url.substring(this.Url.indexOf('/',10));
}
DestinationParameters.prototype.GetLocationFromPage = function(){  	
	if(document.getElementById('location')){
	    this.Location = document.getElementById('location').value;
	}
	return '';
}
DestinationParameters.prototype.GetJobCountUrl = function(){  	
	var url = this.GetRootUrl() + '/ajax/geolocation/';
	var p = this.GetPath();
	var q = this.Q;
	var l = this.Location;
	if(p=='/'){
		p = '';
	}
	url += q.length + l.length + p.length > 0 ? '?' : '';
	if(p.length>0){
		url += 'filter_path=' + escape(p);
	}
	if (q.length > 0) {
	    url += p.length > 0 ? '&' : '';
		url += 'q=' + escape(q);
	}
	if (l.length > 0) {
	    url += (p.length+q.length) > 0 ? '&' : '';
		url += 'location=' + escape(l);
	}
	return url;
}
DestinationParameters.prototype.GetJobLocationTitleListUrl = function(){  	
    var url = this.GetRootUrl() + this.GetPath() + 'feed/json';
    var q = this.ReturnQ;
    var l = this.ReturnLocation;
  
    url += q.length + l.length > 0 ? '?' : '';   
    if (q.length > 0) {
        url += 'q=' + escape(q);
    }
    if (l.length > 0) {
        url += q.length > 0 ? '&' : '';
        url += 'location=' + escape(l);
    }
    return url;
}
function MapWrapper(){
	var arg;
	this.ObjectName = 'map';		
	this.DestinationParameters = null;
	this.JobData = '';
	this.Condensed = false;
	this.JobGroupMapping = null;
	this.Map = null;
	this.SingleEntity = false;
	this.IgnoreJobGroupOnReturn = false;
	this.UseFriendlyLocations = false;
	this.JobDataReady = false;
	this.RootUrl = '';
	this.AnalyticsEnvironment = '';
	
	for(var i=0;i<arguments.length;i++){
		arg = arguments[i];
		switch(typeof arg){				
			case 'object':
				switch(arg.ObjectName){
					case 'googleinfo':
						this.GoogleInfo = arg;
						break;
					case 'zoomlevels':
						this.ZoomLevels = arg;
						break;
					case 'center':
						this.Center = arg;
						break;
					case 'circledraw':
						this.CircleDraw = arg;
						break;
					case 'style':
						this.Style = arg;
						break;
					case 'mode':
						this.Mode = arg;
						break;
					case 'legend':
						this.Legend = arg;
						break;
					case 'footer':
						this.Footer = arg;
						break;
					case 'clustermarkers':
						this.ClusterMarkers = arg;
						break;
					case 'jobmarkers':
						this.JobMarkers = arg;
						break;
				    case 'destinationparameters':				        
						this.DestinationParameters = arg;
						break;
					default:
					
						break;					
				}
				break;			
			default:
				//null or undefined
				break;
		}
	}
	this.DefaultMissingSettings();
	
}
MapWrapper.prototype.DefaultMissingSettings = function(){ 
	
	if(!this.ZoomLevels){
		this.ZoomLevels = new ZoomLevels();
	}
	if(!this.Mode){
	    this.Mode = new Mode(true);	    
	}
	if(!this.Center){
		this.Center = new Center();
	}
	if(!this.CircleDraw){
		this.CircleDraw = new CircleDraw();
	}
	if(!this.Style){
		this.Style = new Style();
	}
	if(!this.Legend){
		this.Legend = new Legend();
	}
	if(!this.Footer){
		this.Footer = new Footer();
	}
	if(!this.ClusterMarkers){
		this.ClusterMarkers = new ClusterMarkers();
	}
	if(!this.JobMarkers){
		this.JobMarkers = new JobMarkers();
	}	
	
	this.SetMarkerScope();
}; 
MapWrapper.prototype.IsReadyToDraw = function(en){  
	if(!this.GoogleInfo){		
		window.console&&console.log('Google Info is missing, cannot launch map');
		return false;
	}	
	if(!document.getElementById(en)){
		window.console&&console.log('No div with the name of ' + en + ' was found');
		return false;
	}
	
	this.SetMarkerScope();
	return true;
}; 
MapWrapper.prototype.SetMarkerScope = function () {    
	if(this.JobMarkers.Markers.length==1){
		this.SingleEntity = true;
	}	
};
//set this if the microsite already fileters on BU correctly
MapWrapper.prototype.SetIgnoreJobGroupOnReturn = function(){  
	this.IgnoreJobGroupOnReturn = true;  	
}; 
//deal with how destinationparameters gets set, whether it's passed in or gather from the page
MapWrapper.prototype.SetDestinationParameters = function(dp){  
	this.DestinationParameters = dp;  	
};
MapWrapper.prototype.SetMappingData = function (ma) {    
    if (typeof ma == 'string') {
        this.JobGroupMapping = JSON.parse(ma);
    } else {
        this.JobGroupMapping = ma;
    }    
};  
MapWrapper.prototype.SetDivClass = function (en) {    
    if(document.getElementById(en)){
        document.getElementById(en).className = this.Style.DivClass;
    }	
};
MapWrapper.prototype.SetEnvironment = function (ru) {
    this.RootUrl = ru || '';
    var u;
    if (this.RootUrl.length > 0) {
        for (var i = 0; i < this.JobMarkers.Markers.length; i++) {
            u = this.JobMarkers.Markers[i].IconUrl;
            if (isRelativeUrl(u)) {
                this.JobMarkers.Markers[i].IconUrl = ru + u;
            }
        }
        u = this.ClusterMarkers.Small.IconUrl;
        if (isRelativeUrl(u)) {
            this.ClusterMarkers.Small.IconUrl = ru + u;
        }
        u = this.ClusterMarkers.Medium.IconUrl;
        if (isRelativeUrl(u)) {
            this.ClusterMarkers.Medium.IconUrl = ru + u;
        }
        u = this.ClusterMarkers.Large.IconUrl;
        if (isRelativeUrl(u)) {
            this.ClusterMarkers.Large.IconUrl = ru + u;
        }
    }
};
MapWrapper.prototype.SetGAEnvironment = function (ae) {
    this.AnalyticsEnvironment = ae || '';   
};
MapWrapper.prototype.RetrieveJobData = function(){
    //call ajax here
    if (this.DestinationParameters) {
        var _this = this;
        this.JobDataReady = false;
        this.Condensed = false;
        var dataType = '';
        if (window.attachEvent && !window.addEventListener) {
            dataType = 'jsonp';
        }
        //alert(contentType);
        $.ajax({
            url: this.DestinationParameters.GetJobCountUrl(),            
            dataType: dataType,
            success: function (data) {
                if (window.attachEvent && !window.addEventListener) {
                    data = JSON.stringify(data);
                }                             
                _this.SetJobData(data);
            },
            error: function (xhr, status, error) {                
                alert('error');
            }
        });
    }
    else {
        window.console && console.log('No Destination parameters provided...');
    }
}
MapWrapper.prototype.RetrieveJobLocationData = function (lat,lng,cid,t,a) {
    //call ajax here
    
    if (this.DestinationParameters) {
        var _this = this;
        //alert(_this.DestinationParameters.GetJobLocationTitleListUrl());
        var show = true;
        if (window.attachEvent && !window.addEventListener) {
            show = false;
        }
        if (show) {
            $.ajax({
                url: _this.DestinationParameters.GetJobLocationTitleListUrl(),                
                success: function (data) {                   
                    var lo = '';
                    var fl = _this.UseFriendlyLocations;
                    var kg = true;
                    var fi = true;
                    var ti = new Array();
                    var geo = _this.GetGeoLocationString(lat, lng);
                    //compile a list of job titles

                    if (fl && _this.DestinationParameters.FriendlyLocations[geo] && _this.DestinationParameters.FriendlyLocations[geo].Location.length > 0) {
                        //test this!
                        fl = false;
                    }
                    if (t && _this.DestinationParameters.FriendlyLocations[geo] && _this.DestinationParameters.FriendlyLocations[geo].Titles.length > 0) {
                        //test this!
                        t = false;
                    }
                    if (fl || t) {
                        for (var i in data) {
                            if (t) {
                                if (data[i].title.length > 0) {
                                    ti.push(data[i].title);
                                }
                            }
                            if (fl) {
                                if (kg) {
                                    if (fi) {
                                        lo = data[i].location;                                        
                                    }
                                    else {
                                        if (lo != data[i].location) {
                                            kg = false;
                                        }
                                    }
                                }
                                fi = false;
                            }
                        }
                        if (!kg) {
                            lo = '';                            
                        }
                    }
                    if (!_this.DestinationParameters.FriendlyLocations[geo]) {
                        _this.DestinationParameters.FriendlyLocations.Add(geo, new FriendlyLocation(lat, lng, lo, ti));
                    }
                    else {
                        if (ti.length > 0 && _this.DestinationParameters.FriendlyLocations[geo].Titles.length == 0) {
                            _this.DestinationParameters.FriendlyLocations[geo].Titles = ti;
                        }
                        if (lo.length > 0 && _this.DestinationParameters.FriendlyLocations[geo].Location.length == 0) {
                            _this.DestinationParameters.FriendlyLocations[geo].Location = lo;                            
                        }
                    }
                    if (t && _this.DestinationParameters.FriendlyLocations[geo].Titles.length > 0) {
                        //trigger map to shiw titles                       
                        _this.PopulateInfoWindow(lat, lng);
                    }
                    if (!ti) {
                        _this.ProcessReturnValues(lat, lng, cid);
                        _this.DestinationParameters.OpenWindow(_this.GoogleInfo.GetCampaignParameters());
                    }
                }
            });
        }
    }
    else {
        window.console && console.log('No Destination parameers provided...');
    }
}

MapWrapper.prototype.FilterMissingLatLons = function () {
    var jdo = JSON.parse(this.JobData);
    var test = [];
    var lt, ln;
    for (var i = jdo.length - 1; i >= 0; i--) {
        lt = jdo[i].lat;
        ln = jdo[i].lng;
        if (isNaN(lt) || isNaN(ln)) {            
            jdo.splice(i, 1);
        }        
    }
    this.JobData = JSON.stringify(jdo);    
}
MapWrapper.prototype.SetJobData = function(jd){  
	var aggregate = false;
	this.JobData = jd;	
	this.AdjustNames();	
	this.FilterMissingLatLons();
	var check = this.JobData;

	
	if (this.SingleEntity || this.JobGroupMapping) {	    
		if(this.SingleEntity){
			this.CreateMappingForSingleEntity(this.JobMarkers.Markers[0].CompanyId);			
		}
		this.CondenseJobGroups();
		//window.console && console.log(this.JobData);
		if(check != this.JobData){
			this.Condensed = true;
		}		
	}
	if(this.Condensed){
		this.CondenseJobCounts();
	}	
	this.JobDataReady = true;	
	this.LoadJobData(0);	
}; 
MapWrapper.prototype.CreateMappingForSingleEntity = function (cid) {
    
	var ret='';
	var retCheck=[];
	var jdo = JSON.parse(this.JobData);
	for(var i=0;i<jdo.length;i++){
		if(retCheck.indexOf(jdo[i].cid)==-1){
		    retCheck.push(jdo[i].cid);
		    if (ret.length > 0) {
		        ret += ',';
		    }
		    ret += '"' + jdo[i].cid + '":' + cid;		    
		}
	}
	ret = '{' + ret + '}';	
	this.SetMappingData(ret);
}
MapWrapper.prototype.CondenseJobCounts = function(){ 
	var jdo = JSON.parse(this.JobData);	
	var test = [];
	var s = '';
	var t = '';
	for(var i = jdo.length-1;i>=0;i--){
		s = jdo[i].cid + '-' + jdo[i].lat + '-' + jdo[i].lng;
		if(test.indexOf(s)>-1){
			for(var j = jdo.length-1;j>=0;j--){
				t = jdo[j].cid + '-' + jdo[j].lat + '-' + jdo[j].lng;
				if (s == t) {				    
				    jdo[j].count = jdo[j].count + jdo[i].count;				    
					jdo.splice(i,1);
					break;
				}
			}
		}
	}	
	this.JobData = JSON.stringify(jdo);
}; 
MapWrapper.prototype.CondenseJobGroups = function(){ 
	var s = '';
	var ma = this.JobGroupMapping;
	
	for (var m in ma) {	    
		var t = m;
		if(isNaN(t)){
			t = '"' + t + '"';
		}
		s = '"cid": "' + t + '",';
		v = '"cid": "' + ma[m] + '",';	

		var re = new RegExp(s,"g");
		this.JobData = this.JobData.replace(re,v);
	}		
}; 
MapWrapper.prototype.AdjustNames = function(){ 
	var i = 0;
	var s = ["cid", "count", "lat", "lng"];
	var jdo = JSON.parse(this.JobData);
	var jdi = jdo[0];
	for (var jdn in jdi) {
	    sn = s[i];	
		if (sn != jdn) {
			var re = new RegExp(jdn,"g");
			this.JobData = this.JobData.replace(re, sn);
		}
		i++;
	}	
}; 
MapWrapper.prototype.DrawMap = function(en){ 	
    if (this.IsReadyToDraw(en)) {
        var _this = this;
        //this may conflict with page tracking on a hosted page, if it's not on it's own page, should be checked the first time it's implemented        
        if (_this.GoogleInfo.GA != null && (typeof ga != 'undefined')) {
            ga('create', _this.GoogleInfo.GA, 'auto', { 'name': 'mapTracker' }); 
            _this.MapManipulation();
        }
        
        //track map clicks here
        _this.MapManipulation('/G/jobs-map-draw');

        var _url = this.RootUrl;       
        this.Map = new jobMap.Map(en,_url, this.GetOptions());
	    this.Map.setAutomaticClustering(this.Mode.Clustering)
	    this.Map.extentChangedEventHandler = function (extent, zoomLevel) {	        
	        _this.ZoomLevels.ZoomLevel = zoomLevel;
	        _this.ZoomLevels.SetToCookie();
	        _this.MapManipulation('/G/jobs-map-zoom');
	    }	    
	    this.Map.jobLocationClickedEventHandler = function (jobLocation) {
	        _this.Center.Lat = jobLocation['lat'];
	        _this.Center.Lng = jobLocation['lng'];
	        _this.Center.SetToCookie();
	        //do the work
	        var returnCid = jobLocation['cid'];
	        //alert(returnCid);
	        
	        var opened = false;
	        if (_this.UseFriendlyLocations) {
	            if (!_this.DestinationParameters.FriendlyLocations[_this.GetGeoLocationString(_this.Center.Lat, _this.Center.Lng)]) {
	                _this.ProcessReturnValues(_this.Center.Lat, _this.Center.Lng, returnCid);
	                _this.RetrieveJobLocationData(_this.Center.Lat, _this.Center.Lng, returnCid,false);
	                opened = true;
	                window.console & console.log('getting data' + _this.Center.Lat);
	            }
	        }
	        window.console & console.log('clicked' + _this.Center.Lat);
	        if (!opened) {
	            _this.ProcessReturnValues(_this.Center.Lat, _this.Center.Lng, returnCid);
	            _this.DestinationParameters.OpenWindow(_this.GoogleInfo.GetCampaignParameters());
	        }
	        _this.MapManipulation('/G/jobs-map-search');
             
	        //_this.DestinationParameters.OpenWindow(_this.DestinationParameters.GetReturnUrl());
	    }
	    this.Map.jobLocationHoveredEventHandler = function (jobLocation) {
	        _this.Center.Lat = jobLocation['lat'];
	        _this.Center.Lng = jobLocation['lng'];
	        var returnCid = jobLocation['cid'];
	        window.console && console.log('hover' + _this.Center.Lat);	                
	        if (!_this.DestinationParameters.FriendlyLocations[_this.GetGeoLocationString(_this.Center.Lat, _this.Center.Lng)]) {
	            _this.ProcessReturnValues(_this.Center.Lat, _this.Center.Lng, returnCid);
	            _this.RetrieveJobLocationData(_this.Center.Lat, _this.Center.Lng, returnCid, true);
	        }
	        else {
	            _this.PopulateInfoWindow(_this.Center.Lat, _this.Center.Lng);
	        }
	    }
	    this.Map.circleDrawnEventHandler = function (center, radius) {
	        //nothing for now
	        _this.MapManipulation('/G/jobs-map-circle');
	    }
	}
}
MapWrapper.prototype.PopulateInfoWindow = function (lat,lng) {
    var geo = this.GetGeoLocationString(lat, lng);    
    var fLoc = '';
    if (this.DestinationParameters.FriendlyLocations[geo]) {
        if (this.DestinationParameters.FriendlyLocations[geo].Location.length > 0) {
            fLoc = this.DestinationParameters.FriendlyLocations[geo].Location + " : ";
        }
        var s = this.DestinationParameters.FriendlyLocations[geo].Titles.length + ' job' + (this.DestinationParameters.FriendlyLocations[geo].Titles.length > 1 ? 's' : '');        
        var ts = DedupeArray(this.DestinationParameters.FriendlyLocations[geo].Titles, '[v] ([n])');
        var t = '';
        for (var i = 0; i < ts.length; i++) {
            t += '<div>' + ts[i] + '</div>';
        }
        this.Map.addToInfoWindow("<div class='infowin'><strong>" + fLoc + "</strong><strong>" + s + "</strong><hr>" + t);
    }    
}

MapWrapper.prototype.MapManipulation = function (url) {
    if (typeof ga != 'undefined') {
        if (url && url.length>0) {
            if (url.indexOf('//') == -1 && this.AnalyticsEnvironment.length > 0) {
                if (url.substring(0, 1) == '/' && this.AnalyticsEnvironment.substring(this.AnalyticsEnvironment.length - 1) == '/') {
                    url = url.substring(1);
                }
                url = this.AnalyticsEnvironment + url;
            }
        }
        else {
            if (this.AnalyticsEnvironment.length > 0) {
                url = this.AnalyticsEnvironment;
            }
            else {
                url = this.DestinationParameters.Url;
            }
        }        
        if (url) {
            ga('mapTracker.send', 'pageview', url);
        }
        else {
            ga('mapTracker.send', 'pageview');
        }
    }
}

MapWrapper.prototype.LoadJobData = function (attempts) {  
    if (this.Map != null && this.JobDataReady) {

        this.Map.setJobData(this.JobData);
	}
	else{
		if(attempts<30){
			attempts++;
			_this = this;					
			window.setTimeout(function() { _this.LoadJobData;}, 100, attempts);
			window.console&&console.log('Delayed Job Data loading as map was not yet drawn');
		}
		else{
			window.console&&console.log('Ceased trying to load Job Data as map was not yet drawn in 3 seconds');
		}
	}	
}
MapWrapper.prototype.GetGeoLocationString = function(lat,lng){
    return 'GeoLocation:("' + lat + ',' + lng + '")';
}
MapWrapper.prototype.ProcessReturnValues = function(lat,lng,cid){ 
	var cids = new Array();
	var qps = '';
	var path = '';
	var isBuid = true;	
	if(!this.IgnoreJobGroupOnReturn){
	    //Job Group is relevant on return	    
		if(this.Condensed){	
		    //we did some sort of reduction		    
		    cids = this.InflateJobGroups(cid);		    
		}
		else{
			cids.push(cid);
		}
		for(var i=0;i<cids.length;i++){
			if(isNaN(cids[i])){
				isBuid = false;
				break;
			}
		}		
		if(isBuid){
		    //chose to string BUIDs together and AND the whole with the latlon, may have to redo with each buid having it's latlon taged on
		    for(var i=0;i<cids.length;i++){
				qps += 'buid:' + cids[i];
				if(i<cids.length-1){
					qps += ' || '
				}
			}
			qps = '(' + qps + ')';
		}
		else{
			if(cids.length==1){
				//has a path, since there's no way to retrieve this yet from solr, tackle another time
			}
			else{
				//deal with this later, once we see what comes down the pike, a single path works, what about multiple?
				//this is where returnurl might change
			}
		}
	}
	else{
		//no need to include job group in query				
	}
	
	var friendlyLocation = '';
	var geoLocation = this.GetGeoLocationString(lat, lng);
	if (this.UseFriendlyLocations && !this.Condensed && this.DestinationParameters.FriendlyLocations[geoLocation] && this.DestinationParameters.FriendlyLocations[geoLocation].Location.length>0) {
	    friendlyLocation = this.DestinationParameters.FriendlyLocations[geoLocation].Location;
	    window.console & console.log(friendlyLocation);
	}	
	var ql = this.DestinationParameters.Q.length;
	var qpl = qps.length;
	var fl = friendlyLocation.length;
	var gl = geoLocation.length;
	var qr = 0;
	
	if (fl > 0) {
	    this.DestinationParameters.ReturnLocation = friendlyLocation;
	    gl = 0;	    
	}
	else {
	    this.DestinationParameters.ReturnLocation = '';
	}
		
	if (ql > 0) {
	    this.DestinationParameters.ReturnQ = '(' + this.DestinationParameters.Q + ')';
	}
	else {
	    this.DestinationParameters.ReturnQ = '';
	}
	qr = this.DestinationParameters.ReturnQ.length;
	
	if(qpl>0){
		if(qr>0){
			this.DestinationParameters.ReturnQ += ' && ' + qps;
		}
		else{
			this.DestinationParameters.ReturnQ = qps;
		}
	}
	qr = this.DestinationParameters.ReturnQ.length;
	
	if(gl>0){
		if(qr>0){
		    this.DestinationParameters.ReturnQ += ' && ' + geoLocation;
		}
		else{
		    this.DestinationParameters.ReturnQ = geoLocation;
		}	
	}
};

MapWrapper.prototype.InflateJobGroups = function(cid){ 
	var s = '';
	var ma = this.JobGroupMapping;
	var ret = new Array();
	
	for(var m in ma){
	    var s = ma[m];
		if(cid == s){
			ret.push(m);
		}		
	}	 
	return ret;
}; 


//used internally
MapWrapper.prototype.FilterUrlExemptedProperties = function (p) {
    var e = ['Map.DestinationParameters', 'Map.Legend', 'Map.Footer', 'Map.CircleDraw', 'Map.Mode', 'Map.Center', 'Map.ZoomLevels', 'Map.GoogleInfo', 'Map.JobDataReady', 'Map.SingleEntity', 'Map.Map', 'Map.Condensed'];
    for (var i = p.length - 1; i >= 0; i--) {
        if (e.indexOf(p[i]) > -1) {
            p.splice(i, 1);
        }
    }
    return p;
}
MapWrapper.prototype.GetAlterableProperties = function () {
    var r = [];
    var props = GetObjectProperties(r, this, 'Map');
    props = this.FilterUrlExemptedProperties(props);
    return props;
}
MapWrapper.prototype.AlterPropertiesFromUrl = function(){  
    var qs = GetQsParams();
    var props = this.GetAlterableProperties();
    for (var q in qs) {
        var s = qs[q][0];        
        var j = props.indexOf(q);        
        if (j > -1) {            
            if (q == 'Map.JobGroupMapping') {
                this.SetMappingData(s);
            }
            else {
                SetNestedObjectProperty(this, q.substring(4), s);
            }
        }
    }	
};  
MapWrapper.prototype.AlterPropertiesFromCookie = function(){  
	this.Center.GetFromCookie();
	this.ZoomLevels.GetFromCookie();	
};  
MapWrapper.prototype.AlterProperties = function(){  
	this.AlterPropertiesFromUrl();
	this.AlterPropertiesFromCookie();	
}; 
MapWrapper.prototype.GetOptions = function(){  
	var o = new Object();
	this.GoogleInfo.GetOptionsString(o);
	this.Footer.GetOptionsString(o);
	this.Style.GetOptionsString(o);
	this.ZoomLevels.GetOptionsString(o);
	this.Center.GetOptionsString(o);
	this.CircleDraw.GetOptionsString(o);
	this.Legend.GetOptionsString(o);
	this.ClusterMarkers.GetOptionsString(o);	
	this.JobMarkers.GetOptionsString(o);
	
	return JSON.stringify(o);
}; 



