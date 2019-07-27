
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
	{name: "dob"},
  {name: "life_expectation"}
];

/*
Run the macro
*/
exports.run = function(dob, life_expectation) {
  
  dob = new Date(dob);
  const millsPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const age = Math.round((new Date().getTime() - dob.getTime()) / millsPerYear);
  let lifeExpectation = parseInt(life_expectation)
  if (isNaN(lifeExpectation)) lifeExpectation = 85

  let witiText = "`???`";
  
  if (!isNaN(age) && age >= 0 && age < 100 && lifeExpectation >=0 && lifeExpectation < 100) {
    if (lifeExpectation < age) lifeExpectation = age
    let ageLine = "";
    let decadeLine = "";
    for (let i=0; i <= lifeExpectation; i++) {
      const decade = parseInt(i/10)

      if (i < age && i == decade * 10) ageLine += "╤"
      else if (i < age) ageLine += "═"
      else if (i == age) ageLine += "▷"
      else if (i == decade * 10) ageLine += "┬"
      else ageLine += "─"
      
      if (decade == i/10) decadeLine += decade * 10;
      else if (i > decade * 10 + 1 ) decadeLine += " "
    }
    if (lifeExpectation != parseInt(lifeExpectation/10)*10) decadeLine += " "
    witiText = "`" + ageLine + "`<br>`" + decadeLine + "`<br>";
  }
  
	return witiText;
};

})();