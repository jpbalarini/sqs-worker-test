const handler = async (event) => {
  console.log('EVENT FROM DLQ: ', event);
};

module.exports = {
  handler
};
