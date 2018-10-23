var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
// 3rd party modules
var async = require('async');

// here are required validators
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookInstances.
exports.bookinstanceList = function bookinList (req, res, next) {
    BookInstance.find()
        .populate('kirja')
        .exec(function execBook (err, listBookinstances) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('bookinstance_list', { title: 'Kirjainstanssi lista', bookinstanceList: listBookinstances });
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstanceDetail = function bookinDetail (req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('kirja')
        .exec(function bookinid (err, bookinstance) {
            if (err) { return next(err); }
            if (bookinstance === null) { // No results.
                err = new Error('Kirjan kopiota ei löytynyt');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('bookinstance_detail', { title: 'Kirja:', bookinstance: bookinstance });
        });
};

// Display BookInstance create form on GET.
exports.bookinstanceCreateGet = function bookinCreateGet (req, res, next) {
    Book.find({}, 'otsikko')
        .exec(function titleget (err, books) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('bookinstance_form', { title: 'Luo kopio kirjasta', bookList: books });
        });
};

// Handle BookInstance create on POST.
exports.bookinstanceCreatePost = [
    // Validate fields.
    body('book', 'Kirja on pakollinen').isLength({ min: 1 }).trim(),
    body('imprint', 'Toiminimi on pakollinen').isLength({ min: 1 }).trim(),
    body('due_back', 'päivämäärä pitää olla ISO8601 muodossa eli yyyy-mm-dd').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
            { kirja: req.body.book,
                toiminimi: req.body.imprint,
                tila: req.body.status,
                palautettava: req.body.due_back
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'otsikko')
                .exec(function errtitlepost (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Luo kopio kirjasta', bookList: books, selectedBook: bookinstance.kirja._id, errors: errors.array(), bookinstance: bookinstance });
                });
        } else {
            // Data from form is valid.
            bookinstance.save(function errsavebookinstance (err) {
                if (err) { return next(err); }
                // Success redirect to bookinstance
                res.redirect(bookinstance.url);
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstanceDeleteGet = function bookinDeleteGet (req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('kirja')
        .exec(function errinsdelget (err, bookinstance) {
            if (err) { return next(err); }
            if (bookinstance === null) { // No results.
                res.redirect('/catalog/kirjainstanssit');
            }
            // Successful, so render.
            res.render('bookinstance_delete', { title: 'Poista kopio kirjasta', bookinstance: bookinstance });
        });
};

// Handle BookInstance delete on POST.
exports.bookinstanceDeletePost = function bookinDeletePost (req, res, next) {
    BookInstance.findByIdAndRemove(req.params.id, function delbookinspost (err) {
        if (err) { return next(err); } // No results
        res.redirect('/catalog/kirjainstanssit');
    });
};

// Display BookInstance update form on GET.
exports.bookinstanceUpdateGet = function bookinUpdateGet (req, res, next) {
    // Get book, authors and genres.
    async.parallel({
        bookinstance: function (callback) {
            BookInstance.findById(req.params.id).populate('kirja').exec(callback);
        },
        books: function (callback) {
            Book.find(callback);
        }

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.bookinstance === null) { // No results.
            err = new Error('Kopio kirjasta ei löytynyt');
            err.status = 404;
            return next(err);
        }
        // Success
        res.render('bookinstance_form', { title: 'Päivitä kopio kirjasta', bookList: results.books, selectedBook: results.bookinstance.kirja._id, bookinstance: results.bookinstance });
    });
};

// Handle bookinstance update on POST.
exports.bookinstanceUpdatePost = [
    // Validate fields.
    body('book', 'Kirja on pakollinen').isLength({ min: 1 }).trim(),
    body('imprint', 'Toiminimi on pakollinen').isLength({ min: 1 }).trim(),
    body('due_back', 'päivämäärä pitää olla ISO8601 muodossa eli yyyy-mm-dd').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped/trimmed data and current id.
        var bookinstance = new BookInstance(
            { kirja: req.body.book,
                toiminimi: req.body.imprint,
                tila: req.body.status,
                palautettava: req.body.due_back,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            Book.find({}, 'otsikko')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Päivitä kopio kirjasta', bookList: books, selectedBook: bookinstance.kirja._id, errors: errors.array(), bookinstance: bookinstance });
                });
        } else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance) {
                if (err) { return next(err); }
                // Successful - redirect to detail page.
                res.redirect(thebookinstance.url);
            });
        }
    }
];
