const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books)
  res.json(bookList)
  // res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const bookIsbn= parseInt(req.params.isbn);
  const bookDetails = books[bookIsbn];

  if (bookDetails) {
    res.json(bookDetails);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  if (!author) {
    return res.status(400).json({ message: 'Author parameter is required' });
  }

  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  res.json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  if (!title) {
    return res.status(400).json({ message: 'title parameter is required' });
  }

  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookIsbn= parseInt(req.params.isbn);
  const bookDetails = books[bookIsbn];

  if (bookDetails) {
    res.json(bookDetails.reviews);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
