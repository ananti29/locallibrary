var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        etu_nimi: { type: String, required: true, max: 100 },
        suku_nimi: { type: String, required: true, max: 100 },
        kansallisuus: { type: String, required: true, max: 100 },
        syntyma_aika: { type: Date },
        kuolin_aika: { type: Date }
    }
);

// Virtual for author's full name
AuthorSchema
    .virtual('fullname')
    .get(function virtualName () {
        return this.suku_nimi + ', ' + this.etu_nimi;
    });

// Virtual for author's age
AuthorSchema
    .virtual('age')
    .get(function virtualAge () {
        return (this.kuolin_aika.getYear() - this.syntyma_aika.getYear()).toString();
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function virtualAuthorUrl () {
        return '/catalog/author/' + this._id;
    });

// Export model
module.exports = mongoose.model('Author', AuthorSchema);
