firebase.auth().onAuthStateChanged(function (user) {
	var db = firebase.database();
	var events = db.ref('events/');
	var people = db.ref('people/');

	// edgesArray = [
	 // 	 {from: 1, to: 3},
	 // 	 {from: 1, to: 2}
	// ];
	var peopleList = [];
	var eventsList = [];
	var edges = new vis.DataSet({});
	var nodes = new vis.DataSet({});

	events.once('value').then(function(eventSnap) {
		var count = 1;
		eventSnap.forEach(function(event) {

			var title = event.child('title').val();
			nodes.add({id:count, label:title, color: '#ff4962'});
			eventsList.push({node_id:count, event_id:event.key})
			console.log('EVENT KEY:'+event.key+":");
			var tempEventID = count;

			people.orderByChild('event_id').equalTo(event.key.toString()).once('value').then(function(peopleSnap) {
				console.log("numChildren: "+peopleSnap.numChildren());
				peopleSnap.forEach(function(person) {
					console.log(person.key);
					var toggle = false;
					var firstName = person.child('first_name').val();
					// If identity already exists add an event connection
					nodes.forEach(function(node) {
						if(node.label == firstName) {
							toggle = true;
							edges.add({from:node.id, to:tempEventID});
						}
					});
					if(!toggle) {
						count += 1;
					  peopleList.push({node_id:count, person_id: person.key});
						nodes.add({id:count, label:firstName, color:'#3fdfff'});
						edges.add({from:count, to:tempEventID});
					}
				});
			});

			count += 1;
		});
	});

	 var container = document.getElementById('mynetwork');
	 var data = {
			 nodes: nodes,
			 edges: edges
	 };
	 // Edit Options
	 var options = {
			edges: {
				smooth: false,
				length: 200
			},
			nodes: {
				shape: 'circle'
			}
		}

	 network = new vis.Network(container, data, options);

	 network.on('click', function(properties) {
	  var clickedNode = peopleList.filter(function (person) {
	 	 // Find node in network where its id equals recorded peopleList node id
	 	 return person.node_id == nodes.get(properties.nodes)[0].id
	  })[0];
	  // If node is a person
	  if(clickedNode != null) {
	 	 console.log('clicked person: '+clickedNode.person_id);
		 	people.child(clickedNode.person_id).on("value", function(personInfo) {
				$('#node-information').empty();
				$('#node-information').append('<h2>Name: '+personInfo.child('first_name').val()+' '+personInfo.child('last_name').val()+'</h2>');
				$('#node-information').append('<h3>Banner ID: '+personInfo.child('banner_id').val()+'</h3>');
			});
	  }
	  clickedNode = eventsList.filter(function (event) {
	 	 // Find node in network where its id equals recorded identities node id
	 	 return event.node_id == nodes.get(properties.nodes)[0].id
	  })[0];
	  // If node is an event
	  if(clickedNode != null) {
			events.child(clickedNode.event_id).on("value", function(eventInfo) {
				$('#node-information').empty();
				$('#node-information').append('<h2>Title: '+eventInfo.child('title').val()+'</h2>');
				$('#node-information').append('<h3>description: '+eventInfo.child('description').val()+'</h3>');
				$('#node-information').append('<h3>Report Date: '+eventInfo.child('report_date').val()+'</h3>');
				$('#node-information').append('<h3>Clery Case: '+eventInfo.child('clery').val()+'</h3>');
			});
	  }
	 });

});
