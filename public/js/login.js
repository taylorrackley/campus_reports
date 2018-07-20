// Initialize Firebase
var config = {
	apiKey: "AIzaSyB-dgCAy1Ef5gS-s26YuT3kWm-nIOO4KY0",
	authDomain: "test-30a16.firebaseapp.com",
	databaseURL: "https://test-30a16.firebaseio.com",
	projectId: "test-30a16",
	storageBucket: "test-30a16.appspot.com",
	messagingSenderId: "667509319135"
};
firebase.initializeApp(config);

var email = 'safety@covenant.edu';
var password = 'Mscott1819!';
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	// ...
});
