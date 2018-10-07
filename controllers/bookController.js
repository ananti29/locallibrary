var Book = require('../models/book');

exports.index = function (req, res) {
    res.send('TODO: Site Home Page');
};

// Display list of all books.
exports.bookList = function bookLis (req, res) {
    res.send('TODO: Book list');
};

// Display detail page for a specific book.
exports.bookDetail = function bookDet (req, res) {
    res.send('TODO: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.bookCreateGet = function bookCreGet (req, res) {
    res.send('TODO: Book create GET');
};

// Handle book create on POST.
exports.bookCreatePost = function bookCrePos (req, res) {
    res.send('TODO: Book create POST');
};

// Display book delete form on GET.
exports.bookDeleteGet = function bookDelGet (req, res) {
    res.send('TODO: Book delete GET');
};

// Handle book delete on POST.
exports.bookDeletePost = function bookDelPos (req, res) {
    res.send('TODO: Book delete POST');
};

// Display book update form on GET.
exports.bookUpdateGet = function bookUpdGet (req, res) {
    res.send('TODO: Book update GET');
};

// Handle book update on POST.
exports.bookUpdatePost = function bookUpdPos (req, res) {
    res.send('TODO: Book update POST');
};
