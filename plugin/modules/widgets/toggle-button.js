/*\
title: $:/plugins/sebastianovide/gsebd/modules/widgets/toggleButton.js
type: application/javascript
module-type: widget

Toggle Button widget allows a button to have behaviour similar to the checkbox.

\*/
(function(){

// slint node: true, browser: true
// global $tw: false
"use strict";
var Widget = require("$:/core/modules/widgets/widget.js").widget;
var ToggleButton = function(parseTreeNode,options) {
    this.initialise(parseTreeNode,options);
};

ToggleButton.prototype = new Widget();

ToggleButton.prototype.render = function(parent,nextSibling) {
    var self = this;
    // Remember parent
    this.parentDomNode = parent;
    // Compute attributes and execute state
    this.computeAttributes();
    this.execute();
    // Create element
    var domNode = this.document.createElement("button");
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
    domNode.className = classes.join(" ");
    // Assign other attributes
    if(this.style) {
        domNode.setAttribute("style",this.style);
    }
    if(this.tooltip) {
        domNode.setAttribute("title",this.tooltip);
    }
    if(this["aria-label"]) {
        domNode.setAttribute("aria-label",this["aria-label"]);
    }
    // Add a click event handler
    domNode.addEventListener("click",function (event) {
        self.handleClickEvent();
    });
    // Insert element
    parent.insertBefore(domNode,nextSibling);
    this.renderChildren(domNode,null);
    this.domNodes.push(domNode);
};

ToggleButton.prototype.handleClickEvent = function() {
    var toggleState = this.getValue();
    if(toggleState === this.toggleOff) {
        this.wiki.setText(this.toggleTitle, this.toggleField, null, this.toggleOn);
    }
    if(toggleState === this.toggleOn) {
        this.wiki.setText(this.toggleTitle, this.toggleField, null, this.toggleOff);
    }
};

ToggleButton.prototype.getValue = function() {
    var tiddler = this.wiki.getTiddler(this.toggleTitle);
    if(tiddler) {
        if(this.toggleField) {
            var value = tiddler.fields[this.toggleField] || this.toggleDefault || "";
            if(value === this.toggleOn) {
                return this.toggleOn;
            }
            if(value === this.toggleOff) {
                return this.toggleOff;
            }
        }
    } else {
        if(this.toggleField) {
            if(this.toggleDefault === this.toggleOn) {
                return this.toggleOn;
            }
            if(this.toggleDefault === this.toggleOff) {
                return this.toggleOff;
            }
        }
    }
    return this.toggleOff;
};

ToggleButton.prototype.execute = function() {
    // Get attributes
    this.toggleTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
    this.toggleField = this.getAttribute("field","text");
    this.toggleOn = this.getAttribute("on");
    this.toggleOff = this.getAttribute("off");
    this.toggleDefault = this.getAttribute("default");
    this["class"] = this.getAttribute("class","");
    this["aria-label"] = this.getAttribute("aria-label");
    this.tooltip = this.getAttribute("tooltip");
    this.style = this.getAttribute("style");
    this.selectedClass = this.getAttribute("selectedClass");
    // Make child widgets
    this.makeChildWidgets();
};

ToggleButton.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if(changedAttributes.to || changedAttributes["class"] || changedAttributes.selectedClass || changedAttributes.style) {
        this.refreshSelf();
        return true;
    }
    return this.refreshChildren(changedTiddlers);
};

exports.toggle = ToggleButton;

})();
