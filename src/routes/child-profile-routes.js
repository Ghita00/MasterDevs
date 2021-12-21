const express = require('express')
const router = new express.Router()

const ChildProfile = require('../models/childProfile')
const Parent = require('../models/parent')
const Activity = require('../models/activity')

router.get('/', (req, res, next) => {
  if (!req.child_user_id) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.find({ child_user_id: { $in: ids } })
    .select('given_name family_name image_id child_id suspended')
    .populate('image')
    .lean()
    .exec()
    .then(profiles => {
      if (profiles.length === 0) {
        return res.status(404).send('Children not found')
      }
      res.json(profiles)
    }).catch(next)
})

router.get('/rights/:child_user_id/getRights', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  ChildProfile.findOne({ child_user_id: req.params.child_user_id })
    .then(rights => {
      res.json(rights)
    })
    .catch(next)
})

router.patch('/rights/:child_user_id/changerights', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const {
    activity, chat, partecipation, manage
  } = req.body
  console.log(activity, chat, partecipation, manage)
  let child_user_id = req.params.child_user_id
  let exec = { $set: { activity: activity, chat: chat, partecipation: partecipation, manage: manage } }
  await ChildProfile.updateOne({ child_user_id }, exec).then(console.log('update eseguito'))
  /* let input = !req.params.bool
  let exec = { $set: { activity: input } }
  let child_user_id = req.params.child_user_id
  console.log('cambia attività')
  await ChildProfile.updateOne({ child_user_id }, exec).then(console.log('cambia attività')) */
})

router.get('/:id/activities', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const userId = req.params.id
  let child_ids = (await Parent.find({ parent_id: userId })).map(child => child.child_id)
  // child_ids = child_ids
  const activities_ids = await Activity.find({ creator_id: { $in: child_ids } })
  res.json(activities_ids)
})
module.exports = router
