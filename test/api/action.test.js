process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

const {
  expect
} = chai

const {
  describe,
  it
} = require('mocha')

const server = require('../../api/index').handler

chai.use(chaiHttp)

describe('Block API', () => {
  describe('POST ping', () => {
    it('should be ok', (done) => {
      chai.request(server)
        .post('/ping')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(
          JSON.stringify({
            message: {
              'mID': 'TUVSR0VSLTE=',
              'sCnt': '0',
              'stat': 'ERROR_ON_SIGNERS',
              'time': '1548132023'
            }
          })
        )
        .end((err, res) => {
          if (err) throw err

          expect(res.status).to.be.equal(200)
          done()
        })
    })
  })
})
