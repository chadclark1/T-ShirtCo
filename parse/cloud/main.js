 
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});





Parse.Cloud.define("introEmail", function(request, response) {
var mandrill = require("mandrill");
mandrill.initialize('ncsdDZJxpHtZ16xUu5JTpA');

  mandrill.sendEmail({
    message: {
      text: "Hello!",
      subject: "Thanks for Signing Up!",
      from_email: "Chad@ConnectedClothing.com",
      from_name: "Chad",
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


var Stripe = require('stripe'),
  express = require('express'),
  app = express(),
  path = require('path'), 
  models = require('cloud/models'), 
  config = require('cloud/config');






Stripe.initialize('sk_test_4TzBP9ev2GGgKq2WMbijiHkG');


app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({
  secret: config.secret,
  cookie: { httpOnly: true }
}));






  app.get('/', function(req, res) {
  res.render('index', {
    config: config
    });
  });



  app.post('/pay',function(req,res) {
    var order = new models.Order()

    for (param in models.Order.schema) {
      order.set(param,req.body[param]);
    }
    // Use stripeToken somehow

    token_id = req.body.stripe_token
    Stripe.Tokens.retrieve(token_id).then(function(token) {
      order.set('token_id', token_id);
      order.set('email', token.email);

      return order.save();
    })

    .then(function(order) {
      return Stripe.Customers.create({
        description: order.get('name'),
        email: order.get('email'),
        card: order.get('token_id')   
      })
    })

    .then(function(customer) {
      return Stripe.Charges.create({
        amount: order.calculateAmount(),
        description:'Pre-Order $35',
        currency: 'usd',
        customer: customer.id
      });
    })


    });






/*
var Stripe = require('stripe');
Stripe.initialize('sk_test_4TzBP9ev2GGgKq2WMbijiHkG');


Parse.Cloud.define("createCustomer", function(request, response) {    
    Stripe.Customers.create({
        account_balance: 0,
        email: request.params.email,
        description: 'new stripe user',
        metadata: {
            name: request.params.name,
            userId: request.params.objectId, // e.g PFUser object ID
            createWithCard: false
        }
    }, {
        success: function(httpResponse) {
            console.log(name + userId);
            response.success(name + userId); // return customerId
        },
        error: function(httpResponse) {
            console.log(httpResponse);
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
    card: request.params.token // the token id should be sent from the client
  },{
    success: function(httpResponse) {
      response.success("Purchase made!");
    },
    error: function(httpResponse) {
      response.error("Uh oh, something went wrong");
    }
  })
});
*/












