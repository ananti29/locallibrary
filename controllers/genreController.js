var Genre = require('../models/genre');

// Display list of all Genre.
exports.genreList = function genList (req, res) {
    res.send('TODO: Genre list');
};

// Display detail page for a specific Genre.
exports.genreDetail = function genDetail (req, res) {
    res.send('TODO: Genre detail: ' + req.params.id);
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
