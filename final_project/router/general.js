const axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const baseURL = "https://adityakothar-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";
public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password) {
    return res.json({message: "Username or password was left empty"});
  }
  if(users[username]) {
    return res.json({message: "User already exists"})
  }
  users[username] = password;
  return res.status(201).json({
    message: "User registered successfully"
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${baseURL}/books`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`${baseURL}/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`${baseURL}/books`);

        const books = response.data;
        let result = {};

        for (let id in books) {
            if (books[id].author === author) {
                result[id] = books[id];
            }
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`${baseURL}/books`);

        const books = response.data;
        let result = {};

        for (let id in books) {
            if (books[id].title === title) {
                result[id] = books[id];
            }
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = {review: books[isbn].review}
  return res.status(202).send(JSON.stringify(review));
});

module.exports.general = public_users;
