#!/usr/bin/env bash

cd /vagrant

# add ubuntu ppa for nodejs
# https://github.com/joyent/node/wiki/installing-node.js-via-package-manager
curl -sL https://deb.nodesource.com/setup | sudo bash -

# install dependencies
apt-get install -y  build-essential nodejs mongodb git

# install developer tools
npm install -g bower grunt-cli

# install the project dependencies
npm install
