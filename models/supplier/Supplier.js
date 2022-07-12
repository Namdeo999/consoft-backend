
import mongoose from "mongoose";
// import CustomFunction from "../../services/CustomFunction.js";

// const date = CustomFunction.currentDate();
// const time = CustomFunction.currentTime();

const supplierSchema = mongoose.Schema({
    supplier_name:{ type: String, required:true },
    supplier_mobile:{ type: Number, required:true, unique:true },
    supplier_email:{ type: String, required:true, unique:true },
    supplier_location:{ type: String, required:true },
});


export default mongoose.model('Supplier', supplierSchema, 'suppliers');