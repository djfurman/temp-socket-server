/*
 * This simple express server mocks the real service and is _only_ for testing the UI
 * The production instance will be hosted via AWS API Gateway, authenticated by Cognito
 * The application logic would exist as lambda functions with distinct IAM policies
 * The persistence layer would live in several DynamoDB tables with appropriate KMS keys
 * Since API Gateway exposes both websocket and HTTP interfaces, it's fitting to mock them here
 */
import express from 'express'
import expressWs from 'express-ws'
import http from 'http'

const port = 3500

let app = express()

let server = http.createServer(app).listen(port)

expressWs(app, server)

// Classic API routes will go here
app.get('/', (req, res) => {
  const successPayload = {
    status: 'success',
    data: {
      '/demo': 'demonstration endpoint'
    },
  }
  res.status(200).json(successPayload)
})

app.get('/demo', (req, res) => {
  const successPayload = {
    status: 'success',
    data: {
      '/patients': 'Patient information and interaction API',
      '/users': 'User management and control API'
    }
  }
  res.status(200).json(successPayload)
})

const fakeMessages = {
  messages: [
    {
      conversationId: '39817aa2-505f-4e78-bd67-279f7efc7125:d3c0c15f9cb5:aed672:2',
      subject: 'Secure Message',
      from: 'Dr. Green',
      at: new Date("2022-03-21T17:13:51"),
      body: 'Lab results are in everything looks great, let me know if there any issues, otherwise I will see you at your next appointment.',
      isRead: false,
    },
    {
      conversationId: '39817aa2-505f-4e78-bd67-279f7efc7125:d3c0c15f9cb5:aed672:1',
      subject: 'Test results?',
      from: 'John Cleese',
      at: new Date("2022-03-16T09:32:13"),
      body: 'I know these test can take a while but please let me know when you get the results',
      isRead: true,
    },
  ]
}

app.get('/demo/patients/:patientId/messages', (req, res) => {
  // Here we'd validate the user tried to authenticate
  if (!req.get('authorization')) {  // let's assume for the moment that any auth token is fine
    res.status(401).json({ status: 'fail', data: null, message: 'authorization header is required to access a protected endpoint, provide a valid token and reattempt your request' })
  }

  //Here we'd check the auth policy to see if the authenticated user can see _this_ patient's messages
  const isAuthorized = true  // Let's assume for the moment they are authorized
  if (!isAuthorized) {
    res.status(403).json({ status: fail, data: null, message: 'user is not authorized to see messages for this patientId' })
  }
  // Here we'd fetch the patientId's messages from the database, we'll use fake messages here
  res.status(200).json({ status: 'success', data: fakeMessages })
})

const fakeAuthorizations = {
  provider: null,
  patients: [
    {
      patientId: '39817aa2-505f-4e78-bd67-279f7efc7125',
      providers: [
        {
          providerId: 'd3c0c15f9cb5:aed672'
        }
      ]
    }
  ]
}

app.get('/demo/users/:userId/authorizations', (req, res) => {
  // Here we'd validate the user tried to authenticate
  if (!req.get('authorization')) {  // let's assume for the moment that any auth token is fine
    res.status(401).json({ status: 'fail', data: null, message: 'authorization header is required to access a protected endpoint, provide a valid token and reattempt your request' })
  }

  //Here we'd check to see what patient(s) _this_ authenticated user can access
  const isAuthorized = true  // Let's assume for the moment they are authorized
  if (!isAuthorized) {
    res.status(403).json({ status: fail, data: null, message: 'user is not authorized to see messages for this patientId' })
  }

  // This argument would give us the system user's ID to lookup what patients they can access
  // This endpoint supports both patient(s) and providers 
  // The access policies only differ in the namespace of the response
  console.log(req.params.userId)

  // Here we'd fetch the users's patient(s) from the database, we'll use fake authorizations here
  res.status(200).json({ status: 'success', data: fakeAuthorizations })
})

// Websocket routes will go here
app.ws('/ws', async function (ws, req) {
  ws.on('message', async function (msg) {
    console.log(msg)
    ws.send(JSON.stringify({ status: 'success', data: 'pong' }))
    // Listens for messages here
  })
})