const apimock = require('@ng-apimock/core')
const devInterface = require('@ng-apimock/dev-interface')
const express = require('express')
const app = express()
app.set('port', 9999)

app.use('/dev-interface', express.static(devInterface))
app.use(apimock.middleware)

apimock.processor.process({
  src: '',
})

app.use(apimock.middleware)

app.listen(app.get('port'), () => {
  console.log('@ng-apimock/core running on port', app.get('port'))
  console.log('@ng-apimock/dev-interface is available under /dev-interface')
})
