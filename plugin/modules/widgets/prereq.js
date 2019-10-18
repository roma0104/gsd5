/*\
title: $:/plugins/sebastianovide/gsebd/modules/widgets/prereq.js
type: application/javascript
module-type: widget

Widget to set prerequisite actions.

\*/
(function() {

// jslint node: true, browser: true
// global $tw: false
"use_strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var PrereqWidget = function(parseTreeNode,options) {
    this.initialise(parseTreeNode, options);
};

// Inherit from Widget
PrereqWidget.prototype = new Widget();

// Render to DOM
PrereqWidget.prototype.render = function(parent,nextSibling) {
    var self = this;
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    this.selectDomNode = this.document.createElement("select");
    this.selectDomNode.addEventListener("change", function() {
        self.handleChangeEvent();
    });
    // Assign classes
    var classes = this["class"].split(" ") || [];
    if(this.selectedClass) {
        if(this.set && this.setTo && this.isSelected()) {
            $tw.utils.pushTop(classes,this.selectedClass.split(" "));
        }
        if(this.popup && this.isPoppedUp()) {
            $tw.utils.pushTop(classes,this.selectedClass.split(" "));
        }
    }
    this.selectDomNode.className = classes.join(" ");
    parent.insertBefore(this.selectDomNode,nextSibling);
    this.renderChildren(this.selectDomNode,null);
    this.domNodes.push(this.selectDomNode);
    this.setSelectValue();
};

PrereqWidget.prototype.execute = function() {
    this.prereqTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
    this.prereqDefault = this.getAttribute("default");
    this["class"] = this.getAttribute("class","");
    this.makeChildWidgets();
};

PrereqWidget.prototype.setSelectValue = function() {
    var value = this.prereqDefault;
    var tiddler = this.wiki.getTiddler(this.prereqTitle);
    if(tiddler.fields.gsd_action) {
        value = tiddler.fields.gsd_action;
    }
    this.selectDomNode.value = value;
};

PrereqWidget.prototype.handleChangeEvent = function() {
    var tiddler = this.wiki.getTiddler(this.prereqTitle);
    if(tiddler.fields.gsd_type !== "action") {
        return;
    }
    this.wiki.setText(this.prereqTitle, "gsd_action", null, this.selectDomNode.value);
    this.setStatus();
};

PrereqWidget.prototype.setStatus = function() {
    if(this.selectDomNode.value !== "none") {
        var currentTiddler = this.wiki.getTiddler(this.prereqTitle);
        if (["active", "next"].includes(currentTiddler.fields.gsd_status)) {
          this.wiki.setText(this.prereqTitle, "gsd_status", null, "future");
        }
    }
};

PrereqWidget.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if(changedAttributes.prereqTitle) {
        this.refreshSelf();
        return true;
    } else {
        if(changedTiddlers[this.prereqTitle]) {
            this.setSelectValue();
        }
        return this.refreshChildren(changedTiddlers);
    }
};

exports.prereq = PrereqWidget;

})();
