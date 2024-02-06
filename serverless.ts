import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "mock-service",
  frameworkVersion: "3",

  params: {
    offline: {
      stage: "dev",

      sentryDSN: "", // leave blank for not logging in local dev
    },
    prod: {},
    default: {
      region: "${opt:region, self:provider.region}",
      stage: "${sls:stage}",

      sentryDSN: "",
    },
  },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      watch: {
        pattern: ["src/**/*.{ts,tsx}"],
      },
    },

    "serverless-offline": {
      httpPort: 5001,
      lambdaPort: 3001,
    },

    prune: {
      automatic: true,
      number: 20,
    },
  },

  plugins: ["serverless-dotenv-plugin", "serverless-esbuild", "serverless-offline", "serverless-prune-plugin"],

  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "us-east-1",
    profile: "iamadmin-general",
    logRetentionInDays: 14,
    timeout: 30, // seconds - nb APIGateway has 30 sec limit

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",

      SERVICE: "${self:service}",
      STAGE: "${param:stage}",
      REGION: "${param:region}",

      MAIN_TABLE: { Ref: "MainTable" },
    },

    iam: {
      role: {
        statements: [{ Effect: "Allow", Action: ["dynamodb:*"], Resource: [{ "Fn::GetAtt": ["MainTable", "Arn"] }] }],
      },
    },
  },

  resources: {
    Resources: {
      MainTable: {
        Type: "AWS::DynamoDB::Table",
        // DeletionPolicy: "Retain",
        Properties: {
          TableName: "${self:service}-${param:stage}-main",
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "nuid", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST", // on-demand
          StreamSpecification: { StreamViewType: "NEW_AND_OLD_IMAGES" },
          GlobalSecondaryIndexes: [
            {
              IndexName: "nuid",
              KeySchema: [{ AttributeName: "nuid", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
            },
          ],
        },
      },
    },
  },

  functions: {
    root: {
      handler: "src/handler/root.main$",
      description: "health check",
      events: [{ stream: { type: "dynamodb", batchSize: 4, arn: { "Fn::GetAtt": ["MainTable", "StreamArn"] } } }],
    },
  },
};

module.exports = serverlessConfiguration;
