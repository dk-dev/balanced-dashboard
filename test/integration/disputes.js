module('Disputes', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
	var disputesController = Balanced.__container__.lookup('controller:marketplace_disputes');
	visit(DISPUTES_ROUTE)
		.then(function() {
			Ember.run(function() {
				disputesController.get("model").setProperties({
					minDate: moment('2013-08-01T00:00:00.000Z').toDate(),
					maxDate: moment('2013-08-01T23:59:59.999Z').toDate()
				});
			});
		})
		.then(function() {
			var resultsLoader = disputesController.get("model");
			assert.equal(resultsLoader.get("path"), '/disputes', 'Disputes URI is correct');
			assert.deepEqual(resultsLoader.get("queryStringArguments"), {
				"created_at[<]": "2014-07-22T08:00:00.000Z",
				"created_at[>]": "2013-11-06T23:52:48.396Z",
				"limit": 50,
				"sort": "initiated_at,desc"
			}, "Query string arguments match");
		})
		.checkElements({
			".page-navigation h1": "Disputes",
			"table.disputes tbody tr": 2,
			'table.disputes tbody tr:eq(0) td.date.initiated': 1,
			'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
			'table.disputes tbody tr:eq(0) td.status': 'pending',
			'table.disputes tbody tr:eq(0) td.account': 1,
			'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
			'table.disputes tbody tr:eq(0) td.amount': '$2.00',
		}, assert);
});
