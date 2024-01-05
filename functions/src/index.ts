/* eslint @typescript-eslint/no-var-requires: "off" */
const { v4: uuidv4 } = require("uuid");

import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { UserState } from "./UserState";
import { UserProfile } from "./UserProfile";
import { Database } from "firebase-admin/database";
admin.initializeApp();

export const auth = https.onRequest(async (request, response) => {
  const id = request.body.id;
  if (!id) {
    logger.error("Missing id parameter: " + JSON.stringify(request));
    response.status(400).send("Missing 'id' parameter");
    return;
  }

  const db: Database = admin.database();
  const refUserDict = db.ref(`users/${id}`);
  const snapshotUserDict = await refUserDict.once("value");
  const docId: string | null = snapshotUserDict.val();
  let now = Date.now();

  if (!docId) {
    const newDocId = uuidv4();
    let userState: UserState = new UserState(null, null, null, now);
    let userProfile: UserProfile = await userState.GetUserProfile(newDocId, db);
    FindSegments(userProfile);
    FindTest(userProfile);

    refUserDict.set(newDocId);

    const refUserState = db.ref(`states/${newDocId}`);
    await refUserState.set(userState);

    response.status(200).send(userState.ToJSONString());
    return;
  }

  const refUserState = db.ref(`states/${docId}`);
  const snapshotUserState = await refUserState.once("value");
  let userState: UserState = snapshotUserState.val() as UserState;
  if (userState) {
    userState = new UserState(userState);
    if (userState.GetAuthExpired()) {
      let userProfile: UserProfile = await userState.GetUserProfile(docId, db);
      FindSegments(userProfile);
      FindTest(userProfile);
    }

    userState.SetLastAuthTime(now);
    response.status(200).send(userState.ToJSONString());
    refUserState.set(userState);
  } else {
    response.status(404).send("User state not found");
  }
});

function FindSegments(userProfile: UserProfile) {}

function FindTest(userProfile: UserProfile) {}
