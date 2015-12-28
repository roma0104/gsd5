/*\
title: $:/plugins/gsd5/core/modules/widgets/gsdtiddler.js
type: application/javascript
module-type: widget

New GSD5 Tiddler Widget

\*/
(function() {

// jslint node: true, browser: true
// global $tw: false
"use_strict";
var Widget = require("$:/core/modules/widgets/widget.js").widget;
var GSDTiddler = function(parseTreeNode,options) {
    this.initialise(parseTreeNode, options);
};
// Inherit from Widget
GSDTiddler.prototype = new Widget();
// Render to DOM
GSDTiddler.prototype.render = function(parent,nextSibling) {
    var self = this;
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    // Create DOM element
    var domNode = this.document.createElement("button");
    domNode.className = this["class"];
    if(this.title) {
        domNode.setAttribute("title", this.title);
    }
    if(this["aria-label"]) {
        domNode.setAttribute("aria-label", this["aria-label"]);
    }
    // Add event listener
    domNode.addEventListener(
        "click",
        function(event) {
        self.handleClick(event);
        },
        false
    );
    // Insert element
    parent.insertBefore(domNode, nextSibling);
    this.renderChildren(domNode, null);
    this.domNodes.push(domNode);
};

GSDTiddler.prototype.handleClick = function(event) {
    var title = prompt("Enter title:");
    if(!title) {
        return;
    }
    /*
    Special thanks to Stephan "Skeeve" Hradek for the NewTiddler plugin.
    Much of the following code is pulled from his plugin.
    http://tiddlystuff.tiddlyspot.com
    */
    var skeleton = this.wiki.getTiddlerAsJson(this.newtiddlerSkeleton);
    var skeletonClone = JSON.parse(this.substituteVariableReferences(skeleton));
    var basetitle = title;
    var newTitle = basetitle;
    for(var t=1; this.wiki.tiddlerExists(newTitle); t++) {
        newTitle = basetitle + " " + t;
    }
    skeletonClone.title = newTitle;
    var created = this.wiki.getCreationFields();
    for(var creationField in created) {
        skeletonClone[creationField] = created[creationField];
    }
    var modified = this.wiki.getModificationFields();
    for(var modificationField in modified) {
        skeletonClone[modificationField] = modified[modificationField];
    }
    this.wiki.addTiddler(skeletonClone);
    switch(this.newtiddlerEdit) {
        case "show":
        case "yes":
            var bounds = this.domNodes[0].getBoundingClientRect();
            this.dispatchEvent({
                type: "tm-navigate",
                navigateTo: newTitle,
                navigateFromTitle: this.getVariable("currentTiddler"),
                navigateFromNode: this,
                navigateFromClientRect: { top: bounds.top, left: bounds.left, width: bounds.width, right: bounds.right, bottom: bounds.bottom, height: bounds.height}
            });
            if(this.newtiddlerEdit === "yes") {
                this.dispatchEvent({type: "tm-edit-tiddler", tiddlerTitle: newTitle});
            }
            break;
        case "no":
            break;
    }
    var self = this;
    setTimeout(function() {
    // Set the dependant on-the-fly, if enabled.
    if(self.setNow==="true") {
        var gsdType = self.getVariable("gsd_type");
        // Set the target tiddler, usually currentTiddler, gsd_* field to the title of the newly created GSD5 tiddler.
        self.wiki.setText(self.parentTiddler, "gsd_"+gsdType, null, title);
    }
    $tw.rootWidget.dispatchEvent({type: "tm-auto-save-wiki"});
    }, 500);
};

GSDTiddler.prototype.execute = function() {
    // Get attributes
    this["class"] = this.getAttribute("class", "");
    this["aria-label"] = this.getAttribute("aria-label");
    this.title = this.getAttribute("title");
    this.newtiddlerSkeleton = this.getAttribute("skeleton");
    this.newtiddlerEdit = this.getAttribute("edit", "show");
    this.parentTiddler = this.getAttribute("tiddler", this.getVariable("currentTiddler"));
    this.setNow = this.getAttribute("setNow", "false");
    this.makeChildWidgets();
};

GSDTiddler.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if(changedAttributes["class"] || changedAttributes.edit) {
        this.refreshSelf();
        return true;
    }
    return this.refreshChildren(changedTiddlers);
};

exports.gsdtiddler = GSDTiddler;

})();
