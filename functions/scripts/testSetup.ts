/* eslint-disable no-unused-vars */
import functionsTestSetup from 'firebase-functions-test'
import * as admin from 'firebase-admin'
const projectId = 'unit-test-project'
const {
  FIREBASE_DATABASE_EMULATOR_HOST,
  FIRESTORE_EMULATOR_HOST = 'localhost:8080'
} = process.env

;(global as any).projectId = projectId

// Initialize admin SDK with emulator settings for RTDB (needed to
// prevent error from initializeApp not being called since it is in index.js)
admin.initializeApp({
  projectId,
  databaseURL: `http://${FIREBASE_DATABASE_EMULATOR_HOST}?ns=${projectId}`,
  credential: admin.credential.applicationDefault()
})

// Initialize Firestore with emulator settings from environment
const [servicePath, portStr] = FIRESTORE_EMULATOR_HOST.split(':')
admin.firestore().settings({
  servicePath,
  port: parseInt(portStr, 10)
})
