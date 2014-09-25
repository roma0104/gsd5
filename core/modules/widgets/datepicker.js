/*\
title: $:/plugins/briefcase/core/modules/widgets/datepicker.js
type: application/javascript
module-type: widget

Date Picker Widget

\*/
(function() {

// jslint node: true, browser: true
// global $tw: false
"use_strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var DateWidget = function(parseTreeNode, options) {
	this.initialise(parseTreeNode, options);
};

// Inherit from Widget
DateWidget.prototype = new Widget();

/*
 * Render the DOM of the DatePicker widget.
 */
DateWidget.prototype.render = function(parent, nextSibling) {
	var self = this;
	this.calendar = new Calendar();
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	// Create DOM element
	this.domNode = this.document.createElement("div");
	this.domNode.setAttribute("class", "tw-calendar");
	this.inputNode = this.document.createElement("input");
	this.getField();
	// Create event listeners
	// When the input field is selected, show the floating calendar.
	this.inputNode.addEventListener(
		"focus",
		function(event) {
			self.calendar.show();
		}, true
	);
	/*
	 * When editing the field manually, hitting Enter will save the date to
	 * the tiddler field specified.  Attempted other means, 'blur' and tried to
	 * include 'tab' cannot get the updates to work correctly.
	 */
	this.inputNode.addEventListener(
		"keypress",
		function(event) {
			if(event.keyCode === 13) {
				self.handleChange();
			}
		}, true
	);
	/*
	 * Watch for click outside the calendar that loses focus and hides the
	 * calendar.
	 */
	this.document.addEventListener(
		'click',
		function(event) {
			self.calendar.isOutsideCalendar(event);
		},false
	);
	this.domNode.appendChild(this.inputNode);
	this.calendar.build(this);
	// Insert element
	parent.insertBefore(this.domNode, nextSibling);
	this.renderChildren(this.domNode, null);
	this.domNodes.push(this.domNode);
};

/*
 * Called when the input field is changed.
 */
DateWidget.prototype.handleChange = function(event) {
	var date_obj = this.validate();
	if(!date_obj) {
		this.getField();
		return;
		if(this.inputNode.value === "") {
			return;
		}
	}
	this.setField(date_obj);
};

/*
 * Validate the value of the input field.  Return empty string if invalid
 * date values.  ISO/UTC date string YYYY-MM-DD.
 */
DateWidget.prototype.validate = function() {
	var split_string = this.inputNode.value.split("-");
	var year = parseInt(split_string[0]);
	var month = parseInt(split_string[1]);
	var day = parseInt(split_string[2]);
	// Check to see if any of the values are not a number.
	if(isNaN(year) || isNaN(month) || isNaN(day)) {
		this.inputNode.value = "";
		return;
	}
	// Check number values are within limits.
	if(month < 1 || month > 12) {
		this.inputNode.value = "";
		return;
	}
	var day_upperLimit = this.calendar.gDayCounts[month-1]
	if(month === 2 && year%4 === 0) { // Leap year
		day_upperLimit = 29;
	}
	if(day < 1 || day > day_upperLimit) {
		this.inputNode.value = "";
		return;
	}
	// Return date_object if string is good.
	var date_obj = new Date(this.inputNode.value);
	return date_obj;
};

/*
 * Set the specified field to aTiddlyWiki5 UTC string.
 */
DateWidget.prototype.setField = function(date_obj) {
	this.wiki.setText(this.dateTitle, this.dateField, null, $tw.utils.stringifyDate(date_obj));
};

/*
 * Get TiddlyWiki5 UTC string from the specified field, update the calendar
 * and input field.
 */
DateWidget.prototype.getField = function() {
	var tiddler = this.wiki.getTiddler(this.dateTitle);
	if(tiddler) {
		var date_string = tiddler.getFieldString(this.dateField);
		if(date_string === "" && this.inputNode.value === "") {
			this.calendar.date_info = this.calendar.getDateInfo();
			return;
		}
		var date_obj = $tw.utils.parseDate(date_string);
		this.calendar.date_info = this.calendar.getDateInfo(date_obj);
		this.inputNode.value = this.calendar.createSimpleUTCDate(this.calendar.date_info);
	} else {
		this.inputNode.value = "";
	}
};

/*
 * Compute the internal state of the widget
 */
DateWidget.prototype.execute = function() {
	this.dateTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	this.dateField = this.getAttribute("field");
	this.makeChildWidgets();
};

/*
 * Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
 */
DateWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	// Refresh if an attribute has changed, or the type associated with the target tiddler has changed
	if(changedAttributes.tiddler || changedAttributes.field) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);
	}
};


