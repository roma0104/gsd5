/*\
title: $:/plugins/gsd5/core/modules/startup/onsave.js
type: application/javascript
module-type: wikimethod

Updates gsd5 reference fields on referent tiddler rename.

\*/
(function(){
  // jslint node: true, browser: true
  // global $tw: true
  "use strict";
  /*
    Store method which retargets gsd refs from fromTitle to toTitle.
  */
  exports.retargetGsdReferences = function(fromTitle,toTitle) {
    var self = this;
    // each gsd_type has an associated inbound reference field gsd_${gsd_type}
    var types = ['action', 'project', 'contact', 'realm'],
        targetTiddler = this.getTiddler(fromTitle);
    var targetType = targetTiddler.fields && targetTiddler.fields.gsd_type;
    if (targetType && types.indexOf(targetType) > -1) {
      var field = 'gsd_'+targetType;
	    this.each(function(tiddler,title) {
        if (tiddler.fields[field] == fromTitle){
          var change = {};
          change[field] = toTitle;
			    self.addTiddler(new $tw.Tiddler(tiddler,change,self.getModificationFields()));
        }
      });
    }
  };
  $tw.hooks.addHook("th-saving-tiddler",function(tiddler, renaming) {
    if (renaming) {
      $tw.wiki.retargetReferences(renaming, tiddler.fields.title);
      $tw.wiki.retargetGsdReferences(renaming, tiddler.fields.title);
    }
    return tiddler;
  });
  return exports;
})();
