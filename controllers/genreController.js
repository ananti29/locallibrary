var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

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
    res.send('TODO: Genre create GET');
};

// Handle Genre create on POST.
exports.genreCreatePost = function genCreatePost (req, res) {
    res.send('TODO: Genre create POST');
};

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
