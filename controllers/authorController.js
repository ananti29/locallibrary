var Author = require('../models/author');

// Display list of all Authors.
exports.authorList = function autList (req, res) {
    res.send('TODO: Author list');
};

// Display detail page for a specific Author.
exports.authorDetail = function autDetail (req, res) {
    res.send('TODO: Author detail: ' + req.params.id);
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
