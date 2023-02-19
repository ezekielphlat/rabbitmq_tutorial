const amqplib = require("amqplib");

//create a queue name
const queueName = "task";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  // create a pipeline to rmq
  const channel = await connection.createChannel();
  // by default the exchange is the direct exchange
  // create a queue and not recreate after restart
  await channel.assertQueue(queueName, { durable: true });
  // pefetch queue to ensure it is not busy
  channel.prefetch(1);
  console.log(`waiting for messages in queue: ${queueName}`);
  channel.consume(
    queueName,
    (msg) => {
      const secs = msg.content.toString().split(".").length - 1;
      console.log("[X] Recieved: ", msg.content.toString());
      setTimeout(() => {
        console.log("done resizing image");
        channel.ack(msg);
      }, secs * 1000);
    },
    { noAck: false }
  );
};

sendMsg();
