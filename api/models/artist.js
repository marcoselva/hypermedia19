const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    currentAffiliattion: { type: String,  },
    achivements: { type: Array},
    isCompany: { type: Boolean, default: false },
    companyMembers: { type: Array, required: false },
    abstract: { type: String, required: false },
    type:{ type: String, required: true },
    photoGallery: { type: String, required: false }
});

module.exports = mongoose.model('Artist', artistSchema);