
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});





Parse.Cloud.define("introEmail", function(request, response) {
var mandrill = require("mandrill");
mandrill.initialize('ncsdDZJxpHtZ16xUu5JTpA');

  mandrill.sendEmail({
    message: {
      text: "Hello, Thanks for signing up for news from People Clothing.",
      subject: "Thanks for Signing Up!",
      from_email: "Chad@ConnectedClothing.com",
      from_name: "Chad from People Clothing",
      to: [
        {
          email: request.params.Address,
          name: ""
        }
      ]
    },
    async: true
  }, {
    success: function(httpResponse) { response.success("Email sent!"); },
    error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });
});





var Stripe = require('stripe');
/*
models = require('cloud/models'), 
config = require('cloud/config');
*/
Stripe.initialize('sk_test_4TzBP9ev2GGgKq2WMbijiHkG');


Parse.Cloud.define("createCustomer", function(request, response) { 
var Stripe = require('stripe');
Stripe.initialize('sk_test_4TzBP9ev2GGgKq2WMbijiHkG');

console.log(request.params) 
    Stripe.Customers.create({
        account_balance: 0,
        email: request.params.email,
        //card: request.params.token,
        description: "stripe customer",
        metadata: {
            name: request.params.name,
            userId: request.params.token, // e.g PFUser object ID
            createWithCard: true
        }

    }, {
        success: function(httpResponse) {
            response.success(name + userId + "good"); // return customerId

        },
        error: function(httpResponse) {
            console.log(httpResponse + "help!");
            response.error("Cannot create a new customer.");
        }
    });
});



Parse.Cloud.define("preOrder", function(request, response) {
var Stripe = require('stripe');
Stripe.initialize('sk_test_4TzBP9ev2GGgKq2WMbijiHkG');

  Stripe.Charges.create({
    amount: 100 * 35, // $35 expressed in cents
    currency: "usd",
    card: request.params.token, // the token id should be sent from the client
  },{
    success: function(httpResponse) {
      response.success("Purchase made!" + request.params.email);
      

    },
    error: function(httpResponse) {
      response.error("Uh oh, something went wrong");
    }
  })
});













