var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
//npm i mongoose-double
var SchemaTypes = mongoose.Schema.Types;

var playerDetailsSchema = new Schema({
    playerName: {
        type: String,
        required : true
    },
    profileDescription: {
        type: String,
        required : true
    },
    profileImage: {
        type: String,
        required : true
    },
    playerFlag: {
        type: Boolean,
        required : true
    },
    playerType: {
        type: String,
        required : true
    },
    createdDate: {
        type: Date,
        required : true
    },
    playerAPIId: {
        type: String,
        unique : true,
        required : true
    }
})

var testMatchSchema = new Schema({

    playerID: {
        type: String,
        required : true
    },
    matchesPlayed: {
        type: Number,
        required : true
    },
    totalRunSored: {
        type: Number,
        required : true
    },
    totalFifties: {
        type: Number,
        required : true
    },
    totalHundreads: {
        type: Number,
        required : true
    },
    average: {
        type: SchemaTypes.Double
    },
    wicketsTaken: {
        type: Number
    },
    topScore: {
        type: Number
    },
    economy: {
        type: SchemaTypes.Double
    }
})

var dataSchemaODI = new Schema({

    playerID: {
        type: String,
        required : true
    },
    matchesPlayed: {
        type: Number,
        required : true
    },
    totalRunSored: {
        type: Number,
        required : true
    },
    totalFifties: {
        type: Number,
        required : true
    },
    totalHundreads: {
        type: Number,
        required : true
    },
    average: {
        type: SchemaTypes.Double
    },
    wicketsTaken: {
        type: Number
    },
    topScore: {
        type: Number
    },
    economy: {
        type: SchemaTypes.Double
    }

})

var dataSchemaT20 = new Schema({

    playerID: {
        type: String,
        required : true
    },
    matchesPlayed: {
        type: Number,
        required : true
    },
    totalRunSored: {
        type: Number,
        required : true
    },
    totalFifties: {
        type: Number,
        required : true
    },
    totalHundreads: {
        type: Number,
        required : true
    },
    Average: {
        type: SchemaTypes.Double
    },
    wicketsTaken: {
        type: Number
    },
    TopScore: {
        type: Number
    },
    Economy: {
        type: SchemaTypes.Double
    }

})

var playerDetails = mongoose.model('playerDetails', playerDetailsSchema);
var testMatch = mongoose.model('testMatch', testMatchSchema);
var oneDayInternational = mongoose.model('oneDayInternational', dataSchemaODI);
var tTwenty = mongoose.model('tTwenty', dataSchemaT20);

module.exports = {
    playerDetails: playerDetails,
    testMatch: testMatch,
    oneDayInternational : oneDayInternational,
    tTwenty : tTwenty
};
