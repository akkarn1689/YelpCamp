const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


// 
mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp')
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!!!");
        console.log(err);
    })


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await 
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '6555b01d3d4db1e78b13cc4f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus nemo ullam incidunt, aperiam dolorum fuga ratione, saepe, aut odit eligendi modi? Nemo nihil nesciunt iure, aliquid neque expedita omnis! Quis.',
            price,
            images: [
              {
                url: 'https://res.cloudinary.com/dmzdxxp1k/image/upload/v1702711409/YelpCamp/se5cvgea3hskylezxan7.jpg',
                filename: 'YelpCamp/se5cvgea3hskylezxan7',
              },
              {
                url: 'https://res.cloudinary.com/dmzdxxp1k/image/upload/v1702711410/YelpCamp/eyw7fexkm46jeflyjdqu.jpg',
                filename: 'YelpCamp/eyw7fexkm46jeflyjdqu',
              },
              {
                url: 'https://res.cloudinary.com/dmzdxxp1k/image/upload/v1702711423/YelpCamp/hazrgblkzkehhe9e34gq.jpg',
                filename: 'YelpCamp/hazrgblkzkehhe9e34gq',
              }
              ]
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})