#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async');
var Book = require('./models/book');
var Author = require('./models/author');
var Genre = require('./models/genre');
var BookInstance = require('./models/bookinstance');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB yhteysvirhe:'));

var authors = [];
var genres = [];
var books = [];
var bookinstances = [];

function authorCreate (first_name, family_name, d_birth, d_death, kansallisuus, cb) {
    authordetail = { etu_nimi: first_name, suku_nimi: family_name, kansallisuus: kansallisuus };
    if (d_birth != false) authordetail.syntyma_aika = d_birth;
    if (d_death != false) authordetail.kuolin_aika = d_death;

    var author = new Author(authordetail);

    author.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('Uusi kirjailija: ' + author);
        authors.push(author);
        cb(null, author);
    });
}

function genreCreate (name, cb) {
    var genre = new Genre({ luokan_nimi: name });

    genre.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('Uusi luokka: ' + genre);
        genres.push(genre);
        cb(null, genre);
    } );
}

function bookCreate (title, summary, isbn, author, genre, cb) {
    bookdetail = {
        otsikko: title,
        tiivistelma: summary,
        kirjailija: author,
        isbn: isbn
    };
    if (genre != false) bookdetail.lajityyppi = genre;

    var book = new Book(bookdetail);
    book.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Book: ' + book);
        books.push(book);
        cb(null, book);
    } );
}

function bookInstanceCreate (book, imprint, due_back, status, cb) {
    bookinstancedetail = {
        kirja: book,
        toiminimi: imprint
    };
    if (due_back != false) bookinstancedetail.palautettava = due_back;
    if (status != false) bookinstancedetail.tila = status;

    var bookinstance = new BookInstance(bookinstancedetail);
    bookinstance.save(function (err) {
        if (err) {
            console.log('VIRHE LUOTAESSA Kirjainstanssia: ' + bookinstance);
            cb(err, null);
            return;
        }
        console.log('Uusi kirjainstanssi: ' + bookinstance);
        bookinstances.push(bookinstance);
        cb(null, book);
    });
}

function createGenreAuthors (cb) {
    async.parallel([
        function (callback) {
            authorCreate('Patrick', 'Rothfuss', '1973-06-06', false, 'USA', callback);
        },
        function (callback) {
            authorCreate('Ben', 'Bova', '1932-11-8', false, 'USA', callback);
        },
        function (callback) {
            authorCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', 'RUS', callback);
        },
        function (callback) {
            authorCreate('Bob', 'Billings', false, false, 'USA', callback);
        },
        function (callback) {
            authorCreate('Jim', 'Jones', '1971-12-16', false, 'USA', callback);
        },
        function (callback) {
            genreCreate('Fantasia', callback);
        },
        function (callback) {
            genreCreate('Scifikirjallisuus', callback);
        },
        function (callback) {
            genreCreate('Ranskalainen runous', callback);
        }
    ],
    // optional callback
    cb);
}

