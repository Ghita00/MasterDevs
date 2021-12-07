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

router.post('/rights/:child_user_id/changeactivity/:bool', /* async */ (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  // let child_user_id = req.body.child_user_id
  console.log('activity' + req.params.bool)
  // await ChildProfile.updateOne({}, {})
})

router.post('/rights/:child_user_id/changechat/:bool', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('chat' + req.params.bool)
})
router.post('/rights/:child_user_id/changepartecipation/:bool', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('partecipate' + req.params.bool)
})

router.post('/rights/:child_user_id/changemanage/:bool', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('manage' + req.params.bool)
})

module.exports = router
