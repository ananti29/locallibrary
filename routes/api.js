var express = require('express');
var router = express.Router();
var async = require('async');
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

// API GET all counts
router.get('/', function indexapi (req, res, next) {
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
        if (err) {
            console.log('api error index counting: ' + err);
        } else {
            res.send(results);
        }
    });
});

// API GET all books
router.get('/kirjat', function apibooks (req, res, next) {
    Book.find({}, 'otsikko kirjailija')
        .populate('kirjailija', '-__v')
        .exec(function execBook (err, listBooks) {
            if (err) { return next(err); }
            // Successful, so render
            res.send(listBooks);
        });
});

// API GET all authors
router.get('/kirjailijat', function apiauthors (req, res, next) {
    Author.find().select('-__v')
        .sort([['suku_nimi', 'ascending']])
        .exec(function execAuthor (err, listAuthors) {
            if (err) { return next(err); }
            // Successful, so render
            res.send(listAuthors);
        });
});

// API GET all genres
router.get('/luokat', function apigenres (req, res, next) {
    Genre.find().select('-__v')
        .sort([['luokan_nimi', 'ascending']])
        .exec(function execGenre (err, listGenres) {
            if (err) { return next(err); }
            // Successful, so render
            res.send(listGenres);
        });
});

// API GET all bookinstances
router.get('/kirjainstanssit', function apibookinstances (req, res, next) {
    BookInstance.find().select('-__v')
        .populate('kirja', '-__v')
        .exec(function execBook (err, listBookinstances) {
            if (err) { return next(err); }
            // Successful, so render
            res.send(listBookinstances);
        });
});

module.exports = router;
