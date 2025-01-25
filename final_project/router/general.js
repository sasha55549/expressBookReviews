const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  if (!username) res.status(404).json({message: "Username not provided"});
  let password = req.body.password;
  if (!password) res.status(404).json({message: "Password not provided"});
  if (!isValid(username)) res.status(404).json({message: "User with such username already exists"});
  else {

  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   let author = req.params.author;
   let keys = Object.keys(books);
   let newBooks = [];
   for (let i=0;i<keys.length;i++){
    if (books[keys[i]]['author']==author) newBooks.push(books[keys[i]]);
   }
   res.send(JSON.stringify(newBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let keys = Object.keys(books);
    let newBooks = [];
    for (let i=0;i<keys.length;i++){
     if (books[keys[i]]['title']==title) newBooks.push(books[keys[i]]);
    }
    res.send(JSON.stringify(newBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]['reviews']));
});

module.exports.general = public_users;
