Parse.initialize("s1dRWOG0Mq2pGHNZNrgs2emJ953qz4SKSt8uaXP9", "wQYeR4TrzqfyRVqnheVAVZd1mbSZlIXT6TuVEazU");

$(document).ready(function() {



    $(".input-group-btn").click(function() {
        console.log("Notify Me");

        var emailAdd = $(".form-control").val();

        if (emailAdd.length < 5) {
            alert("Please enter a valid email address.");


        } else {

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

                    Parse.Cloud.run('SubscribeUserToMailingList', {
                            listid: "9748c09977",
                            email: $(".form-control").val()
                        })
                        .then(function(success) {
                                console.log("Successfully subscribed");
                                // ...
                            },
                            function(error) {
                                console.log("Unable to subscribe");
                                // ...
                            });



                    Parse.Cloud.run('MandrillSubscribe', {
                        Address: $(".form-control").val()
                    }, {
                        // Success handler
                        success: function(message) {
                            alert("Thank you! Please check your inbox for news about People Clothing.");
                        },
                        // Error handler
                        error: function(message) {
                            alert('Error: ' + message);
                        }
                    });
                }


            });
        }
    });

    $(".btn-wide").click(function() {
        console.log("Buy");
    });


    var handler = StripeCheckout.configure({
        key: 'pk_live_4TzBB2YwP8Q3LgmUaX2uH1BE',
        image: '../../startup/common-files/img/PLogoStripe.png',
        token: function(token) {
            // Use the token to create the charge with a server-side script.
            // You can access the token ID with `token.id`

            Parse.Cloud.run('preOrder', {
                token: token.id
            }, {
                // Success handler
                success: function(message) {
                    alert('Thank you for your purchase. Please check your email for more details.');
                    console.log(token.email);

                    Parse.Cloud.run('SubscribeUserToMailingList', {
                            listid: "9748c09977",
                            email: token.email
                        })
                        .then(function(success) {
                                console.log("Successfully subscribed");
                                // ...
                            },
                            function(error) {
                                console.log("Unable to subscribe");
                                // ...
                            });




                    var Address = token.email;

                    var Email = Parse.Object.extend("Email");
                    var email = new Email();

                    email.set("Address", Address);

                    console.log(Address + '5');

                    email.save(null, {
                        success: function(email) {
                            // Execute any logic that should take place after the object is saved.
                            console.log('New object created with objectId: ' + email.id);
                            console.log(token.email);


                            // Invoke our cloud function, using the phone number in the text field
                            Parse.Cloud.run('MandrillPreOrder', {
                                Address: token.email
                            }, {
                                // Success handler
                                success: function(message) {
                                    console.log('success'.message);
                                },
                                // Error handler
                                error: function(message) {
                                    console.log('Error: ' + message);
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


            Parse.Cloud.run('createCustomer', {
                token: token.id,
                email: token.email,
                name: token.card.name,
            }, {
                // Success handler
                success: function(message) {
                    console.log('Success: 3' + message);

                },
                // Error handler
                error: function(message) {
                    console.log('Error: 4' + message);
                }
            })
        }
    });

    document.getElementById('btn-wide').addEventListener('click', function(e) {
        // Open Checkout with further options
        handler.open({
            name: 'People Clothing',
            description: 'Pre-Order One Month of T-Shirts',
            amount: 3500,
            shippingAddress: true,
            billingAddress: true,
            coupon: true,
            panelLabel: 'Pre-Order',
        });
        e.preventDefault();
    });




    $(".btn-large").click(function() {
        console.log("Notify Me");

        var emailAdd = $(".subinput").val();

        if (emailAdd.length < 5) {
            alert("Please enter a valid email address.");


        } else {

            var Address = $(".subinput").val();

            var Email = Parse.Object.extend("Email");
            var email = new Email();

            email.set("Address", Address);

            console.log(Address);

            email.save(null, {
                success: function(email) {
                    // Execute any logic that should take place after the object is saved.
                    console.log('New object created with objectId: ' + email.id);
                    // Invoke our cloud function, using the phone number in the text field

                    Parse.Cloud.run('SubscribeUserToMailingList', {
                            listid: "9748c09977",
                            email: $(".subinput").val()
                        })
                        .then(function(success) {
                                console.log("Successfully subscribed");
                                // ...
                            },
                            function(error) {
                                console.log("Unable to subscribe");
                                // ...
                            });



                    Parse.Cloud.run('MandrillSubscribe', {
                        Address: $(".subinput").val()
                    }, {
                        // Success handler
                        success: function(message) {
                            alert("Thank you! Please check your inbox for news about People Clothing.");
                        },
                        // Error handler
                        error: function(message) {
                            alert('Error: ' + message);
                        }
                    });
                },

                error: function(email, error) {
                    console.log('Could not accept email address: ' + error.message);
                    alert("Error")
                },

            });
        }



    });

});


