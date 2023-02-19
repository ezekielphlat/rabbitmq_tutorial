const amqplib = require("amqplib");

//create a queue name
const queueName = "task";
// create a message
const msg = process.argv.slice(2).join(" ") || "Hello World";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  // create a pipeline to rmq
  const channel = await connection.createChannel();
  // by default the exchange is the direct exchange
  // create a queue and not recreate after restart
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  console.log("sent: ", msg);
  setTimeout(() => {
    connection.close();
    process.exit();
  }, 500);
};

sendMsg();
