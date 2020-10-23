import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/**
 * Executes PUT request
 * @param req http request
 * @param res http response
 * @returns promise resolution
 */
async function put(req: functions.https.Request, res: functions.Response<any>) {
  const item: any = req.body
  const itemId: string = item.id
  delete item.id
  return admin
    .firestore()
    .collection('items')
    .doc(itemId)
    .update(item)
    .then(
      () => res.status(200).send(req.body),
      () => res.status(500).send()
    )
}

/**
 * Executes POST request
 * @param req http request
 * @param res http response
 * @returns promise resolution
 */
async function post(
  req: functions.https.Request,
  res: functions.Response<any>
) {
  const item: any = req.body
  return admin
    .firestore()
    .collection('items')
    .add(item)
    .then(
      (docRef) => {
        docRef.get().then((snap) => {
          item.id = snap.id
          res.status(201).send(item)
        })
      },
      () => res.status(500).send()
    )
}

/**
 * Executes GET request
 * @param req http request
 * @param res http response
 * @param id item ID
 * @returns promise resolution
 */
async function get(
  req: functions.https.Request,
  res: functions.Response<any>,
  id?: string
) {
  const dbRef = admin.firestore().collection('items')
  if (id != null) {
    dbRef
      .doc(id)
      .get()
      .then(
        (docRef) => {
          const item = docRef.data()
          if (item !== undefined) {
            item.id = id
            res.status(200).send(item)
          } else {
            res.status(404).send()
          }
        },
        () => res.status(500).send()
      )
  } else {
    dbRef.get().then(
      (dbSnap) => {
        res.status(200).send(dbSnap.docs)
      },
      () => res.status(500).send()
    )
  }
}

/**
 * Executes DELETE request
 * @param res http response
 * @param id item ID
 * @returns promise resolution
 */
async function del(res: functions.Response<any>, id: string) {
  return admin
    .firestore()
    .collection('items')
    .doc(id)
    .delete()
    .then(
      () => res.status(204).send(),
      () => res.status(500).send()
    )
}

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
  const id = req.path.replace('/', '')
  if (id !== '') {
    // Endpoint /items/{id}
    switch (req.method) {
      case 'GET':
        await get(req, res, id)
        break
      case 'DELETE':
        await del(res, id)
        break
      default:
        res.status(400).send({ error: 'Bad Request' })
        break
    }
  } else {
    switch (req.method) {
      case 'GET':
        await get(req, res)
        break
      case 'PUT':
        await put(req, res)
        break
      case 'POST':
        await post(req, res)
        break
      default:
        res.status(400).send({ error: 'Bad Request' })
        break
    }
  }
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
