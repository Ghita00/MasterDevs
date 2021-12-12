const mongoose = require('mongoose')
// questa è una prova di commit
const childProfileSchema = new mongoose.Schema(
  {
    child_user_id: {
      type: String,
      unique: true,
      required: true
    },
    activity: {
      type: Boolean,
      required: true,
      default: true
    },
    chat: {
      type: Boolean,
      required: true,
      default: true
    },
    partecipation: {
      type: Boolean,
      required: true,
      default: true
    },
    manage: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)
mongoose.pluralize(null)
const model = mongoose.model('ChildProfile', childProfileSchema)

module.exports = model
