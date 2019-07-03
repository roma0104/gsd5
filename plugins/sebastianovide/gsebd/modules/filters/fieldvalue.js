/*\
title: $:/plugins/sebastianovide/gsebd/modules/filters/fieldvalue.js
type: application/javascript
module-type: filteroperator

Filter operator for returning the value of target field.  Does not take an argument/operand.
A variation of the field filter found in TW5 core.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports._fieldvalue = function(source,operator,options) {
    var results = [],
        fieldname = (operator.operand || "title").toLowerCase();
    if(operator.prefix === "!") {
        source(function(tiddler,title) {
            if(tiddler) {
                var text = tiddler.getFieldString(fieldname);
                if(text !== null) {
                    results.push(text);;
                }
            }
        });
    } else {
        source(function(tiddler,title) {
            if(tiddler) {
                var text = tiddler.getFieldString(fieldname);
                if(text !== null) {
                    results.push(text);
                }
            }
        });
    }
    return results;
};

})();