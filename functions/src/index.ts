/* eslint @typescript-eslint/no-var-requires: "off" */
const { v4: uuidv4 } = require("uuid");

const { defineString } = require("firebase-functions/params");
defineString("SECRET");
defineString("SEGMENTS");

import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { Database } from "firebase-admin/database";
import * as admin from "firebase-admin";
import { UserState } from "./UserState";
import { UserProfile } from "./UserProfile";
import { Segment } from "./Segment";

let segments: Segment[];

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

  async function LoadSegments() {
    if (segments) {
      logger.info("Cached segments: " + segments.length);
      logger.info("ENV segments: " + process.env.SEGMENTS);
      return;
    }

    if (process.env.SEGMENTS) {
      logger.info("Fast load segments: " + process.env.SEGMENTS);
      const segmentsConfig: Segment[] = JSON.parse(
        process.env.SEGMENTS
      ) as Segment[];
      segments = [];
      segmentsConfig.forEach((s) => {
        segments.push(new Segment(s));
      });
      return;
    }

    logger.info("Read segments");
    segments = [];

    const db: Database = admin.database();
    const refSegmentsConfig = db.ref("segments");
    const snapshotSegmentsConfig = await refSegmentsConfig.once("value");
    const segmentsConfigString: string = snapshotSegmentsConfig.val() as string;
    if (!segmentsConfigString) {
      console.error(
        "Error reading segments configuration from Realtime Database"
      );
      return;
    }
    process.env.SEGMENTS = segmentsConfigString;
    const segmentsConfig: Segment[] = JSON.parse(
      segmentsConfigString
    ) as Segment[];
    segments = [];
    segmentsConfig.forEach((s) => {
      segments.push(new Segment(s));
    });
  }
});

export const setSegments = https.onRequest(async (request, response) => {
  const secretKey = request.body.secret;
  const json = request.body.json;

  if (!secretKey || !json) {
    response.status(400).send("Invalid request");
    return;
  }

  if (secretKey !== process.env.SECRET) {
    response.status(403).send("Unauthorized");
    return;
  }

  let segmentsConfig: Segment[] = [];
  try {
    segmentsConfig = JSON.parse(json) as Segment[];
    segments = [];
    segmentsConfig.forEach((s) => {
      segments.push(new Segment(s));
    });
  } catch (error) {
    logger.error((error as Error).message);
    logger.info(json);
    response.status(400).send("Invalid JSON format");
    return;
  }

  const db: Database = admin.database();
  const refSegmentsConfig = db.ref("segments");
  await refSegmentsConfig.set(json).catch((error) => {
    console.error(
      "Error writing segments configuration to Realtime Database",
      error
    );
  });
  process.env.SEGMENTS = json;

  response.status(200).send("Done");
});
