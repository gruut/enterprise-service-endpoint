process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')

const {expect} = chai
const server = require('../../api/index').handler
const {Block} = require('../../models')

chai.use(chaiHttp)

describe('GET blocks', function () {
  it('should return blocks', (done) => {
    Block.create({
      version: 1,
      blockId: 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw=',
      time: new Date(),
      height: 1,
      txRoot: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
      mergerId: 'TUVSR0VSLTE=',
      mergerSignature: '1'
    }).then(() => {
      chai.request(server)
        .get('/blocks')
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          expect(res.body.length).to.be.greaterThan(0)
          done()
        })
    }).catch(e => {
      done(e)
    })
  })
})

  it('should find and return blocks', (done) => {
    Block.create({
      version: 1,
      blockId: 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw=',
      time: new Date(),
      height: 1,
      txRoot: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
      mergerId: 'TUVSR0VSLTE=',
      mergerSignature: '1'
    }).then(() => {
      chai.request(server)
        .get('/blocks/?height=1')
        .end((err, res) => {
          expect(res.status).to.be.equal(200)
          expect(res.body.length).to.be.greaterThan(0)
          done()
        })
    }).catch(e => {
      done(e)
    })
  })

  it('should return a specific block', (done) => {
    Block.create({
      version: 1,
      blockId: 'xo2a8TIhzOYE1aUZMta7lGJSlCdgHoG9eyrldLbq6Nw=',
      time: new Date(),
      height: 1,
      txRoot: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
      mergerId: 'TUVSR0VSLTE=',
      mergerSignature: '1'
    }).then((block) => {
      chai.request(server)
        .get(`/blocks/${block.id}`)
        .end((err, res) => {
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
  it('should create a block', (done) => {
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
            txrt: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
            mID: 'TUVSR0VSLTE=',
            mergerSignature: '1'
          }
        })
      })
      .end((err, res) => {
        Block.findAll({
          order: [
            ['time', 'DESC']
          ]
        }).then((blocks) => {
          const block = blocks[0]
          expect(block.id).to.be.greaterThan(0)
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
            txrt: 'dCc8MsxGDMpc1QEKmt/7EK8l8IcOe9owKwSwCenFvw4=',
            mID: 'TUVSR0VSLTE=',
            mergerSignature: '1',
            SSig: [
              {
                sID: 'MDAwMDAwMTk=',
                sig: 'olMN/ERvmBANJSf2MbscdapS2jblWkD/aiOKC2owTK63Tu1MFicyki7IyM zf4I8eel OAx1ML1eeQcNIfYronIkvBdUgbhSPDb3G3cHpLlKrlZXDYnhjVlwbnpjPgUDSWJKhjXmzC/zGYE/Bp9ptAbz aSvv3hL4UVNr0nzFXx8Yc0tpyE2bMNy0RDMkc5PrF6OOYdkrvPAUPc2XgKXW6WTOC72meRpzJXmrtLjARi1iST2ZtR1VgO6vLyeg6X2NiOjGCT0YDCehDZm71O1wC/z A7wmpswebe0DSIR7FGLnVYsMO7N35/APLAYxH8kYd4CxY4LUXUPyCrLocA1HA=='
              }
            ],
            txids: [
              'dSupNe0rqGpXKdvnQFB3pvtAHxvj3pUsJSGN3UbDWWc='
            ]
          }
        })
      })
      .end((err, res) => {
        Block.findAll({
          order: [
            ['time', 'DESC']
          ]
        }).then((blocks) => {
          const block = blocks[0]
          done()
        }).catch(e => {
          done(e)
        })
      })
  })
})
