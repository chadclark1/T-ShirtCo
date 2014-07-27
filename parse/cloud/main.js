 
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