import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectReportPath = mongoose.Schema({
    company_id: {type: ObjectId, required: true },
    project_id: {type: ObjectId, required: true },
    started_by: {type: ObjectId, required: true },
    verification_1: {type: ObjectId, required: true },
    // verification_2: {type: String, default:undefined },
    // admin_3: {type: String, default:undefined },
    admin_1: {type: ObjectId, required: true },
    admin_2: {type: ObjectId, required: true },
}, { timestamps: true });

export default mongoose.model('ProjectReportPath', projectReportPath, 'projectReportPaths');