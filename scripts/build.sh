#!/bin/sh
npm run local-node &
sleep 30
npm run deploy-local
kill $!