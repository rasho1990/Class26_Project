const Place = require("./../models/Place");
const HttpError = require("./../models/http-error");

const ratePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	const { raterId, raterRating, creatorRate } = req.body;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {}

	if (place.rate.raterIds.includes(raterId)) {
		let indexNumber = place.rate.raterIds.indexOf(raterId);
		place.rate.raterRates[indexNumber] = raterRating;
	} else {
		place.rate.raterIds.push(raterId);
		place.rate.raterRates.push(raterRating);
	}
	place.rate.averageRating =
		place.rate.raterRates.reduce((a, b) => a + b) / place.rate.raterRates.length;

	place.rate.creatorRate = creatorRate;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError("Something went wrong, could not update place.", 500);

		return next(error);
	}

	res.status(200).json({ rate: place.rate });
};

exports.ratePlace = ratePlace;
