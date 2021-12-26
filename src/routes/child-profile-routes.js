const express = require('express')
const router = new express.Router()

const ChildProfile = require('../models/childProfile')
const Member = require('../models/member')

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
})

router.post('/:group_id/members/:child_id', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const { group_id, child_id } = req.params
  let cond = await Member.findOne({
    group_id: group_id,
    user_id: child_id,
    group_accepted: true,
    user_accepted: true
  })
  console.log(!cond)
  if (!cond) {
    let member = {
      group_id: group_id,
      user_id: child_id,
      admin: false,
      user_accepted: true,
      group_accepted: true
    }
    Member.create(member)
      .then(res.status(200).send('Child added in ' + group_id))
      .catch(next)
  }
})

module.exports = router
