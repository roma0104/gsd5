/*\
title: $:/plugins/briefcase/core/modules/widgets/prereq.js
type: application/javascript
module-type: widget

Widget to set prerequisite actions.

\*/
(function() {

//jslint node: true, browser: true
//global $tw: false
"use_strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var PrereqWidget = function(parseTreeNode, options) {
	this.initialise(parseTreeNode, options);
};

// Inherit from Widget
PrereqWidget.prototype = new Widget();

// Render to DOM
PrereqWidget.prototype.render = function(parent, nextSibling) {
	var self = this;
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.selectDomNode = this.document.createElement("select");
	this.selectDomNode.addEventListener("change", function() {
		self.handleChangeEvent();
	});
	parent.insertBefore(this.selectDomNode,nextSibling);
	this.renderChildren(this.selectDomNode,null);
	this.domNodes.push(this.selectDomNode);
	this.setSelectValue();
};

PrereqWidget.prototype.execute = function() {
	this.prereqTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	this.prereqDefault = this.getAttribute("default");
	this.makeChildWidgets();
};

PrereqWidget.prototype.setSelectValue = function() {
	var value = this.prereqDefault;
	var tiddler = this.wiki.getTiddler(this.prereqTitle);
	if(tiddler.fields.gtd_prereq) {
		value = tiddler.fields.gtd_prereq;
	}
	this.selectDomNode.value = value;
};

PrereqWidget.prototype.handleChangeEvent = function() {
	var tiddler = this.wiki.getTiddler(this.prereqTitle);
	if(tiddler.fields.gtd_type !== "action") {
		return;
	}
	this.wiki.setText(this.prereqTitle, "gtd_prereq", null, this.selectDomNode.value);
	this.setStatus();
};

PrereqWidget.prototype.setStatus = function() {
	if(this.selectDomNode.value !== "none") {
		var currentTiddler = this.wiki.getTiddler(this.prereqTitle);
		if(currentTiddler.fields.gtd_completed !== "completed" || currentTiddler.fields.gtd_status !== "waiting") {
			this.wiki.setText(this.prereqTitle, "gtd_status", null, "future");
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
