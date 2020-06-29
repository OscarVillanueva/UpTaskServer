const mongoose = require("mongoose")

const Project = mongoose.Schema({

    projectName: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
    
})

module.exports = mongoose.model("Project", Project)