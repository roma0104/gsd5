/*\
title: $:/plugins/sebastianovide/gsebd/modules/widgets/lifeLine.js
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

  MyWidget.prototype = new Widget();

  MyWidget.prototype.render = function(parent,nextSibling) {
      this.parentDomNode = parent;
      this.computeAttributes();

      const dob = new Date(this.getAttribute("dob", ""));
      const millsPerYear = 365.25 * 24 * 60 * 60 * 1000;
      const age = Math.round((new Date().getTime() - dob.getTime()) / millsPerYear);
      let lifeExpectation = parseInt(this.getAttribute("life_expectation", ""))
      let retirementAge = parseInt(this.getAttribute("retirement_age", ""))

      let domString = "`???`";
            
      if (!isNaN(age) && age >= 0 && age < 100 && !isNaN(lifeExpectation) && lifeExpectation >=0 && lifeExpectation < 100) {

        const WIDTH = this.parentDomNode.offsetWidth;
        const HEIGHT = 20;
        const STW = 3;
        const D = (WIDTH - STW) / lifeExpectation;
        const SYMBOL_SIZE = 40;
        const SYMBOL_X_CORRECTION = -SYMBOL_SIZE/2;
        const YCORRECTION = 20;
        
        domString = `<svg height="${HEIGHT + 40}" width="${WIDTH}" stroke="black">`

        domString += `<rect x="${STW/2}" y="${STW/2 + YCORRECTION}" width="${lifeExpectation * D}" height="${HEIGHT}" fill="green" stroke-width="${STW}" />`

        if (!isNaN(retirementAge) && retirementAge > age) domString += `<rect x="${STW/2 + age * D}" y="${STW/2 + YCORRECTION}" width="${(retirementAge - age) * D}" height="${HEIGHT}" fill="yellow" stroke-width="${STW}" />`

        domString += `<rect x="${STW/2}" y="${STW/2 + YCORRECTION}" width="${age * D}" height="${HEIGHT}" fill="red" stroke-width="${STW}" />`
        
        for (let i = 0; i < lifeExpectation; i = i + 10) {
          const X = i * D;
          domString += `<line x1="${X}" y1="${HEIGHT + YCORRECTION}" x2="${X}" y2="${YCORRECTION}"/>`
          domString += `<text x="${X - 9}" y="${37 + YCORRECTION}">${i}</text>`
        }
        
        domString += `<text x="${age * D + SYMBOL_X_CORRECTION + STW}" y="${20 + YCORRECTION}" style="font-size:${SYMBOL_SIZE};">🔥</text>`

        if (!isNaN(retirementAge)) domString += `<text x="${retirementAge * D + SYMBOL_X_CORRECTION + STW}" y="${9 + SYMBOL_SIZE/2  + YCORRECTION}" style="font-size:${SYMBOL_SIZE};">🚷</text>`
            
        // find tiddlers tagged $:/plugins/sebastianovide/gsebd/ui/pd/life-line   
        $tw.wiki.forEachTiddler( (title, tiddler) => {
          if (tiddler.fields.tags && tiddler.fields.tags.includes("$:/plugins/sebastianovide/gsebd/ui/pd/life-line")) {
            const age = Number(tiddler.fields.age);
          
            // TODO: text
            if (age>=0 && age<100)
              domString += `<text x="${age * D + SYMBOL_X_CORRECTION + STW}" y="${9 + SYMBOL_SIZE/2  + YCORRECTION}" style="font-size:${SYMBOL_SIZE};">${tiddler.fields.icon || '❗️'}</text>`
          }
        })
        
        domString += '</svg>'
      }

      const parser = new DOMParser();    
      const html = parser.parseFromString(domString, 'text/html');    
      const svgNode = html.body.firstChild;
      parent.insertBefore(svgNode,nextSibling);
      this.domNodes.push(svgNode);
  };

  MyWidget.prototype.refresh = function(changedTiddlers) {
    this.refreshSelf();
    return true;
  };

  exports.lifeLine = MyWidget;

})();