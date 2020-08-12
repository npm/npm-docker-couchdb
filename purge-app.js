const http = require('http')


function deleteDesignDocument (name) {
  http.request({
    host: 'localhost',
    port: 5984,
    auth: 'admin:admin',
    path: `/registry/_design/${name}`
  }, (res) => {
    if (res.statusCode === 200) {
      let str = ''
      res.on('data', (chunk) => {
        str += chunk
      })

      res.on('end', () => {
        const parsed = JSON.parse(str)
        http.request({
          method: 'DELETE',
          host: 'localhost',
          port: 5984,
          auth: 'admin:admin',
          path: `/registry/_design/${name}?rev=${parsed._rev}`
        }, (deleteRes) => {
          if (deleteRes.statusCode === 200) {
            console.log('deleted design doc:', name)
            deleteRes.resume()
          }
        })
      })
    }
  })
}

deleteDesignDocument('app')
deleteDesignDocument('scratch')
