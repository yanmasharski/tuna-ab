/* eslint @typescript-eslint/no-var-requires: "off" */
const { v4: uuidv4 } = require("uuid");

import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
admin.initializeApp();

export const auth = https.onRequest(async (request, response) => {
  const id = request.query.id;
  if (!id) {
    logger.error("Missing id parameter: " + request);
    response.status(400).send("Missing 'id' parameter");
    return;
  }

  const db = admin.database();
  const ref = db.ref(`users/${id}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  if (data) {
    response.status(200).send(data);
  } else {
    const docId = uuidv4();
    ref.set(docId);
    response.status(200).send(docId);
  }
});
