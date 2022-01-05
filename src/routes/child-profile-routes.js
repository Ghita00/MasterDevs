const express = require('express')
const router = new express.Router()

const ChildProfile = require('../models/childProfile')
const Member = require('../models/member')
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
/* dato l'id di un utente bambino/a, prende dal database i permessi */
router.get('/rights/:child_user_id/getRights', (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  ChildProfile.findOne({ child_user_id: req.params.child_user_id })
    .then(rights => {
      res.json(rights)
    })
    .catch(next)
})
/* dato l'id di un utente bambino/a, aggiorna i permessi */
router.patch('/rights/:child_user_id/changerights', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const {
    activity, chat, partecipation, manage
  } = req.body
  let child_user_id = req.params.child_user_id
  let exec = { $set: { activity: activity, chat: chat, partecipation: partecipation, manage: manage } }
  await ChildProfile.updateOne({ child_user_id }, exec).then(console.log('update eseguito'))
})
/* aggiunge un bambino utente ad un gruppo e lo fa diventare membro */
router.post('/:group_id/members/:child_id', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const { group_id, child_id } = req.params
  let cond = await Member.findOne({
    group_id: group_id,
    user_id: child_id,
    group_accepted: true,
    user_accepted: true
  })
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

/* dato l'id di un utente bambino/a prende dal database le attività da lui proposte che devono essere accettate dal genitore */
router.get('/:id/activities', async (req, res, next) => {
  if (!req.user_id) { return res.status(401).send('Not authenticated') }
  const userId = req.params.id
  let child_ids = (await Parent.find({ parent_id: userId })).map(child => child.child_id)
  const activities_ids = await Activity.find({ creator_id: { $in: child_ids } })
  res.json(activities_ids)
})

module.exports = router
