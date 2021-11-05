const Excel = require('exceljs')

function newGroupAgendaEmail (groupName) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        Attached to this email, you will find ${groupName} group agenda.
      </p>
    </div>
  </div>
</div>`
  )
}

async function createExcel (group, activities, events, cb) {
  const workBook = new Excel.Workbook()
  workBook.creator = 'Families Share'
  workBook.created = new Date()
  const sheet = workBook.addWorksheet(`${group.name} Agenda`)
  sheet.columns = [
    {
      header: 'Activity',
      key: 'activity'
    },
    {
      header: 'Event',
      key: 'event'
    },
    {
      header: 'Date',
      key: 'date'
    },
    {
      header: 'Start',
      key: 'start'
    },
    {
      header: 'End',
      key: 'end'
    },
    {
      header: 'Description',
      key: 'description'
    },
    {
      header: 'Location',
      key: 'location'
    },
    {
      header: 'Cost',
      key: 'cost'
    },
    {
      header: 'Link',
      key: 'link'
    },
    {
      header: 'No of Required Parents',
      key: 'requiredParents'
    },
    {
      header: 'No of Required Children',
      key: 'requiredChildren'
    },
    {
      header: 'With Enough Participants',
      key: 'enoughParticipants'
    },
    {
      header: 'Parents',
      key: 'parents'
    },
    {
      header: 'Children',
      key: 'children'
    },
    {
      header: 'Externals',
      key: 'externals'
    },
    {
      header: 'Status',
      key: 'status'
    }
  ]
  for (const activity of activities) {
    const activityEvents = events.filter(event => event.extendedProperties.shared.activityId === activity.activity_id)
    for (const event of activityEvents) {
      const requiredParents = event.extendedProperties.shared.requiredParents
      const requiredChildren = event.extendedProperties.shared.requiredChildren
      const parents = JSON.parse(event.extendedProperties.shared.parents)
      const children = JSON.parse(event.extendedProperties.shared.children)
      const externals = JSON.parse(event.extendedProperties.shared.externals || '[]')
      const start = new Date(event.start.dateTime)
      const end = new Date(event.end.dateTime)
      const originalStart = event.extendedProperties.shared.start || start.getHours()
      const originalEnd = event.extendedProperties.shared.end || end.getHours()
      await sheet.addRow({
        activity: activity.name,
        event: event.summary,
        date: `${start.getMonth() + 1}-${start.getDate()}-${start.getFullYear()}}`,
        start: `${originalStart}:${start.getMinutes()}`,
        end: `${originalEnd}:${end.getMinutes()}`,
        description: event.description,
        location: event.location,
        cost: event.extendedProperties.shared.cost,
        link: event.extendedProperties.shared.link,
        requiredParents: requiredParents,
        requiredChildren: requiredChildren,
        enoughParticipants: ((parents.length + externals.length) >= requiredParents && children.length >= requiredChildren ? 'YES' : 'NO'),
        parents: parents.toString(),
        externals: externals.toString(),
        children: children.toString(),
        status: event.extendedProperties.shared.status
      })
    }
    await sheet.addRow({})
  }
  workBook.xlsx.writeFile(`agenda.xlsx`)
    .then(() => {
      console.log('Excel created')
      cb()
    })
}

module.exports = {
  newGroupAgendaEmail: newGroupAgendaEmail,
  createExcel: createExcel
}
