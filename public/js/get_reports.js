firebase.auth().onAuthStateChanged(function (user) {
	var db = firebase.database();
	var events = db.ref('events/');

	events.on('value', function(eventSnap) {
		eventSnap.forEach(function(event) {

			var id = event.key;
			var title = event.child('title').val();
			var description = event.child('description').val();
			var report_date = event.child('report_date').val();

			$('#reports').append(`
				<tr>
					<th scope="row">`+id+`</th>
					<th>`+title+`</th>
					<th>`+description+`</th>
					<th>`+report_date+`</th>
				</tr>
				`);

		});
	});

});
