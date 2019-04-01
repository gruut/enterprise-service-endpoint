process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const Seed = require('../seed')

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
  Block,
  Transaction,
  Signer,
  sequelize
} = require('../../models')

chai.use(chaiHttp)

describe('Block API', () => {
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

  describe('GET blocks', () => {
    before((done) => {
      Seed.sampleBlock().then((result) => {
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return blocks', (done) => {
      chai.request(server)
        .get('/blocks')
        .end((err, res) => {
          if (err) throw err

          expect(res.status).to.be.equal(200)
          expect(res.body.blocks.length).to.be.greaterThan(0)
          expect(res.body.totalBlocksCount).to.be.greaterThan(0)

          done()
        })
    })

    it('should return a specific block', (done) => {
      Block.findAll().then((blocks) => {
        chai.request(server)
          .get(`/blocks?blockId=${blocks[0].blockId}`)
          .end((err, res) => {
            if (err) throw err

            expect(res.status).to.be.equal(200)
            done()
          })
      })
    })

    it('should return 404 status', (done) => {
      chai.request(server)
        .get('/blocks?wrong_query=1')
        .end((err, res) => {
          if (err) throw err

          expect(res.status).to.be.equal(404)
          done()
        })
    })
  })

  describe('GET :id', () => {
    it('should return a specific block', (done) => {
      Seed.sampleBlock().then((block) => {
        chai.request(server)
          .get(`/blocks/${block.height}`)
          .end((err, res) => {
            if (err) throw err

            expect(res.status).to.be.equal(200)
            expect(res.body.block.id).to.be.greaterThan(0)
            done()
          })
      }).catch(e => {
        done(e)
      })
    })
  })

  describe('POST block', function () {
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

    it('should create a block', (done) => {
      chai.request(server)
        .post('/blocks')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          message: JSON.stringify({
            blockraw: {
              ver: '1',
              bID: 'testID',
              time: '1545292716',
              hgt: 1,
              txrt: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
              mID: 'TUVSR0VSLTE=',
              cID: 'R0VOVEVTVDE=',
              prevH: 'j29G/wJ0tBSfOuLx4DjMtJmPuVeNrgzqa+5ptxisj5Q=',
              prevbID: 'xGDovtfI32Xl84eQy529S9LT4odVrgHXnvNfjR7YBgc='
            }
          })
        })
        .end(async (err, res) => {
          if (err) throw err

          await Block.sync()
          Block.findOne({
            order: [
              ['createdAt', 'DESC']
            ]
          }).then((block) => {
            expect(res.status).to.be.equal(200)
            expect(block.blockId).to.be.equal('testID')

            done()
          }).catch(e => {
            done(e)
          })
        })
    })

    it('should create a block with transactions and signers', (done) => {
      chai.request(server)
        .post('/blocks')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          message: JSON.stringify({
            blockraw: {
              ver: '1',
              bID: 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw=',
              time: '1545292716',
              hgt: 1,
              cID: 1,
              txrt: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
              prevH: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
              prevbID: 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw',
              mID: 'TUVSR0VSLTE=',
              SSig: [{
                sID: 'MDAwMDAwMTk=',
                sig: 'olMN/ERvmBANJSf2MbscdapS2jblWkD/aiOKC2owTK63Tu1MFicyki7IyM zf4I8eel OAx1ML1eeQcNIfYronIkvBdUgbhSPDb3G3cHpLlKrlZXDYnhjVlwbnpjPgUDSWJKhjXmzC/zGYE/Bp9ptAbz aSvv3hL4UVNr0nzFXx8Yc0tpyE2bMNy0RDMkc5PrF6OOYdkrvPAUPc2XgKXW6WTOC72meRpzJXmrtLjARi1iST2ZtR1VgO6vLyeg6X2NiOjGCT0YDCehDZm71O1wC/z A7wmpswebe0DSIR7FGLnVYsMO7N35/APLAYxH8kYd4CxY4LUXUPyCrLocA1HA=='
              },
              {
                sID: 'MDAwMDAwMTk==',
                sig: 'olMN/ERvmBANJSf2MbscdapS2jblWkD/aiOKC2owTK63Tu1MFicyki7IyM zf4I8eel OAx1ML1eeQcNIfYronIkvBdUgbhSPDb3G3cHpLlKrlZXDYnhjVlwbnpjPgUDSWJKhjXmzC/zGYE/Bp9ptAbz aSvv3hL4UVNr0nzFXx8Yc0tpyE2bMNy0RDMkc5PrF6OOYdkrvPAUPc2XgKXW6WTOC72meRpzJXmrtLjARi1iST2ZtR1VgO6vLyeg6X2NiOjGCT0YDCehDZm71O1wC/z A7wmpswebe0DSIR7FGLnVYsMO7N35/APLAYxH8kYd4CxY4LUXUPyCrLocA1HA==='
              }
              ],
              txids: [
                'dSupNe0rqGpXKdvnQFB3pvtAHxvj3pUsJSGN3UbDWWc=',
                'dSupNe0rqGpXKdvnQFB3pvtAHxvj3pUsJSGN3UbDWWc=='
              ]
            }
          })
        })
        .end((err, res) => {
          if (err) throw err

          Block.findOne({
            where: {
              'blockId': 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw='
            },
            include: [Signer, Transaction]
          }).then((block) => {
            expect(res.status).to.be.equal(200)
            expect(block.Transactions.length).to.be.equal(2)
            expect(block.Signers.length).to.be.equal(2)

            done()
          }).catch(e => {
            done(e)
          })
        })
    })

    it('should not create duplicated block', async () => {
      await sequelize.sync({
        force: true,
        match: /_test$/
      })

      const blockRaw = {
        ver: '1',
        bID: 'testID',
        time: '1545292716',
        hgt: 1,
        txrt: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
        mID: 'TUVSR0VSLTE=',
        cID: 'R0VOVEVTVDE=',
        prevH: 'j29G/wJ0tBSfOuLx4DjMtJmPuVeNrgzqa+5ptxisj5Q=',
        prevbID: 'xGDovtfI32Xl84eQy529S9LT4odVrgHXnvNfjR7YBgc='
      }
      await Block.create({
        version: blockRaw.ver,
        blockId: blockRaw.bID,
        time: new Date(parseInt(`${blockRaw.time}000`)),
        height: blockRaw.hgt,
        txRoot: blockRaw.txrt,
        mergerId: blockRaw.mID,
        chainId: blockRaw.cID,
        prevBlockHash: blockRaw.prevH,
        prevBlockId: blockRaw.prevbID
      })

      chai.request(server)
        .post('/blocks')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          message: JSON.stringify({
            blockraw: blockRaw
          })
        })
        .end(async (err, res) => {
          if (err) throw err

          Block.findAll({
            where: {
              'height': blockRaw.hgt
            }
          }).then((blocks) => {
            expect(res.status).to.be.equal(200)
            expect(blocks.length).to.be.equal(1)
          }).catch(e => {
            throw e
          })
        })
    })
  })
})
