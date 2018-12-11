!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e){var n,o,i=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});!function(t){var e=function(){return function(){this.stroke="BLUE",this.strokeWidth=3}}(),n=function(){function t(t,n){this.path=n||"",this.pathProperties=t||new e,this.coordinates=[],this.currentPos={x:0,y:0}}return t.prototype.moveTo=function(t,e){return this.coordinates.push({x:t,y:e}),this.currentPos={x:t,y:e},this.path+="M "+t+" "+e+" ",this},t.prototype.lineTo=function(t,e){return this.currentPos={x:t,y:e},this.path+="L "+t+" "+e+" ",this},t.prototype.LineH=function(t){return this.currentPos.x=t,this.path+="H "+t+" ",this},t.prototype.LineV=function(t){return this.currentPos.y=t,this.path+="V "+t+" ",this},t.prototype.render=function(){return'<path d=" '+this.path+' "stroke='+this.pathProperties.stroke+" stroke-width="+this.pathProperties.strokeWidth+" />"},t}(),o=function(){function t(t,e,n){this.content=t,this.fontSize=e,this.position=n}return t.prototype.render=function(){return"<text font-size="+this.fontSize+'x="'+this.position.x+'" y="'+this.position.y+'" class="small">'+this.content+"</text>"},t}(),r=(function(){}(),function(){function t(t,n){this._data=n||[],this.div=document.getElementById(t),this.dimensions={width:this.div.offsetWidth,height:this.div.offsetHeight},this.graphProps=new e}return t.prototype.coordinates=function(t,e){for(var n=[],o=e.width/t.length,i=this.boundsOfData(t),r=0;r<t.length;r++)n.push({x:o*r+50,y:e.height-t[r].value/i.max*e.height});return n},t.prototype.createYHeaders=function(){for(var t=this.boundsOfData(this._data),e=[],n=0;n<10;n++){var i=Math.floor(t.max-n*t.max/10).toString();e.push(new o(i,12,{x:0,y:this.dimensions.height/10*n+6}))}return e},t.prototype.createReferenceLines=function(t){for(var e={stroke:"#dbdbdb",strokeWidth:.5},o=e.strokeWidth/2,i=new n(e),r=this.coordinates(this._data,this.dimensions),s=1;s<r.length;s++)i.moveTo(r[s].x-o,o),i.LineV(this.dimensions.height-o);for(s=0;s<t;s++)i.moveTo(o+50,this.dimensions.height/t*s+o),i.LineH(this.dimensions.width-o);return i},t.prototype.createGraph=function(){var t=new n;return t.moveTo(0,0),t.lineTo(100,100),t},t.prototype.addPoint=function(t,e){null!=e?this._data.splice(e,0,t):this._data.push(t)},t.prototype.removePoint=function(t){this._data.splice(t,1)},Object.defineProperty(t.prototype,"data",{set:function(t){this._data=t,(void 0).push(this.createReferenceLines(10)),(void 0).push(this.createGraph()),(void 0).concat(this.createYHeaders()),this.chartComponents=void 0},enumerable:!0,configurable:!0}),t.prototype.boundsOfData=function(t){if(!t)return{min:0,max:0};var e=t.map(function(t){return t.value}),n=Math.max.apply(Math,e);return{min:Math.min.apply(Math,e),max:n}},t.prototype.draw=function(){return'<svg id="mainSVG" preserveAspectRatio="xMinYMin none" width="100%" height="100%" viewBox="0 0 '+this.dimensions.width+" "+this.dimensions.height+'" height=>'+this.chartComponents.forEach(function(t){return t.render()})+"</svg>"},t.prototype.drawChart=function(){this.chartComponents?this.div.innerHTML+=this.draw():console.log("Data not set!")},t.prototype.connectPoints=function(t,e,n){n.lineTo(t,e).moveTo(t,e)},t}());t.XYChart=r;var s=function(t){function e(e,n){var o=t.call(this,e,n)||this;return console.log("chart created!"),o}return i(e,t),e.prototype.connectPoints=function(t,e,n){var o=e<n.currentPos.y,i=this.graphProps.strokeWidth/2;n.LineH(t).moveTo(t-i,o?n.currentPos.y+i:n.currentPos.y-i).LineV(o?e+i:e-i).moveTo(n.currentPos.x-i,n.currentPos.y)},e.prototype.createGraph=function(){for(var t=new n(this.graphProps),e={width:this.dimensions.width-200,height:this.dimensions.height-100},o=this.coordinates(this._data,e),i=0;i<o.length;i++)0==i&&t.moveTo(o[i].x,o[i].y),this.connectPoints(o[i].x,o[i].y,t);return t.LineH(e.width+t.pathProperties.strokeWidth/2),t},e}(r);t.StepLineChart=s}(o||(o={}))}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbImluc3RhbGxlZE1vZHVsZXMiLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwibW9kdWxlSWQiLCJleHBvcnRzIiwibW9kdWxlIiwiaSIsImwiLCJtb2R1bGVzIiwiY2FsbCIsIm0iLCJjIiwiZCIsIm5hbWUiLCJnZXR0ZXIiLCJvIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiciIsIlN5bWJvbCIsInRvU3RyaW5nVGFnIiwidmFsdWUiLCJ0IiwibW9kZSIsIl9fZXNNb2R1bGUiLCJucyIsImNyZWF0ZSIsImtleSIsImJpbmQiLCJuIiwib2JqZWN0IiwicHJvcGVydHkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsInAiLCJzIiwiZ3JhcGh5IiwiUGF0aFByb3BlcnRpZXMiLCJ0aGlzIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJQYXRoIiwicGF0aFByb3BlcnRpZXMiLCJwYXRoIiwiY29vcmRpbmF0ZXMiLCJjdXJyZW50UG9zIiwieCIsInkiLCJtb3ZlVG8iLCJwdXNoIiwibGluZVRvIiwiTGluZUgiLCJMaW5lViIsInJlbmRlciIsIlRleHQiLCJjb250ZW50IiwiZm9udFNpemUiLCJwb3NpdGlvbiIsIlhZQ2hhcnQiLCJkaXYiLCJkYXRhIiwiX2RhdGEiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZGltZW5zaW9ucyIsIndpZHRoIiwib2Zmc2V0V2lkdGgiLCJoZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJncmFwaFByb3BzIiwiZGF0YU9iamVjdCIsImNvb3JkcyIsImludGVydmFsWCIsImxlbmd0aCIsImJvdW5kcyIsImJvdW5kc09mRGF0YSIsIm1heCIsImNyZWF0ZVlIZWFkZXJzIiwicmVzdWx0IiwiTWF0aCIsImZsb29yIiwidG9TdHJpbmciLCJjcmVhdGVSZWZlcmVuY2VMaW5lcyIsImRlbnNpdHkiLCJoYWxmU3Ryb2tlIiwiY3JlYXRlR3JhcGgiLCJhZGRQb2ludCIsInBvaW50IiwiaW5kZXgiLCJzcGxpY2UiLCJyZW1vdmVQb2ludCIsImNvbXBvbmVudHMiLCJjb25jYXQiLCJjaGFydENvbXBvbmVudHMiLCJtaW4iLCJ2YWx1ZXMiLCJtYXAiLCJlbCIsImFwcGx5IiwiZHJhdyIsImZvckVhY2giLCJkcmF3Q2hhcnQiLCJpbm5lckhUTUwiLCJjb25zb2xlIiwibG9nIiwiY29ubmVjdFBvaW50cyIsIlN0ZXBMaW5lQ2hhcnQiLCJfc3VwZXIiLCJfdGhpcyIsIl9fZXh0ZW5kcyIsIm1vdmluZ1VwIl0sIm1hcHBpbmdzIjoiYUFDQSxJQUFBQSxFQUFBLEdBR0EsU0FBQUMsRUFBQUMsR0FHQSxHQUFBRixFQUFBRSxHQUNBLE9BQUFGLEVBQUFFLEdBQUFDLFFBR0EsSUFBQUMsRUFBQUosRUFBQUUsR0FBQSxDQUNBRyxFQUFBSCxFQUNBSSxHQUFBLEVBQ0FILFFBQUEsSUFVQSxPQU5BSSxFQUFBTCxHQUFBTSxLQUFBSixFQUFBRCxRQUFBQyxJQUFBRCxRQUFBRixHQUdBRyxFQUFBRSxHQUFBLEVBR0FGLEVBQUFELFFBS0FGLEVBQUFRLEVBQUFGLEVBR0FOLEVBQUFTLEVBQUFWLEVBR0FDLEVBQUFVLEVBQUEsU0FBQVIsRUFBQVMsRUFBQUMsR0FDQVosRUFBQWEsRUFBQVgsRUFBQVMsSUFDQUcsT0FBQUMsZUFBQWIsRUFBQVMsRUFBQSxDQUEwQ0ssWUFBQSxFQUFBQyxJQUFBTCxLQUsxQ1osRUFBQWtCLEVBQUEsU0FBQWhCLEdBQ0Esb0JBQUFpQixlQUFBQyxhQUNBTixPQUFBQyxlQUFBYixFQUFBaUIsT0FBQUMsWUFBQSxDQUF3REMsTUFBQSxXQUV4RFAsT0FBQUMsZUFBQWIsRUFBQSxjQUFpRG1CLE9BQUEsS0FRakRyQixFQUFBc0IsRUFBQSxTQUFBRCxFQUFBRSxHQUVBLEdBREEsRUFBQUEsSUFBQUYsRUFBQXJCLEVBQUFxQixJQUNBLEVBQUFFLEVBQUEsT0FBQUYsRUFDQSxLQUFB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QUFLMEIsV0FBV0csT0FBUyxLQUNwRkksRUFBU2pDLEtBQUtNLFlBQVlOLEtBQUt1QixNQUFPRyxHQUVsQzVELEVBQUksRUFBR0EsRUFBSW1FLEVBQU9FLE9BQVFyRSxJQUN0QixHQUFMQSxHQUNDdUMsRUFBS0ssT0FBT3VCLEVBQU9uRSxHQUFHMEMsRUFBR3lCLEVBQU9uRSxHQUFHMkMsR0FDdkNULEtBQUttRSxjQUFjbEMsRUFBT25FLEdBQUcwQyxFQUFHeUIsRUFBT25FLEdBQUcyQyxFQUFHSixHQUdqRCxPQURBQSxFQUFLUSxNQUFNYSxFQUFXQyxNQUFRdEIsRUFBS0QsZUFBZUYsWUFBYyxHQUN6REcsR0FFZitELEVBL0JBLENBQW1DaEQsR0FBdEJ0QixFQUFBc0UsY0FBYUEsRUF4TjlCLENBQVV0RSxNQUFNIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIm5hbWVzcGFjZSBncmFwaHkge1xyXG4gICAgdHlwZSBDb2xvciA9IFwiI0ZGRkZGRlwiIHwgXCIjRkYwMDAwXCIgfCBcIiMwMDAwRkZcIjtcclxuICAgIGNvbnN0IFdISVRFOiBDb2xvciA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgY29uc3QgUkVEOiBDb2xvciA9IFwiI0ZGMDAwMFwiO1xyXG4gICAgY29uc3QgQkxVRTogQ29sb3IgPSBcIiMwMDAwRkZcIjtcclxuICAgIFxyXG4gICAgaW50ZXJmYWNlIENoYXJ0Q29tcG9uZW50IHtcclxuICAgICAgICByZW5kZXI6ICgpPT5zdHJpbmcgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsYXNzIFBhdGhQcm9wZXJ0aWVzIHtcclxuICAgICAgICBzdHJva2U6IHN0cmluZyA9IFwiQkxVRVwiO1xyXG4gICAgICAgIHN0cm9rZVdpZHRoOiBudW1iZXIgPSAzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGFzcyBQYXRoIGltcGxlbWVudHMgQ2hhcnRDb21wb25lbnQge1xyXG4gICAgICAgIHBhdGhQcm9wZXJ0aWVzOiBQYXRoUHJvcGVydGllcztcclxuICAgICAgICBwYXRoOiBzdHJpbmc7XHJcbiAgICAgICAgY29vcmRpbmF0ZXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfVtdO1xyXG4gICAgICAgIGN1cnJlbnRQb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcclxuICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhdGhQcm9wZXJ0aWVzPzogUGF0aFByb3BlcnRpZXMsIHBhdGg/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXRoID0gcGF0aCA/IHBhdGggOiAnJzsgXHJcbiAgICAgICAgICAgIHRoaXMucGF0aFByb3BlcnRpZXMgPSBwYXRoUHJvcGVydGllcyA/IHBhdGhQcm9wZXJ0aWVzIDogbmV3IFBhdGhQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHVibGljIG1vdmVUbyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzLnB1c2goeyB4OiB4LCB5OiB5IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSB7IHg6IHgsIHk6IHkgfTtcclxuICAgICAgICAgICAgdGhpcy5wYXRoICs9ICdNICcgKyB4ICsgJyAnICsgeSArICcgJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHVibGljIGxpbmVUbyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSB7IHg6IHgsIHk6IHkgfTtcclxuICAgICAgICAgICAgdGhpcy5wYXRoICs9ICdMICcgKyB4ICsgJyAnICsgeSArICcgJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHVibGljIExpbmVIKHg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aCArPSAnSCAnICsgeCArICcgJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHVibGljIExpbmVWKHk6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aCArPSAnViAnICsgeSArICcgJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHVibGljIHJlbmRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gJzxwYXRoIGQ9XCIgJyArIHRoaXMucGF0aCArICcgXCInICtcclxuICAgICAgICAgICAgJ3N0cm9rZT0nKyB0aGlzLnBhdGhQcm9wZXJ0aWVzLnN0cm9rZSArICcgc3Ryb2tlLXdpZHRoPScgKyB0aGlzLnBhdGhQcm9wZXJ0aWVzLnN0cm9rZVdpZHRoICsgJyAvPic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGFzcyBUZXh0IGltcGxlbWVudHMgQ2hhcnRDb21wb25lbnQge1xyXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcclxuICAgICAgICBmb250U2l6ZTogbnVtYmVyO1xyXG4gICAgICAgIHBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XHJcbiAgICBcclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250ZW50OiBzdHJpbmcsIGZvbnRTaXplOiBudW1iZXIsIHBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICAgICAgdGhpcy5mb250U2l6ZSA9IGZvbnRTaXplO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyByZW5kZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuICc8dGV4dCBmb250LXNpemU9JyArIHRoaXMuZm9udFNpemUgKyAneD1cIicgKyB0aGlzLnBvc2l0aW9uLnggKyAnXCIgeT1cIicgKyB0aGlzLnBvc2l0aW9uLnkgKyAnXCIgY2xhc3M9XCJzbWFsbFwiPicgKyB0aGlzLmNvbnRlbnQgKyAnPC90ZXh0PidcclxuICAgICAgICAgICAgLy8nPHRleHQgZm9udC1zaXplPScgKyB0aGlzLmZvbnRTaXplICsgJ3g9XCInICsgMCArICdcIiB5PVwiJyArICh0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0IC8gMTAgKiBpICsgNikgKyAnXCIgY2xhc3M9XCJzbWFsbFwiPicgKyAoTWF0aC5mbG9vcihib3VuZHMubWF4IC0gaSAqIGJvdW5kcy5tYXggLyAxMCkpICsgJzwvdGV4dD4nXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGF0YU9iamVjdCB7XHJcbiAgICAgICAga2V5OiBhbnk7XHJcbiAgICAgICAgdmFsdWU6IG51bWJlcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgaW50ZXJmYWNlIFJlY3RhbmdsZSB7XHJcbiAgICAgICAgeDogbnVtYmVyO1xyXG4gICAgICAgIHk6IG51bWJlcjtcclxuICAgICAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgICAgIGhlaWdodDogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGFzcyBQYW5lIHtcclxuICAgICAgICBib3VuZHM6IFJlY3RhbmdsZTtcclxuICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlY3Q6IFJlY3RhbmdsZSkge1xyXG4gICAgICAgICAgICB0aGlzLmJvdW5kcyA9IHJlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFhZQ2hhcnQge1xyXG4gICAgICAgIHByb3RlY3RlZCBfZGF0YTogRGF0YU9iamVjdFtdO1xyXG4gICAgICAgIHByb3RlY3RlZCBkaXY6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHByb3RlY3RlZCBkaW1lbnNpb25zOiB7IHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH07XHJcbiAgICAgICAgcHJvdGVjdGVkIGNoYXJ0Q29tcG9uZW50czogQ2hhcnRDb21wb25lbnRbXTtcclxuICAgICAgICBwdWJsaWMgZ3JhcGhQcm9wczogUGF0aFByb3BlcnRpZXM7XHJcbiAgICBcclxuICAgICAgICBjb25zdHJ1Y3RvcihkaXY6IHN0cmluZywgZGF0YT86IERhdGFPYmplY3RbXSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhID0gZGF0YSA/IGRhdGEgOiBbXTtcclxuICAgICAgICAgICAgdGhpcy5kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXYpO1xyXG4gICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSB7IHdpZHRoOiB0aGlzLmRpdi5vZmZzZXRXaWR0aCwgaGVpZ2h0OiB0aGlzLmRpdi5vZmZzZXRIZWlnaHQgfTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaFByb3BzID0gbmV3IFBhdGhQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHJvdGVjdGVkIGNvb3JkaW5hdGVzKGRhdGFPYmplY3Q6IERhdGFPYmplY3RbXSwgZGltZW5zaW9uczogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9KTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9W10ge1xyXG4gICAgICAgICAgICBsZXQgY29vcmRzID0gW107XHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbFggPSAoZGltZW5zaW9ucy53aWR0aCkgLyBkYXRhT2JqZWN0Lmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGJvdW5kcyA9IHRoaXMuYm91bmRzT2ZEYXRhKGRhdGFPYmplY3QpO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZGF0YU9iamVjdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29vcmRzLnB1c2goeyB4OiBpbnRlcnZhbFggKiBpICsgNTAsIHk6IGRpbWVuc2lvbnMuaGVpZ2h0IC0gZGF0YU9iamVjdFtpXS52YWx1ZSAvIGJvdW5kcy5tYXggKiBkaW1lbnNpb25zLmhlaWdodCB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb29yZHM7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVlIZWFkZXJzKCk6IFRleHRbXSB7XHJcbiAgICAgICAgICAgIGxldCBib3VuZHMgPSAgdGhpcy5ib3VuZHNPZkRhdGEodGhpcy5fZGF0YSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGZvbnRTaXplID0gMTI7IC8vIHJhdGlvIG9mIGRpbWVuc2lvbnM/XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudCA9IChNYXRoLmZsb29yKGJvdW5kcy5tYXggLSBpICogYm91bmRzLm1heCAvIDEwKSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBUZXh0KGNvbnRlbnQsIGZvbnRTaXplLCB7IHg6IDAsIHk6ICh0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0IC8gMTAgKiBpICsgZm9udFNpemUgLyAyKSB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlUmVmZXJlbmNlTGluZXMoZGVuc2l0eTogbnVtYmVyKTogUGF0aCB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoUHJvcGVydGllcyA9IHsgc3Ryb2tlOiBcIiNkYmRiZGJcIiwgc3Ryb2tlV2lkdGg6IDAuNSB9O1xyXG4gICAgICAgICAgICBsZXQgaGFsZlN0cm9rZSA9IHBhdGhQcm9wZXJ0aWVzLnN0cm9rZVdpZHRoIC8gMjtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSBuZXcgUGF0aChwYXRoUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIGxldCBjb29yZHMgPSB0aGlzLmNvb3JkaW5hdGVzKHRoaXMuX2RhdGEsIHRoaXMuZGltZW5zaW9ucyk7XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8IGNvb3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGF0aC5tb3ZlVG8oY29vcmRzW2ldLnggLSBoYWxmU3Ryb2tlLCBoYWxmU3Ryb2tlKTtcclxuICAgICAgICAgICAgICAgIHBhdGguTGluZVYodGhpcy5kaW1lbnNpb25zLmhlaWdodCAtIGhhbGZTdHJva2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGRlbnNpdHk7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGF0aC5tb3ZlVG8oaGFsZlN0cm9rZSArIDUwLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0IC8gZGVuc2l0eSAqIGkgKyBoYWxmU3Ryb2tlKTtcclxuICAgICAgICAgICAgICAgIHBhdGguTGluZUgodGhpcy5kaW1lbnNpb25zLndpZHRoIC0gaGFsZlN0cm9rZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlR3JhcGgoKTogUGF0aCB7XHJcbiAgICAgICAgICAgIGxldCBwYXRoID0gbmV3IFBhdGgoKTtcclxuICAgICAgICAgICAgcGF0aC5tb3ZlVG8oMCwgMCk7XHJcbiAgICAgICAgICAgIHBhdGgubGluZVRvKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHVibGljIGFkZFBvaW50KHBvaW50OiBEYXRhT2JqZWN0LCBpbmRleD86IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YS5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9kYXRhLnNwbGljZShpbmRleCwgMCwgcG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVQb2ludChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzZXQgZGF0YShkYXRhOiBEYXRhT2JqZWN0W10pIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGxldCBjb21wb25lbnRzOiBDaGFydENvbXBvbmVudFtdO1xyXG4gICAgICAgICAgICBjb21wb25lbnRzLnB1c2godGhpcy5jcmVhdGVSZWZlcmVuY2VMaW5lcygxMCkpO1xyXG4gICAgICAgICAgICBjb21wb25lbnRzLnB1c2godGhpcy5jcmVhdGVHcmFwaCgpKTtcclxuICAgICAgICAgICAgY29tcG9uZW50cy5jb25jYXQodGhpcy5jcmVhdGVZSGVhZGVycygpKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFydENvbXBvbmVudHMgPSBjb21wb25lbnRzO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHByb3RlY3RlZCBib3VuZHNPZkRhdGEoZGF0YU9iamVjdDogRGF0YU9iamVjdFtdKSB7XHJcbiAgICAgICAgICAgIGlmKCFkYXRhT2JqZWN0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbWluOiAwLCBtYXg6IDAgfTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGRhdGFPYmplY3QubWFwKGVsID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbC52YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxldCBtYXggPSBNYXRoLm1heCguLi52YWx1ZXMpO1xyXG4gICAgICAgICAgICBsZXQgbWluID0gTWF0aC5taW4oLi4udmFsdWVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgbWluOiBtaW4sIG1heDogbWF4IH07XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcHJvdGVjdGVkIGRyYXcoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAgJzxzdmcgaWQ9XCJtYWluU1ZHXCIgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pbllNaW4gbm9uZVwiICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAndmlld0JveD1cIjAgMCAnICsgdGhpcy5kaW1lbnNpb25zLndpZHRoICsgJyAnICsgdGhpcy5kaW1lbnNpb25zLmhlaWdodCArICdcIiBoZWlnaHQ9JyArICc+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRDb21wb25lbnRzLmZvckVhY2goZWwgPT4gZWwucmVuZGVyKCkpICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9zdmc+JztcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBwdWJsaWMgZHJhd0NoYXJ0KCkge1xyXG4gICAgICAgICAgICBpZighdGhpcy5jaGFydENvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YSBub3Qgc2V0IVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRpdi5pbm5lckhUTUwgKz0gdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kaXYucXVlcnlTZWxlY3RvcignI21haW5TVkcnKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2QnLCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBwcm90ZWN0ZWQgY29ubmVjdFBvaW50cyh4OiBudW1iZXIsIHk6IG51bWJlciwgcGF0aDogUGF0aCkge1xyXG4gICAgICAgICAgICBwYXRoLmxpbmVUbyh4LCB5KS5tb3ZlVG8oeCwgeSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU3RlcExpbmVDaGFydCBleHRlbmRzIFhZQ2hhcnQge1xyXG4gICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoZGl2OiBzdHJpbmcsIGRhdGE/OiBEYXRhT2JqZWN0W10pIHtcclxuICAgICAgICAgICAgc3VwZXIoZGl2LCBkYXRhKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGFydCBjcmVhdGVkIVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJvdGVjdGVkIGNvbm5lY3RQb2ludHMoeDogbnVtYmVyLCB5OiBudW1iZXIsIHBhdGg6IFBhdGgpIHtcclxuICAgICAgICAgICAgbGV0IG1vdmluZ1VwID0geSA8IHBhdGguY3VycmVudFBvcy55O1xyXG4gICAgICAgICAgICBsZXQgaGFsZlN0cm9rZSA9IHRoaXMuZ3JhcGhQcm9wcy5zdHJva2VXaWR0aCAvIDI7XHJcbiAgICBcclxuICAgICAgICAgICAgcGF0aFxyXG4gICAgICAgICAgICAgICAgLkxpbmVIKHgpXHJcbiAgICAgICAgICAgICAgICAubW92ZVRvKHggLSBoYWxmU3Ryb2tlLCBtb3ZpbmdVcCA/IHBhdGguY3VycmVudFBvcy55ICsgaGFsZlN0cm9rZSA6IHBhdGguY3VycmVudFBvcy55IC0gaGFsZlN0cm9rZSlcclxuICAgICAgICAgICAgICAgIC5MaW5lVihtb3ZpbmdVcCA/IHkgKyBoYWxmU3Ryb2tlIDogeSAtIGhhbGZTdHJva2UpXHJcbiAgICAgICAgICAgICAgICAubW92ZVRvKHBhdGguY3VycmVudFBvcy54IC0gaGFsZlN0cm9rZSwgcGF0aC5jdXJyZW50UG9zLnkpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVHcmFwaCgpOiBQYXRoIHtcclxuICAgICAgICAgICAgbGV0IHBhdGggPSBuZXcgUGF0aCh0aGlzLmdyYXBoUHJvcHMpO1xyXG4gICAgICAgICAgICBsZXQgZGltZW5zaW9ucyA9IHsgd2lkdGg6IHRoaXMuZGltZW5zaW9ucy53aWR0aCAtIDIwMCwgaGVpZ2h0OiB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0IC0gMTAwIH07XHJcbiAgICAgICAgICAgIGxldCBjb29yZHMgPSB0aGlzLmNvb3JkaW5hdGVzKHRoaXMuX2RhdGEsIGRpbWVuc2lvbnMpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKGkgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICBwYXRoLm1vdmVUbyhjb29yZHNbaV0ueCwgY29vcmRzW2ldLnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0UG9pbnRzKGNvb3Jkc1tpXS54LCBjb29yZHNbaV0ueSwgcGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGF0aC5MaW5lSChkaW1lbnNpb25zLndpZHRoICsgcGF0aC5wYXRoUHJvcGVydGllcy5zdHJva2VXaWR0aCAvIDIpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIH0gLy8gTmFtZXNwYWNlIGVuZCJdLCJzb3VyY2VSb290IjoiIn0=