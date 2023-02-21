const express = require("express");
const app = express();
// const https = require("https");
const emailChimpApiKey = "cb1705d8461e874fc56f749a14f475c0-us21";
const chimpServer = emailChimpApiKey.split("-")[1];
const listId = "6abecd581e";
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: emailChimpApiKey,
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: chimpServer,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const userEmail = req.body.userEmail;
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: userEmail,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName,
      },
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server is up and running...");
});
