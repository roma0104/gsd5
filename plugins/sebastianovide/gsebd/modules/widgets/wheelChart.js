/*\
title: $:/plugins/sebastianovide/gsebd/modules/widgets/wheelChart.js
type: application/javascript
module-type: widget


\*/
(function(){

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";
  
  const Widget = require("$:/core/modules/widgets/widget.js").widget;

  const MyWidget = function(parseTreeNode,options) {
      this.initialise(parseTreeNode,options);
  };

  function calcColor(points, R) {
    let area = 0
    if (points.length>2) {
      for (let i=0; i<points.length-1; i++) {
        area += points[i].x*points[i+1].y-points[i+1].x*points[i].y;
      }
      area += points[points.length-1].x*points[0].y-points[0].x*points[points.length-1].y;
      area = area / 2;
    }
    
    // calc polygn fill color based on the area size
    let color = "red";
    if (area > Math.pow((2/3)*R,2)*Math.PI) {
      color = "green";
    } else if (area > Math.pow((1/3)*R,2)*Math.PI) {
      color = "yellow"
    }
    
    return color;
  }

  MyWidget.prototype = new Widget();

  MyWidget.prototype.render = function(parent,nextSibling) {
      this.parentDomNode = parent;
      this.computeAttributes();

      const values = this.getAttribute("values", "").match(/-?[0-9]+/g) || [];
      const SIZE = this.getAttribute("size", 200);
      const MIN = -3;
      const MAX = 3
      const D = MAX-MIN;
      const SW = 3;
      const R = (SIZE - SW) / 2;
      const CX = SIZE / 2;
      const CY = CX;    
      
      const parser = new DOMParser();        
      let domString = `<svg height="${SIZE}" width="${SIZE}">`
      domString += `<circle cx="${CX}" cy="${CY}" r="${R}" stroke="black" stroke-width="${SW}" fill="green" />`
      domString += `<circle cx="${CX}" cy="${CY}" r="${2*R/3}" stroke="black" stroke-width="0" fill="yellow" />`
      domString += `<circle cx="${CX}" cy="${CY}" r="${R/3}" stroke="black" stroke-width="0" fill="red" />`
      let angle = 0;
      const points = [];
      values.forEach( value => {
        const AREA_R = ((value - MIN) / D) * R;
        const x = AREA_R * Math.cos(angle) + CX;
        const y = AREA_R * Math.sin(angle) + CY;
        domString += `<circle cx="${x}" cy="${y}" r="${SW}" stroke="black" stroke-width="${SW}" fill="red" />` 
        points.push({x,y});
        angle += 2 * Math.PI/values.length;
      })
                              
      const pointsStr = points.reduce( (a,e) => `${a}${e.x},${e.y} `, "" );
      const color = calcColor(points, R);
      domString += `<polygon points="${pointsStr}" fill="${color}" stroke="black" stroke-width="${SW}" fill-opacity="0.8" />`
      domString += `<circle cx="${CX}" cy="${CY}" r="${SW}" stroke="black" stroke-width="${SW}" fill="red" />`  
      domString += '</svg>'
            
      const html = parser.parseFromString(domString, 'text/html');    
      const svgNode = html.body.firstChild;
      parent.insertBefore(svgNode,nextSibling);
      this.domNodes.push(svgNode);
  };

  MyWidget.prototype.refresh = function(changedTiddlers) {
    this.refreshSelf();
    return true;
  };

  exports.wheelChart = MyWidget;

})();