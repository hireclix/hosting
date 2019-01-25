if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start){
		for (var i = (start || 0), j = this.length; i < j; i++) {
		 if (this[i] === obj) { return i; }
		}
		return -1;
	}
}
//Array.prototype.extend = function (other_array) {    
 //   other_array.forEach(function(v) {this.push(v)}, this);    
//}
function isRelativeUrl(u) {
    if (u.indexOf('//') > -1) {
        return false;
    }
    return true;
}
function CompileProps(r, n) {
    for (var i in n) {
        r.push(n[i]);
    }
    //n.forEach(function (v) { r.push(v) }, r);
    return r;
}
function WriteArrayToConsole(a) {    
	for(var i=0;i<a.length;i++){
		window.console&&console.log(a[i]);
	} 
}
function SetNestedObjectProperty(o,p,v){    
    if(typeof o === 'undefined') return false;
    var i = p.indexOf('.')    
    if (i > -1) {        
        SetNestedObjectProperty(o[p.substring(0, i)], p.substr(i+1),v);
    }
    else {        
        o[p] = v;
    }
}
function DedupeArray(o, f) {
    //[v] = value, [n] = number
    var a = o.slice(0);
    if (a.length > 0) {
        if (!f) {
            f = '[v]';
        }
        b = [];
        var c = 1;
        var r = a.splice(0, 1);
        while (a.length > 0 || r) {
            if (a.indexOf(r[0]) > -1) {
                a.splice(a.indexOf(r[0]), 1);
                c++;
            }
            else {
                b.push(f.replace('[v]', r[0]).replace('[n]', c));
                c = 1;
                if (a.length > 0) {
                    r = a.splice(0, 1);
                }
                else {
                    r = null;
                }
            }
        }
        return b;
    }
    return [];
}
//function GetQsParams(qs){  
//	var qd = [];
//	var s = qs || location.search;
//	s = s.indexOf('?') == 0 ? s.substr(1) : s;	
//	s.split("&").forEach(function (item) { var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]); if (!isNaN(v)) { v = Number(v) } (k in qd) ? qd[k].push(v) : qd[k] = [v] })
//	return qd;
//}
function GetQsParams(qs) {
    var qd = [];
    var s = qs || location.search;
    s = s.indexOf('?') == 0 ? s.substr(1) : s;
    var a = s.split("&");
    for (var i = 0; i < a.length; i++) {
        var k = a[i].split("=")[0];
        var v = decodeURIComponent(a[i].split("=")[1]);
        if (!isNaN(v)) {
            v = Number(v)
        }
        (k in qd) ? qd[k].push(v) : qd[k] = [v];
    }
    return qd;
}
function GetObjectProperties(r,o,n){  
	if(typeof o == 'object'){
	    var a = new Array()
	    var added = false;
		for(var prop in o){			
			if (o.hasOwnProperty(prop)) {
				if(prop != 'ObjectName'){					
				    if (o[prop] instanceof Array) {				        
						for(var i=0;i<o[prop].length;i++){								
						    a = GetObjectProperties(r, o[prop][i], n + '.' + prop + '.' + i);						   
						}
					}
					else {					    
					    a = GetObjectProperties(r, o[prop], n + '.' + prop);					    
				    }
				    added = true;
				}
			}        
		}
		
		if (!added) {		    
		    return CompileProps(r, [n]);
		}
		return a;
	}
	else {	    
	    return CompileProps(r, [n]);	    
	}
}
var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

function showMapModal(jqid, href) {
    $(jqid).click(function () {
        if (href) {
            $("#map").attr('src', href);
        }
        else {
            $("#map").attr('src', $(this).attr("href"));
        }        
        $("#map-container, .ui-widget-overlay, .ui-dialog-titlebar").fadeIn('slow');
        $('body').css('overflow', 'hidden')
        $("#map-container").dialog({
            width: 'auto',
            height: 'auto',
            modal: true,
            draggable: false,
            close: function () {
                $("#overlay").fadeOut('slow');
                $('body').css('overflow', 'visible')
            }
        });
        $(".ui-dialog, .ui-widget-overlay").click(function () {
            $("#map-container, .ui-widget-overlay, .ui-dialog-titlebar").fadeOut('slow');
        });
        return false;
    });
}
