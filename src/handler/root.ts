import { DynamoDBStreamEvent } from "aws-lambda";

export const main$ = async (a: DynamoDBStreamEvent) => {
  a?.Records.map(({ eventName, dynamodb: { OldImage, NewImage } }) => {
    // eslint-disable-next-line no-console
    console.log({ eventName, OldImage, NewImage });
  });
  return "Success";
};
