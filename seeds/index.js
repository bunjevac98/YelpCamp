///OVO JE JAKO SLICNO USING U C# fakticki ja povezujem fajlove sa onim sto mi treba
const mongoose = require('mongoose');
const campground = require('../models/campground');
const Campground = require('../models/campground');

const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');
const { array } = require('mongoose/lib/utils');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedtopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Funkcija za random dobijanje brojeva
const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground(
            {
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)}, ${sample(places)}`,
                image: 'https://source.unsplash.com/collection/483251/480x480',
                description: 'Bilo kakv text samo da je dovoljno dugacak da mozemo da ga stavimo u dva reda tako da ovde apsolutno nema veze sta pise, samo da ne pisu neke gluposti i da ga mozemo pravilno dodavat',
                price
            })
        await camp.save();
    }
}

//OVO NAM Pomaze samo da dodamo neke proizvode u nasu bazu i da mozemo manipulisati sa njima
seedDB().then(() => {
    mongoose.connection.close();
})
