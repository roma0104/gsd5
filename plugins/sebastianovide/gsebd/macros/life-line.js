
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
  {name: "life_expectation"},
  {name: "retirement_age"}
];

function validRetirment(retirementAge) {
  
}

/*
Run the macro
*/
exports.run = function(dob, life_expectation, retirement_age) {
  dob = new Date(dob);
  const millsPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const age = Math.round((new Date().getTime() - dob.getTime()) / millsPerYear);
  let lifeExpectation = parseInt(life_expectation)
  let retirementAge = parseInt(retirement_age)

  // if (isNaN(lifeExpectation)) lifeExpectation = 85
  // if (isNaN(retirementAge)) retirementAge = 65
  // if (retirementAge > lifeExpectation) retirementAge = lifeExpectation

  let domString = "`???`";
  
  if (!isNaN(age) && age >= 0 && age < 100 && !isNaN(lifeExpectation) && lifeExpectation >=0 && lifeExpectation < 100) {
    const WIDTH = this.parentDomNode.offsetWidth;
    const HEIGHT = 20;
    const STW = 3;
    const D = (WIDTH - STW) / lifeExpectation;
    
    domString = `<svg height="${HEIGHT + 20}" width="${WIDTH}" stroke="black">`

    domString += `<rect x="${STW/2}" y="${STW/2}" width="${lifeExpectation * D}" height="${HEIGHT}" fill="green" stroke-width="${STW}" />`

    if (!isNaN(retirementAge) && retirementAge > age) domString += `<rect x="${STW/2 + age * D}" y="${STW/2}" width="${(retirementAge - age) * D}" height="${HEIGHT}" fill="yellow" stroke-width="${STW}" />`

    domString += `<rect x="${STW/2}" y="${STW/2}" width="${age * D}" height="${HEIGHT}" fill="red" stroke-width="${STW}" />`
    
    for (let i = 0; i < lifeExpectation; i = i + 10) {
      const X = i * D;
      domString += `<line x1="${X}" y1="${HEIGHT}" x2="${X}" y2="0"/>`
      domString += `<text x="${X - 9}" y="37" fill="red">${i}</text>`
    }
    
    domString += `<text x="${age * D - 9 + STW}" y="20" fill="white" stroke="red" style="font-size:20;">🔥</text>`

    if (!isNaN(retirementAge)) domString += `<text x="${retirementAge * D - 9 + STW}" y="20" fill="white" stroke="red" style="font-size:20;">🚷</text>`
    
    domString += '</svg>'
  }
  
	return domString;
};

})();