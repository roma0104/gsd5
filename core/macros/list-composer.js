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
	{name: "customFilter"},
	{name: "ownerField"},
	{name: "owner"}
];

function processType(filter) {
	filter.strings.type = "field:gsd_type[" + filter.values.gsd_type + "]";
	return filter;
}

function processComplete(filter) {
	if(filter.values.gsd_type==="action"||filter.values.gsd_type==="project") {
		filter.strings.complete = "field:gsd_complete[" + filter.values.gsd_complete + "]";
	}
	return filter;
}

function processStatus(filter) {
	if(filter.values.gsd_complete==="true"||filter.values.gsd_status==="none") {
		return filter;
	}
	if(filter.values.gsd_type==="action"||filter.values.gsd_type==="project") {
		filter.strings.status = "field:gsd_status[" + filter.values.gsd_status + "]";
	}
	return filter;
}

function processRealm(filter) {
	if(filter.values.realmAware==="true") {
		filter.strings.realm = "field:gsd_realm{$:/currentRealm}";
	}
	return filter;
}

function processSort(filter) {
	if(filter.values.sort!=="none") {
		if(filter.values.order==="descending") {
			filter.strings.sort = "!nsort[" + filter.values.sort + "]";
		} else {
			filter.strings.sort = "nsort[" + filter.values.sort + "]";
		}
	}
	return filter;
}

function processGroup(filter) {
	if(filter.values.groupHeader==="true") {
		if(filter.values.groupBy==="none") {
			return filter;
		} else {
			if(filter.values.groupBy==="created"||filter.values.groupBy==="modified"||filter.values.groupBy==="gsd_comp_date") {
				filter.strings.group = "has[" + filter.values.groupBy + "]eachday[" + filter.values.groupBy + "]";
			} else {
				filter.strings.group = "has[" + filter.values.groupBy + "]each[" + filter.values.groupBy + "]";
			}
		}
	} else if(filter.values.groupTailHeader==="true") {
		if(filter.values.groupBy==="none") {
			return filter;
		} else {
			filter.strings.group = "field:" + filter.values.groupBy + "[]limit[1]";
		}
	} else if(filter.values.groupTail==="true") {
		if(filter.values.groupBy==="none") {
			return filter;
		} else {
			filter.strings.group = "field:" + filter.values.groupBy + "[]";
		}
	}
	return filter;
}

function processCustomFilter(filter) {
	if(filter.values.customFilter!=="none") {
		filter.strings.customFilter = filter.values.customFilter;
	}
	return filter;
}

function processOwner(filter) {
	if(filter.values.groupHeader==="true") {
		if(filter.values.ownerField!=="none") {
			filter.strings.owner = "field:" + filter.values.ownerField + "<caller>";
		} else {
			return filter;
		}
	} else if(filter.values.groupTailHeader==="true") {
		if(filter.values.ownerField!=="none") {
			filter.strings.owner = "field:" + filter.values.ownerField + "<caller>";
		} else {
			return filter;
		}
	} else if(filter.values.groupTail==="true") {
		if(filter.values.ownerField!=="none") {
			filter.strings.owner = "field:" + filter.values.ownerField + "<caller>";
		} else {
			return filter;
		}
	} else {
		if(filter.values.groupBy==="created"||filter.values.groupBy==="modified"||filter.values.groupBy==="gsd_comp_date") {
			filter.strings.owner = "sameday:" + filter.values.groupBy + "{!!title}";
		} else {
			filter.strings.owner = "field:" + filter.values.groupBy + "{!!title}";
		}
		if(filter.values.ownerField!=="none") {
			filter.strings.owner += "field:" + filter.values.ownerField + "<caller>";
		}
	}
	return filter;
}

function processFieldValue(filter) {
	if(filter.values.groupHeader==="true") {
		filter.strings.fieldValue = "_fieldvalue[" + filter.values.groupBy + "]";
	}
	return filter;
}

// Run the macro
exports.run = function(gsd_type,gsd_complete,gsd_status,realmAware,sort,order,groupBy,groupTail,groupTailHeader,groupHeader,customFilter,ownerField,owner) {
	// Prepare the filterString object.
	var filter = {},
		composedFilter= "";

	console.log(arguments);
	// Process values to resolve any wikitext.
	filter.values = {
		gsd_type: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",gsd_type),
		gsd_complete: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",gsd_complete),
		gsd_status: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",gsd_status),
		realmAware: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",realmAware),
		sort: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",sort),
		order: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",order),
		groupBy: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupBy),
		groupTail: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupTail),
		groupTailHeader: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupTailHeader),
		groupHeader: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupHeader),
		customFilter: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",customFilter),
		ownerField: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",ownerField)
	};

	// String are used to created the final filter statement.
	filter.strings = {
		type: "",
		complete: "",
		status: "",
		realm: "",
		sort: "",
		group: "",
		customFilter: "",
		owner: "",
		fieldValue: ""
	};

	/*
	 * The filter composer falls into three major concerns:
	 * groupHeader - If items are to be grouped by a field, this set of rules returns tiddlers found in the grouping field.
	 * groupTailHeader - A rather ugly name; a reveal-like widget to show the 'No Group' header of items with out a group, if they exist.
	 * groupTail - If items do not have a value for the group-field, they are shown here as without group.
	 * (else) - Basic list construction.
	 */

	filter = processType(filter);
	filter = processStatus(filter);
	filter = processRealm(filter);
	filter = processComplete(filter);
	filter = processSort(filter);
	filter = processGroup(filter);
	filter = processCustomFilter(filter);
	filter = processOwner(filter);
	filter = processFieldValue(filter);

	// Finally, compose the final filter statement.
	for(var x in filter.strings) {
		if(filter.strings.hasOwnProperty(x)) {
			composedFilter += filter.strings[x];
		}
	}

	if(filter.values.groupHeader==="true"&&filter.values.groupBy==="none"){
		composedFilter = "";
	} else if(filter.values.groupTailHeader==="true"&&filter.values.groupBy==="none") {
		composedFilter = "";
	} else {
		composedFilter = "[" + composedFilter + "]";
	}

	return composedFilter;
};

})();
