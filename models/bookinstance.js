var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
    {
        kirja: { type: Schema.Types.ObjectId, ref: 'Kirja', required: true }, // reference to specific book
        toiminimi: { type: String, required: true },
        tila: { type: String, required: true, enum: ['Saatavilla', 'Huollossa', 'Lainassa', 'Varattu'], default: 'Huollossa' },
        palautettava: { type: Date, default: Date.now }
    }
);

// Virtual for bookinstance's URL
BookInstanceSchema
    .virtual('url')
    .get(function virtualBookInstanceUrl () {
        return '/catalog/kirjainstanssi/' + this._id;
    });

// Virtual for palautettava in more user friendly mode
BookInstanceSchema
    .virtual('palautettava_format')
    .get(function palformat () {
        return moment(this.palautettava).locale('fi').format('D MMMM YYYY');
    });

// Export model
module.exports = mongoose.model('KirjaInstanssi', BookInstanceSchema);
