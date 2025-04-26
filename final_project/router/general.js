const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists."});
    }
  }

   return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  return res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  Object.keys(books).forEach(key => {
    if (books[key].author == req.params.author) {
        return res.send(books[key]);
    }
  });
  return res.status(404).send("Author not found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  Object.keys(books).forEach(key => {
    if (books[key].title == req.params.title) {
        return res.send(books[key]);
    }
  });
  return res.status(404).send("Title not found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  return res.send(books[req.params.isbn].reviews);
});

// Improving the scope of Tasks 1-4 using Promises or Async-Await
const axios = require('axios').default;

const getBooks = (url) => {
    const req = axios.get(url);

    req.then(res => {
        console.log("Books available in the shop:");
        console.log(res.data);
    })
    .catch(err => {
        console.log("Error fetching books:", err.toString());
    });
}

const getBookDetails = (isbn) => {
    const url = `https://laia2000rc-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`;

    axios.get(url)
        .then(res => {
            console.log("Book details:");
            console.log(res.data);
        })
        .catch(err => {
            console.log("Error fetching book:", err.toString());
        });
}

const getBookByAuthor = (author) => {
    const url = `https://laia2000rc-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`;

    axios.get(url)
        .then(res => {
            console.log("Book by author:");
            console.log(res.data);
        })
        .catch(err => {
            console.log("Error fetching book:", err.toString());
        });
}

const getBookByTitle = (title) => {
    const url = `https://laia2000rc-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`;

    axios.get(url)
        .then(res => {
            console.log("Book by title:");
            console.log(res.data);
        })
        .catch(err => {
            console.log("Error fetching book:", err.toString());
        });
}

getBooks('https://laia2000rc-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
getBookDetails('3');
getBookByAuthor('Jane Austen');
getBookByTitle('The Divine Comedy');

module.exports.general = public_users;
