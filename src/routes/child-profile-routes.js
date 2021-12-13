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
      console.log(rights)
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

router.post('/rights/:child_user_id/changeactivity/:bool', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('activity' + !req.params.bool)
  let input = !req.params.bool
  let exec = { $set: { activity: input } }
  let child_user_id = req.params.child_user_id
  console.log('cambia attività')
  await ChildProfile.updateOne({ child_user_id }, exec).then(console.log('cambia attività'))
})

router.post('/rights/:child_user_id/changechat/:bool', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('chat' + !req.params.bool)
  let input = !req.params.bool
  let exec = { $set: { chat: input } }
  await ChildProfile.updateOne({ child_user_id: req.params.child_user_id }, exec)
})

router.post('/rights/:child_user_id/changepartecipation/:bool', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('partecipate' + !req.params.bool)
  let input = !req.params.bool
  let exec = { $set: { partecipation: input } }
  await ChildProfile.updateOne({ child_user_id: req.params.child_user_id }, exec)
})

router.post('/rights/:child_user_id/changemanage/:bool', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  console.log('manage' + !req.params.bool)
  let input = !req.params.bool
  let exec = { $set: { manage: input } }
  await ChildProfile.updateOne({ child_user_id: req.params.child_user_id }, exec)
})

module.exports = router
