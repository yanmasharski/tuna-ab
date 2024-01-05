/* eslint @typescript-eslint/no-var-requires: "off" */
const { v4: uuidv4 } = require("uuid");

import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { UserState } from "./UserState";
import { UserProfile } from "./UserProfile";
import { Database } from "firebase-admin/database";
import { Segment } from "./Segment";

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
    let userState: UserState = new UserState(
      db,
      newDocId,
      null,
      null,
      null,
      now
    );
    await FindSegments(userState);
    await FindTest(userState);

    refUserDict.set(newDocId);

    const refUserState = db.ref(`states/${newDocId}`);
    await refUserState.set(userState.ToSerializable());

    response.status(200).send(userState.ToJSONString());
    return;
  }

  const refUserState = db.ref(`states/${docId}`);
  const snapshotUserState = await refUserState.once("value");
  let userState: UserState = snapshotUserState.val() as UserState;
  if (userState) {
    userState = new UserState(db, docId, userState);
    // if (userState.GetAuthExpired()) {
    await FindSegments(userState);
    await FindTest(userState);
    // }

    userState.SetLastAuthTime(now);
    response.status(200).send(userState.ToJSONString());
    refUserState.set(userState.ToSerializable());
  } else {
    response.status(404).send("User state not found");
  }
});

let segments: Segment[];

async function LoadSegments() {
  if (segments) {
    return;
  }

  logger.info("Load segments");
  segments = [];

  const db: Database = admin.database();
  const refSegmentsConfig = db.ref("segments");
  const snapshotSegmentsConfig = await refSegmentsConfig.once("value");
  const segmentsConfig = snapshotSegmentsConfig.val() as Segment[];
  if (!segmentsConfig) {
    console.error(
      "Error reading segments configuration from Realtime Database"
    );
    return;
  }
  segmentsConfig.forEach((s) => {
    segments.push(new Segment(s));
  });
}

async function FindSegments(userState: UserState) {
  await LoadSegments();
  const userProfile: UserProfile = await userState.GetUserProfile();
  let newSegments: string[] = [];
  segments.forEach((segment) => {
    if (segment.Fits(userProfile)) {
      newSegments.push(segment.id);
    }
  });

  userState.SetActiveSegments(newSegments);
}

async function FindTest(userState: UserState) {
  const userProfile: UserProfile = await userState.GetUserProfile();
  logger.info("FindTest " + userProfile);
}
