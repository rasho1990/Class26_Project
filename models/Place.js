const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	location: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
	creator: {
		type: mongoose.Types.ObjectId, // Id of related model
		required: true,

		ref: "User",
	},
	rate: {
		averageRating: { type: Number, required: false, default: 0 },
		raterIds: [
			{
				type: mongoose.Types.ObjectId,
				required: false,
				default: null,
			},
		],
		raterRates: [{ type: Number, required: false, default: null }],
		creatorRate: { type: Number, required: false, default: 0 },
	},
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
