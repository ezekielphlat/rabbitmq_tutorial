const amqplib = require("amqplib");

//create a queue name
const queueName = "hello";
// create a message
const msg = "hello world from another one";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  // create a pipeline to rmq
  const channel = await connection.createChannel();
  // by default the exchange is the direct exchange
  // create a queue and not recreate after restart
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(msg));
  console.log("sent: ", msg);
  setTimeout(() => {
    connection.close();
    process.exit();
  }, 500);
};

sendMsg();
