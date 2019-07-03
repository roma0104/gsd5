/*\
title: $:/plugins/sebastianovide/gsebd/modules/filters/datefilter.js
type: application/javascript
module-type: filteroperator

Filter operator for comparing date with date field.

\*/
(function(){
// jslint node: true, browser: true
// global $tw: false
"use strict";
// Export our filter function
exports.date = function(source,operator,options) {
    var results = [],
        fieldname = (operator.suffix || "created").toLowerCase();
    if(operator.prefix === "!") {
        source(function(tiddler,title) {
            if(tiddler) {
                var field_string = tiddler.getFieldString(fieldname);
                var field_object = $tw.utils.parseDate(field_string);
                if(operator.operand.split("-").length === 1) {
                    var now = new Date();
                    now.setUTCHours(0);
                    now.setUTCMinutes(0);
                    now.setUTCSeconds(0);
                    now.setUTCMilliseconds(0);
                    var offsetDays = parseInt(operator.operand) * 86400000;
                    var test_object = new Date(now - offsetDays);
                } else {
                    var test_object = new Date(operator.operand);
                }
                if(isNaN(field_object.valueOf()) === false && isNaN(test_object.valueOf()) === false && field_object <= test_object) {
                    results.push(title);
                }
            }
        });
    } else {
        source(function(tiddler,title) {
            if(tiddler) {
                var field_string = tiddler.getFieldString(fieldname);
                var field_object = $tw.utils.parseDate(field_string);
                if(operator.operand.split("-").length === 1) {
                    var now = new Date();
                    now.setUTCHours(0);
                    now.setUTCMinutes(0);
                    now.setUTCSeconds(0);
                    now.setUTCMilliseconds(0);
                    var offsetDays = parseInt(operator.operand) * 86400000
                    var test_object = new Date(now-offsetDays);
                } else {
                    var test_object = new Date(operator.operand);
                }
                if(isNaN(field_object.valueOf()) === false && isNaN(test_object.valueOf()) === false && field_object >= test_object) {
                    results.push(title);
                }
            }
        });
    }
    return results;
};

})();
