https://github.com/IvanRadchenko/shop-angular-cloudfront-be/tree/aws-course-task-7


https://github.com/EPAM-JS-Competency-center/cloud-development-course-initial

# Serverless - EPAM AWS Course - Online Shop BE

## Installation/deployment instructions

- Run `npm i` to install the project dependencies
- Run `npm run deploy:dev|prod` to deploy this stack to AWS

## Test your service

The request body must be provided as `application/json`.
The body structure is tested by API Gateway against `src/functions/{FUNCTION_NAME}/schema.ts` JSON-Schema definition.

You can run jest tests with npm commands from within the Product Service:

- `npm run test`

### Locally

You can test all lamdas locally without visiting the aws console. Enter the Product service repository and launch commands:

- `sls invoke local -f getAllProducts --path src/functions/getAllProducts/mock.json`
- `sls invoke local -f getProductById --path src/functions/getProductById/mock.json`

OR

- `npm run local:getAllProducts`
- `npm run local:getProductById`

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/products' \
--header 'Content-Type: application/json' \
--data-raw '{
    "myParams": "myParamValues"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions            # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts   # `Handler` lambda source code
│   │   │   ├── index.ts     # `Handler` lambda Serverless configuration
│   │   │   ├── mock.json    # `Handler` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts    # `Handler` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts         # Import/export of all lambda configurations
│   │
│   └── libs                 # Lambda shared code
│       └── apiGateway.ts    # API Gateway specific helpers
│
├── package.json
├── serverless.yml           # Serverless service file
├── tsconfig.json            # Typescript compiler configuration
└── webpack.config.js        # Webpack configuration
```

### 3rd party librairies

- [redoc-cli](https://github.com/Redocly/redoc) - provides a tool to configure and write our documentation using [OpenAPI Specification](https://swagger.io/specification).
- [serverless-prune-plugin](https://github.com/claygregory/serverless-prune-plugin) - prunes old lambda versions.