/*
 * The Calendar class isolates the calendar functions from the widget functions.
 */
var Calendar = function() {
	this.enGMonth = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	this.enGWeekDay = ["S", "M", "T", "W", "T", "F", "S"];
	this.gDayCounts = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
};

/*
 * Build the DOM for the calendar.
 */
Calendar.prototype.build = function(widget) {
	var self = this;
	this.widget = widget;
	// Create calendar table
	this.calendarNode = this.widget.document.createElement("table");
	this.calendarNode.setAttribute("class", "tw-calendar-popup");
	this.calendarNode.setAttribute("cellpadding", "2");
	this.widget.domNode.appendChild(this.calendarNode);
	// Create top row
	this.topRowNode = this.widget.document.createElement("thead");
	this.navLeftNode = this.widget.document.createElement("th");
	this.navLeftNode.setAttribute("class", "tw-calendar-left");
	this.navLeftNode.innerHTML = "<";
	this.topRowNode.appendChild(this.navLeftNode);
	// Listener for month navigation
	this.navLeftNode.addEventListener("click", function(event) {
		self.navMonth(true);
	});
	this.navCenterNode = this.widget.document.createElement("th");
	this.navCenterNode.setAttribute("class", "tw-calendar-title");
	this.navCenterNode.setAttribute("colspan", "5");
	this.topRowNode.appendChild(this.navCenterNode);
	this.navRightNode = this.widget.document.createElement("th");
	this.navRightNode.setAttribute("class", "tw-calendar-right");
	this.navRightNode.innerHTML = ">";
	this.topRowNode.appendChild(this.navRightNode);
	// Listener for month navigation
	this.navRightNode.addEventListener("click", function(event) {
		self.navMonth(false);
	});
	this.calendarNode.appendChild(this.topRowNode);
	// Create weekday row
	this.dateRowNode = this.widget.document.createElement("thead");
	this.dateRowNode.setAttribute("class", "tw-calendar-dayrow");
	for(var x = 0; x < this.enGWeekDay.length; x++) {
		dayNode = this.widget.document.createElement("th");
		dayNode.innerHTML = this.enGWeekDay[x];
		this.dateRowNode.appendChild(dayNode);
	}
	this.calendarNode.appendChild(this.dateRowNode);
	// Create day grid
	this.dayGridNode = this.widget.document.createElement("tbody");
	this.dayGrid = [];
	for(var y = 0; y < 6; y++) {
		weekRow = this.widget.document.createElement("tr");
		for(var x = 0; x < 7; x++) {
			dayNode = this.widget.document.createElement("td");
			var d = ((y*7)+x);
			dayNode.innerHTML = "&nbsp;"
			this.dayGrid.push(dayNode);
			weekRow.appendChild(dayNode);
		}
		this.dayGridNode.appendChild(weekRow);
	}
	this.calendarNode.appendChild(this.dayGridNode);
	// Add listener for day select
	this.dayGridNode.addEventListener("click", function(event) {
		if(event.target.innerHTML === "&nbsp;") {
			return;
		}
		self.setInput(parseInt(event.target.innerHTML));
		self.widget.handleChange();
		self.hide();
	});
	this.getInput();
};

/*
 * Determine the position for the floating calendar for rendering just below
 * the input box.
 */
Calendar.prototype.setPosition = function() {
	var x = this.widget.inputNode.offsetLeft;
	var y = this.widget.inputNode.offsetHeight;
	this.calendarNode.style["left"] = x;
	this.calendarNode.style["top"] = y;
};

/*
 * Is the click from the mouse outside the floating calendar?
 */
Calendar.prototype.isOutsideCalendar = function(event) {
	var child = event.target;
	var parent = this.calendarNode;
	if(child === this.widget.inputNode) {
		return;
	}
	if(!this.isChild(child, parent)) {
		this.hide();
	}
};

/*
 * Is the child a child of the parent?
 */
Calendar.prototype.isChild = function(child, parent) {
	while(child) {
		if(child === parent) {
			return true;
		}
		child = child.offsetParent;
	}
	return false;
};

/*
 * Fill the calendar with text for the month displayed.
 */
