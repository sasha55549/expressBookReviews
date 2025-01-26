const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filteredUsers = users.filter((user)=>user['username']==username);
    if (filteredUsers.length>0) return false;
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let filteredUsers = users.filter((user)=>(user['username']==username && user['password']==password));
    if (filteredUsers.length==0) return false;
    return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
        req.session.authorization = {accessToken,username};
        res.status(200).json({message: "User successfully logged in"});
    }
    else {
        res.status(404).json({message: "Invalid username and/or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.authorization['username'];
  if (!username) return res.status(404).json({message: "User is not logged in"});
  books[isbn]['reviews'][username]=review;
  res.status(200).json({message: "Your review has been added/modified"});
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization['username'];
  if (!username) return res.status(404).json({message: "User is not logged in"});
  if (username in books[isbn]['reviews']) delete books[isbn]['reviews'][username];
  res.status(200).json({message: "Your reviews has been deleted"});
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
