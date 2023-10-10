const AWS =  require("aws-sdk");
const uuid = require("uuid");
AWS.config.update({
    region: process.env.REGION
})
const dynamoDB =  new AWS.DynamoDB.DocumentClient();
const userTable =  process.env.USERS_TABLE

module.exports.subscribeUser = async (event)=>{
    const data = JSON.parse(event.body);
    console.log("DATA:::",data);
    const timestamp = new Date().getTime();
    const params = {
        TableName: userTable,
        Item: {
            userId: uuid.v4(),
            email:  data.email,
            subscribe: true,
            createdAt: timestamp,
            updateAt: timestamp
        }
    }


    try {
        const data =  await dynamoDB.put(params).promise();
        console.log("data",data);
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        }

        return response;

    } catch (error) {
        return  {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}