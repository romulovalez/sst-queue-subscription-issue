/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-queue-subscription-issue",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // If the lambda has no changes it will not be updated, as expected...
    new sst.aws.Function("Lambda", { handler: "src/lambda.handler" });

    const topic = new sst.aws.SnsTopic("Topic");
    const queue = new sst.aws.Queue("Queue");
    queue.subscribe("src/handle-queue.handler");

    // ...but this subscription will always be updated even if there are no changes
    // to it or its resources
    topic.subscribeQueue(queue.arn);
  },
});
