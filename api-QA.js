'use strict';
const expect = require('chai').expect;
const mongoose = require('mongoose');
const mongodb = require('mongodb');

module.exports = function (app) {
  
  mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    comments: [String]
  });

  const Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(async (req, res) => {
      let arrayOfBooks = [];
      let results = await Book.find({});
      try {
        if (results) {
          results.forEach((result) => {
            let book = result.toJSON();
            book['commentcount'] = book.comments.length;
            arrayOfBooks.push(book);
          });
          return res.json(arrayOfBooks);
        }
      } catch (error) {
        console.log(error);
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      const newBook = new Book({
        title: title,
        comments: []
      });
      const savedBook = await newBook.save();
      return res.json(savedBook);
    })
    
    .delete(async (req, res) => {
      let results = await Book.deleteMany({});
      if (results.deletedCount > 0) {
        res.send('complete delete successful');
      } else {
        res.send('no book exists');
      }
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      let result = await Book.findById(bookid);
      if (!result) {
        return res.send('no book exists');
      } else {
        return res.json(result);
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      if (!comment) {
        return res.send('missing required field comment');
      }
      let updatedBook = await Book.findByIdAndUpdate(
        bookid,
        {$push: {comments: comment}},
        {new: true}
      ); 
      if (!updatedBook) {
        return res.send('no book exists');
      } else {
        return res.json(updatedBook);
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      let deletedBook = await Book.findByIdAndDelete(bookid);
      if (!deletedBook) {
        return res.send('no book exists');
      } else {
        return res.send('delete successful');
      }
    });
};
