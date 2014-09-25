/*\
title: $:/plugins/briefcase/core/modules/startup/tickler.js
type: application/javascript
module-type: startup

Tickler alert manager.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "tickler";
//exports.platforms = ["browser"];
exports.after = ["story"];
exports.synchronous = true;

exports.startup = function() {
	$tw.wiki.forEachTiddler(checkForAlert);
	var interval = setInterval(function() {
		$tw.wiki.forEachTiddler(checkForAlert);
	}, 3600000);
};

function checkForAlert(title, tiddler) {
	var now = new Date();
	if(!tiddler) {
		return;
	}
	if(tiddler.fields.gtd_type === "tickler") {
		if(tiddler.fields.gtd_tickdate) {
			var alert_date = $tw.utils.parseDate(tiddler.fields.gtd_tickdate);
			if(alert_date <= now) {
				this.setText(title, "component", null, tiddler.fields.title);
				this.setText(title, "tags", null, "$:/tags/Alert");
			}
		}
	}
}

})();
