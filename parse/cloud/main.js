
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});




//Subscribe Email
Parse.Cloud.define("MandrillSubscribe", function(request, response){
  var mandrill = require("mandrill");
mandrill.initialize('ncsdDZJxpHtZ16xUu5JTpA');

Parse.Cloud.httpRequest({

    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    url: 'https://mandrillapp.com/api/1.0/messages/send-template.json',
    body:{
            "key": "ncsdDZJxpHtZ16xUu5JTpA",
        "template_name": "T-Shirt",
        "template_content": [{
            "name": "Chad",
                "content": "T-Shirt" // Name and Content are required even though they are ignored
            }], 
        "message": {
            "to": [
                {
                    "email": request.params.Address, //changed
                 }
                  ]
                }},

     success: function(httpResponse)
      { response.success("Email sent!" + httpResponse); },
      error: function(httpResponse)
      { response.error("Uh oh, something went wrong" + httpResponse); }
        });

    });




//PreOrder Email
Parse.Cloud.define("MandrillPreOrder", function(request, response){
  var mandrill = require("mandrill");
mandrill.initialize('ncsdDZJxpHtZ16xUu5JTpA');

Parse.Cloud.httpRequest({

    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    url: 'https://mandrillapp.com/api/1.0/messages/send-template.json',
    body:{
            "key": "ncsdDZJxpHtZ16xUu5JTpA",
        "template_name": "T-ShirtPurchase",
        "template_content": [{
            "name": "Chad",
                "content": "Buy T-Shirt" // Name and Content are required even though they are ignored
            }], 
        "message": {
            "to": [
                {
                    "email": request.params.Address, //changed
                 }
                  ]
                }},

     success: function(httpResponse)
      { response.success("Email sent!" + httpResponse); },
      error: function(httpResponse)
      { response.error("Uh oh, something went wrong" + httpResponse); }
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











var mailchimpApiKey = "4d99750dd39352efa9c1d488e97ecfb0-us8";

Parse.Cloud.define("SubscribeUserToMailingList", function(request, response) {

  if (!request.params ||
        !request.params.email){
    response.error("Must supply email address, firstname and lastname to Mailchimp signup");
    return;
  }

  var mailchimpData = {
    apikey  : mailchimpApiKey,
    id      : request.params.listid,
    email   : {
      email : request.params.email
    },
    double_optin : false,
  }

  var url = "https://us8.api.mailchimp.com/2.0/lists/subscribe.json";

  Parse.Cloud.httpRequest({
    method: 'POST',
    url: url,
    body: JSON.stringify(mailchimpData),
    success: function(httpResponse) {
      console.log(httpResponse.text);

      response.success("Successfully subscribed");
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      console.error(httpResponse.text);

      response.error('Mailchimp subscribe failed with response code ' + httpResponse.status);
    }
  });

});







// -------------OLD FUNCTIONS-----------------

//Subscribe Email Mandrill
Parse.Cloud.define("introEmail", function(request, response) {
var mandrill = require("mandrill");
mandrill.initialize('ncsdDZJxpHtZ16xUu5JTpA');

  mandrill.sendEmail({
    message: {
      text: "Hello, Thanks for signing up for news from People Clothing.",
      subject: "Thanks for Signing Up!",
      from_email: "Chad@People-Clothing.com",
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




//PreOrder Email Mandrill
Parse.Cloud.define("PreOrderEmail", function(request, response) {
var mandrill = require("mandrill");
mandrill.initialize('ncsdDZJxpHtZ16xUu5JTpA');

  mandrill.sendEmail({
    message: {
      text: "Hello, Thanks for your purchase from People Clothing.",
      subject: "Thanks for PreOrder!",
      from_email: "Chad@People-Clothing.com",
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










