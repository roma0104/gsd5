/*\
title: $:/plugins/sebastianovide/gsebd/macro/view-composer.js
type: application/javascript
module-type: macro

Macro that selects the correct view widget based upon grouping type.  Used with the filter-composer macro.


\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "view-composer";

exports.params = [
    {name: "groupTitle"},
    {name: "dateTemplate"}
];

// Run the macro
exports.run = function(groupTitle, dateTemplate) {

    var templateString="",
        linkString='&nbsp;<span style="font-size: 12px; line-height: 18px;"><$link to=<<currentTiddler>>>>></$link></span>';

    // Process values to resolve any wikitext.
    groupTitle = $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupTitle);
    dateTemplate = $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",dateTemplate);

    if(groupTitle==="modified"||groupTitle==="created"||groupTitle==="gsd_comp_date") {
        templateString = ' format="date" template="' + dateTemplate + '" ';
        linkString = "";
    }

    return '<$view field="title"' + templateString + ' />' + linkString;
};

})();
