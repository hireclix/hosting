(function(){'use strict';var v=[0,0,0,0],x=/[-+]?[0-9]*\.?[0-9]+%/g,y=/[-+]?[0-9]*\.?[0-9]+px/g,z=function(b,c){if(b)for(var k=0;k<c.length;k++){var l=c[k].position/100,g=c[k].value;if(void 0===g.a||null===g.a)g.a=1;b.addColorStop(l,"rgba("+g.r+","+g.g+","+g.b+","+g.a+")")}},A=function(b,c,k){return b?0<=b.indexOf("%")?c+parseInt(b,10)/100*(k-c):0<=b.indexOf("px")?c+parseInt(b,10):c+.5*(k-c):0};var B=function(){};goog.inherits(B,HTMLCanvasElement);
B.prototype.attachedCallback=function(){var b,c,k=this.getContext("2d");var l=this.width;var g=this.height;var a=parseFloat(this.getAttribute("stroke-width"))||0;var f=JSON.parse(this.getAttribute("stroke-color"))||v;var t=parseFloat(this.getAttribute("x-adj"))||0;var m=parseFloat(this.getAttribute("y-adj"))||0;var n=this.getAttribute("slope")||"0",n=isNaN(parseFloat(n))?n:parseFloat(n);k.beginPath();k.lineWidth=a;if(f){if(f.gradientMode)if(a=[[0,0,0],[0,g-0,0],[l-0,g-0,0],[l-0,0,0]],"radial"==f.gradientMode){(b=
f.center)||(b="center");var h=c="center";var e=b.match(x);b=b.match(y);e&&1<e.length?(c=e[0],h=e[1]):b&&1<b.length&&(c=b[0],h=b[1]);c=A(c,a[0][0],a[3][0]);h=A(h,a[0][1],a[1][1]);e=f.shape;b=[.5*(a[0][0]+a[2][0]),.5*(a[0][0]+a[2][0])];var d=c<b[0]?a[2][0]:a[0][0];b=h<b[1]?a[1][1]:a[0][1];d=Math.abs(c-d);b=Math.abs(h-b);var r=a[3][0]-a[0][0];a=a[1][1]-a[0][1];.001<Math.abs(r)&&(a/=r,d=Math.sqrt(d*d+b*b/(a*a)),b=a*d);a=d;e&&"farthest-corner"!=e&&(e=e.match(y))&&1<e.length&&(a=parseFloat(e[0]),b=parseFloat(e[1]));
r=Math.max(a,b);e=document.createElement("canvas");e.width=l;e.height=g;d=e.getContext("2d");r=d.createRadialGradient(c,h,0,c,h,r);z(r,f.color);d.rect(0,0,l,g);if(b<a){f=1;var u=b/a}else u=1,f=a/b;d.save();d.transform(f,0,0,u,f*-c+c,u*-h+h);d.fillStyle=r;d.fill();d.restore();f=d.createPattern(e,"no-repeat")}else{c=0;f.orientation&&(c=parseFloat(f.orientation)*Math.PI/180);isFinite(c)&&!isNaN(c)||(c=0);d=-1*c;c=[];e=[];h=[.5*(a[0][0]+a[2][0]),.5*(a[0][1]+a[2][1])];b=Math.tan(d);if(.001>Math.abs(Math.tan(.5*
Math.PI-.001)-b))e=0<=Math.sin(d)?1:-1,a=.5*(a[2][1]-a[0][1]),c=[h[0],h[1]-e*a],e=[h[0],h[1]+e*a];else{d=0<=Math.cos(d)?1:-1;d=[d,d*b];r=Infinity;u=-Infinity;for(var w=0;4>w;w++){var p=[a[w][0]-h[0],a[w][1]-h[1]],p=b*p[1]+p[0],p=p/(1+b*b);var q=[p,p*b];p=(0<d[0]*q[0]+d[1]*q[1]?1:-1)*Math.sqrt(q[0]*q[0]+q[1]*q[1]);q=[q[0]+h[0],q[1]+h[1]];p<r&&(c=q,r=p);p>u&&(e=q,u=p)}}a=k.createLinearGradient(c[0],c[1],e[0],e[1]);z(a,f.color);f=a}else f="rgba("+Math.floor(255*f[0])+","+Math.floor(255*f[1])+","+Math.floor(255*
f[2])+","+f[3]+")";k.strokeStyle=f;switch(n){case "vertical":n=[.5*l,0];m=[.5*l,g];break;case "horizontal":n=[0,.5*g];m=[l,.5*g];break;default:0<n?(n=[t,m],m=[l-t,g-m]):(n=[t,g-m],m=[l-t,m])}l=n[0];t=n[1];g=m[0];m=m[1];k.moveTo(l,t);k.lineTo(g,m);k.stroke()}};B.prototype.attributeChangedCallback=function(){};document.registerElement("gwd-line",{prototype:B.prototype,"extends":"canvas"});}).call(this);
