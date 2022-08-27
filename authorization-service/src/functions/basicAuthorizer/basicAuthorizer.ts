import { middyfy } from "../../libs/lambda";
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerHandler,
  PolicyDocument,
} from "aws-lambda";

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event,
  _,
  cb
): Promise<APIGatewayAuthorizerResult> => {
  if (event.type != "TOKEN") {
    cb("Unauthorized");
  }
  try {
    const { authorizationToken, methodArn } = event;
    const token = authorizationToken.replace("Basic ", "");
    const buffer = Buffer.from(token, "base64");
    const [username, password] = buffer.toString("utf-8").split(":");
    console.log(`username: ${username} and password: ${password}`);
    const storedPassword = process.env[username];

    const effect =
      storedPassword && storedPassword === password
        ? Effect.Allow
        : Effect.Deny;
    return generateResponse(token, effect, methodArn);
  } catch (e) {
    cb(`Unauthorized ${e.message}`);
  }
};

enum Effect {
  Allow = "Allow",
  Deny = "Deny",
}

const generatePolicyDocument = (
  effect: Effect,
  resource: string
): PolicyDocument => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };
};

const generateResponse = (
  principalId: string,
  effect: Effect,
  resource: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, resource),
  };
};

export const main = middyfy(basicAuthorizer);
