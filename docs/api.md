# API DOCS

This document contains a listing of all of the api routes for Node
Airlines and their purpose, usage, and results.

## Login

Login a user and start a session. Some others routes require an active
session such view reserve flights, purchasing flights, and canceling
flights (The expected data is _username_ and _password_).

    POST /api/login

## Logout

Logout a user and end a session.
    
    GET /api/logout

## Users

Get all of the information of the current user.

    GET /api/user

