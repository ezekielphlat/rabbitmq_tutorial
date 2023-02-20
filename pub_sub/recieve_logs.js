const amqplib = require("amqplib");

//create a queue name
const exchangeName = "log_exchange";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  // create a pipeline to rmq
  const channel = await connection.createChannel();
  // by default the exchange is the direct exchange
  // create a queue and not recreate after restart
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });
  // pefetch queue to ensure it is not busy
  console.log(`waiting for messages in queue: ${q.queue}`);
  channel.bindQueue(q.queue, exchangeName, "");
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) console.log("the message is: ", msg.content.toString());
    },
    { noAck: true }
  );
};

sendMsg();
