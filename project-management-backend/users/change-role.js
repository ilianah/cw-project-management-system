"use strict";
let AWS = require("aws-sdk");
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
let {
  respondWithHeaders,
  hasRole,
  permissionError
} = require("../util/helpers");

module.exports.handler = async event => {
  if (!await hasRole(event, "Admin")) return permissionError();
  try {
    event.body = JSON.parse(event.body);
    let oldRole = event.body.oldRole;

    let newRole = event.body.newRole;

    let res = await cognitoClient
      .adminRemoveUserFromGroup({
        GroupName: oldRole,
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();
    let res2 = await cognitoClient
      .adminAddUserToGroup({
        GroupName: newRole,
        UserPoolId: "us-east-1_p4KcysLln",
        Username: event.pathParameters.username
      })
      .promise();

    return respondWithHeaders(200, res);
  } catch (e) {
    return respondWithHeaders(500, e);
  }
};
