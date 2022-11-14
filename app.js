const express = require('express');
const path = require('path')
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedtopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//OVDEEEEEEEEEEEEEEEEE
app.use(express.urlencoded({ extended: true }))

//ovo je za uprate U ONOM FORMU KOD EDITA AKO SE OVDE ZOVE _METHOD MORA I TAMO TO JE POVESANO
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');

})
//U RENDER IDE PUTANJA OD EJS KOJI RENDERUJEMO
//kao sto je u C# Views
//PAZITI KOD RENDERA NE IDE JEBEN "/" POSLE SVEGA
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})


///ovaj get kada se unesu podaci vraca post metodu a ona se nalazi ispod ovoga
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    //BODY JE PRAZAN I MI MORAMO DA GA PARSIRAMO TAKO DA TREBA DA 
    //DEKODIRAMO ONO STO SMO NAPISALI A TO SE NALAZI OVDEEEEEEEEEEEE
    //u ovom body se nalazi nas objekat
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

})



///KOD OVOGA PAZITI JER KAD DODJE DO OVOGA TRAZICE TU TUTU TAKO DA JE REDOSLED GET-A VEOMA BITAN
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {

    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.listen(3000, () => {
    console.log('Server na portu 3000');
})













