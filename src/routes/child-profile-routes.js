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

router.get('/rights/changeactivity', (req, res, next) => {
  if (!req.activity) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.find({ activity: { $in: ids } })
    .select('activity')
    .lean()
    .exec()
    .then(child => {
      child.activity = !child.activity
    }).catch(next)
})

router.get('/rights/changechat', (req, res, next) => {
  if (!req.chat) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.find({ chat: { $in: ids } })
    .select('chat')
    .lean()
    .exec()
    .then(child => {
      child.chat = !child.chat
    }).catch(next)
})

router.get('/rights/changepartecipation', (req, res, next) => {
  if (!req.partecipation) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.find({ partecipation: { $in: ids } })
    .select('partecipation')
    .lean()
    .exec()
    .then(child => {
      child.partecipation = !child.partecipation
    }).catch(next)
})

router.get('/rights/changemanage', (req, res, next) => {
  if (!req.manage) { return res.status(401).send('Not authenticated') }
  const { ids } = req.query
  if (!ids) {
    return res.status(400).send('Bad Request')
  }
  ChildProfile.find({ manage: { $in: ids } })
    .select('manage')
    .lean()
    .exec()
    .then(child => {
      child.manage = !child.manage
    }).catch(next)
})

module.exports = router
