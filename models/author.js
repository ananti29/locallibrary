var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        first_name: { type: String, required: true, max: 100 },
        last_name: { type: String, required: true, max: 100 },
        nationality: { type: String, required: true, max: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date }
    }
);

// Virtual for author's full name
AuthorSchema
    .virtual('fullname')
    .get(function VirtualName () {
        return this.last_name + ', ' + this.first_name;
    });

// Virtual for author's age
AuthorSchema
    .virtual('age')
    .get(function VirtualAge () {
        return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function VirtualUrl () {
        return '/catalog/author/' + this._id;
    });

// Export model
module.exports = mongoose.model('Author', AuthorSchema);
