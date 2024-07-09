const apimock = require('@ng-apimock/core')
const devInterface = require('@ng-apimock/dev-interface')
const express = require('express')
const cors = require('cors')

apimock.processor.process({
  src: '',
})

const app = express()
app.use(cors())
app.set('port', 9999)
app.use('/dev-interface', express.static(devInterface))
app.use(apimock.middleware)
app.listen(app.get('port'), () => {
  console.log('@ng-apimock/core running on port', app.get('port'))
  console.log('@ng-apimock/dev-interface is available under /dev-interface')
})
