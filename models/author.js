var mongoose = require('mongoose');
var moment = require('moment');

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
    .virtual('kokonimi')
    .get(function virtualName () {
        return this.suku_nimi + ', ' + this.etu_nimi;
    });

// Virtual for author's age
AuthorSchema
    .virtual('age')
    .get(function virtualAge () {
        let born = this.syntyma_aika ? moment(this.syntyma_aika).locale('fi').format('YYYY') : '';
        let death = this.kuolin_aika ? moment(this.kuolin_aika).locale('fi').format('YYYY') : '';
        let ageres = death - born;
        return ageres;
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function virtualAuthorUrl () {
        return '/catalog/kirjailija/' + this._id;
    });

// Virtual for syntyma_aika in more user friendly mode
AuthorSchema
    .virtual('syntyma_aika_format')
    .get(function syntymaformat () {
        return this.syntyma_aika ? moment(this.syntyma_aika).locale('fi').format('D MMMM YYYY') : '';
    });

// Virtual for kuolin_aika in more user friendly mode
AuthorSchema
    .virtual('kuolin_aika_format')
    .get(function kuolinformat () {
        return this.kuolin_aika ? moment(this.kuolin_aika).locale('fi').format('D MMMM YYYY') : '';
    });

// Virtual for kuolin and syntyma_aika together in more user friendly mode
AuthorSchema
    .virtual('age_day_format')
    .get(function ikapaivaformat () {
        let deathday = this.kuolin_aika ? moment(this.kuolin_aika).locale('fi').format('D MMMM YYYY') : '';
        let bornday = this.syntyma_aika ? moment(this.syntyma_aika).locale('fi').format('D MMMM YYYY') : '';
        return bornday + ' - ' + deathday;
    });

// Export model
module.exports = mongoose.model('Kirjailija', AuthorSchema);
