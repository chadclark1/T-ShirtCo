Parse.initialize("s1dRWOG0Mq2pGHNZNrgs2emJ953qz4SKSt8uaXP9", "wQYeR4TrzqfyRVqnheVAVZd1mbSZlIXT6TuVEazU")


$(document).ready(function() {

	$(".input-group-btn").click(function() {
		console.log("Notify Me");

		var Address = $(".form-control").val();

		var Email = Parse.Object.extend("Email");
		var email = new Email();
 
		email.set("Address", Address);

		console.log(Address);

		email.save(null, {
  			success: function(email) {
    			// Execute any logic that should take place after the object is saved.
    			console.log('New object created with objectId: ' + email.id);
    			
  			},
  			error: function(email, error) {
    			// Execute any logic that should take place if the save fails.
    			// error is a Parse.Error with an error code and description.
    			alert('Could not accept email address: ' + error.message);
  			}
		});

	});


	$(".btn-wide").click(function() {
		console.log("Buy");
	});

	$(".btn-large").click(function() {
		console.log("Subscribe");

		var Address = $(".subinput").val();

		var Email = Parse.Object.extend("Email");
		var email = new Email();
 
		email.set("Address", Address);

		console.log(Address);

		email.save(null, {
  			success: function(email) {
    			// Execute any logic that should take place after the object is saved.
    			console.log('New object created with objectId: ' + email.id);
    			$('.subinput').val("");
  			},
  			error: function(email, error) {
    			// Execute any logic that should take place if the save fails.
    			// error is a Parse.Error with an error code and description.
    			alert('Could not accept email address: ' + error.message);
  			}
		});

	});

});