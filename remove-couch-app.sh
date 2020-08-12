#!/bin/bash

# wait for CouchDB to be online before we put the documents.
# note that username and password on CouchDB are both admin.
until $(curl --output /dev/null --silent --head --fail http://localhost:5984/); do
    printf '.'
    sleep 2
done

node ./purge-app.js
