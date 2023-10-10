const AWS = require("aws-sdk");
const sns =  new AWS.SNS();
const axios =  require("axios");


const publishToSNS =  (messgae)=>{
    const res =  sns.publish({
        Message: messgae,
        TopicArn: process.env.SNS_ARN_TOPIC
    }).promise();

    console.log("sns publish res::",res);
}

const buildEmailBody = (id,form)=>{
    return `
        Message: ${form.message}
        Name: ${form.name}
        Email: ${form.email}
        Service information: ${id.sourceIp} - ${id.userAgent}
    `
}


module.exports.staticMailer = async (event)=>{
    console.log("event::",event);
    const data =  JSON.parse(event.body);
    const emailBody =  buildEmailBody(event.requestContext.identity,data);
    await publishToSNS(emailBody);

    try {
        const res =  await axios.post(
            "https://93cirspaik.execute-api.us-east-1.amazonaws.com/dev/subscribe",
            {
                email: data.email
            }
        );

        console.log("res:",res);
    } catch (error) {
        console.log("error:",error);
    }
    return {
        headers: {
          "Content-type": "application/json",
          "Access-control-Allow-Methods": "*",
          "Access-control-Allow-Origin": "*",
        },
        statusCode: 200,
        body: JSON.stringify({message:"OK"}),
      };
}