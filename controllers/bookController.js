// own modules
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
// 3rd party modules
var async = require('async');

// here are required validators
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
exports.bookCreateGet = function bookCreGet (req, res, next) {
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function autfindget (callback) {
            Author.find(callback);
        },
        genres: function genfindget (callback) {
            Genre.find(callback);
        }
    }, function errget (err, results) {
        if (err) { return next(err); }
        res.render('book_form', { title: 'Luo kirja', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
exports.bookCreatePost = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') { req.body.genre = []; } else { req.body.genre = new Array(req.body.genre); }
        }
        next();
    },

    // Validate fields.
    body('title', 'Otsikko ei saa olla tyhjä.').isLength({ min: 1 }).trim(),
    body('author', 'Kirjailija ei saa olla tyhjä.').isLength({ min: 1 }).trim(),
    body('summary', 'Tiivistelmä ei saa olla tyhjä.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN ei saa olla tyhjä').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
            { otsikko: req.body.title,
                kirjailija: req.body.author,
                tiivistelma: req.body.summary,
                isbn: req.body.isbn,
                lajityyppi: req.body.genre
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            // Get all authors and genres for form.
            async.parallel({
                authors: function getallauthors (callback) {
                    Author.find(callback);
                },
                genres: function getallgenres (callback) {
                    Genre.find(callback);
                }
            }, function errauthorgenreget (err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', { title: 'Luo kirja', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
        } else {
            // Data from form is valid. Save book.
            book.save(function errbookpost (err) {
                if (err) { return next(err); }
                // successful - redirect to new book record.
                res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.bookDeleteGet = function bookDelGet (req, res) {
    res.send('TODO: Book delete GET');
};

// Handle book delete on POST.
exports.bookDeletePost = function bookDelPos (req, res) {
    res.send('TODO: Book delete POST');
};

// Display book update form on GET.
exports.bookUpdateGet = function bookUpdGet (req, res, next) {
    // Get book, authors and genres for form.
    async.parallel({
        book: function getupdbook (callback) {
            Book.findById(req.params.id).populate('kirjailija').populate('lajityyppi').exec(callback);
        },
        authors: function getupdauthors (callback) {
            Author.find(callback);
        },
        genres: function getupdgenres (callback) {
            Genre.find(callback);
        }
    }, function errgetupdbook (err, results) {
        if (err) { return next(err); }
        if (results.book == null) { // No results.
            err = new Error('kirjaa ei löytynyt');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected genres as checked.
        for (var allGiter = 0; allGiter < results.genres.length; allGiter++) {
            for (var bookGiter = 0; bookGiter < results.book.lajityyppi.length; bookGiter++) {
                if (results.genres[allGiter]._id.toString() === results.book.lajityyppi[bookGiter]._id.toString()) {
                    results.genres[allGiter].checked = 'true';
                }
            }
        }
        res.render('book_form', { title: 'Päivitä kirja', authors: results.authors, genres: results.genres, book: results.book });
    });
};

// Handle book update on POST.
exports.bookUpdatePost = [
    // Convert the genre to an array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') { req.body.genre = []; } else { req.body.genre = new Array(req.body.genre); }
        }
        next();
    },

    // Validate fields.
    body('title', 'Otsikko ei saa olla tyhjä.').isLength({ min: 1 }).trim(),
    body('author', 'Kirjailija ei saa olla tyhjä.').isLength({ min: 1 }).trim(),
    body('summary', 'Tiivistelmä ei saa olla tyhjä.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN ei saa olla tyhjä').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('author').trim().escape(),
    sanitizeBody('summary').trim().escape(),
    sanitizeBody('isbn').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book(
            { otsikko: req.body.title,
                kirjailija: req.body.author,
                tiivistelma: req.body.summary,
                isbn: req.body.isbn,
                lajityyppi: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
                _id: req.params.id // This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function getupdpostauthors (callback) {
                    Author.find(callback);
                },
                genres: function getupdpostgenres (callback) {
                    Genre.find(callback);
                }
            }, function errgetpostbooks (err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', { title: 'Päivitä kirja', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
        } else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function dbupdbooks (err, thebook) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect(thebook.url);
            });
        }
    }
];