function createBooks (cb) {
    async.parallel([
        function (callback) {
            bookCreate('Tuulen nimi (Kuninkaan tappaja #1 sarjassa)', 'Olen varastanut prinsessoja takaisin nukkumisjyrkiltä. Poltin Trebonin kaupungin. Olen viettänyt yötä Felurian kanssa ja jätin sekä minun järkevyyteni että elämäni. Minut karkotettiin yliopistolta nuorempana kuin useimmat ihmiset sallitaan yliopistoon. kuljen polkuja kuunvalossa, joita toiset pelkäävät puhuvan päivällä. Olen puhunut Jumalalle, rakastanut naisia ja kirjoittanut kappaleita, jotka saavat miekkailijat itkemään.', '9781473211896', authors[0], [genres[0] ], callback);
        },
        function (callback) {
            bookCreate("Viisaan miehen pelko (Kuninkaan tappaja, #2 sarjassa)", 'Kvothe Kingkillerin tarinan palaaminen jälleen. Seuraamme hänrn tarinaa maanpakoon, poliittiseen viehätykseen, kohteliaisuuteen, seikkailuun, rakkauteen ja taikuuteen ... ja pitkin matkaa, joka on kääntänyt Kvothein, hänen ikäisensä mahtavan taikurin, oman aikansa legendan Koten kaupunkiin mitään aavistamattoman pubin omistajan luo', '9788401352836', authors[0], [genres[0] ], callback);
        },
        function (callback) {
            bookCreate('Hiljaiden asioiden hitaus (Kuninkaan tappaja sarja)', 'Syvällä yliopiston alapuolella on pimeä paikka. Harvat ihmiset tietävät siitä: vanhojen käytävien ja hylättyjen huoneiden rikki verkko. Täällä siellä asuu nuori nainen, joka sijoittuu Underthingin rönsyilevien tunneleiden keskelle, siististi tämän unohdetun paikan sydämessä.', '9780756411336', authors[0], [genres[0] ], callback);
        },
        function (callback) {
            bookCreate('Apinat ja enkelit', 'Ihmiskunta lähti tähtiin ei valloitusta, etsintää eikä edes uteliaisuutta. Ihmiset menivät tähdet epätoivoiseen ristiretkuun pelastaakseen älykkään elämän missä tahansa he löysivät sen. Kuoleman aalto leviää Linnunradan galaksin läpi, laajeneva tappava gamma...', '9780765379528', authors[1], [genres[1] ], callback);
        },
        function (callback) {
            bookCreate('Kuoleman aalto', 'Ben Bovan aikaisemmassa New Earth-mallissa Jordan Kell johti ensimmäisen ihmisjoukkojen aurinkokunnan ulkopuolelle. He löysivät vanhan ulkomaalaisen sivilisaation rauniot. Mutta yksi ulkomaalainen AI selviytyi, ja se paljasti Jordan Kellille, että Linnunradan galaksin sydämessä oleva musta aukko on aiheuttanut aalton tappavaa säteilyä, joka ulottuu ydinmaasta kohti maata. Ellei ihmiskunta pelasta itsensä pelastamiseksi, kaikki maan päällä oleva elämä tuhoutuu ...', '9780765379504', authors[1], [genres[1] ], callback);
        },
        function (callback) {
            bookCreate('Testi kirja 1', 'Testi kirja 1 tiivistelmä', 'ISBN111111', authors[4], [genres[0], genres[1]], callback);
        },
        function (callback) {
            bookCreate('Testi kirja 2', 'Testi kirja 2 tiivistelmä', 'ISBN222222', authors[4], false, callback);
        }
    ],
    // optional callback
    cb);
}

function createBookInstances (cb) {
    async.parallel([
        function (callback) {
            bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Saatavilla', callback);
        },
        function (callback) {
            bookInstanceCreate(books[1], ' Gollancz, 2011.', false, 'Lainassa', callback);
        },
        function (callback) {
            bookInstanceCreate(books[2], ' Gollancz, 2015.', false, false, callback);
        },
        function (callback) {
            bookInstanceCreate(books[3], 'New York Tom Doherty Kumppanit, 2016.', false, 'Saatavilla', callback);
        },
        function (callback) {
            bookInstanceCreate(books[3], 'New York Tom Doherty Kumppanit, 2016.', false, 'Saatavilla', callback);
        },
        function (callback) {
            bookInstanceCreate(books[3], 'New York Tom Doherty Kumppanit, 2016.', false, 'Saatavilla', callback);
        },
        function (callback) {
            bookInstanceCreate(books[4], 'New York Tom Doherty Kumppanit, OY, 2015.', false, 'Saatavilla', callback);
        },
        function (callback) {
            bookInstanceCreate(books[4], 'New York Tom Doherty Kumppanit, OY, 2015.', false, 'Huollossa', callback);
        },
        function (callback) {
            bookInstanceCreate(books[4], 'New York Tom Doherty Kumppanit, OY, 2015.', false, 'Lainassa', callback);
        },
        function (callback) {
            bookInstanceCreate(books[0], 'Toiminimi XXX2', false, false, callback);
        },
        function (callback) {
            bookInstanceCreate(books[1], 'Toiminimi XXX3', false, false, callback);
        }
    ],
    // Optional callback
    cb);
}

async.series([
    createGenreAuthors,
    createBooks,
    createBookInstances
],
// Optional callback
function (err, results) {
    if (err) {
        console.log('Viimeinen virhe: ' + err);
    } else {
        console.log('Kirjainstanssit: ' + bookinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
