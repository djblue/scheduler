#!/usr/bin/env bash

# Quick setup script for development.

# update arch linux
echo 'updating arch linux (noconfirm)'
pacman -Syu --noconfirm

# install dependencies
# --noconfirm won't prompt user for [Y/n]
echo 'installing nodejs mongodb git (noconfirm)'
pacman -S --noconfirm  nodejs mongodb git zsh

echo 'install developer tools'
npm install --loglevel error -g bower grunt-cli

echo 'enable and start mongodb service'
systemctl enable mongodb
systemctl start mongodb

echo 'enable scheduler service'
cp /vagrant/scheduler.service /etc/systemd/system/
systemctl enable scheduler

echo 'give a chance for daemons to start up'
sleep 5

echo 'cloning my dotfiles'
cd /home/vagrant
rm -rf /home/vagrant/dotfiles
git clone https://github.com/djblue/dotfiles.git
chown -R vagrant:vagrant /home/vagrant/dotfiles

echo 'install my dotfiles'
cd /home/vagrant/dotfiles
sudo -H -u vagrant sh -c './install.sh'

echo 'setting user shell as zsh'
chsh vagrant -s /usr/bin/zsh

echo 'install the project dependencies'
cd /vagrant
sudo -H -u vagrant sh -c 'npm install --loglevel error'

echo 'Import data to database'
cd data
find . -type f | xargs -I{} basename {} | xargs -I{} ../scripts/import.sh {}

echo 'start the application service'
systemctl start scheduler
