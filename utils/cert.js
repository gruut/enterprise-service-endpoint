const { Key, sequelize: { Op } } = require('../models')
const KeyUtils = require('jsrsasign')
const axios = require('axios')

class Cert {
  static async generateKeyPair () {
    let key = await Key.findOne({
      where: {
        id: {[Op.gt]: 0}
      }
    })

    if (!key) {
      const ecKeypair = KeyUtils.KEYUTIL.generateKeypair('EC', 'secp256r1')

      const csri = new KeyUtils.asn1.csr.CertificationRequestInfo()

      const CN = Buffer.from(process.env.MY_ID).toString('base64')
      csri.setSubjectByParam({str: `/C=KR/O=Gruut Networks/CN=${CN}/E=contact@gruut.net`})
      csri.setSubjectPublicKeyByGetKey(ecKeypair.pubKeyObj)

      const csr = new KeyUtils.asn1.csr.CertificationRequest({csrinfo: csri})
      csr.sign('SHA256withECDSA', ecKeypair.prvKeyObj)

      const csrPem = csr.getPEMString()

      const reqAddress = `http://${process.env.GA_ADDRESS}:${process.env.GA_PORT}/v1/users`
      axios.post(reqAddress,
        {
          phone: '',
          csr: csrPem,
          role: 300,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ).then((res) => {
        if (res.status === 200) {
          Key.create({
            name: process.env.MY_ID,
            certificatePem: res.data.pem,
            privateKeyPem: KeyUtils.KEYUTIL.getPEM(ecKeypair.prvKeyObj, 'PKCS8PRV')
          })
        }
      }).catch((err) => {
        // TODO: log
        console.log(err)
        throw err
      })
    }
  }
}

module.exports = Cert
