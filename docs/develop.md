# For Developers

This document is aimed at developers who aren't familiar with setting up a
nodejs project and the common other applications that go along with it.
You can skip it if you know how to set up a nodejs development
environment.

This document does expect a certain level of experience with developing
web applications. You should be familiar with how web applications work
before you continue; proceed at your own risk.

If you just need to quickly setup the developer tools and install
application dependencies, just run the setup script:

    ./setup.sh 

## Prerequisites (Platform dependent)

As a developer you will need the following installed before you can start:

- [nodejs](http://nodejs.org/) - Server side javascript.
- [mongodb](https://www.mongodb.org/)  - NoSQL database server.
- [git](http://git-scm.com/) - Distributed source control management.

### Installation

If you are developing on Ubuntu Linux, run the following command:

    sudo apt-get install nodejs mongodb git

If you are developing on Arch Linux (like on of the cool kids), run the
following command:

    sudo pacman -Syu nodejs mongodb git

If you are developing on OSX, and you have [brew](http://brew.sh/)
installed, run the following command (you can install git through Xcode):

   brew install node mongodb

If you are developing on windows, the links in the Prerequisites section
will lead to installers that you can simply run for your version of
windows..

## npm, bower, and grunt

After installing node, there are additional tools to setup before you can
begin development.

- [npm](https://www.npmjs.org/) - Node (server side) package management;
  comes packaged with node, no need to install.
- [bower](http://bower.io/) - Client package management.
- [grunt](http://gruntjs.com/) - Task runner / automation tool.

After you have node installed, run the following command (cmd or terminal)
to install grunt and bower:

    npm install -g bower grunt-cli

Now that you have the dev tools installed, you need to get all of the
dependencies 

## Now for the fun

Now that you have you development environment all setup, you can begin to
work on the project; that is if you have already cloned a copy to you
computer, if not run the following command to clone a local copy of the
ropo (unless somebody moved the repo):

    git clone https://github.com/djblue/scheduler.git

Now you have the entire history of the application, have fun; that is
after you look over application dependencies.

## Application Dependencies

So you have everything setup and you are ready to go, well you still need
to get the application dependencies. This is how (assuming npm and bower
are now installed):

    npm install && bower install 

and then to start the server (which will auto reload the browser when the
source files change):
    
    grunt server

### Notable Dependencies

Here are some notable server/client dependencies, don't worry about
installing them, that is done automatically. Include doc links for easy
access.

### Server (Installed with npm)

- [express](http://expressjs.com/) - Rest api framework.
- [passport](http://passportjs.org/) - Server authentication module.
- [underscore](http://underscorejs.org/) - The best convenience library
  written in javascript (learn to use it for everything). It works on the
  server as well as the client.
- [mongoose](http://mongoosejs.com/) - Object document mapper for easy
  database manipulation.
- [karma](http://karma-runner.github.io/0.12/index.html) - Although its a
  server dependenncy, its for testing client side code; integrate nicely
  with Angular.js
- [supertest](https://github.com/visionmedia/supertest) - Rest api testing
  framework.

### Client (Installed with bower)

- [jquery](http://jquery.com/) - Because the DOM is a piece of crap.
- [Angular.js](http://angularjs.org/) - Effortless front-end development
  library.
- [underscore](http://underscorejs.org/) - The best convenience library
  written in javascript (learn to use it for everything). It works on the
  server as well as the client.
- [multiselect](http://loudev.com/) - Because the html multiselect is a
  piece of crap.

## Directory Structure

Although the directory structure might seem odd, I will explain a top
level view of what each folder is for, which should hopefully make it
easier for you to make this application better:

    .
    ├── api                     Directory that contains rest api
    ├── bower.json              File for listing client side dependencies
    ├── docs                    Folder for project documentation
    ├── Gruntfile.js            Ugly grunt config file
    ├── node_modules            Folder where node puts its dependencies
    ├── package.json            File for listing client sider dependencies
    ├── public                  Statically served directory
    │   ├── bower_components    Folder where bower puts its dependencies
    │   ├── javascripts         Folder for Angular.js front-end application
    │   ├── partials            Folder for Angular.js template
    │   └── styles              Folder for css styles
    ├── README.md
    ├── server.js               Node.js server file
    ├── setup.sh                Quick setup script
    └── views                   Node.js server-rendered views (try to get rid of this).

## Testing

The test coverage isn't as great as it could be, add more if you can, but
the ones that do exist can be executed by running the following command:

    grunt test

It will wait and execute every time you change a file.
