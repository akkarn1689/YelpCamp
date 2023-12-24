const express = require('express');
const router = express.Router();
const { campgroundSchema, reviewSchema } = require('../schemas.js')   //
const catchAsync = require('../utils/catchAsync');    //
const ExpressError = require('../utils/ExpressError');  //
const Campground = require('../models/campground');    //
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campground = require('../controllers/campgrounds.js');
const multer  = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage});



//
router.get('/', catchAsync(campground.index))

// 
router.get('/new', isLoggedIn, campground.renderNewForm)

// 
router.post('/', isLoggedIn, upload.array('images'), validateCampground, catchAsync(campground.createCampground))

// router.post('/', upload.array('image'), (req,res) => {
//     console.log(req.body, req.file);
//     res.send('It worked')
// })

// 
router.get('/:id', catchAsync(campground.showCampgrounds))

// 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

//
router.put('/:id', isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campground.editCampground))

//
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

module.exports = router;