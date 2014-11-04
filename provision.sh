#!/usr/bin/env bash

# Quick setup script for development.

# add ubuntu ppa for nodejs
# https://github.com/joyent/node/wiki/installing-node.js-via-package-manager
curl -sL https://deb.nodesource.com/setup | sudo bash -

# install dependencies
apt-get install -y  build-essential nodejs mongodb git

# install developer tools
npm install --loglevel error -g bower grunt-cli

# become the infamous vagrant user
su vagrant
cd /vagrant

# install the project dependencies
npm install --loglevel error

# Import data to database
cd data
find . -type f | xargs -I{} basename {} | xargs -I{} ../scripts/import.sh {}
