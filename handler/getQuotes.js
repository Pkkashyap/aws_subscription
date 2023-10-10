const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REGION,
});
const s3 = new AWS.S3();

module.exports.getQuotes = async (event) => {
  console.log("event:::", event);

  const params = {
    Bucket: "myquotebucket1",
    Key: "quotes.json",
  };

  try {
    const data = await s3.getObject(params).promise();
    const quotes = JSON.parse(data.Body);
    console.log("data::", data);
    console.log("quotes::", quotes);
    const resposne = {
      headers: {
        "Content-type": "application/json",
        "Access-control-Allow-Methods": "*",
        "Access-control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify(quotes),
    };

    return resposne;
  } catch (error) {

    console.log("err::", error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
