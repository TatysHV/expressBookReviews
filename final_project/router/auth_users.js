const express = require('express');
const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
let books = {
  1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} },
  2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
  3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
  4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
  5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
  6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
  7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
  8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
  9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
  10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
  return res.status(200).send("User successfully logged in");
}
else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}

  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review
    return res.status(200).json({ message: "Review modified successfully", book: books[isbn] });
  } else {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review
    return res.status(200).json({ message: "Review added successfully", book: books[isbn] });
  }

  return res.status(200).json({ message: "Review added successfully", book: books[isbn] });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if there are reviews for the ISBN
  if (!books[isbn].reviews) {
    return res.status(404).json({ message: "No reviews found for the book" });
  }

  // Check if the user has a review for the ISBN
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "User does not have a review for this book" });
  }

  // Delete the user's review for the ISBN
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", book: books[isbn] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
