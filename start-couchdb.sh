#!/bin/bash

./install-couch-app.sh &
couchdb &
wait $!
kill 0
exit 1
