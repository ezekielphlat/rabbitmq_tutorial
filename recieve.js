const amqplib = require("amqplib");

//create a queue name
const queueName = "hello";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  // create a pipeline to rmq
  const channel = await connection.createChannel();
  // by default the exchange is the direct exchange
  // create a queue and not recreate after restart
  await channel.assertQueue(queueName, { durable: false });
  console.log(`waiting for messages in queue: ${queueName}`);
  channel.consume(
    queueName,
    (msg) => {
      console.log("[X] Recieved: ", msg.content.toString());
    },
    { noAck: true }
  );
};

sendMsg();
