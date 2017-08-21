#!/usr/bin/env bash
#/bin/sh
set -e

echo "env.namespace = $NAMESPACE"
echo "node version"
node -v

npm config set proxy http://172.20.0.254:3128
npm config set https-proxy http://172.20.0.254:3128
npm install
NODE_ENV=$NAMESPACE npm run jsdoc
