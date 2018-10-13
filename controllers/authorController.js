var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');

// Display list of all Authors.
exports.authorList = function autList (req, res, next) {
    Author.find()
        .sort([['suku_nimi', 'ascending']])
        .exec(function execAuthor (err, listAuthors) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('author_list', { title: 'Kirjailija lista', authorList: listAuthors });
        });
};

// Display detail page for a specific Author.
exports.authorDetail = function autDetail (req, res, next) {
    async.parallel({
        author: function autid (callback) {
            Author.findById(req.params.id)
                .exec(callback);
        },
        authorsBooks: function autbook (callback) {
            Book.find({ 'kirjailija': req.params.id }, 'otsikko tiivistelma')
                .exec(callback);
        }
    }, function auterr (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author === null) { // No results.
            err = new Error('Kirjailijaa ei löytynyt');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Kirjailijan tiedot', author: results.author, authorsBooks: results.authorsBooks });
    });
};

// Display Author create form on GET.
exports.authorCreateGet = function autCreateGet (req, res) {
    res.send('TODO: Author create GET');
};

// Handle Author create on POST.
exports.authorCreatePost = function autCreatePost (req, res) {
    res.send('TODO: Author create POST');
};

// Display Author delete form on GET.
exports.authorDeleteGet = function autDeleteGet (req, res) {
    res.send('TODO: Author delete GET');
};

// Handle Author delete on POST.
exports.authorDeletePost = function autDeletePost (req, res) {
    res.send('TODO: Author delete POST');
};

// Display Author update form on GET.
exports.authorUpdateGet = function autUpdateGet (req, res) {
    res.send('TODO: Author update GET');
};

// Handle Author update on POST.
exports.authorUpdatePost = function autUpdatePost (req, res) {
    res.send('TODO: Author update POST');
};
