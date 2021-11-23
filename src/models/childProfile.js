const mongoose = require('mongoose')

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

childProfileSchema.virtual('image', {
  ref: 'Image',
  localField: 'image_id',
  foreignField: 'image_id',
  justOne: true
})

childProfileSchema.post('find', (profiles, next) => {
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].suspended) {
      if (profiles[i].image !== null) {
        profiles[i].image.path = '/images/profiles/user_default_photo.png'
        profiles[i].image.thumbnail_path =
          '/images/profiles/user_default_photo.png'
      }
    }
  }
  next()
})
childProfileSchema.post('findOne', (profile, next) => {
  if (profile !== null) {
    if (profile.suspended) {
      if (profile.image !== null) {
        profile.image.path = '/images/profiles/user_default_photo.png'
        profile.image.thumbnail_path =
          '/images/profiles/user_default_photo.png'
      }
    }
  }
  next()
})

mongoose.pluralize(null)
const model = mongoose.model('ChildProfile', childProfileSchema)

module.exports = model
