Parse.initialize("s1dRWOG0Mq2pGHNZNrgs2emJ953qz4SKSt8uaXP9", "wQYeR4TrzqfyRVqnheVAVZd1mbSZlIXT6TuVEazU");

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
        	// Invoke our cloud function, using the phone number in the text field
        	Parse.Cloud.run('introEmail', {
            	Address: $(".form-control").val()
        		}, {
            		// Success handler
            		success: function(message) {
                		alert('Success: ' + message);
            		},
            		// Error handler
            		error: function(message) {
               	 		alert('Error: ' + message);
            		}
        		});
        	}
    	});
	});	

	$(".btn-wide").click(function() {
		console.log("Buy");
	});


    var handler = StripeCheckout.configure({
        key: 'pk_test_4TzBTXvA3s0wWq0WfUyJgGQv',
        image: 'Desktop/TShirtWebsite/startup/common-files/img/logo.png',
        token: function(token) {
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
        
        Parse.Cloud.run('preOrder', {
            token: token.id
        }, {
            // Success handler
                success: function(message) {
                    alert('Success: 1' + message);
                    console.log(token.email);

                    var Address = token.email;

                    var Email = Parse.Object.extend("Email");
                    var email = new Email();
 
                    email.set("Address", Address);

                    console.log(Address + '5');

                    email.save(null, {
                        success: function(email) {
                            // Execute any logic that should take place after the object is saved.
                            console.log('New object created with objectId: ' + email.id);
                            alert(token.email);
                        // Invoke our cloud function, using the phone number in the text field
                        Parse.Cloud.run('introEmail', {
                            Address: token.email
                            }, {
                                // Success handler
                                success: function(message) {
                                    alert('Success: ' + message);
                                },
                                // Error handler
                                error: function(message) {
                            alert('Error: ' + message);
                                }
                            });
                        }
                    });


                },
                // Error handler
                error: function(message) {
                    alert('Error: 2' + message);
                }
             })
        Parse.Cloud.run('createCustomer',{
            token: token.id,
            email: token.email,
            name: token.card.name,
        }, {
            // Success handler
                success: function(message) {
                    alert('Success: 3' + message);

                },
                // Error handler
                error: function(message) {
                    alert('Error: 4' + message);
                }
        })
        }
    });

    document.getElementById('btn-wide').addEventListener('click', function(e) {
        // Open Checkout with further options
        handler.open({
        name: 'Connected Clothing',
        description: 'Pre-Order One Month of T-Shirts',
        amount: 3500,
        shippingAddress: true,
        billingAddress:true,
        panelLabel: 'Pre-Order',
        });
        e.preventDefault();
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
    			
  			},
  			error: function(email, error) {
    			// Execute any logic that should take place if the save fails.
    			// error is a Parse.Error with an error code and description.
    			console.log('Could not accept email address: ' + error.message);
  			}
		});

	});

});