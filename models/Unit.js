import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
    unit_name: {type: String, required: true, unique: true },
}, { timestamps: true } );

export default mongoose.model('Unit', unitSchema, 'units' ); 