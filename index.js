// Create Node poroject
// listen to sqs queue message will be like Saleor  async webhooks response
// send event to klaviyo

const aws = require("aws-sdk");

const sendEventToKlaviyo = require("./src/sendEventToKlaviyo");

const sqs = new aws.SQS({ region: "us-east-1" });
const queueUrl =
  "https://sqs.us-east-1.amazonaws.com/381285607374/myQueueToTest.fifo";

// Continuously poll the SQS queue for new messages
async function pollQueue() {
  try {
    while (true) {
      // Receive messages from the SQS queue
      const result = await sqs
        .receiveMessage({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 20,
        })
        .promise();

      // If there are no messages in the queue, wait and retry
      if (!result.Messages) {
        console.log("No messages found, retrying...");
        continue;
      }
      // Process each message in the queue
      for (const message of result.Messages) {
        const body = JSON.parse(message.Body);
        const payload = body.payload;

        const event = body.notify_event || "ANY_EVENTS";

        sendEventToKlaviyo(event, payload, async (status, err) => {
          if (err) console.log(err);
          if (status) {
            await sqs
              .deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle,
              })
              .promise();
          }
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

pollQueue();
