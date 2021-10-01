const { SNS } = require('aws-sdk');

const handler = async (event) => {
  let statusCode = 200;
  let message;

  let sns = new SNS({
    endpoint: 'http://127.0.0.1:4002',
    region: 'us-east-1',
  });

  try {
    const snsMessage = JSON.stringify({ default: JSON.stringify({ body: 1 }) });
    let response = await sns.publish({
      Message: snsMessage,
      MessageAttributes: {
        AttributeName: {
          StringValue: "Attribute Value",
          DataType: "String",
        },
      },
      TopicArn: `arn:aws:sns:us-east-1:123456789012:${process.env.TOPIC_NAME}`,
    })
    .promise();
    // console.log(response);
    message = "Message sent!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
}

module.exports = {
  handler,
};
