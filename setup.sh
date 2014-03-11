#!/bin/sh

# Quick setup script for development.

# Install Development Tools
sudo npm install -g bower grunt-cli

# Install node and bower modules
npm install 
bower install

# Import data to database
cd data
find . -type f | xargs -I{} basename {} | xargs -I{} ../import.sh {}
