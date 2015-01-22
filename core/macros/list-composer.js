/*\
title: $:/plugins/gsd5/core/macro/list-composer.js
type: application/javascript
module-type: macro

Macro to choose which of two colours has the highest contrast with a base colour

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "list-composer";

exports.params = [
	{name: "gsd_type"},
	{name: "gsd_complete"},
	{name: "gsd_status"},
	{name: "realmAware"},
	{name: "sort"},
	{name: "order"},
	{name: "groupBy"},
	{name: "groupHeader"},
	{name: "filters"}
];

/*
Run the macro
*/
exports.run = function(gsd_type,gsd_complete,gsd_status,realmAware,sort,order,groupBy,groupHeader,filters) {
	var completeString = '',
		statusString = '',
		realmString = '',
		sortString = 'nsort[' + sort + ']',
		groupString = '';

	console.log(typeof(groupHeader));
	console.log(arguments);

	if(gsd_type==="action"||gsd_type==="project"){
		completeString = 'field:gsd_complete[' + gsd_complete + ']';
		if(gsd_type==="project" && gsd_status==="next") {
			gsd_status = "active";
		}
		statusString = 'field:gsd_status[' + gsd_status + ']';
	}
	if(realmAware==="true") {
		realmString = 'field:gsd_realm{$:/currentRealm}';
	}
	if(order==="descending") {
		sortString = '!' + sortString;
	}
	if(groupBy!=="") {
		groupString = 'field:' + groupBy + '{!!title}';
	} else {
		return '';
	}
	if(groupHeader==='true') {
		groupString = 'field:' + groupBy + '[]';
	}

	return '[field:gsd_type[' + gsd_type + ']' + completeString + statusString + realmString + sortString + filters + ']';
};

})();
