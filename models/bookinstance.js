var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
    {
        kirja: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // reference to specific book
        toiminimi: { type: String, required: true },
        tila: { type: String, required: true, enum: ['Saatavilla', 'Huollossa', 'Lainassa', 'Varattu'], default: 'Huollossa' },
        palautettava: { type: Date, default: Date.now }
    }
);

// Virtual for bookinstance's URL
BookInstanceSchema
    .virtual('url')
    .get(function virtualBookInstanceUrl () {
        return '/catalog/bookinstance/' + this._id;
    });

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
