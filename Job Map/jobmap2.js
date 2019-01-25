/**
 * @name         jobMap
 * @version      1.2 [Nov 18, 2014]
 * @author       Igor Kishchak
 * @copyright    (c) 2014 
 * @require      jQuery
 * @fileoverview A configurable map widget allowing displaying job locations using clustering. 
 *               Uses Google Maps V3. 
 */

var jobMap = (function () {
	var namespace = {};
	
	namespace.Url = "jobmap/"; // Must be changed to URL of the jobmap directory in case of a shared installation  

	/**
	 * Creates a new map inside of the specified HTML container, which is typically a DIV element.
	 * @constructor
	 * @param {Node} container - a HTML container 
	 * @param {jobMap.MapOptions || string} options - a MapOptions object or a string containing a MapOptions data in JSON format.     
	 */
	namespace.Map = function (container, url, options) {
		var this_ = this;

		// constants
		var MapDivId = "mapDiv";
		var FooterDivId = "footerDiv";
		var LeftLogoDivId 	= "leftLogoDiv";
		var RightLogoDivId 	= "rightLogoDiv";
		var LegendDivId = "legendDiv";
		var CompanyDivId = "companyDiv";
		var LoadingDivId = "loadingDiv";
		var AllJobsDivId = "allJobsDiv";
		var DrawToolDivId = "drawToolDiv";
		var ZoomToAllDivId = "zoomToAllJobsDiv";
		var CurrentJobsDivId = "currJobsDiv";
		var LegendToggleDivId = "legendToggleDiv";

		var DrawCircleStr = "Draw circle";
		var CancelDrawingCircleStr = "Cancel drawing of circle";
		var DeleteDrawnCircleStr = "Remove drawn circle";

		var ImagesUrl = url + jobMap.Url + "images/";
		var JsUrl = url + jobMap.Url + "js/";
		var infoWindow_;

		/* public section */

		/**
		 * automaticClustering - Gets/sets a value indicating if the map performs automatic clustering of job location markers.
		 * @type {boolean}
		 * @default true
		 * @public
		 */
		
		this.setAutomaticClustering = function (val) {
			automaticClustering_ = val;

			if (loaded_) {
				update();
			}
		}
		this.addToInfoWindow = function (val) {
		    infoWindow_.setContent(val);
		}
		this.addToCustomInfoWindow = function (job,lat,lng,loc,tit) {
		    infoWindow_.setContent(job, lat, lng, loc, tit);		    
		}
		this.getAutomaticClustering = function () {
			return automaticClustering_;
		}
		var automaticClustering_ = true;

		/**
		 * jobData - Gest/sets job data to be displayed on the map.
		 * @type {Array.<jobMap.JobLocation> || jobMap.JobDataSource || string} - the value can be a string containing data (jobMap.JobLocation[]  or jobMap.JobDataSource) in JSON format  
		 * @public
		*/
		this.setJobData = function (val) {
			jobData_ = convertIfJSON(val);

			isJobLocationDataSource_ = (jobData_ instanceof Array);

			if (!isJobLocationDataSource_ && (this_.options_.clusterMarkers == null || this_.options_.clusterMarkers.length == 0)) {
				jobData_ = null;
				throw new Error("The mapOptions.clusterMarkers value must be defined and contain at least one item if a JobDataSource is used.");
			}

			if (loaded_) {
				update();
			}
		}
		this.getJobData = function () {
			return jobData_;
		}
		var jobData_ = null;

		/**
		 * zoomToAllJobsTooltip - Gets or sets the tooltip of the icon for zooming to all job data assigned to the jobData property.
		 * @type {boolean}
		 * @public
		 */
		this.setZoomToAllJobsTooltip = function (val) {
			zoomToAllTooltip_ = val;
			updateZoomToAllTooltip();
		}
		this.getZoomToAllJobsTooltip = function () {
			return zoomToAllTooltip_;
		}
		var zoomToAllTooltip_ = null;

		/**
		 * Zooms the map to the all job data assigned to the jobData property.
		 * @public
		 */
		this.zoomToAllJobs = function (val) {		   
			if (map_ && allObjectsBounds_)
				map_.fitBounds(allObjectsBounds_);
		}

		/**
		 * zoomLevel - Gets/sets the current zoom level of the map.
		 * @type {int}
		 * @public
		 */
		this.setZoomLevel = function (val) {
			if (isNaN(parseInt(val)) || val < 0)
				throw new Error("zoomLevel is set to an invalid value.");

			if (map_)
				map_.setZoomLevel(val);
		}
		this.getZoomLevel = function () {
			var zoom = null;			
			if (map_)
				zoom = map_.getZoomLevel();
			else
				zoom = this_.options_.zoomLevel;
			
			return zoom;
		}

		/**
		 * center - Gets/sets the location displayed at the center of the map.
		 * @type {jobMap.GeoPoint}
		 * @public
		 */
		this.setCenter = function (val) {
			if (!val)
				throw new Error("The 'center' property is set to null.");

			checkGeoPoint(val, "center");

			if (map_) {
				var gPoint = new google.maps.LatLng(val.lat, val.lng);
				map_.setCenter(gPoint);
			}
		}
		this.getCenter = function () {
			var center = null;
			if (map_) {
				center = map_.getCenter();
				center = new jobMap.GeoPoint(center.lat(), center.lng());
			}
			else
				center = this_.options_.center;

			return center;
		}

		/**
		 * Gets geographical bounds of the displayed area.
		 * @type {jobMap.GeoBounds}
		 * @public
		 */
		this.getExtent = function () {
			var b = map_.getBounds();
			return latLngBoundsToGeoBounds(b);
		}

		/* Events  */

		/**
		 * extentChangedEventHandler - The method is invoked when the map extent is changed.
		 * @param {jobMap.GeoBounds} extent 	- new extent of the map.
		 * @param {int} zoomLevel 			    - new zoom level.
		 */
		this.extentChangedEventHandler = null;

		function onExtentChanged(extent, zoom) {           
			if (this_.extentChangedEventHandler)
				this_.extentChangedEventHandler(extent, zoom);
		}

		/**
		 * jobLocationClickedEventHandler - The method is invoked when a job location marker is clicked.
		 * @param {jobMap.JobLocation} jobLocation 	- the clicked jobMap.JobLocation.
		 */
		this.jobLocationClickedEventHandler = null;

		function onJobLocationClicked(jobLocation) {
			if (this_.jobLocationClickedEventHandler)
				this_.jobLocationClickedEventHandler(jobLocation);
		}
		function onJobLocationHovered(jobLocation) {
		    if (this_.jobLocationHoveredEventHandler)
		        this_.jobLocationHoveredEventHandler(jobLocation);
		}
		

		/**
		 * circleDrawnEventHandler - The method is invoked when the user has finished drawing a circle.
		 * @param {jobMap.GeoPoint} center 	- center of the drawn circle.
		 * @param {int} radius 				- radius of the drawn circle, in meters
		 */
		this.circleDrawnEventHandler = null;

		function onCircleDrawn(center, radius) {
			if (this_.circleDrawnEventHandler)
				this_.circleDrawnEventHandler(center, radius);
		}

		/* End Events */

		/* end public section */

		/* private section */

		this.containerElement_ = document.getElementById(container);
		if (!this.containerElement_)
			throw Error("The container element not found.");

		// customize container styles
		$(this.containerElement_).css("overflow", "hidden");

		this.container_ = container;

		/**
		 * Indicates state of component loading
		 * @type {int}
		 * @private
		 */
		var loaded_ = false;

		/**
		 * Count of all jobs assigned to the jobData property
		 * @type {int}
		 * @private
		 */
		var allJobCount_ = 0;

		/**
		 * Count of jobs in the current extent of the map 
		 * @type {int}
		 * @private
		 */
		var currentJobCount_ = 0;

		/**
		 * The associated google.maps.Map object.
		 * @type {google.maps.Map}
		 * @private
		 */
		var map_;		
		/**
		 * Google drawing manager tool.
		 * @type {google.maps.drawing.DrawingManager}
		 * @private
		 */
		var drawingManager_;
		var tempCircle_ = { circle: null, center: null };

		/**
		 * Collection of job location markers on the map.
		 * @type {Array.<google.maps.Marker>}
		 * @private
		 */
		var jobMarkers_ = [];

		/**
		 * Collection of clusters of job locations on the map, specified by a jobMap.JobDataSource
		 * @type {Array.<markerWithLabel>}
		 * @private
		 */
		var jobClusters_ = [];

		/**
		 * Determines if data source type is an Array.<JobLocation>.
		 * @type {boolean}
		 * @private
		 */
		var isJobLocationDataSource_ = true;

		/**
		 * Clusterer of job location markers.
		 * @type {Array.<google.maps.Marker>}
		 * @private
		 */
		var jobMarkerClusterer_;

		/**
		 * Bounds of all objects on the map.
		 * @type {google.maps.LatLngBounds}
		 * @private
		*/
		var allObjectsBounds_;

		/**
		 * Maximum and minimum zoom levels of the map.
		 * @type {int}
		 * @private
		 */
		var mapMinZoom_;
		var mapMaxZoom_;

		/**
		 * Determines if all job data assigned to jobData property have been added to the map.   
		 * Is used for jobMap.JobDataSource.
		 * @type {int}
		 * @private
		 */
		var allDataIsDrawn_;

		var customWindowHtml_;
		var customWindowId_;
		var companyDivId_;
		var locationDivId_;
		var jobCountDivId_;
		var titlesDivId_;

		var locationLatLongs_ = [];
		

		/* Private Methods */
		function extendDefaultOptions(mapOptions) {
			try {
				var opts = mapOptions || {};
				opts = convertIfJSON(opts);				
				opts = $.extend(true, this_.defaultMapOptions, opts);				
			}
			catch (e) {
				log(e);
				throw new Error("The JSON has syntax errors.");
			}
			// validations of options
			validateMapOptions(opts);

			return opts;
		}

		function validateMapOptions(opts) {
			
			// validate google maps api key
			if(opts.googleMapsApiKey && typeof opts.googleMapsApiKey != "string")
				throw new Error("The 'googleMapsApiKey' option is not a string.");
			
			// validate footer options
			if (opts.footer){
				validatePositiveNumber(opts.footer.height, "footer.height");
				validatePositiveNumber(opts.footer.topBorderHeight, "footer.topBorderHeight");
				
				if (opts.footer.rightImagePos){
					validateNumber(opts.footer.rightImagePos.x, "footer.rightImagePos.x");
					validateNumber(opts.footer.rightImagePos.y, "footer.rightImagePos.y");
				}

				validateNumber(opts.footer.textLeftMargin, "footer.textLeftMargin");
				validateNumber(opts.footer.textRightMargin, "footer.textRightMargin");
			}
			
			// validate jobMarkers
			if (opts.jobMarkers) {			    
			    for (var i = 0; i < opts.jobMarkers.length;i++) {
			        if (!opts.jobMarkers[i].iconUrl)
			            throw new Error("The 'jobMarkers[" + i + "].iconUrl' required option is not defined or is an empty string.");

			        if (opts.jobMarkers.length > 1 && !opts.jobMarkers[i].companyName)
			            throw new Error("The 'jobMarkers[" + i + "].companyName' required option is not defined or is an empty string.");

			        validatePositiveNumber(opts.jobMarkers[i].companyID, "jobMarkers[" + i + "].companyID", true);

			        if (opts.jobMarkers[i].anchorPoint) {
			            validateNumber(opts.jobMarkers[i].anchorPoint.x, "jobMarkers[" + i + "].anchorPoint.x");
			            validateNumber(opts.jobMarkers[i].anchorPoint.y, "jobMarkers[" + i + "].anchorPoint.y");
			        }
			       
				}
			}

			// validate clusterMarkers
			if (opts.clusterMarkers) {
			    for (var i = 0; i < opts.clusterMarkers.length; i++) {
					if (!opts.clusterMarkers[i].iconUrl)
						throw new Error("The 'clusterMarkers[" + i + "].iconUrl' required option is not defined or is an empty string.");

					validatePositiveNumber(opts.clusterMarkers[i].height, "clusterMarkers[" + i + "].height", true);
					validatePositiveNumber(opts.clusterMarkers[i].width, "clusterMarkers[" + i + "].width", true);

					if (opts.clusterMarkers[i].anchorPoint) {
						validateNumber(opts.clusterMarkers[i].anchorPoint.x, "clusterMarkers[" + i + "].anchorPoint.x");
						validateNumber(opts.clusterMarkers[i].anchorPoint.y, "clusterMarkers[" + i + "].anchorPoint.y");
					}
				}
			}

			// validate clusterMaxZoomLevel
			validatePositiveNumber(opts.clusterMaxZoomLevel, "clusterMaxZoomLevel");

			// validate circleDrawTool options
			if (opts.circleDrawTool) {
				validatePositiveNumber(opts.circleDrawTool.penWidth, "circleDrawTool.penWidth");
			}

			// validate zoomLevels
			validatePositiveNumber(opts.zoomLevel, "zoomLevel");
			validatePositiveNumber(opts.minZoomLevel, "minZoomLevel");
			validatePositiveNumber(opts.maxZoomLevel, "maxZoomLevel");
			if (opts.zoomLevel < opts.minZoomLevel)
				throw new Error("The 'zoomLevel' option cannot be less than 'minZoomLevel'.");
			if (opts.zoomLevel > opts.maxZoomLevel)
				throw new Error("The 'zoomLevel' option cannot be greater than 'maxZoomLevel'.");
			if (opts.clusterMaxZoomLevel < opts.minZoomLevel)
				throw new Error("The 'clusterMaxZoomLevel' option cannot be less than 'minZoomLevel'.");
			if (opts.clusterMaxZoomLevel > opts.maxZoomLevel)
				throw new Error("The 'clusterMaxZoomLevel' option cannot be greater than 'maxZoomLevel'.");

			if (opts.center) {
				checkGeoPoint(opts.center, "center");
			}
		}

		function checkGeoPoint(point, optsName) {
			validateNumber(point.lat, optsName + ".lat");
			if (point.lat < -90 || point.lat > 90)
				throw new Error("The '" + optsName + ".lat' option cannot be greater than '90' and cannot be less than '-90'.");

			validateNumber(point.lng, optsName + ".lng");
			if (point.lng < -180 || point.lng > 180)
				throw new Error("The '" + optsName + ".lng' option cannot be greater than '180' and cannot be less than '-180'.");
		}
		
		function validatePositiveNumber(val, paramName, isRequired)
		{
			validateNumber(val, paramName, isRequired);

			if(val < 0)
				throw new Error("The '" + paramName + "' option is negative.");
		}
		
		function validateNumber(val, paramName, isRequired)
		{		    
			if(typeof(val) == "string" || isNaN(val) /*|| isNaN(parseInt(val))*/)
				throw new Error("The '" + paramName + "' " + (isRequired ? "required":"") + " option " + (isRequired ? "is not defined or":"") + " is not a number.");
		}
		
		var isMobile_ = false;

		// inits main GUI and map
		function init() {
			try {
				if (!window.MarkerWithLabel) {
					$.getScript(JsUrl + 'markerwithlabel.js');
				}

				isMobile_ = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

				// get template for control GUI with the specified parameters
				var html = getGUI({
					imgUrl: ImagesUrl,
					mapId: MapDivId,
					footerId: FooterDivId,
					leftLogoDiv		: LeftLogoDivId,
					rightLogoDiv	: RightLogoDivId,
					companyNameId: CompanyDivId,
					companyName: (this_.options_.footer.companyName || ""),
					loadingDiv: LoadingDivId,
					allJobsDiv: AllJobsDivId,
					currJobsDiv: CurrentJobsDivId,
					legendId: LegendDivId,
					zoomToAllDiv: ZoomToAllDivId,
					drawToolDiv: DrawToolDivId,
					legendToggleId: LegendToggleDivId
				});
				$(this_.containerElement_).html(html);

				showWait();
				mapMinZoom_ = this_.options_.minZoomLevel;
				mapMaxZoom_ = this_.options_.maxZoomLevel;

				// init map
				var map_opts = {
					center: new google.maps.LatLng(this_.options_.center.lat, this_.options_.center.lng),
					zoom: this_.options_.zoomLevel,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					maxZoom: mapMaxZoom_,
					minZoom: mapMinZoom_,
					disableDefaultUI: true,
					styles : this_.options_.mapStyles
				};
				map_ = new google.maps.Map(document.getElementById(MapDivId), map_opts);
				if (this_.options_.customInfoWindow) {				    
				    infoWindow_ = new CustomToolTip(this_.options_.customInfoWindow, map_, this_.container_);
				}
				else{
                    infoWindow_ = new google.maps.InfoWindow;
				}

				initZoomControl();

				// events for show/hide loader
				google.maps.event.addListener(map_, 'dragstart', function () {
					showWait();
				});
				google.maps.event.addListener(map_, 'bounds_changed', function () {
					showWait();
				});
				google.maps.event.addListener(map_, 'zoom_changed', function () {
					allDataIsDrawn_ = false;
					updateZoomControl();
				});

				// map loading handle
				google.maps.event.addListener(map_, 'idle', function () {
					if (jobData_ && !isJobLocationDataSource_ && jobData_.getData) {
						if (!allDataIsDrawn_)
							drawJobDataSourceData();
					}
					else {
						updateJobCountsGUI();
					}

					onExtentChanged(this_.getExtent(), map_.getZoom());

					google.maps.event.trigger(map_, 'resize');

					hideWait();
				});

				// init drawing manager
				drawingManager_ = new google.maps.drawing.DrawingManager({
					drawingControl: false,
					drawingControlOptions: {
						drawingModes: [
							google.maps.drawing.OverlayType.CIRCLE
						]
					},
					circleOptions: {
						fillColor: this_.options_.circleDrawTool.brushColor,
						fillOpacity: this_.options_.circleDrawTool.opacity,
						strokeWeight: this_.options_.circleDrawTool.penWidth,
						strokeColor: this_.options_.circleDrawTool.penColor,
						strokeOpacity: this_.options_.circleDrawTool.opacity,
						strokePosition: google.maps.StrokePosition.OUTSIDE,
						clickable: false,
						draggable: false,
						editable: false,
						zIndex: 1
					}
				});
				drawingManager_.setMap(map_);
				drawingManager_.setDrawingMode(null);

				google.maps.event.addListener(drawingManager_, 'circlecomplete', function (circle) {
					tempCircle_.circle = null;
					tempCircle_.center = null;

					drawingManager_.setDrawingMode(null);

					var pos = circle.getCenter();

					tempCircle_.circle = circle;
					tempCircle_.center = createCircleCenter(pos);

					var radius = circle.getRadius();

					$("#" + DrawToolDivId).addClass("delete")
										.data("state", "drawn")
										.attr("title", DeleteDrawnCircleStr);

					onCircleDrawn(new jobMap.GeoPoint(pos.lat(), pos.lng()), radius);
				});

				google.maps.event.addListener(drawingManager_, 'drawingmode_changed', function (event) {
					if (tempCircle_.circle) {
						if (drawingManager_.getDrawingMode() == "circle") {
							clearDrawnCircle();
						}
					}
				});

				// add event handler for view_all button click
				$("#" + ZoomToAllDivId).click(this_.zoomToAllJobs);

				// event for drawing tool
				$("#" + DrawToolDivId).click(function () {
					var ths = $(this);
					var state = ths.data("state");

					if (!isMobile_) {
						//$( ".tooltip-enable" ).tooltip("destroy");
						ths.tooltip("destroy");
					}

					if (state == "drawn") {
						drawingManager_.setDrawingMode(null);
						clearDrawnCircle();
						ths.removeClass("delete").removeClass("selectedTool").data("state", "none").attr("title", DrawCircleStr);
					}
					else if (state == "active") {
						drawingManager_.setDrawingMode(null);
						ths.removeClass("selectedTool").data("state", "none").attr("title", DrawCircleStr);
					}
					else {
						drawingManager_.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
						ths.addClass("selectedTool").data("state", "active").attr("title", CancelDrawingCircleStr);
					}

					if (!isMobile_) {
						$(".tooltip-enable").tooltip({ track: true });
						ths.tooltip({ track: true });
						ths.tooltip("open");
					}

				});

				loaded_ = true;
				if (jobData_)
					this_.setJobData(jobData_);
				else
					updateGUI();


				updateZoomToAllTooltip();

				if (this_.options_.geolocation) {
					initUserGeolocation();
				}

				if (!isMobile_) {
					$(".tooltip-enable").tooltip({ track: true });
					$("#" + DrawToolDivId).tooltip({ track: true });
				}
				
				$(window).resize(onResize);
			}
			catch (e) {
				log(e);
			}
		}
        		
		function clearDrawnCircle() {
			tempCircle_.circle.setMap(null);
			tempCircle_.center.setMap(null);
		}

		// gets user location
		function initUserGeolocation() {
			if (navigator.geolocation) {
				watchId = navigator.geolocation.watchPosition(
					function (location) {
						navigator.geolocation.clearWatch(watchId);
						var point = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
						map_.setCenter(point);
					},
					function (err) {
						log(err);
					});

			} else {
				alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
			}
		}

		function createCircleCenter(pos) {
			var circle = new google.maps.Marker({
				position: pos,
				map: map_,
				icon: {
					fillColor: "#000000",
					fillOpacity: 0.6,
					path: google.maps.SymbolPath.CIRCLE,
					scale: 3
				},
				zIndex: 0
			});
			return circle;
		}

		function loadScripts() {
			if (window.google && window.google.load) {
				loadGoogleMaps();
			}
			else {
				$.getScript('https://www.google.com/jsapi', function () {
					loadGoogleMaps();
				});
			}
		}
		function loadGoogleMaps() {
			if (window.google.maps) {
				init();
			}
			else {
				// build code for key value
				var keyVars = this_.options_.googleMapsApiKey;
				if (keyVars)
					keyVars = "&key=" + keyVars;
				else
					keyVars = "";

				google.load('maps', '3.exp', { other_params: 'sensor=false&language=en&libraries=drawing' + keyVars, callback: function () {
					if (!window.MarkerClusterer) {
					    $.getScript(JsUrl + 'markerclusterer.js', function () {
					        $.getScript(JsUrl + 'customtooltip.js', function () {
					        //$.getScript('/jobmap/js/customtooltip.js', function () {
                                 
					            init();
					        });
						});
					}
					else
						init();
				} 
				});
			}
		}

		function update() {
			if (isJobLocationDataSource_) {
				// update markers and clusters
				drawJobLocationsData();
			}

			// update GUI
			updateGUI();

			updateJobCountsGUI(!isJobLocationDataSource_);
		}

		function showWait() {
			$("#" + LoadingDivId).show();
		}
		function hideWait() {
			$("#" + LoadingDivId).hide();
		}
		function onResize() {
			var footer_h = $("#" + FooterDivId).height();
			var m_h = $(this_.containerElement_).height() - footer_h - this_.options_.footer.topBorderHeight;
			$("#" + MapDivId).height(m_h);
			$(".controls-holder").css("bottom", footer_h + 35);
			updateFooterSizes();
		}

		function updateGUI() {		    
			if (this_.options_.circleDrawTool.visible)
				$("#" + DrawToolDivId).show();

			var showLegend = false;
			var cName = '';
			if (this_.options_.jobMarkers && this_.options_.jobMarkers.length > 1) {
			    for (var i = 0; i < this_.options_.jobMarkers.length; i++) {				    
			        var opt = this_.options_.jobMarkers[i];
			        if (cName.length > 0 && opt.companyName != cName) {
			            showLegend = true;                        
			            break;
			        }
			        cName = opt.companyName;
			    }
			}
			if(showLegend){
			    var legendItems = [];
			    for (var i = 0; i < this_.options_.jobMarkers.length; i++) {					
					var opt = this_.options_.jobMarkers[i];
					var checked = opt.visible || true;
					var state = checked ? "checked" : "";
					legendItems.push('<div class="legendItem"><img src="' + opt.iconUrl + '"><input ' + state + ' class="legendItemCompany" type="checkbox" id="chkbx' + opt.companyID + '" data-cid="' + opt.companyID + '"> <label for="chkbx' + opt.companyID + '">' + opt.companyName + '</label></div>');
				}
				$(".content", "#" + LegendDivId).html(legendItems.join(""))
									.css("color", this_.options_.legend.textColor)
									.css("background-color", this_.options_.legend.fillColor);


				$(".header", "#" + LegendDivId).css("color", this_.options_.legend.headerTextColor)
									.css("background-color", this_.options_.legend.headerColor);

				$("input", "#" + LegendDivId).unbind(onLegendItemClick).change(onLegendItemClick);
				$(".collapse", "#" + LegendDivId).unbind("click").bind("click", hideLegend);
				$("#" + LegendToggleDivId).show().unbind("click").bind("click", showLegend);
			}
			else {
				$("#" + LegendDivId).hide();
				$("#" + LegendToggleDivId).hide();
			}

			// update footer GUI
			var width = $("#" + FooterDivId).width() - this_.options_.footer.textLeftMargin 
					- this_.options_.footer.textRightMargin;
			
			$("#" + FooterDivId).css("color", this_.options_.footer.textColor)
				.css("background-color", this_.options_.footer.fillColor)
				.css("height", this_.options_.footer.height)
				.css("border-top-width", this_.options_.footer.topBorderHeight)
				.css("border-top-color", this_.options_.footer.topBorderColor)
				.css("border-top-style", "solid")
			.find(".footer-texts")
				.height(this_.options_.footer.height)
				.width($("#" + FooterDivId).width())
			.find("h3")
				.css("margin-left", this_.options_.footer.textLeftMargin)
				.css("margin-right", this_.options_.footer.textRightMargin)
				.width(width);
			
			
			
			// update company name
			$("#" + CompanyDivId).html(this_.options_.footer.companyName || "");
			if(this_.options_.footer.companyName)
				$(".company-splitter").show();
			else
				$(".company-splitter").hide();
			
			// footer left image
			if(this_.options_.footer.leftImageUrl)
			{
				$("#" + LeftLogoDivId).css("left", "0px")
									.css("bottom", "0px")
									.show()
									.find("img")
									.attr("src", this_.options_.footer.leftImageUrl)
									.attr("alt", "");
			}
			else
			{
				$("#" + LeftLogoDivId).hide();
			}
			
			// footer right image
			if(this_.options_.footer.rightImageUrl)
			{
				$("#" + RightLogoDivId).css("right", -this_.options_.footer.rightImagePos.x)
									.css("bottom", this_.options_.footer.rightImagePos.y)
									.show()
									.find("img")
									.attr("src", this_.options_.footer.rightImageUrl)
									.attr("alt", "");
			}
			else
			{
				$("#" + RightLogoDivId).hide();
			}

			onResize();
		}
		
		function updateFooterSizes()
		{
			var width = $("#" + FooterDivId).width() - this_.options_.footer.textLeftMargin 
					- this_.options_.footer.textRightMargin;
			$("#" + FooterDivId).find(".footer-texts").find("h3").width(width);
		}
		
		function showLegend() {
			$("#" + LegendToggleDivId).hide();
			$("#" + LegendDivId).toggle("slow", function () {
				$(this).find(".collapse").show();
			});
		}
		function hideLegend() {
			$("#" + LegendDivId).toggle("slow", function () {
				$("#" + LegendToggleDivId).show();
			}).find(".collapse").hide();
		}

		function updateJobCountsGUI(ignoreCalculating) {
			if (!ignoreCalculating)
				updateCurrentJobCounts();

			$("#" + AllJobsDivId).html(allJobCount_);
			$("#" + CurrentJobsDivId).html(currentJobCount_);
		}

		function updateCurrentJobCounts() {
			currentJobCount_ = 0;
			var bounds = map_.getBounds();
			if (bounds) // if map is initialized
			{
			    for (var i = 0; i < jobMarkers_.length; i++) {					
					if (jobMarkers_[i].getVisible() && bounds.contains(jobMarkers_[i].getPosition())) {
						currentJobCount_ += parseInt(jobMarkers_[i].jobLoc.count);
					}
				}
			}
		}

		function onLegendItemClick() {
			var cid = $(this).data("cid");
			var visible = this.checked;

			// apply filter for data source
			if (!isJobLocationDataSource_) {
				var companyFilter = [];
				$('.legendItemCompany').each(function () {
					if (!this.checked)
						companyFilter.push($(this).data("cid"));
				});
				drawJobDataSourceData(companyFilter);
			}
			else // apply filter for jobLocations
			{
			    for (var i = 0; i < jobMarkers_.length; i++) {					
					if (jobMarkers_[i].jobLoc.cid == cid) {
						jobMarkers_[i].setVisible(visible);
					}
				}

				updateJobCountsGUI();
				if (jobMarkerClusterer_)
					jobMarkerClusterer_.repaint();
			}
		}

		function updateZoomToAllTooltip() {
			if (loaded_ && zoomToAllTooltip_ != null)
				$("#" + ZoomToAllDivId).attr("title", zoomToAllTooltip_);
		}

		/* Helper Functions */
		function convertIfJSON(data) {
			if (typeof data == "string") {
				data = JSON.parse(data);
			}
			return data;
		}

		function drawJobLocationsData() {
		    allObjectsBounds_ = new google.maps.LatLngBounds();		    
			jobMarkers_ = [];
			allJobCount_ = 0;

			if (!jobData_)
				return;

			drawJobLocations(jobData_, automaticClustering_);
		}

		function drawJobLocations(jobLocations, autoClustering, ignoreBounds, filter) {
			if (isJobLocationDataSource_)
				clearCache();
			
			for (var i = 0; i < jobLocations.length; i++) {
				var jobLoc = jobLocations[i];
				if (filter && $.inArray(jobLoc.cid, filter) >= 0)
					continue;

				var jobIcon = getJobMarkerIcon(jobLoc.cid);
				if (jobLoc.lat && jobLoc.lng) {
					var obj = null;

					// get data from cache if exists
					if (!isJobLocationDataSource_) {
						obj = getObjectFromCache(jobLoc);
					}

					if (!obj) {
						// create markers
					    var pos = new google.maps.LatLng(jobLoc.lat, jobLoc.lng);					    
						var marker = new google.maps.Marker({
							position: pos,
							map: (autoClustering ? null : map_),
							icon: jobIcon,
							visible: true
						});
						marker.jobLoc = jobLoc;

						if (!ignoreBounds)
							allObjectsBounds_.extend(pos);
						
						google.maps.event.addListener(marker, 'click', function () {
							onJobLocationClicked(this.jobLoc);
						});
						google.maps.event.addListener(marker, 'mouseover', function () {
						    var s = this.jobLoc.count + ' job' + (this.jobLoc.count > 1?'s':'');
						    infoWindow_.setContent(s);						    
						    if (infoWindow_.Html) {						        
						        infoWindow_.open(this.getPosition());						        
						    }
						    else {
						        infoWindow_.open(map_, this);
						    }
						    onJobLocationHovered(this.jobLoc);
						});
						google.maps.event.addListener(marker, 'mouseout', function () {
						    infoWindow_.close();
						});
						// cache markers
						if (isJobLocationDataSource_) {
							jobMarkers_.push(marker);
						}
						else {
							marker.jobCount = jobLoc.count;
							addObjectToCache(marker);
						}
						allJobCount_ += parseInt(jobLoc.count);
					}
				}
			}

			if (jobMarkers_.length > 0 && autoClustering && isJobLocationDataSource_) {
				var clusterStyles = this_.options_.clusterMarkers;
				if (clusterStyles && clusterStyles.length > 0) {				    
				    for (var i = 0; i < clusterStyles.length; i++) {
						clusterStyles[i].url = clusterStyles[i].iconUrl;
						if (clusterStyles[i].anchorPoint) {
							clusterStyles[i].anchorIcon = [clusterStyles[i].anchorPoint.x+(clusterStyles[i].width/2), clusterStyles[i].anchorPoint.y+(clusterStyles[i].height/2)];
						}
					}
				}

				// create and init clusters
				jobMarkerClusterer_ = new MarkerClusterer(map_, jobMarkers_, {
					ignoreHidden: true,
					maxZoom: this_.options_.clusterMaxZoomLevel,
					styles: clusterStyles
				});

				// cluster on click
				google.maps.event.clearListeners(jobMarkerClusterer_, 'click');

				// cluster calculator
				jobMarkerClusterer_.setCalculator(clustersCalculator);
			}
		}
		function clustersCalculator(markers, numStyles, markersCount) {
			var index = 0;
			var count = markersCount || 0;
			if (count == 0) {
				for (var i = 0; i < markers.length; i++) {
					if (markers[i].visible)
						count += markers[i].jobLoc.count;
				}
			}

			var dv = count;

			while (dv !== 0) {
				dv = Math.floor(dv / 20);
				index++;
			}

			index = Math.min(index, numStyles);
			return {
				text: count,
				index: index
			};
		}

		function drawJobDataSourceData(filter) {
			jobMarkerClusterer_ = null;

			removeInvisibleDSClustersAndMarkers();

			var jobsData = jobData_.getData(this_.getExtent(), map_.getZoom());

			// draw job locations
			if (jobsData.jobLocations)
				drawJobLocations(jobsData.jobLocations, false, true, filter);

			// draw job clusters
			if (jobsData.jobClusters)
				drawCompanyJobCluster(jobsData.jobClusters, filter);

			removeInvalidDSClustersAndMarkers();

			currentJobCount_ = 0;
			for (var i = 0; i < objectsCache_.length; i++) {			
				currentJobCount_ += objectsCache_[i].marker.jobCount;
			}

			allJobCount_ = jobData_.jobCount;
			allObjectsBounds_ = geoBoundsToLatLngBounds(jobData_.extent);		   

			// store if all job data have been drawn
			if (allJobCount_ == currentJobCount_)
				allDataIsDrawn_ = true;

			updateJobCountsGUI(true);
		}

		function drawCompanyJobCluster(companyJobClusters, filter) {
			jobClusters_ = [];
			var jobLocations = [];

		    // draw icon for each cluster
			for (var i = 0; i < companyJobClusters.length; i++) {			
				var jobCount = 0;
				var extent = new google.maps.LatLngBounds();
				var cluster = { lat: 0, lng: 0, count: 0, companyCount: 0, cid: "" };
				var cid = 0;
				for (var j = 0; j < companyJobClusters[i].length; j++) {	
					var compCluster = companyJobClusters[i][j];
					if (filter && $.inArray(compCluster.companyID, filter) >= 0)
						continue;
					jobCount += compCluster.jobCount;
					extent.union(geoBoundsToLatLngBounds(compCluster.extent));

					cluster.lat += compCluster.lat;
					cluster.lng += compCluster.lng;
					cluster.companyCount++;
					cluster.count += compCluster.jobLocationCount;
					cid = compCluster.companyID;
					cluster.cid += "_" + cid;

				}

				var verticalLabelAnchor = 9;
				
				// hack for FF 
				if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
					verticalLabelAnchor = 10;
				}
				if (cluster.count != 0) {
					cluster.lat = cluster.lat / cluster.companyCount;
					cluster.lng = cluster.lng / cluster.companyCount;

					var obj = getObjectFromCache(cluster);

					if (!obj) {

						if (cluster.count == 1) {
							jobLocations.push(new jobMap.JobLocation(cid, cluster.lat, cluster.lng, jobCount));
						}
						else {
							var center = new google.maps.LatLng(cluster.lat, cluster.lng);

							var clusterStyles = this_.options_.clusterMarkers;
							var calcObj = clustersCalculator(null, clusterStyles.length, jobCount);
							var currStyle = clusterStyles[calcObj.index - 1];

							var anchorPoint = currStyle.anchorPoint || { x: 0, y: 0 };
							var textSize = currStyle.textSize || 10;
							var textColor = currStyle.textColor || "#000000";

							var marker = new MarkerWithLabel({
								position: center,
								icon: {
									size: new google.maps.Size(currStyle.width, currStyle.height),
									anchor: new google.maps.Point(currStyle.width * .5 + anchorPoint.x, currStyle.height * .5 + anchorPoint.y),
									url: currStyle.iconUrl
								},
								draggable: false,
								raiseOnDrag: false,
								map: map_,
								labelContent: jobCount.toString(),
								labelAnchor: new google.maps.Point(50, textSize / 2),
								labelStyle: {
									color: textColor,
									fontSize: textSize + "px",
									fontWeight: "bold",
									textAlign: "center",
									whiteSpace: "nowrap",
									width: "100px",
									lineHeight: textSize + "px"
								}
							});
							marker.extent = extent;
							marker.jobCount = jobCount;
							marker.obj = cluster;
							google.maps.event.addListener(marker, 'click', function () {
								map_.fitBounds(this.extent);
							});

							addObjectToCache(marker);
						}
					}
				}
			}
			if (jobLocations.length > 0)
				drawJobLocations(jobLocations, false, true);
		}

		function getJobMarkerIcon(cid) {
			var icon = null;
			var opt = getJobMarkerOptionByCompId(cid);

			// if no marker style has been defined for a JobLocation.cid value 
			// then use the default marker (for companyId=0) if it is defined
			if (!opt)
				opt = getJobMarkerOptionByCompId(0);

			if (opt) {
				icon = {
					//size: new google.maps.Size(24,24),
					//scaledSize: new google.maps.Size(24,24),
					url: opt.iconUrl,
					title: opt.companyName,
					anchor: (opt.anchorPoint ? new google.maps.Point(opt.anchorPoint.x, opt.anchorPoint.y) : null)
				};
			}
			return icon;
		}

		function getJobMarkerOptionByCompId(cid) {
			var opt = null;
			if (this_.options_.jobMarkers) {
			    for (var i = 0; i < this_.options_.jobMarkers.length; i++) {					
					if (this_.options_.jobMarkers[i].companyID == cid) {
						opt = this_.options_.jobMarkers[i];
						break;
					}
				}
			}
			return opt;
		}

		function latLngBoundsToGeoBounds(latLngBounds) {
			var extent = new jobMap.GeoBounds(
					new jobMap.GeoPoint(latLngBounds.getSouthWest().lat(), latLngBounds.getSouthWest().lng()),
					new jobMap.GeoPoint(latLngBounds.getNorthEast().lat(), latLngBounds.getNorthEast().lng())
				);
			return extent;
		}

		function geoBoundsToLatLngBounds(geoBounds) {
			var bounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(geoBounds.southWest.lat, geoBounds.southWest.lng),
					new google.maps.LatLng(geoBounds.northEast.lat, geoBounds.northEast.lng)
				);
			return bounds;
		}

		function log(message) {
			if (window.console)
				console.log(message);
		}

		/* Caching */
		function removeInvisibleDSClustersAndMarkers() {
			var mapBounds = map_.getBounds();
			for (var i = 0; i < objectsCache_.length; i++) {
				if (objectsCache_[i]) {
					objectsCache_[i].toDelete = true;
					var pos = objectsCache_[i].marker.getPosition();
					if (!mapBounds.contains(pos)) {
						objectsCache_[i].marker.setMap(null);
						delete objectsCache_[i];
					}
				}
			}
		}

		function removeInvalidDSClustersAndMarkers() {
			var mapBounds = map_.getBounds();
			for (var i = 0; i < objectsCache_.length; i++) {
				if (objectsCache_[i] && objectsCache_[i].toDelete) {
					objectsCache_[i].marker.setMap(null);
					delete objectsCache_[i];
				}
			}
		}

		function clearCache() {
		    for (var i = 0; i < objectsCache_.length; i++) {
		        if (objectsCache_[i]) {
		            objectsCache_[i].marker.setMap(null);
		        }
			}
			objectsCache_ = [];
		}

		// adds to cache jobLocation or cluster (using only for jobMap.JobDataSource data)
		function addObjectToCache(objMarker) {
			var obj = objMarker.jobLoc || objMarker.obj;
			obj.marker = objMarker;
			var id = obj.lat + "_" + obj.lng + "_" + obj.cid;
			objectsCache_[id] = obj;
		}

		function deleteObjectFromCache(obj) {
			var id = obj.lat + "_" + obj.lng + "_" + obj.cid;
			objectsCache_[id].marker.setMap(null);
			delete objectsCache_[id];
		}

		function getObjectFromCache(obj) {
			var id = obj.lat + "_" + obj.lng + "_" + obj.cid;
			var cacheObj = objectsCache_[id];

			if (cacheObj) {
				if (obj.count != cacheObj.count) {
					deleteObjectFromCache(cacheObj);
					cacheObj = null;
				}
				else {
					// mark to no delete
					cacheObj.toDelete = false;
				}
			}
			return cacheObj;
		}
		var objectsCache_ = [];

		/* End Helper Functions */

		/* Zoom control */
		function initZoomControl() {
			if (!zoomControl_) {
				zoomIn_ = $(".zoom-in")[0];
				$(zoomIn_).click(function () {
					if ($(this).data("state") == "disabled")
						return false;

					var nextZoom = map_.getZoom() + 1;
					nextZoom = Math.min(nextZoom, mapMaxZoom_);
					map_.setZoom(nextZoom);
				});

				zoomOut_ = $(".zoom-out")[0];
				$(zoomOut_).click(function () {
					if ($(this).data("state") == "disabled")
						return false;

					var nextZoom = map_.getZoom() - 1;
					nextZoom = Math.max(nextZoom, mapMinZoom_);
					map_.setZoom(nextZoom);
				});

				updateZoomControl();

				zoomControl_ = true;
			}
		}
		var zoomControl_ = false;
		var zoomIn_;
		var zoomOut_;

		function updateZoomControl() {
			updateZoomButton(zoomIn_, mapMaxZoom_);
			updateZoomButton(zoomOut_, mapMinZoom_);
		}

		function updateZoomButton(zoomButton, maxOrMinZoom) {
			var currZoom = map_.getZoom();
			if (currZoom == maxOrMinZoom) {
				//zoomButton.disabled = true;
				$(zoomButton).data("state", "disabled");
				$(zoomButton).addClass("disabled");
			}
			else {
				//zoomButton.disabled = false;
				$(zoomButton).data("state", "enabled");
				$(zoomButton).removeClass("disabled");
			}
		}
		/* End Zoom Control */

		/* End Private Methods */

		/* End Private section */

		this.defaultMapOptions =
		{
			/**
			 * googleMapsApiKey - key for using google maps API
			 * @type {string}
			 */
			googleMapsApiKey: null,

			/**
			* footer - properties of footer
			* @type {jobMap.FooterOptions}
			*/
			footer : {
				height : 80,
				fillColor : "#444444",
				topBorderHeight : 5,
				topBorderColor : "#CCCCCC",
				leftImageUrl : null,
				rightImageUrl : null,
				rightImagePos : {x:0, y:0},
				textLeftMargin : 20,
				textRightMargin : 20,
				textColor : "#EFEFEF",
				companyName : null
			},
			
			/**
			* mapStyles - a collection of selectors and stylers that define how the map should be styled.
			*/
			mapStyles : null,

			/**
			 * legend - properties of legend
			 * @type {jobMap.LegendOptions}
			 */
			legend: {
				headerColor: "#444444",
				headerTextColor: "#EFEFEF",
				fillColor: "#FFFFFF",
				textColor: "#000000"
			},

			/**
			 * jobMarkers - options of markers of job locations
			 * @type {Array.<jobMap.JobMarkersOption>}
			 * @public
			 */
			"jobMarkers": null,

			/**
			 * clusterMarkers - options of clusters
			 * @type {Array.<jobMap.ClusterMarkerOption>}
			 */
			clusterMarkers: null,

			/**
			 * clusterMaxZoomLevel - maximum zoom level of map for clustering
			 * @type {int}
			 */
			clusterMaxZoomLevel: 10,
			
			/**
			 * circleDrawTool - options of the circle draw tool
			 * @type {jobMap.CircleDrawToolOptions}
			 * @public
			 */
			circleDrawTool: {
				visible: false,
				brushColor: "#FFFF00",
				penColor: "#000000",
				penWidth: 3,
				opacity: 0.6
			},

			/**
			* zoomLevel - initial zoom level of the map
			* @type {int}
			* @public
			*/
			zoomLevel: 3,

			/**
			* minZoomLevel - minimum zoom level of the map
			* @type {int}
			* @public
			*/
			minZoomLevel: 1,

			/**
			* maxZoomLevel - maximum zoom level of map
			* @type {int}
			* @public
			*/
			maxZoomLevel: 19,

			/**
			* center - The location displayed at the center of the map after its loading.
			* @type {jobMap.GeoPoint}
			* @public
			*/
			center: {
				lat: 39.1,
				lng: -77.045379
			},

			/**
			* geolocation - If is true, the map center is set to the user's location after loading the map.
			* @type {bool}
			*/
			geolocation: false
		}

		function getGUI(params) {
			var jobMapTemplateHtml = '<div id="' + params.mapId + '">' + 
			 '</div>' + 
			 ' <div id="' + params.footerId + '" class="bottom-dock">' + 
			 '	  <div class="logo" id="' + params.leftLogoDiv + '"><img alt="" src="' + params.imgUrl + 'nologo.png">' + 
			 '	  </div>' +
			 '	  <div class="logo" id="' + params.rightLogoDiv + '"><img alt="" src="' + params.imgUrl + 'nologo.png">' + 
			 '	  </div>' +	
			 '	<div class="footer-texts">' + 
			 '	  <h3>' + 
			 '		<div class="texts-first"><span class="partial-count" style="display: inline;">' + 
			 '		  <span class="full-only">Showing </span>' + 
			 '		  <span id="' + params.currJobsDiv + '" class="number">0</span> ' + 
			 '		  of' + 
			 '		</span>' + 
			 '		<span id="' + params.allJobsDiv + '" class="active-count number">0</span>' + 
			 '		<span class="full-only"> active</span>' + 
			 '		jobs' + 
			 '		<span class="company-splitter"> &nbsp;&nbsp;|&nbsp;&nbsp;</span>' + 
			 '		</div><span class="company-name" id="' + params.companyNameId + '"> ' + params.companyName + '</span>' + 
			 '	  </h3>' + 
			 '	</div>' + 
			 '</div>' + 
			 '<div class="loading-mask" id="' + params.loadingDiv + '" style="display: none; background: transparent url("' + params.imgUrl + 'loading.gif") no-repeat center center;"></div>' + 
			  '<div class="top-left-panel">' + 
			 '	<div id="' + params.legendToggleId + '" class="legendToggle tool-button tooltip-enable" title="Show legend">' + 
			 '		<img src="' + params.imgUrl + 'legend.png" alt="">' + 
			 '	</div>' + 
			 '	<div id="' + params.legendId + '" class="legend">' + 
			 '		<div class="header"><div class="collapse tooltip-enable" title="Collapse legend">&lt;&lt;</div><span>Legend</span></div>' + 
			 '		<div class="content">' + 
			 '		</div>' + 
			 '	</div>' + 
			  '	<div id="' + params.drawToolDiv + '" class="drawToolDiv tool-button tooltip-enable" title="Draw circle">' + 
			 '		<img class="default" src="' + params.imgUrl + 'circle.png" alt="">' + 
			 '		<img class="delete" src="' + params.imgUrl + 'circle_del.png" alt="">' + 
			 '	</div>' + 
			  '</div>' + 
			  '<div class="controls-holder">' + 
			 '	<div class="app-vertical-item" id="zoom">' + 
			 '		<div class="zoom"> ' + 
			 '			<button class="button tool-button zoom-in tooltip-enable" title="Zoom in"> ' + 
			 '				<div class="icon" style="background-image: url(\'' + params.imgUrl + 'zooming_small.png\');"></div> ' + 
			 '			</button> ' + 
			 '			<button class="button tool-button zoom-out tooltip-enable" title="Zoom out"> ' + 
			 '				<div class="icon" style="background-image: url(\'' + params.imgUrl + 'zooming_small.png\');"></div> ' + 
			 '			</button> ' + 
			 '			<div class="splitter"></div>' + 
			 '		</div>' + 
			 '	</div>' + 
			 '	<div id="' + params.zoomToAllDiv + '" class="viewAllDiv tool-button tooltip-enable">' + 
			 '		<img src="' + params.imgUrl + 'zoom-full.png" alt="">' + 
			 '	</div>' + 
			 '</div>';
			 return jobMapTemplateHtml;
		}

		/**
		 * options - contains options of the map.
		 * @type {jobMap.MapOption}
		 * @private
		 */
		this.options_ = extendDefaultOptions(options);

		loadScripts();
	}

	
	

	/**
	 * GeoPoint - represents a point of the Earth surface.
	 * @param {float} lat - latitude.
	 * @param {float} lng - longitude.
	 */
	namespace.GeoPoint = function (lat, lng) {
		this.lat = lat;
		this.lng = lng;
	}

	/**
	 * A GeoBounds represents a set of points whose coordinates lie in specific ranges. 
	 * @param {jobMap.GeoPoint} sw - the south-west corner of the bounds, undefined/null if the bounds is empty    
	 * @param {jobMap.GeoPoint} ne - the north-east corner of the bounds, undefined/null if the bounds is empty or contains only the sw point	
	 */
	namespace.GeoBounds = function (sw, ne) {
		this.southWest = sw;
		this.northEast = ne;

		if (ne && !sw)
			throw new Error("sw must be defined if ne is defined");
		if (sw && !ne) {
			this.northEast = new jobMap.GeoPoint(sw.lat, sw.lng);
		}
	}
	// Indicates if the bounds is empty (contains no point).
	namespace.GeoBounds.prototype.isEmpty = function () {
		return !this.southWest && !this.northEast;
	}
	// Gets size by latitude.
	namespace.GeoBounds.prototype.getSizeLat = function () {
		if (this.isEmpty())
			return 0;
		return this.northEast.lat - this.southWest.lat;
	}
	// Gets size by longitude.
	namespace.GeoBounds.prototype.getSizeLng = function () {
		if (this.isEmpty())
			return 0;
		return jobMap.getLngDiff(this.northEast.lng, this.southWest.lng);
	}
	// Extends the bounds to contain a specified point.
	namespace.GeoBounds.prototype.extend = function (lat, lng) {
		if (this.isEmpty()) {
			this.southWest = new jobMap.GeoPoint(lat, lng);
			this.northEast = new jobMap.GeoPoint(lat, lng);
		} else {
			if (this.southWest == this.northEast) {
				this.northEast = new jobMap.GeoPoint(this.southWest.lat, this.southWest.lng);
			}
			if (lat < this.southWest.lat) {
				this.southWest.lat = lat;
			} else if (lat > this.northEast.lat) {
				this.northEast.lat = lat;
			}
			if (!this._containsLng(lng)) {
				if (jobMap.getLngDiff(this.southWest.lng, lng) < jobMap.getLngDiff(lng, this.northEast.lng)) {
					this.southWest.lng = lng;
				} else {
					this.northEast.lng = lng;
				}
			}
		}
	}
	// Indicates if a specified point is contained in the bounds.
	namespace.GeoBounds.prototype.contains = function (lat, lng) {
		if (!this.isEmpty()) {
			if (lat >= this.southWest.lat && lat <= this.northEast.lat)
				return this._containsLng(lng);
		}
		return false;
	}
	namespace.GeoBounds.prototype._containsLng = function (lng) {
		return (this.southWest.lng <= this.northEast.lng) ?
		           (lng >= this.southWest.lng && lng <= this.northEast.lng) :
				  !(lng < this.southWest.lng && lng > this.northEast.lng);
	}
	namespace.getLngDiff = function (eastLng, westLng) {
		return eastLng >= westLng ?
			eastLng - westLng :
			360 - (westLng - eastLng);
	}

	/**
	 * JobLocation - contains data of a job location of a company.
	 * @param {int}   cid  - company id.
	 * @param {float} lat  - latitude.
	 * @param {float} lng  - longitude.
	 * @param {int}  count - count of jobs.
	 */
	namespace.JobLocation = function (cid, lat, lng, count) {
		this.cid = cid;
		this.lat = lat;
		this.lng = lng;
		this.count = count;
	}

	/**
	 * JobDataSource - provides job data and is intended for optimization of the map performance for large datasets or for a custom clustering (e.g. by administrative division).
	 * @param {int} jobCount - the count of all jobs of the data source (to be displayed in the footer of the map).
	 * @param {jobMap.GeoBounds} extent - the geographical bounds of the all job locations of the data source.
	 * @param {function} getData - the function that gets job data for a specified map extent and zoom level.
	 */
	namespace.JobDataSource = function (jobCount, extent, getData) {
		this.jobCount = jobCount;
		this.extent = extent;

		/**
		 * Gets job data for a specified map extent and zoom level.
		 * @param {GeoBounds} extent.
		 * @param {int} zoomLevel.
		 * @return {jobMap.JobData} 
		 */
		this.getData = getData;
	}

	/**
	 * JobData - contains job data (job locations and/or clusters) to be displayed for a map extent.
	 * @param {Array.<Array.<jobMap.CompanyJobCluster>>}  jobClusters
	 * @param {Array.<jobMap.JobLocation>} jobLocations
	 */
	namespace.JobData = function (jobClusters, jobLocations) {
		this.jobClusters  = jobClusters;
		this.jobLocations = jobLocations;
	}

	/**
	 * CompanyJobCluster - defines a cluster of job locations of a certain company.
	 * @param {int} companyID - ID of the company.
	 * @param {int} jobCount - count of jobs.
	 * @param {int} jobLocationCount - count of job locations.
	 * @param {float} lat - latitude of the cluster centroid.
	 * @param {float} lng - longitude of the cluster centroid.
	 * @param {jobMap.GeoBounds} extent - the geographical bounds of the job locations of this cluster.
	 */
	namespace.CompanyJobCluster = function (companyID, jobCount, jobLocationCount, lat, lng, extent) {
		this.companyID = companyID;
		this.jobCount = jobCount;
		this.jobLocationCount = jobLocationCount;
		this.lat = lat;
		this.lng = lng;
		this.extent = extent;
	}

	/**
	 * Point - represents a point of screen
	 * @param {float} x 
	 * @param {float} y 
	 */
	namespace.Point = function (x, y) {
		this.x = x;
		this.y = y;
	}

	return namespace;
} (jobMap || {}));