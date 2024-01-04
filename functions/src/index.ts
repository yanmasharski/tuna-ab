/* eslint @typescript-eslint/no-var-requires: "off" */
const { v4: uuidv4 } = require("uuid");

import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { UserProfile } from "./UserProfile";
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
    let userProfile: UserProfile = new UserProfile(null, null, null, now);

    refUserDict.set(newDocId);

    const refUserProfile = db.ref(`profiles/${newDocId}`);
    await refUserProfile.set(userProfile);

    response.status(200).send(JSON.stringify(userProfile));
    return;
  }

  const refUserProfile = db.ref(`profiles/${docId}`);
  const snapshotUserProfile = await refUserProfile.once("value");
  const ups: UserProfile = snapshotUserProfile.val() as UserProfile;
  if (ups) {
    const userProfile: UserProfile = new UserProfile(ups);
    userProfile.SetLastAuthTime(now);
    response.status(200).send(JSON.stringify(userProfile));
    refUserProfile.set(userProfile);
  } else {
    response.status(404).send("User profile not found");
  }
});

function FindSegments(userProfile: UserProfile) {}

function FindTest(userProfile: UserProfile) {}
