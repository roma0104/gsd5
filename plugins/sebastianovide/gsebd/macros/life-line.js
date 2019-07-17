
/*\
title: $:/plugins/sebastianovide/gsebd/macro/life-line.js
type: application/javascript
module-type: macro
Macro to return a formatted version of the current time
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "life-line";

exports.params = [
	{name: "edge"},
  {max: "max"}
];

/*
Run the macro
*/
exports.run = function(edge, max) {
  edge = parseInt(edge)
  max = parseInt(max)
  if (isNaN(max)) max = 85

  let witiText = "`???`";
  
  if (!isNaN(edge) && edge >= 0) {
    if (max < edge) max = edge
    let edgeLine = "";
    let decadeLine = "";
    for (let i=0; i <= max; i++) {
      const decade = parseInt(i/10)

      if (i < edge) edgeLine += "X"
      else if (i == edge) edgeLine += "!"
      else if (i == decade * 10) edgeLine += "+"
      else edgeLine += "-"
      
      if (decade == i/10) decadeLine += decade * 10;
      else if (i > decade * 10 + 1 ) decadeLine += " "
    }
    if (max != parseInt(max/10)*10) decadeLine += " "
    witiText = "`" + edgeLine + "`<br>`" + decadeLine + "`<br>";
  }
  
	return witiText;
};

})();