var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
    {
        otsikko: { type: String, required: true },
        kirjailija: { type: Schema.Types.ObjectId, ref: 'Kirjailija', required: true },
        tiivistelma: { type: String, required: true },
        isbn: { type: String, required: true },
        lajityyppi: [{ type: Schema.Types.ObjectId, ref: 'Luokka' }]
    }
);

// Virtual for book's URL
BookSchema
    .virtual('url')
    .get(function virtualBookUrl () {
        return '/catalog/kirja/' + this._id;
    });

// Export model
module.exports = mongoose.model('Kirja', BookSchema);
