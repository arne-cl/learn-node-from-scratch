const mongoose = require('mongoose');
const slug = require('slugs'); // create URL-friendly names

// We don't want to use callbacks or external libraries when waiting for
// results from MongoDB. We'll use ES6 promises instead.
//
// 'global' contains all the global variables in NodeJS (similar to
// 'window' in browser-facing javascript.
mongoose.Promise = global.Promise;

// create a schema for our store
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!' // true would work, but emits an unhelpful error msg
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now // calls Date.now() in JS
    },
    location: {
        type: { // a type object
            type: String,
            default: 'Point'
        },
        coordinates: [{ // list of floats
            type: Number,
            required: 'Please enter coordinates!'
        }],
        address: {
            type: String,
            required: 'Please enter the address of the store!'
        }
    }
});

// We will autogenerate the slug from the name field.
// This function is called before a document is stored.
storeSchema.pre('save', function(next) {
    // this: the store we are trying to save to
    // because we use 'this', we can't use an arrow function here
    if (!this.isModified('name')) {
        next(); // skip it
        return;
    }
    this.slug = slug(this.name);
    next();
    
    // TODO: ensure slugs are unique
});

module.exports = mongoose.model('Store', storeSchema);
