import mongoose, {Schema} from "mongoose";


const ProductSchema=new Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String},
    images: [{type: String}],
    category: {
        type: String,
        enum: ["Men's clothes", "Women's clothes", "Footwear", "Watches", "Speakers"],
        required: true
    },
    price: {type: Number, required: true, default: 0},
    discount: {type: Number, default: 0, min:0, max:100},
    rating: {type: Number, min:1, max:5}
})


export default mongoose.models.Product || mongoose.model("Product", ProductSchema);