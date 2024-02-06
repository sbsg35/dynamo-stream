# Dynamo streams & Lambda integration

Test to see what is passed to lambda functions from the dynamo stream.
The stack creates a dynamodb table that streams data to a lambda. The lambda logs what it receives.

## Requirements

Install [serverless framework](https://www.serverless.com/framework/docs/getting-started). This is used to deploy the stack to AWS.

## Deploying

```
yarn install
yarn deploy:dev
```

## Testing

Create/Update/Delete items in the dynamo to trigger the lambda.

View the corresponding logs in cloudwatch or via serverless framework cli, using the name of the lambda function.

```
sls logs -f streamhandler -t
```

## Cleanup

```
yarn remove:dev
```
