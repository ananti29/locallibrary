var express = require('express');
var router = express.Router();

// Require controller modules.
var bookController = require('../controllers/bookController');
var authorController = require('../controllers/authorController');
var genreController = require('../controllers/genreController');
var bookInstanceController = require('../controllers/bookinstanceController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', bookController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/kirja/create', bookController.bookCreateGet);

// POST request for creating Book.
router.post('/kirja/create', bookController.bookCreatePost);

// GET request to delete Book.
router.get('/kirja/:id/delete', bookController.bookDeleteGet);

// POST request to delete Book.
router.post('/kirja/:id/delete', bookController.bookDeletePost);

// GET request to update Book.
router.get('/kirja/:id/update', bookController.bookUpdateGet);

// POST request to update Book.
router.post('/kirja/:id/update', bookController.bookUpdatePost);

// GET request for one Book.
router.get('/kirja/:id', bookController.bookDetail);

// GET request for list of all Book items.
router.get('/kirjat', bookController.bookList);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/kirjailija/create', authorController.authorCreateGet);

// POST request for creating Author.
router.post('/kirjailija/create', authorController.authorCreatePost);

// GET request to delete Author.
router.get('/kirjailija/:id/delete', authorController.authorDeleteGet);

// POST request to delete Author.
router.post('/kirjailija/:id/delete', authorController.authorDeletePost);

// GET request to update Author.
router.get('/kirjailija/:id/update', authorController.authorUpdateGet);

// POST request to update Author.
router.post('/kirjailija/:id/update', authorController.authorUpdatePost);

// GET request for one Author.
router.get('/kirjailija/:id', authorController.authorDetail);

// GET request for list of all Authors.
router.get('/kirjailijat', authorController.authorList);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/luokka/create', genreController.genreCreateGet);

// POST request for creating Genre.
router.post('/luokka/create', genreController.genreCreatePost);

// GET request to delete Genre.
router.get('/luokka/:id/delete', genreController.genreDeleteGet);

// POST request to delete Genre.
router.post('/luokka/:id/delete', genreController.genreDeletePost);

// GET request to update Genre.
router.get('/luokka/:id/update', genreController.genreUpdateGet);

// POST request to update Genre.
router.post('/luokka/:id/update', genreController.genreUpdatePost);

// GET request for one Genre.
router.get('/luokka/:id', genreController.genreDetail);

// GET request for list of all Genre.
router.get('/luokat', genreController.genreList);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/kirjainstanssi/create', bookInstanceController.bookinstanceCreateGet);

// POST request for creating BookInstance.
router.post('/kirjainstanssi/create', bookInstanceController.bookinstanceCreatePost);

// GET request to delete BookInstance.
router.get('/kirjainstanssi/:id/delete', bookInstanceController.bookinstanceDeleteGet);

// POST request to delete BookInstance.
router.post('/kirjainstanssi/:id/delete', bookInstanceController.bookinstanceDeletePost);

// GET request to update BookInstance.
router.get('/kirjainstanssi/:id/update', bookInstanceController.bookinstanceUpdateGet);

// POST request to update BookInstance.
router.post('/kirjainstanssi/:id/update', bookInstanceController.bookinstanceUpdatePost);

// GET request for one BookInstance.
router.get('/kirjainstanssi/:id', bookInstanceController.bookinstanceDetail);

// GET request for list of all BookInstance.
router.get('/kirjainstanssit', bookInstanceController.bookinstanceList);

module.exports = router;
