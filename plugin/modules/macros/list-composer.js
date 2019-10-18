/*\
title: $:/plugins/sebastianovide/gsebd/modules/macros/list-composer.js
type: application/javascript
module-type: macro

Compose a list widget filter that finds the gsebd tidders requested.
This is a fairly convoluted tree of if/else logic, it is not easy to read.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "list-composer";

exports.params = [
    {name: "gsd_type"},
    {name: "gsd_status"},
    {name: "sort"},
    {name: "order"},
    {name: "groupBy"},
    {name: "groupTail"},
    {name: "groupTailHeader"},
    {name: "groupHeader"},
    {name: "customFilter"},
    {name: "ownerField"},
    {name: "owner"},
    {name: "hideFutureProj"}
];

// What type of gsebd tiddlers does the list need to be?
function processType(filter) {
    filter.strings.type = "field:gsd_type[" + filter.values.gsd_type + "]";
    return filter;
}

// What is the desired status of the tiddler list?
function processStatus(filter) {
    // Ignore if a list of completed tiddlers or not requested.
    if(filter.values.gsd_status==="none") {
        return filter;
    }
    // Only process if tidders support gsd_status; actions & projects
    if(filter.values.gsd_type==="action"||filter.values.gsd_type==="project") {
        filter.strings.status = "field:gsd_status[" + filter.values.gsd_status + "]";
    }
    return filter;
}

// What is the desired sort of the tiddler list?
function processSort(filter) {
    // Process only if there is a desired sort.
    if(filter.values.sort!=="none") {
        if(filter.values.order==="descending") {
            filter.strings.sort = "!nsort[" + filter.values.sort + "]";
        } else {
            filter.strings.sort = "nsort[" + filter.values.sort + "]";
        }
    }
    return filter;
}

// Depending on the desired group, and the 'group part' change the list
function processGroup(filter) {
    // If the list is for a group header process the following:
    if(filter.values.groupHeader==="true") {
        // No groupBy just return
        if(filter.values.groupBy==="none") {
            return filter;
        } else {
            // If the groupBy is a temporal field
            if(filter.values.groupBy==="created"||filter.values.groupBy==="modified"||filter.values.groupBy==="modified") {
                filter.strings.group = "has[" + filter.values.groupBy + "]eachday[" + filter.values.groupBy + "]";
            // else group by other field
            } else {
                filter.strings.group = "has[" + filter.values.groupBy + "]";
            }
        }
    /// Process all other tiddlers that do not belong to a member of the groupBy field.
     // This is mostly for a true/false check if there non-grouped tiddlers and whether to display the 'No Group' title.
    } else if(filter.values.groupTailHeader==="true") {
        if(filter.values.groupBy==="none") {
            return filter;
        } else {
            filter.strings.group = "field:" + filter.values.groupBy + "[]limit[1]";
        }
    // Finally, display all tiddlers that are not a member of groupBy member.
    } else if(filter.values.groupTail==="true") {
        if(filter.values.groupBy==="none") {
            return filter;
        } else {
            filter.strings.group = "field:" + filter.values.groupBy + "[]";
        }
    }
    return filter;
}

// Attach custom filter the end of the filter query.
function processCustomFilter(filter) {
    if(filter.values.customFilter!=="none") {
        filter.strings.customFilter = filter.values.customFilter;
    }
    return filter;
}

// Find tiddlers that have the calling tiddler's name as the value for the ownerField
// e.g. Current tiddler name is 'Frank'; ownerField is 'gsd_contact'; only pull tiddlers tha have gsd_contact with value Frank
function processOwner(filter) {
    if(filter.values.groupHeader==="true") {
        if(filter.values.ownerField==="none") {
            return filter;
        } else if(filter.values.ownerField==="tag") {
            filter.strings.owner = "tag<caller>";
        } else {
            filter.strings.owner = "field:" + filter.values.ownerField + "<caller>";
        }
    } else if(filter.values.groupTailHeader==="true") {
        if(filter.values.ownerField==="none") {
            return filter;
        } else if(filter.values.ownerField==="tag") {
            filter.strings.owner = "tag<caller>";
        } else {
            filter.strings.owner = "field:" + filter.values.ownerField + "<caller>";
        }
    } else if(filter.values.groupTail==="true") {
        if(filter.values.ownerField==="none") {
            return filter;
        } else if(filter.values.ownerField==="tag") {
            filter.strings.owner = "tag<caller>";
        } else {
            filter.strings.owner = "field:" + filter.values.ownerField + "<caller>";
        }
    // Special case, where tiddlers are 'owned' by dates
    } else {
        if(filter.values.groupBy==="created"||filter.values.groupBy==="modified"||filter.values.groupBy==="modified") {
            filter.strings.owner = "sameday:" + filter.values.groupBy + "{!!title}";
        } else {
            filter.strings.owner = "field:" + filter.values.groupBy + "{!!title}";
        }
        if(filter.values.ownerField==="none") {
            return filter;
        } else if(filter.values.ownerField==="tag") {
            filter.strings.owner += "tag<caller>";
        } else {
            filter.strings.owner += "field:" + filter.values.ownerField + "<caller>";
        }
    }
    return filter;
}

// A hacky filter that takes all preceeding tiddlers and return just the values found in the field
function processFieldValue(filter) {
    if(filter.values.groupHeader==="true") {
        filter.strings.fieldValue = "_fieldvalue[" + filter.values.groupBy + "]each[title]";
    }
    return filter;
}

// Do not select Actions where the parent Project's status is Future.
// Produces a negating filter e.g. -[field:gsd_project["FutureProject"]]
function processHideFutureProj(filter) {
    if(filter.values.hideFutureProj==="true" && filter.values.gsd_type==="action") {
        if(filter.values.groupHeader==="true") {
            filter.strings.hideFutureProj = " -[field:gsd_type[project]field:gsd_status[future]]";
        } else {
            var filterString = " -[";
            var count = 0;
            $tw.wiki.forEachTiddler(function (title,tiddler) {
                if(tiddler.fields.gsd_type==="project" && tiddler.fields.gsd_status==="future") {
                    filterString = filterString + "field:gsd_project[" + title + "]";
                    count++;
                }
            });
            if(count>0) {
                filter.strings.hideFutureProj = filterString + "]";
            }
        }
    }
    return filter
}

// Run the macro
exports.run = function(gsd_type,gsd_status,sort,order,groupBy,groupTail,groupTailHeader,groupHeader,customFilter,ownerField,owner,hideFutureProj) {
    // Prepare the filterString object.
    var filter = {};
    var composedFilter= "";

    // Process values to resolve any wikitext.
    filter.values = {
        gsd_type: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",gsd_type),
        gsd_status: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",gsd_status),
        sort: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",sort),
        order: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",order),
        groupBy: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupBy),
        groupTail: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupTail),
        groupTailHeader: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupTailHeader),
        groupHeader: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",groupHeader),
        customFilter: customFilter,
        ownerField: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",ownerField),
        hideFutureProj: $tw.wiki.renderText("text/plain","text/vnd.tiddlywiki",hideFutureProj)
    };

    // String are used to created the final filter statement.
    filter.strings = {
        type: "",
        complete: "",
        status: "",
        sort: "",
        group: "",
        customFilter: "",
        owner: "",
        fieldValue: "",
        hideFutureProj: ""
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
    filter = processSort(filter);
    filter = processGroup(filter);
    filter = processCustomFilter(filter);
    filter = processOwner(filter);
    filter = processFieldValue(filter);
    filter = processHideFutureProj(filter);

    // Compose the final filter statement.
    composedFilter += filter.strings.type;
    composedFilter += filter.strings.status;
    composedFilter += filter.strings.sort;
    composedFilter += filter.strings.group;
    composedFilter += filter.strings.customFilter;
    composedFilter += filter.strings.owner;
    composedFilter += filter.strings.fieldValue;

    if(filter.values.groupHeader==="true"&&filter.values.groupBy==="none"){
        composedFilter = "";
    } else if(filter.values.groupTailHeader==="true"&&filter.values.groupBy==="none") {
        composedFilter = "";
    } else {
        composedFilter = "[" + composedFilter + "]";
    }

    composedFilter += filter.strings.hideFutureProj;

    return composedFilter;
};

})();
