var BookInstance = require('../models/bookinstance');

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
