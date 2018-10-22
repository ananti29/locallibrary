var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');

// here are required validators
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
    res.render('author_form', { title: 'Luo kirjailija' });
};

// Handle Author create on POST.
exports.authorCreatePost = [
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('Etunimi on pakollinen.')
        .isAlphanumeric().withMessage('Etunimessä ei saa olla numeroita'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Sukunimi on pakollinen.')
        .isAlphanumeric().withMessage('Sukunimessä ei saa olla numeroita.'),
    body('nationality').isLength({ min: 1, max: 100 }).trim().withMessage('Kansallisuus on pakollinen.')
        .isAlphanumeric().withMessage('Kansallisuudessa ei saa olla numeroita.'),
    body('date_of_birth', 'syntymäaika pitää olla ISO8601 muodossa eli yyyy-mm-dd').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'kuolinaika pitää olla ISO8601 muodossa eli yyyy-mm-dd').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('nationality').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Luo kirjailija', author: req.body, errors: errors.array() });
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    etu_nimi: req.body.first_name,
                    suku_nimi: req.body.last_name,
                    syntyma_aika: req.body.date_of_birth,
                    kuolin_aika: req.body.date_of_death,
                    kansallisuus: req.body.nationality
                });
            author.save(function errauthorpost (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET.
exports.authorDeleteGet = function autDeleteGet (req, res, next) {
    async.parallel({
        author: function getauthordel (callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authorsBooks: function getauthorbookdel (callback) {
            Book.find({ 'kirjailija': req.params.id }).exec(callback);
        }
    }, function errauthorbookdel (err, results) {
        if (err) { return next(err); }
        if (results.author === null) { // No results.
            res.redirect('/catalog/kirjailijat');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Poista kirjailija', author: results.author, authorBooks: results.authorsBooks });
    });
};

// Handle Author delete on POST.
exports.authorDeletePost = function autDeletePost (req, res, next) {
    async.parallel({
        author: function delpostauthor (callback) {
            Author.findById(req.body.authorid).exec(callback);
        },
        authorsBooks: function delpostauthorbooks (callback) {
            Book.find({ 'author': req.body.authorid }).exec(callback);
        }
    }, function errpostauthorsbooks (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authorsBooks.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Poista kirjailija', author: results.author, authorBooks: results.authorsBooks });
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor (err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/kirjailijat');
            });
        }
    });
};

// Display Author update form on GET.
exports.authorUpdateGet = function autUpdateGet (req, res, next) {
    async.parallel({
        author: function getauthorupd (callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authorsBooks: function getauthorbookupd (callback) {
            Book.find({ 'kirjailija': req.params.id }).exec(callback);
        }
    }, function errauthorbookdel (err, results) {
        if (err) { return next(err); }
        if (results.author === null) { // No results.
            res.redirect('/catalog/kirjailijat');
        }
        // Successful, so render.
        res.render('author_form', { title: 'Päivitä kirjailija', author: results.author, authorBooks: results.authorsBooks });
    });
};

// Handle Author update on POST.
exports.authorUpdatePost = [
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('Etunimi on pakollinen.')
        .isAlphanumeric().withMessage('Etunimessä ei saa olla numeroita'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Sukunimi on pakollinen.')
        .isAlphanumeric().withMessage('Sukunimessä ei saa olla numeroita.'),
    body('nationality').isLength({ min: 1, max: 100 }).trim().withMessage('Kansallisuus on pakollinen.')
        .isAlphanumeric().withMessage('Kansallisuudessa ei saa olla numeroita.'),
    body('date_of_birth', 'syntymäaika pitää olla ISO8601 muodossa eli yyyy-mm-dd').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'kuolinaika pitää olla ISO8601 muodossa eli yyyy-mm-dd').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('nationality').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Päivitä kirjailija', author: req.body, errors: errors.array() });
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    etu_nimi: req.body.first_name,
                    suku_nimi: req.body.last_name,
                    syntyma_aika: req.body.date_of_birth,
                    kuolin_aika: req.body.date_of_death,
                    kansallisuus: req.body.nationality,
                    _id: req.params.id // This is required, or a new ID will be assigned!
                });

            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function dbupdauthors (err, theauthor) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect(theauthor.url);
            });
        }
    }
];
