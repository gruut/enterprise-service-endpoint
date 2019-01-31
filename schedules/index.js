const CronJob = require('cron').CronJob
const BlockRequester = require('../services/block_requester')
const schedules = {}

schedules.jobs = []
const requestMessageHeader = new CronJob('* 30 * * * *', function () {
  new BlockRequester().request()
})
schedules.jobs.push(requestMessageHeader)

schedules.start = function () {
  this.jobs.forEach((job) => {
    job.start()
  })
}

module.exports = schedules
