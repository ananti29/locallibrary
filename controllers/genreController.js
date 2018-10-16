var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

// here are required validators
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genreList = function genList (req, res, next) {
    Genre.find()
        .sort([['luokan_nimi', 'ascending']])
        .exec(function execGenre (err, listGenres) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('genre_list', { title: 'Luokka lista', genreList: listGenres });
        });
};

// Display detail page for a specific Genre.
exports.genreDetail = function genDetail (req, res, next) {
    async.parallel({
        genre: function genid (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genreBooks: function genbookid (callback) {
            Book.find({ 'lajityyppi': req.params.id })
                .exec(callback);
        }

    }, function errgenre (err, results) {
        if (err) { return next(err); }
        if (results.genre === null) { // No results.
            err = new Error('Luokka ei löydetty');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Luokan tiedot', genre: results.genre, genreBooks: results.genreBooks });
    });
};

// Display Genre create form on GET.
exports.genreCreateGet = function genCreateGet (req, res) {
    res.render('genre_form', { title: 'Luo Luokka' });
};

// Handle Genre create on POST.
exports.genreCreatePost = [
    // Validate that the name field is not empty.
    body('name', 'Luokan nimi on pakollinen').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
            { luokan_nimi: req.body.name }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Luo Luokka', genre: genre, errors: errors.array() });
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'luokan_nimi': req.body.name })
                .exec(function findgenrepost (err, foundGenre) {
                    if (err) { return next(err); }

                    if (foundGenre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(foundGenre.url);
                    } else {
                        genre.save(function errgenresave (err) {
                            if (err) { return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

// Display Genre delete form on GET.
exports.genreDeleteGet = function genDeleteGet (req, res) {
    res.send('TODO: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genreDeletePost = function genDeletePost (req, res) {
    res.send('TODO: Genre delete POST');
};

// Display Genre update form on GET.
exports.genreUpdateGet = function genUpdateGet (req, res) {
    res.send('TODO: Genre update GET');
};

// Handle Genre update on POST.
exports.genreUpdatePost = function genUpdatePost (req, res) {
    res.send('TODO: Genre update POST');
};
