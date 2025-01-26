const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  if (!username) res.status(404).json({message: "Username not provided"});
  let password = req.body.password;
  if (!password) res.status(404).json({message: "Password not provided"});
  if (!isValid(username)) res.status(404).json({message: "User with such username already exists"});
  else {
    users.push({'username': username, 'password': password});
    res.status(200).json({message: "Your account has been successfully registered"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

let url = "https://kozachokolek-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";
async function getAllBooks() {
    try {
        const response = await axios.get(url)
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching books');
    }
}

async function getBooksByIsbn(isbn){
    try {
        const response = await axios.get(url+'isbn/'+isbn);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching books by isbn');
    }
}

async function getBooksByAuthor(author){
    try {
        const response = await axios.get(url+'author/'+author);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching books by author');
    }
}

async function getBooksByTitle(title){
    try {
        const response = await axios.get(url+'title/'+title);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching books by title');
    }
}

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
