# Student CRUD - Sample Full-Stack App

A reference app that connects a web page (front end) to an Express plus MongoDB
back end using fetch. It is built from our two class demos combined:

- our Express demo gives the server, the routes, and the HTTP methods
- our Mongoose demo gives the connect, the schema, and the model

The only new concept is fetch, which is how the front end talks to the back end.
Everything else (routes, express.json, Mongoose CRUD, DOM) we already covered.

## Folder structure

```
student-crud
  - server.js            the back end (Express + Mongoose)
  - package.json         the dependencies
  - public
      - index.html       the page structure (HTML)
      - style.css        the styling (CSS)
      - script.js        the logic (JavaScript with fetch)
```

The front end lives inside the public folder, split into three files the
proper way - structure, style, and script. index.html links to style.css
and script.js. The line `app.use(express.static("public"))` in server.js
is what serves all of them.

## How to run

1 - Make sure MongoDB is running on your computer (the same local MongoDB we used,
    mongodb://127.0.0.1:27017). MongoDB Compass can be open to watch the data.

2 - Open a terminal inside the student-crud folder and install the packages

```
npm install
```

3 - Start the server

```
npm start
```

You should see

```
Connected to MongoDB
port 3000 is running...
```

4 - Open a browser and go to

```
http://localhost:3000
```

Add, edit, and delete students on the page. Refresh and the data is still there,
because it is saved in MongoDB, not in the page.

## The five API routes (returning JSON)

| Method | URL             | What it does            |
| ------ | --------------- | ----------------------- |
| GET    | /students       | get all students        |
| GET    | /students/:id   | get one student by id   |
| POST   | /students       | add a new student       |
| PUT    | /students/:id   | update a student by id  |
| DELETE | /students/:id   | delete a student by id  |

## How the front end connects (the new part)

In public/index.html, the fetch function sends requests to those routes.

- loadStudents - fetch GET /students, then show the result with DOM
- saveStudent  - fetch POST (add) or PUT (update), sending the form as JSON
- deleteStudent- fetch DELETE /students/:id

`JSON.stringify` turns the form object into JSON text to send, and
`res.json()` turns the JSON reply back into data the page can use.

## Note for the group project

For the group project, the structure is the same. Change the entity (products,
books, movies, and so on) and its fields in both the schema and the form. For
deployment, move the database to MongoDB Atlas and replace the connection string.
