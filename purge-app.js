const http = require('http')


function deleteDesignDocument (name) {
  console.log('fetching design document:', name)
  const getReq = http.request({
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
        console.log('deleting design document:', name, 'at revision', parsed._rev)
        const deleteReq = http.request({
          method: 'DELETE',
          host: 'localhost',
          port: 5984,
          auth: 'admin:admin',
          path: `/registry/_design/${name}?rev=${parsed._rev}`
        }, (deleteRes) => {
          deleteRes.resume()
          if (deleteRes.statusCode === 200) {
            console.log('deleted design doc:', name)
          } else {
            console.log('failed! received unexpected status code:', res.statusCode)
          }
        })

        deleteReq.on('error', (err) => {
          console.log('failed! received error response')
          console.log(err.stack)
        })
        deleteReq.end()
      })
    } else {
      res.resume()
      console.log('failed! received unexpected status code:', res.statusCode)
      process.exitCode = 1
    }
  })

  getReq.on('error', (err) => {
    console.log('failed! received error response')
    console.log(err.stack)
  })
  getReq.end()
}

deleteDesignDocument('app')
deleteDesignDocument('scratch')
