(this.webpackJsonpscript=this.webpackJsonpscript||[]).push([[0],{10:function(t,e,n){"use strict";n.r(e);var o=n(2),a=n(3),i=n(7),c=n(4),r=n(8),u=n(0),l=n.n(u),s=n(5),m=n.n(s),d=(n(15),n(6)),f=window.apiURL||"http://127.0.0.1:33003";var p=function(){var t=window.location.search.split("?"),e={};return t.map((function(t){t&&(e[t.split("=")[0]]=t.split("=")[1])})),e},h=function(t){function e(){var t,n;Object(o.a)(this,e);for(var a=arguments.length,r=new Array(a),u=0;u<a;u++)r[u]=arguments[u];return(n=Object(i.a)(this,(t=Object(c.a)(e)).call.apply(t,[this].concat(r)))).state={zoom:100},n}return Object(r.a)(e,t),Object(a.a)(e,[{key:"onPrint",value:function(){this.refs.container.style.opacity="0",window.print(),this.refs.container.style.opacity="1"}},{key:"onSave",value:function(){var t=p(),e={};window.payload&&Object(d.isArray)(window.payload)&&window.payload.map((function(t){e[t]=(document.getElementById(t).value||"").replace(new RegExp("\n"),"|N|")}));var n=JSON.stringify(e)+"";fetch(f+"/api/document/save",{method:"POST",headers:{"Content-type":"application/json; charset=utf-8"},body:JSON.stringify({id:t.id,data:n,photo:document.getElementById("image")||{}.src||""})}).then((function(t){return t.json()})).then((function(t){1===t.ok?alert("L\u01b0u th\xe0nh c\xf4ng"):alert("L\u01b0u th\u1ea5t b\u1ea1i, vui l\xf2ng th\u1eed l\u1ea1i")}))}},{key:"componentDidMount",value:function(){var t=p();fetch(f+"/api/document/get",{method:"POST",headers:{"Content-type":"application/json; charset=utf-8"},body:JSON.stringify({id:t.id})}).then((function(t){return t.json()})).then((function(t){var e=t.data;e&&Object.keys(e).map((function(t){try{var n=(e[t]||"").replace(new RegExp("\\|N\\|"),"\n");document.getElementById(t).value=n}catch(o){}})),t.photo&&(document.getElementById("image").src=t.photo)}))}},{key:"onfileChange",value:function(t){var e=t.target.files[0];if(e){var n=new FileReader;n.onload=function(t){var e=t.target.result;document.getElementById("image").src=e},n.readAsDataURL(e)}}},{key:"onZoomIn",value:function(){var t=this;this.setState({zoom:this.state.zoom+20},(function(){document.getElementById("page-container").style.zoom=t.state.zoom+"%"}))}},{key:"onZoomOut",value:function(){var t=this;this.setState({zoom:this.state.zoom-20},(function(){document.getElementById("page-container").style.zoom=t.state.zoom+"%"}))}},{key:"onRemoveImage",value:function(){document.getElementById("image").src=null}},{key:"render",value:function(){var t=this;return l.a.createElement("div",{className:"xxx__container",ref:"container"},l.a.createElement("input",{type:"file",onChange:function(e){return t.onfileChange(e)},id:"file",className:"custom-file-input"}),l.a.createElement("button",{className:"xxx-button",onClick:function(){return t.onRemoveImage()}},"X\xf3a \u1ea3nh"),l.a.createElement("div",{style:{flex:1}}),l.a.createElement("button",{className:"xxx-button",onClick:function(){return t.onZoomIn()}},"Ph\xf3ng to"),l.a.createElement("button",{className:"xxx-button",onClick:function(){return t.onZoomOut()}},"Thu nh\u1ecf"),l.a.createElement("button",{className:"xxx-button",onClick:function(){return t.onSave()}},"L\u01b0u"),l.a.createElement("button",{className:"xxx-button",onClick:function(){return t.onPrint()}},"In"))}}]),e}(l.a.Component);m.a.render(l.a.createElement(h,null),document.getElementById("fucking"))},15:function(t,e,n){},9:function(t,e,n){t.exports=n(10)}},[[9,1,2]]]);
//# sourceMappingURL=main.46a036ee.chunk.js.map