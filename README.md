![](./assets/bae0d6ac-f93a-43a0-955d-1757c3c9e51d.png)

This project provides a serverless “Quote of the Day” API. An API Gateway endpoint triggers a TypeScript Lambda function, which retrieves a random quote from a DynamoDB table and returns it as JSON. The entire infrastructure—including the Lambda, API route, and database—is defined and deployed using AWS CDK, with optional scripts for creating and seeding the table during development.