Calendar.prototype.fillCalendar = function() {
	this.navCenterNode.innerHTML = this.enGMonth[this.date_info.selectedMonth] + " " + this.date_info.selectedYear.toString();
	var dayCount = 0;
	var lastDayCount = parseInt(this.gDayCounts[this.date_info.selectedMonth])+parseInt(this.date_info.firstDayOfMonth)-1;
	if(this.date_info.selectedYear%4 === 0 && this.date_info.selectedMonth === 1) {
		lastDayCount = parseInt(this.gDayCounts[this.date_info.selectedMonth])+parseInt(this.date_info.firstDayOfMonth);
	}
	for(var x = 0; x < 42; x++) {
		if(x < this.date_info.firstDayOfMonth || x > lastDayCount) {
			var dayBlock = this.dayGrid[x];
			dayBlock.setAttribute("class", "tw-calendar-nodate");
			dayBlock.innerHTML = "&nbsp;";
		} else {
			var dayBlock = this.dayGrid[x];
			dayBlock.setAttribute("class", "tw-calendar-date");
			++dayCount;
			var dayCountString = dayCount.toString();
			if(dayCountString.length < 2) {
				dayCountString = "0" + dayCountString;
			}
			dayBlock.innerHTML = dayCountString;
		}
	}
};

/*
 * Create a custom date object used to track date changes and fill the calendar.
 */
Calendar.prototype.getDateInfo = function(input) {
	var now = new Date(),
		firstDay = new Date(),
		returnObj = {};
	if(typeof(input) === "string") {
		now = new Date(input);
		firstDay = new Date(input);
	}
	if(typeof(input) === "object") {
		now = input;
		firstDay = new Date(input);
	}
	firstDay.setUTCDate(1);
	returnObj.selectedYear = now.getUTCFullYear();
	returnObj.selectedMonth = now.getUTCMonth();
	returnObj.selectedDay = now.getUTCDate();
	returnObj.firstDayOfMonth = firstDay.getUTCDay();
	return returnObj;
};

/*
 * Set the input field in accordance to current date_info object.
 */
Calendar.prototype.setInput = function(selectedDay) {
	if(isNaN(selectedDay)) {
		return;
	}
	this.date_info.selectedDay = selectedDay;
	this.widget.inputNode.value = this.createSimpleUTCDate();
};

/*
 * Get the value of the input field and update the date_info object to match.
 */
Calendar.prototype.getInput = function() {
	if(this.widget.inputNode.value === "") {
		this.date_info = this.getDateInfo();
	} else {
		this.date_info = this.getDateInfo(this.widget.inputNode.value);
	}
};

/*
 * Move forward or backwards in the calendar.
 */
Calendar.prototype.navMonth = function(direction) {
	if(direction) {
		this.date_info.selectedMonth = this.date_info.selectedMonth - 1;
		if(this.date_info.selectedMonth < 0) {
			this.date_info.selectedMonth = 11;
			this.date_info.selectedYear = this.date_info.selectedYear - 1;
		}
	} else {
		this.date_info.selectedMonth = this.date_info.selectedMonth + 1;
		if(this.date_info.selectedMonth > 11) {
			this.date_info.selectedMonth = 0;
			this.date_info.selectedYear = this.date_info.selectedYear + 1;
		}
	}

	this.date_info = this.getDateInfo(this.createSimpleUTCDate());
	this.fillCalendar();
};

/*
 * Convert UTC Date object to human-readable UTC Date string,
 * have to add one to month value and pad with 0 if needed.
 */
Calendar.prototype.createSimpleUTCDate = function() {
	var monthString = (this.date_info.selectedMonth+1).toString();
	var dayString = this.date_info.selectedDay.toString();
	if (monthString.length < 2) {
		var monthString = "0" + monthString;
	}
	if (dayString.length < 2) {
		var dayString = "0" + dayString;
	}
	return this.date_info.selectedYear.toString()
		+ "-"
		+ monthString
		+ "-"
		+ dayString;
};

/*
 * Show the floating calendar.
 */
Calendar.prototype.show = function() {
	this.setPosition();
	this.fillCalendar();
	this.calendarNode.style["display"] = "inherit";
};

/*
 * Hide the floating calendar.
 */
Calendar.prototype.hide = function() {
	this.calendarNode.style["display"] = "none";
};

exports.date = DateWidget;

})();
