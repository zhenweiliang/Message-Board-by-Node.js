const fs = require('fs')
const http = require('http')
const url = require('url')
const template = require('art-template')
const messagesFile = './data.json'
const utils = require('./utils')

const server = http.createServer()

server.on('request', (req, res) => {
  const urlObj = url.parse(req.url, true)
  const pathname = urlObj.pathname
  //view all msg
  if (pathname === '/') {
    fs.readFile('./views/index.html', (err, templateData) => {
      if (err) {return res.end('Internal server error')}
      fs.readFile(messagesFile, (err, messageData) => {
        if (err) {return res.end('Internal server error')}
        const messages = JSON.parse(messageData.toString())
        const htmlStr = template.render(templateData.toString(), { messages })
        res.end(htmlStr)
      })

    })

  }
  //jump to page postmessage
  if (pathname === '/postmessage') {
    fs.readFile('./views/postmessage.html', (err, data) => {
      if (err) {return res.end('page not found')}
      res.end(data)
    })
  }
  //process the request(get) of post an message
  if (pathname === '/newmessage') {
    const newMessage = urlObj.query
    newMessage.time = utils.currentDate()
    fs.readFile(messagesFile, (err, data) => {
      if (err) {return res.end('File not found')}
      const oldData = JSON.parse(data.toString())
      const newData = Array.prototype.slice.apply(oldData)
      newData.unshift(newMessage)
      fs.writeFile(messagesFile, JSON.stringify(newData), (err) => {
        if (err) {return res.end('File not found')}
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
      })
    })

  }
  //open folder public
  if (pathname.indexOf('/public/') === 0) {
    fs.readFile('.' + pathname, (err, data) => {
      if (err) {return res.end('page not found')}
      res.end(data)
    })

  }

})

server.listen('4000', () => {
  console.log('server is running at 4000')
})
