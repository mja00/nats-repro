import { connect, deferred, nuid } from "@nats-io/transport-node";

const nc = await connect({
    servers: "demo.nats.io",
    // Set to true to see multiple > MSG logs
    debug: false,
    maxReconnectAttempts: -1,
    timeout: 10000,
    pingInterval: 10000,
    maxPingOut: 2,
});

// console.log(nc);

(async () => {
    console.info(`connected ${nc.getServer()}`);
    for await (const s of nc.status()) {
        console.log(s);
      switch (s.type) {
        case "disconnect":
        case "reconnect":
          console.log(s);
          break;
        default:
          // ignored
      }
    }
  })().then();

const subject = nuid.next();

// // Subscribe to our subject once
nc.subscribe(subject, {
    callback: (err, msg) => {
        if (err) {
            console.error(err);
        }
        const parsedMessage = msg.json();
        const prettyTime = new Date(parsedMessage.time).toISOString();
        console.log(`Received message on ${subject}: ${prettyTime}`)
    }
});

// (async () => {
//     const sub = await nc.subscribe(subject);
//     console.log(`Subscribed to ${subject}`);
//     for await (const msg of sub) {
//         const parsedMessage = msg.json();
//         const prettyTime = new Date(parsedMessage.time).toISOString();
//         console.log(`Received message on ${subject}: ${prettyTime}`)
//     }
// })().then();

// Let's publish a message every 1 second with the current time
const defer = deferred();

const timer = setInterval(() => {
    nc.publish(subject, 
        JSON.stringify({
            time: Date.now(),
        }),
    );
}, 1000);

// Run indefinitely till the user ctrl+c's
process.on("SIGINT", async () => {
    clearInterval(timer);
    defer.resolve();
    await nc.drain();
});

await defer;