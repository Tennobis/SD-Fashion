import axios from "axios";

const API_KEY = process.env.PLACES_API_KEY; // Replace with your actual API key

async function getPlaceId(inputText) {
  const findPlaceUrl =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
  try {
    const response = await axios.get(findPlaceUrl, {
      params: {
        input: encodeURIComponent(inputText.trim()),
        inputtype: "textquery",
        fields: "place_id",
        key: API_KEY,
      },
    });
    if (response.data.status === "OK" && response.data.candidates.length) {
      return response.data.candidates[0].place_id;
    } else {
      throw new Error(`Find Place error: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error in getPlaceId:", error);
    throw error;
  }
}

async function getPlaceDetails(placeId) {
  const detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
  try {
    const response = await axios.get(detailsUrl, {
      params: {
        place_id: placeId,
        fields: "user_ratings_total,rating", // add additional fields as required
        key: API_KEY,
      },
    });
    if (response.data.status === "OK") {
      return response.data.result;
    } else {
      throw new Error(`Place Details error: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error in getPlaceDetails:", error);
    throw error;
  }
}
async function main(req, res) {
  try {
    const inputText = req.query.query;
    if (!inputText || typeof inputText !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'query' parameter" });
    }
    const placeId = await getPlaceId(inputText.trim());
    console.log("Place ID:", placeId);
    const placeDetails = await getPlaceDetails(placeId);
    console.log("Place Details:", placeDetails);
    res.status(200).json({ placeId, placeDetails });
  } catch (error) {
    console.error("Error:", error);
  }
}

export { main };
