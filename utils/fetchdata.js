import axios from "axios";

export const fetchData = async (url) => {
	try {
		return await axios.get(url)
	} catch (error) {
		console.log(error);
	}
};
