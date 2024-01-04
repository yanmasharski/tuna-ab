/* eslint @typescript-eslint/no-var-requires: "off" */
const { v4: uuidv4 } = require("uuid");

import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { UserState } from "./UserState";
admin.initializeApp();

export const auth = https.onRequest(async (request, response) => {
  const id = request.body.id;
  if (!id) {
    logger.error("Missing id parameter: " + JSON.stringify(request));
    response.status(400).send("Missing 'id' parameter");
    return;
  }

  const db = admin.database();
  const refUserDict = db.ref(`users/${id}`);
  const snapshotUserDict = await refUserDict.once("value");
  const docId: string | null = snapshotUserDict.val();
  let now = Date.now();

  if (!docId) {
    const newDocId = uuidv4();
    let userState: UserState = new UserState(null, null, null, now);
    FindSegments(userState);
    FindTest(userState);

    refUserDict.set(newDocId);

    const refUserState = db.ref(`states/${newDocId}`);
    await refUserState.set(userState);

    response.status(200).send(JSON.stringify(userState));
    return;
  }

  const refUserState = db.ref(`states/${docId}`);
  const snapshotUserState = await refUserState.once("value");
  const ups: UserState = snapshotUserState.val() as UserState;
  if (ups) {
    const userState: UserState = new UserState(ups);
    if (userState.GetAuthExpired()) {
      FindSegments(userState);
      FindTest(userState);
    }

    userState.SetLastAuthTime(now);
    response.status(200).send(JSON.stringify(userState));
    refUserState.set(userState);
  } else {
    response.status(404).send("User state not found");
  }
});

function FindSegments(userState: UserState) {}

function FindTest(userState: UserState) {}
