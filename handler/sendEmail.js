const brevo = require("@getbrevo/brevo");
const axios =  require("axios");

module.exports.sendEmail = async (event) => {
  try {
    let defaultClient = brevo.ApiClient.instance;
    const randomQuote = await getRandomQuote();
    const emailBody =  await getEmailBody(randomQuote);
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey =
      "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";

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "nicee";
    sendSmtpEmail.htmlContent = emailBody;
    sendSmtpEmail.sender = { name: "John", email: "pkkashyap616@gmail.com" };
    sendSmtpEmail.to = [
      { email: "pkkashyap717@gmail.com", name: "sample-name" },
    ];
    // sendSmtpEmail.replyTo = { "email": "example@brevo.com", "name": "sample-name" };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = {
      parameter: "My param value",
      subject: "common subject",
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
      },
      function (error) {
       throw new Error(error);
      }
    );
  } catch (error) {
    console.log("error",error);

  }
};

const getEmailBody =  async(quotes)=>{
    return`
        <html><body><h1>Common: quotes {{quotes.quote}}</h1></body></html>
    `
}

const getRandomQuote = async()=>{
    const getquotes =  axios.get('api');
    const length = getquotes.data.quotes.length;
    const random =  getquotes.data.quotes[Math.floor(Math.random()*length)];
    return random;
}
