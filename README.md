# Serverless Framework Node SQS Producer-Consumer on AWS

This template demonstrates how to develop and deploy a simple SQS-based producer-consumer service running on AWS Lambda using the Serverless Framework. It allows to accept messages, for which computation might be time or resource intensive, and offload their processing to an asynchronous background process for a faster and more resilient system.

## Anatomy of the template

This template defines one function `producer` and one `consumer`. The producer function is triggered by `http` event type, accepts JSON payloads and sends it to a SQS queue for asynchronous processing. The queue is set up with a "dead-letter queue" (to receive failed messages) and a `worker` Lambda function that processes the SQS messages.

To learn more:

- about `http` event configuration options, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/)
- about SQS processing with AWS Lambda, please refer to the official [AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)

### Running queues locally

In order to use SQS queues locally you will need to run elasticmq on your machine. The easiest way to do this is via docker:

```
docker run -p 9324:9324 -p 9325:9325 softwaremill/elasticmq-native
```

Then `serverless-offline-sqs` will take care of the rest.


### Local invocation

Do a `POST` request to `http://localhost:3012/produce` with the following body:

```json
{
    "body" : {
        "test": 1
    }
}

```
The producer should accept the request and write what you sent to the Queue. The Queue handler should consume it (consumer).


### Deployment

Install dependencies with:

```
npm install
```

Then deploy:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service aws-node-sqs-worker.zip file to S3 (21.45 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
................................................
Serverless: Stack update finished...
Service Information
service: aws-node-sqs-worker
stage: dev
region: us-east-1
stack: aws-node-sqs-worker-dev
resources: 17
api keys:
  None
endpoints:
  POST - https://xxxx.execute-api.us-east-1.amazonaws.com/produce
functions:
  producer: aws-node-sqs-worker-dev-producer
  jobsWorker: aws-node-sqs-worker-dev-jobsWorker
layers:
  None
jobs:
  queueUrl: https://sqs.us-east-1.amazonaws.com/xxxx/aws-node-sqs-worker-dev-jobs
```


_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can now call the created API endpoint with `POST` request to invoke `producer` function:

```bash
curl --request POST 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/produce' --header 'Content-Type: application/json' --data-raw '{"name": "John"}'
```

In response, you should see output similar to:

```bash
{"message": "Message accepted!"}
```
