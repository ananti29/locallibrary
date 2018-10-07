var BookInstance = require('../models/bookinstance');

// Display list of all BookInstances.
exports.bookinstanceList = function bookinList (req, res) {
    res.send('TODO: BookInstance list');
};

// Display detail page for a specific BookInstance.
exports.bookinstanceDetail = function bookinDetail (req, res) {
    res.send('TODO: BookInstance detail: ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.bookinstanceCreateGet = function bookinCreateGet (req, res) {
    res.send('TODO: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstanceCreatePost = function bookinCreatePost (req, res) {
    res.send('TODO: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstanceDeleteGet = function bookinDeleteGet (req, res) {
    res.send('TODO: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstanceDeletePost = function bookinDeletePost (req, res) {
    res.send('TODO: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstanceUpdateGet = function bookinUpdateGet (req, res) {
    res.send('TODO: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstanceUpdatePost = function bookinUpdatePost (req, res) {
    res.send('TODO: BookInstance update POST');
};
