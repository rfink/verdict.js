var debugEvents = [];

exports = module.exports = {

	addEvent: function(event) {
		debugEvents.push(event);
	},

	clearEvents: function() {
		var events = Array.prototype.slice.call(debugEvents);
		debugEvents = [];
		return events;
	},

	getEvents: function() {
		return debugEvents;
	}

};
