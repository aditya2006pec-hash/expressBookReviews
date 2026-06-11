const axios = require("axios");
const express = require("express");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const baseURL =
  "https://adityakothar-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username or password was left empty",
    });
  }

  if (users[username]) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  users[username] = password;

  return res.status(201).json({
    message: "User registered successfully",
  });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error: error.message,
    });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(`${baseURL}/books/${isbn}`);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book by ISBN",
      error: error.message,
    });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;

    const response = await axios.get(`${baseURL}/books`);

    const result = Object.fromEntries(
      Object.entries(response.data).filter(
        ([isbn, book]) => book.author === author
      )
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author",
      error: error.message,
    });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;

    const response = await axios.get(`${baseURL}/books`);

    const result = Object.fromEntries(
      Object.entries(response.data).filter(
        ([isbn, book]) => book.title === title
      )
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by title",
      error: error.message,
    });
  }
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  return res.status(200).json({
    reviews: books[isbn].reviews || books[isbn].review,
  });
});

module.exports.general = public_users;
