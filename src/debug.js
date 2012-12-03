var debugEvents = [];

exports = module.exports = {

	addEvent: function(event) {
		// TODO: This should work at an instance level, but I don't want to pass it around everywhere.  Hmmmmmmm
		//debugEvents.push(event);
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
