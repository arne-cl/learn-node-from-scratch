Learn Node
==========

These are my notes for Wes Bos' [Learn Node](https://learnnode.com/) online class.


01 - Getting Setup
==================

Install NodeJS
--------------

- install NodeJS 7.6 or above with npm 4 or above

```
# check node version
$ node -v
v10.15.3

$ npm -v
6.10.3
```

- download course materials from https://courses.wesbos.com
- download starter files from https://github.com/wesbos/Learn-Node


Install packages in the starter files directory
-----------------------------------------------

```
$ sudo npm install -g npm
$ npm install
...
added 1179 packages from 817 contributors and audited 10758 packages in 166.636s
found 27 vulnerabilities (10 low, 10 moderate, 7 high)
  run `npm audit fix` to fix them, or `npm audit` for details

$ npm audit fix
+ express-session@1.17.0
+ pug@2.0.4
+ axios@0.19.0
+ body-parser@1.19.0
+ express@4.17.1
+ moment@2.24.0
+ mongoose@5.7.4
added 13 packages from 14 contributors, removed 17 packages and updated 38 packages in 44.992s
fixed 22 of 27 vulnerabilities in 10758 scanned packages
  2 vulnerabilities required manual review and could not be updated
  2 package updates for 3 vulnerabilities involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)

$ npm audit fix --force
+ css-loader@3.2.0
+ juice@5.2.0
added 83 packages from 69 contributors, removed 75 packages and updated 16 packages in 39.571s
fixed 3 of 5 vulnerabilities in 10800 scanned packages
  2 vulnerabilities required manual review and could not be updated
  2 package updates for 3 vulnerabilities involved breaking changes
  (installed due to `--force` option)

# With NodeJS, you're always doomed!
$ npm audit
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ timespan                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ No patch available                                           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ forever                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ forever > timespan                                           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/533                             │
└───────────────┴──────────────────────────────────────────────────────────────┘
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ braces                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.3.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ forever                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ forever > forever-monitor > chokidar > anymatch > micromatch │
│               │ > braces                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/786                             │
└───────────────┴──────────────────────────────────────────────────────────────┘
found 2 low severity vulnerabilities in 10315 scanned packages
  2 vulnerabilities require manual review. See the full report for details.
```


Configure IDE
-------------

