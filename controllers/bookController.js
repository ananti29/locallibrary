// own modules
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
// 3rd party modules
var async = require('async');

// list all book, bookinstance, author and genre counts
exports.index = function Index (req, res) {
    async.parallel({
        bookCount: function bookCn (callback) {
            Book.countDocuments({}, callback); // empty object equals find all documents of this collection
        },
        bookInstanceCount: function bookInCn (callback) {
            BookInstance.countDocuments({}, callback);
        },
        bookInstanceAvailableCount: function bookInAvCn (callback) {
            BookInstance.countDocuments({ tila: 'Saatavilla' }, callback);
        },
        authorCount: function authorCn (callback) {
            Author.countDocuments({}, callback);
        },
        genreCount: function genreCn (callback) {
            Genre.countDocuments({}, callback);
        }
    }, function renderIndex (err, results) {
        res.render('index', { title: 'Pienen kirjaston koti', error: err, data: results });
    });
};

// Display list of all books.
exports.bookList = function bookLis (req, res, next) {
    Book.find({}, 'otsikko kirjailija')
        .populate('kirjailija')
        .exec(function execBook (err, listBooks) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('book_list', { title: 'Kirja lista', bookList: listBooks });
        });
};

// Display detail page for a specific book.
exports.bookDetail = function bookDet (req, res, next) {
    async.parallel({
        book: function bookgenid (callback) {
            Book.findById(req.params.id)
                .populate('kirjailija')
                .populate('lajityyppi')
                .exec(callback);
        },
        bookInstance: function bookinsid (callback) {
            BookInstance.find({ 'kirja': req.params.id })
                .exec(callback);
        }
    }, function errbook (err, results) {
        if (err) { return next(err); }
        if (results.book === null) { // No results.
            err = new Error('Kirjaa ei löytynyt');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('book_detail', { title: 'Kirjan otsikko', book: results.book, bookinstance: results.bookInstance });
    });
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
