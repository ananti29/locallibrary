var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
    {
        luokan_nimi: { type: String, required: true, min: 3, max: 100 }
    }
);

// Virtual for genre's URL
GenreSchema
    .virtual('url')
    .get(function virtualGenreUrl () {
        return '/catalog/luokka/' + this._id;
    });

// Export model
module.exports = mongoose.model('Luokka', GenreSchema);