- we need support for ``.pug`` (HTML template) files
    - [vscodium](https://github.com/VSCodium/vscodium) (free/libre version of Micro$oft VSCode) provides this


02 - Setting up Mongo DB
========================

- we'll use MongoDB 3.2+ as our document store / database
- set up MongoDB locally

Install on Ubuntu / Linux Mint
------------------------------

- [how to install on ubuntu with mongodb-maintained packages](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition-using-deb-packages)
- [how to set a password in MongoDB](https://www.scaleway.com/en/docs/install-and-secure-mongodb-on-ubuntu/)

Install on arch linux
---------------------

https://wiki.archlinux.org/index.php/MongoDB

```
sudo mkdir -p /data/db
sudo mongod --fork --logpath /tmp/mongo.log
```

Configure MongoDB
-----------------

- default local URL: ``mongodb://127.0.0.1:27017``

- copy ``variables.env.samples`` to ``variables.env``
- in ``variables.env``, replace ``DATABASE`` value with ``mongodb://$USERNAME:$PASSWORD@127.0.0.1:27017/admin``
- add ``variables.env`` to your ``.gitignore`` file

- test, if mongodb is working

```
$ mongo -u $USERNAME -p --authenticationDatabase admin
> exit
bye
```

- installl [MongoDB Compass](https://www.mongodb.com/download-center/compass) GUI and connect to the database


03 - Starter Files and Environmental Variables
==============================================

- we'll use [ExpressJS](http://expressjs.com/) as our web framework

app.js
------

- imports all the JS/node libraries that we'll use
- loads environment variables from ``variables.env``

start.js
--------

- entrypoint for the app
- connects to our MongoDB database, writes errors to console
- listens for ``GET`` requests on the configured port (default: ``7777``)

Start our example app
---------------------

- ``npm start``
    - looks up ``scripts`` section in ``package.json
    - calls ``node ./start.js`` and lots of other stuff (a file-change watcher, webpack etc)


04 - Core Concept - Routing
===========================

How are URLs routed in ExpressJS?

routes/index.js
--------

- contains a route for ``/``

```
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

module.exports = router;
```

- the routes are then imported into ``app.js`` and used there

```
const routes = require('./routes/index');
[...]
const app = express();
[...]
# all routes starting with '/' will be handled by these routes
app.use('/', routes);

# we could have multiple route handlers:
# app.use('/admin', adminRoutes);
```

- URL query params are available in `req.query`


05 - Core Concept - Templating
==============================

- `res.render` renders templates in a response
- we'll use the pug templating language (original name: jade)
    - templates are stored in `./views` folder

- pug uses significant whitespace for nesting tags
- comments must be on their own line

hello.pug
---------
```
h1 Hello, world!

// comment shown in HTML
//- comment not shown in HTML

//- <div class="wrapper">
div.wrapper 
  p This is a simple paragraph.

  //- <p id="second"></p>
  p#second Yet another paragraph.
  
  //- <img class="animal" src="dog.jpg" alt="Dog"/>
  img.animal(src="dog.jpg" alt="Dog")
```

Put variables / request params into template
--------------------------------------------

```
// take a param from the render function and put it into a string
h2 #{name} is #{age} years old.

// when putting params into tags, we need to use ES6 string literals.
img.animal(src="dog.jpg" alt=`This is ${name}'s dog.`)
```

Use base templates
------------------

If you have a `layout.pug` template with a section ``block content``,
you can fill/override it in another template like this:

```
extends layout

block content
  h1 This is the headline!
```


06 - Core Concept - Template Helpers
====================================

`helpers.js` contains functions and constants that can be used as variables
in pug templates.

- is imported in `app.js` and stored in the variable `h`
- helpers are made available in templates by putting them into a middleware

```
const helpers = require('./helpers');
[...]
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});
```

For example, `siteName` from `helpers.js`

```
exports.siteName = `Now That's Delicious!`;
```

is now available in templates by using:

```
html
  head
    title= `${h.siteName}`
```

moment.js
---------

- relative date/timestamp library, can be used in templates like this:

```
p The sale ends in #{h.moment().endOf('day').fromNow()}
```


07 - Core Concept - Controllers and the MVC Pattern
===================================================

To follow the MVC pattern, we will outsource the functions that are called
in the routes into `./controllers`, i.e. we turn this:

```
router.get('/', (req, res) => {
  res.render('hello', {
    name: req.query.name,
    age: req.query.age
  });
});
```

into this:

```
const storeController = require('../controllers/storeController')
router.get('/', storeController.homePage);
```

and putting the function into `./controllers/storeController.js`:

```
exports.homePage = (req, res) => {
  res.render('hello', {
    name: req.query.name,
    age: req.query.age,
  });
}
```


08 - Core Concept - Middleware and Error Handling
=================================================

- **middleware**: function that get called for each incoming request
  before the response is sent back
    - the output of one middleware is handed over to the input of the next
      middleware by calling `next()`

Route-specific middleware
-------------------------

- is only called for specific routes

```
// example middleware that adds a name to each incoming request
exports.myMiddleware = (req, res, next) => {
  req.name = 'John';
  next();
};
```

This can now be called in a route before the actual response:

```
router.get('/', storeController.myMiddleware, storeController.homePage);
```

Since ``myMiddleware`` hands over its output using `next()` and is called
before ``homePage``, the latter function can access the `req.name` value:

```
exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};
```

Global middleware
-----------------

- is called for every request that comes into the application
  before it get to the router

app.js
------

- contains all global middleware for this app, i.e. all calls to `app.use(...)`
  are invoking some kind of middleware for each incoming request

cookie-parser
-------------

We can set a cookie in any middleware like this:

```
exports.myMiddleware = (req, res, next) => {
  req.name = 'John';
  res.cookie('name', 'evil-cookie', {maxAge: 1000000});
  next();
};
```

It will be added to `res.cookies` (which can be viewed in Chrome DevTools
>> Application >> Storage >> Cookies) by `cookie-parser`, which is added as
a global middleware in `app.js`:

```
const cookieParser = require('cookie-parser');
[...]
app.use(cookieParser());
```


09 - Creating our Store Model
=============================

- unlike Elasticsearch, MongoDB uses schema by default

models/Store.js
---------------

```
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!' // true would work, but emits an unhelpful error msg
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String]
});
```

We add middleware to create slugs for userfriendly URLs automatically.
Our model(s) are then imported once in `start.js` as a singleton.

```
require('./models/Store');
```


10 - Saving Stores and using Mixins
===================================



11 - Using Async Await.mp4
12 - Flash Messages.mp4
13 - Querying our Database for Stores.mp4
14 - Creating an Editing Flow for Stores.mp4
15 - Saving Lat and Lng for each store.mp4
16 - Geocoding Data with Google Maps.mp4
17 - Quick Data Visualization Tip.mp4
18 - Uploading and Resizing Images with Middleware.mp4
19 - Routing and Templating Single Stores.mp4
20 - Using Pre-Save hooks to make Unique Slugs.mp4
21 - Custom MongoDB Aggregations.mp4
22 - Multiple Query Promises with Async Await.mp4




Rewriting the whole thing from scratch
======================================

- run ``npm init`` to create a ``package.json``
- create a route and a minimal start.js

- we don't need the ``body-parser`` parser library mentioned in video 04

Get rid of MongoDB warnings
---------------------------

```
DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.

DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the
 MongoClient constructor.
```

- can be avoided by setting

```
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```
