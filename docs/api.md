# REST API DOCS

This document contains a listing of all of the api routes for the
scheduling application and their purpose, usage, and results. Generally,
only http methods that change the database require authorization; any
special cases will be noted.

As a developer, it is your responsibility to update the documentation when
you change the api.

## Locations

A location where tutoring is available.

### GET /api/locations

Get a listing of all current locations stored in the database.

This will return an object like:

```js
{
    "_id": ObjectId,
    "title": String,
    "hours": { "monday": [...], ..., "friday": [...] }
}
```

## Subjects

All of the subjects that are tutored.

### GET /api/subjects

Get a listing of all available subjects.

```js
{
    "_id": ObjectId,
    "title": String,
    "prefix": String 
}
```

## Courses

All of the courses that are tutored.

### GET /api/courses

Get a listing of all available subjects.

```js
{
    "_id": ObjectId,
    "subject": ObjectId,
    "number": String,
    "title": String,
    "location": ObjectId 
}
```

## Staffs

Get a listing of all of the current staff members.

### GET /api/staffs

General data structure result from this api end point:

```js
{
    "_id": ObjectId,
    "editable": Boolean,
    "email": Email,
    "location": ObjectId, 
    "major": ObjectId,
    "max": String,
    "name": String,
    "schedule": { "monday": [...], ..., "friday": [...] },
    "availability": { "monday": [...], ..., "friday": [...], },
    "courses": [...]
}
```

### POST /api/staffs

Post a new staff member.


### DELETE /api/staffs/:id

Delete an element by id:


## Users 

Allow admin users to login and schedule tutors.

### POST /api/login

Login a user and start a session. Some others routes require an active
session such view reserve flights, purchasing flights, and canceling
flights (The expected data is _username_ and _password_).

### GET /api/logout

Logout a user and end a session.
