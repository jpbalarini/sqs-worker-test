const handler = async (event) => {
  for (const record of event.Records) {
    const messageAttributes = record.messageAttributes;
    console.log("Message Arriving!");
    if (messageAttributes.AttributeName) {
      console.log(
        "Message Attributte: ",
        messageAttributes.AttributeName.stringValue
      );
    }
    console.log("Message Body: ", record.body);
  }
};

module.exports = {
  handler,
};
