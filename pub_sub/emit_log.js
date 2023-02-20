const amqplib = require("amqplib");

//create a queue name
const exchangeName = "log_exchange";
// create a message
const msg = process.argv.slice(2).join(" ") || "subscribe like, comment";

const sendMsg = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  // create a pipeline to rmq
  const channel = await connection.createChannel();
  // by default the exchange is the direct exchange
  // create a queue and not recreate after restart
  await channel.assertExchange(exchangeName, "fanout", { durable: false });
  channel.publish(exchangeName, "", Buffer.from(msg));
  console.log("sent: ", msg);
  setTimeout(() => {
    connection.close();
    process.exit();
  }, 500);
};

sendMsg();
