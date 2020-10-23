import * as functions from 'firebase-functions'

/**
 * Handle request from calling /items endpoint
 *
 * @param {functions.https.Request} req - Express HTTP Request
 * @param {object} res - Express HTTP Response
 * @returns {Promise} Resolves after handling request
 */
export async function itemsRequest(
  req: functions.https.Request,
  res: functions.Response<any>
): Promise<void> {
  console.log('request received', { body: req.body })
  // Write response to request to end function execution
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end('Hello from items')
}

/**
 * Cloud Function triggered by HTTP request
 *
 * Trigger: `HTTPS - onRequest`
 *
 * @name items
 * @type {functions.CloudFunction}
 */
export default functions.https.onRequest(itemsRequest)
