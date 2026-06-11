const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.json({ message: "Username or password was left empty" });
    }
    if (users[username]) {
        return res.json({ message: "User already exists" })
    }
    users[username] = password;
    return res.status(201).json({
        message: "User registered successfully"
    });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    let DisplayBooks = JSON.stringify(books, null, 2);
    return res.status(202).send(DisplayBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let ISBN = req.params.isbn;
    let ReqBook = books[ISBN]
    return res.status(202).send(JSON.stringify(ReqBook))
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let Reqbook;
    for (const id in books) {
        if (books[id].author == req.params.author) {
            Reqbook = books[id];
            break;
        }
    }
    return res.status(202).send(JSON.stringify(Reqbook))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let Reqbook;
    for (const id in books) {
        if (books[id].title == req.params.title) {
            Reqbook = books[id];
            break;
        }
    }
    return res.status(202).send(JSON.stringify(Reqbook));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const review = { review: books[isbn].review }
    return res.status(202).send(JSON.stringify(review));
});

module.exports.general = public_users;
