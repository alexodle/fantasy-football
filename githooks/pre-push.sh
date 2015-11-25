#!/bin/sh -e

# Run client tests before every push
cd client/
npm test
