import express from 'express'
import expressWs from 'express-ws'
import http from 'http'

const port = 3500

let app = express()

let server = http.createServer(app).listen(port)

expressWs(app, server)

// Classic API routes will go here
app.get('/', (req, res) => {
  console.log(req)
  const successPayload = {
    status: 'success',
    data: 'Welcome to the temp API',
  }
  res.status(200).send(JSON.stringify(successPayload))
})

app.get('/api/messages', (req, res) => {
  const fakeMessages = {
    messages: [
      {
        conversationId: '0144e876-7985-47fe-becb-acb78d24261b:acc2431b-da4d-46b3-9a49-fc3445c909cc:2',
        subject: 'Secure Message',
        from: 'Dr. Green',
        at: new Date("2022-03-21T17:13:51"),
        body: 'Lab results are in everything looks great, let me know if there any issues, otherwise I will see you at your next appointment.',
        isRead: false,
      },
      {
        conversationId: '0144e876-7985-47fe-becb-acb78d24261b:acc2431b-da4d-46b3-9a49-fc3445c909cc:1',
        subject: 'Test results?',
        from: 'John Cleese',
        at: new Date("2020-03-10T09:32:13"),
        body: 'I know these test can take a while but please let me know when you get the results',
        isRead: true,
      },
    ]
  }

  if (req.headers.test) {
    res.status(200).send(JSON.stringify(fakeMessages))
  } else {
    res.status(401).send(JSON.stringify({ status: 'fail', error: 'Unauthorized' }))
  }
})

// Websocket routes will go here
app.ws('/ws', async function (ws, req) {
  ws.on('message', async function (msg) {
    console.log(msg)
    ws.send(JSON.stringify({ status: 'success', data: 'pong' }))
    // Listens for messages here
  })
})