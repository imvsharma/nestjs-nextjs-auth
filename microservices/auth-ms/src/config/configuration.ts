export const configuration = () => {
  return {
    environment: process.env.NODE_ENV,
    microservice: process.env.MICROSERVICE_NAME,
    port: process.env.PORT,
    messageQueueUrl: process.env.MESSAGE_QUEUE_URL,
    messageQueueName: process.env.MESSAGE_QUEUE_NAME,
    secret: process.env.SECRET_KEY,
    userQueueName: process.env.USER_QUEUE_NAME,
  };
};
