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
	{name: "groupTail"},
	{name: "groupTailHeader"},
	{name: "groupHeader"},
	{name: "filter"}
];

/*
Run the macro
*/
exports.run = function(gsd_type,gsd_complete,gsd_status,realmAware,sort,order,groupBy,groupTail,groupTailHeader,groupHeader,filter) {
	var completeString = '',
		statusString = '',
		realmString = '',
		sortString = 'nsort[' + sort + ']',
		groupString = '',
		filterString = '';

	console.log(typeof(groupHeader));
	console.log(arguments);

	if(gsd_type==="action"||gsd_type==="project"){
		completeString = 'field:gsd_complete[' + gsd_complete + ']';
		statusString = 'field:gsd_status[' + gsd_status + ']';
	}
	if(realmAware==="true") {
		realmString = 'field:gsd_realm{$:/currentRealm}';
	}
	if(order==="descending") {
		sortString = "!" + sortString;
	}
	if(groupBy!=="none") {
		groupString = 'field:' + groupBy + '{!!' + groupBy + '}';
	}
	if(groupBy!=="none" && groupTail==="true") {
		groupString = 'field:' + groupBy + '[]';
	}
	if(groupBy!=="none" && groupTailHeader==="true") {
		groupString = 'field:' + groupBy + '[]limit[1]';
	} else if(groupBy==="none" && groupTailHeader==="true") {
		return "";
	}
	if(groupHeader==='true' && groupBy!=="none") {
		groupString = 'has[' + groupBy + ']each[' + groupBy + ']';
	}
	if(groupHeader==='true' && groupBy==="none") {
		return "";
	}
	if(filter!=="none") {
		filterString = filter;
	}

	return '[field:gsd_type[' + gsd_type + ']' + completeString + statusString + realmString + sortString + groupString + filterString + ']';
};

})();
