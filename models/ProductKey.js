import mongoose from "mongoose";

const productKeySchema = mongoose.Schema({
    company_id: {type: String, required:true},
    product_key: {type: String, required:true},
})

export default mongoose.model('ProductKey', productKeySchema, 'productKeys');