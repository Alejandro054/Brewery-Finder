//Import Express and Axios
import express, { json } from "express";
import axios from "axios";

//Create an express app, set the port number, and the API URL
const app = express();
const port = 3000;
const API_Link = "https://api.openbrewerydb.org/v1/breweries";

//middleware to parse the request body
express.urlencoded({ extended: true });
//Use the public folder for static files
app.use(express.static("public"));
//When the user goes to the home page it should render the index.ejs file
app.get("/", (req, res) => {
    res.render("index.ejs");
});
//When the user goes to the /get-breweries page, it should get the breweries from the API and render the index.ejs file with the breweries
app.get("/get-breweries", async (req, res) => {
    const {by_city, by_state, by_postal} = req.query;

    let API_URL = `${API_Link}?`;

    if (by_city) {
        API_URL += `by_city=${by_city}&`;
    }

    if (by_state) {
        API_URL += `by_state=${by_state}&`;
    }

    if (by_postal) {
        API_URL += `by_postal=${by_postal}&`;
    }

    // Remove the trailing '&' if it exists
    if (API_URL.endsWith('&')) {
        API_URL = API_URL.slice(0, -1);
    }

    console.log(API_URL);
    try {
            const result = await axios.get(API_URL);
            const breweries = result.data.map(brewery => {
                if (brewery.phone) {
                    const cleaned = ('' + brewery.phone).replace(/\D/g, '');
                    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        brewery.phone = '(' + match[1] + ') ' + match[2] + '-' + match[3];
                    }
                }
                return brewery;
            });
            res.render("index.ejs", {breweries});
        } catch (error) {
            console.log(error);
            res.render("index.ejs", { error: 'Failed to get breweries' });
        }
    });    
//Listen on your predefined port and start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});