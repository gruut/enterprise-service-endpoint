process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const Seed = require('../seed')
const Cert = require('../../utils/cert')

const {
  expect
} = chai

const {
  describe,
  it,
  before
} = require('mocha')

const server = require('../../api/index').handler
const {
  Transaction,
  sequelize
} = require('../../models')

chai.use(chaiHttp)

describe('Transaction API', () => {
  before((done) => {
    sequelize.sync({
      force: true,
      match: /_test$/
    }).then(() => {
      done()
    }).catch((err) => {
      done(err)
    })
  })

  describe('GET transactions', () => {
    before((done) => {
      Seed.sampleTransaction().then((result) => {
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return transactions', (done) => {
      chai.request(server)
        .get('/transactions')
        .end((err, res) => {
          if (err) throw err

          expect(res.status).to.be.equal(200)
          expect(res.body.length).to.be.greaterThan(0)

          done()
        })
    })

    it('should find and return transactions', (done) => {
      Seed.sampleTransaction().then((tx) => {
        chai.request(server)
          .get(`/transactions/?transactionId=${tx.transactionId}`)
          .end((err, res) => {
            if (err) throw err

            expect(res.status).to.be.equal(200)
            expect(res.body.length).to.be.equal(1)
            expect(res.body[0].transactionId).to.be.equal(tx.transactionId)

            done()
          })
      }).catch(e => {
        done(e)
      })
    })
  })

  describe('GET :id', () => {
    it('should return a specific transaction', (done) => {
      Seed.sampleTransaction().then((tx) => {
        chai.request(server)
          .get(`/transactions/${tx.id}`)
          .end((err, res) => {
            if (err) throw err

            expect(res.status).to.be.equal(200)
            expect(res.body.transaction.id).to.be.greaterThan(0)
            done()
          })
      }).catch(e => {
        done(e)
      })
    })
  })

  describe('POST transaction', async function () {
    await Cert.generateKeyPair()
    
    before(done => {
      sequelize.sync({
        force: true,
        match: /_test$/
      }).then((result) => {
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should create a transaction', (done) => {
      chai.request(server)
        .post('/transactions')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          message: 'test',
          requesterId: 'tester'
        })
        .end(async (err, res) => {
          if (err) throw err

          Transaction.findOne({
            order: [
              ['createdAt', 'DESC']
            ]
          }).then((txId) => {
            expect(res.status).to.be.equal(200)
            expect(txId).to.be.equal('testID')

            done()
          }).catch(e => {
            done(e)
          })
        })
    })
  })
})
