#! /usr/bin/env bash

echo "{\"token\":\"$AUTH_TOKEN\"}" > /srv/auth.json
node /srv/dist/index.js
