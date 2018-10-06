var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
    {
        kirja: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        tyylilajin_nimi: { type: String, required: true, min: 3, max: 100 }
    }
);

// Virtual for genre's URL
GenreSchema
    .virtual('url')
    .get(function virtualGenreUrl () {
        return '/catalog/genre/' + this._id;
    });

// Export model
module.exports = mongoose.model('GenreSchema', GenreSchema);
