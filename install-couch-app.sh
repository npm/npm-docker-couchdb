#!/bin/bash
cd /var/lib/couchdb/node_modules/npm-registry-couchapp

# wait for CouchDB to be online before we put the documents.
# note that username and password on CouchDB are both admin.
until $(curl --output /dev/null --silent --head --fail http://localhost:5984/); do
    printf '.'
    sleep 2
done

# Create database for registry.
curl -XPUT http://admin:admin@localhost:5984/registry
# Create database for store-file.
curl -XPUT http://admin:admin@localhost:5984/filenamedb

DEPLOY_VERSION=testing npm start --npm-registry-couchapp:couch=http://admin:admin@localhost:5984/registry
npm run load --npm-registry-couchapp:couch=http://admin:admin@localhost:5984/registry
NO_PROMPT=true npm run copy --npm-registry-couchapp:couch=http://admin:admin@localhost:5984/registry
