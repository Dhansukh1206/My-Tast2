const {
    Schema,
    model
} = require("mongoose");

const MySchema = new Schema({
    domain: {
        type: String,
        required: true,
    },
    string: {
        type: String,
        required: true,
    },
});

const DataModel = model("datamodel", MySchema)

module.exports = DataModel