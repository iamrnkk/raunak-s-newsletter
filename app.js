const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = new express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


//home route
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

});

//redirect to home route on failure
app.get("/failure", function(req, res) {
  res.redirect("/");
});

//handle post method
app.post("/", function(req, res) {
  //get data from user
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
//convert data to JSON needed by mailchimp API
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data);

//for authetication and security
  const uniqueId = "your unique id";
  const apiKey = "your api key";

  const url = "https:usX.api.mailchimp.com/3.0/lists/" + uniqueId; //change X according to your assigned region


  const options = {
    method: "POST",
    auth: "raunak:" + apiKey,
  };

  //get data from mailchimp
  const request = https.request(url, options, function(response) {

    //check if signup was successful
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));

    });
  });

  //send data to mailchhimp
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running at port 3000");
});
