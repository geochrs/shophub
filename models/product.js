const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImagesSchema = new Schema({
    url: String,
    filename: String
});

ImagesSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_120');
});

const ProductSchema = new Schema({
    title: String,
    images: [ImagesSchema],
    price: Number,
    description: String,
    fullDetail: String,
    featured: Boolean,
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;