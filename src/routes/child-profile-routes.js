const express = require('express')
const router = new express.Router()

const ChildProfile = require('../models/childProfile')

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

router.post('/rights/:child_user_id/changeactivity', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  ChildProfile.findOne({ child_user_id: req.params.child_user_id })
    .select('activity')
    .lean()
    .exec()
    .then(child => {
      console.log(child)
      child.activity = !child.activity
    }).catch(next)
})

router.post('/rights/:child_user_id/changechat', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  let bool = ChildProfile.findOne({ child_user_id: req.params.child_user_id })
  console.log(bool.schema.chat)
  ChildProfile.updateOne(
    { child_user_id: req.params.child_user_id },
    { $set: { chat: !bool.chat } })
})

router.post('/rights/:child_user_id/changepartecipation', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.findOne({ child_user_id: { $in: req.child_user_id } })
    .select('partecipation')
    .lean()
    .exec()
    .then(child => {
      child.partecipation = !child.partecipation
    }).catch(next)
})

router.post('/rights/:child_user_id/changemanage', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.findOne({ child_user_id: { $in: req.child_user_id } })
    .select('manage')
    .lean()
    .exec()
    .then(child => {
      child.manage = !child.manage
    }).catch(next)
})

module.exports = router
