<template>
  <v-container>
    <v-flex>
      <form v-if="!transactionSent" class="form_container__form" v-on:submit.prevent>
        <div class="form_container__input_field">
          <v-text-field
            v-model="name"
            id="form_container__input_field_name"
            :error-messages="nameErrors"
            :counter="10"
            label="닉네임"
            color="#00937B"
            required
            @input="$v.name.$touch"
            @blur="$v.name.$touch"
          ></v-text-field>
        </div>
        <div class="form_container__input_field">
          <v-textarea
            v-model="message"
            id="form_container__input_field_textarea"
            outline
            :error-messages="messageErrors"
            rows="10"
            counter="100"
            label="메세지를 입력해주세요."
            color="#00937B"
            required
            @input="$v.message.$touch"
            @blur="$v.message.$touch"
          ></v-textarea>
        </div>
        <div>
          <v-btn type="submit" color="#00937B" block large @click="sendTransaction">
            <span class="form_container__submit_button_text">메세지 전송</span>
          </v-btn>
        </div>
      </form>
      <div v-if="transactionSent">
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card class="form_container__progress_card">
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ cardTitle }}</div>
                  <span v-if="!receivedBlock" class="left grey--text">12초 정도 소요됩니다.</span>
                </div>
              </v-card-title>
              <div class="form_container__progress_circular">
                <v-progress-linear
                  v-model="progressIndicator"
                  :indeterminate="query"
                  color="#00937B"
                  :width="1"
                ></v-progress-linear>
              </div>

              <v-slide-y-transition>
                <v-card-text v-if="receivedBlock">
                  <nuxt-link
                    style="text-decoration: none"
                    :to="{name: 'transactions-id', params: { id: txId }}"
                  >
                    <v-btn flat color="#00937B">생성된 블록 보기</v-btn>
                  </nuxt-link>
                </v-card-text>
                <v-card-text v-if="isFailedToSendTx">
                  <v-btn flat color="#00937B" @click="resendTransaction">다시 보내기</v-btn>
                </v-card-text>
              </v-slide-y-transition>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </v-container>
</template>

<script>
import axios from '~/plugins/axios'
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

const queryString = require('querystring')

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    message: { required, maxLength: maxLength(100) }
  },
  name: 'new',
  data () {
    return {
      name: '',
      message: '',
      progressIndicator: 0,
      transactionSent: false,
      progressChecker: 0,
      msgHeaderChecker: 0,
      receivedBlock: false,
      query: false,
      cardTitle: 'Block 생성 대기중입니다.',
      requestTransactionId: '',
      blockId: '',
      txId: '',
      requestData: null,
      isFailedToSendTx: false
    }
  },
  methods: {
    sendTransaction: function () {
      this.$v.$touch()
      if (this.nameErrors.length > 0) {
        alert('닉네임이 10자를 초과했습니다.')
        return
      }
      if (this.messageErrors.length > 0) {
        alert('메세지가 100자를 초과했습니다.')
        return
      }

      const textareaElem = document.getElementById(
        'form_container__input_field_textarea'
      )
      const nameElem = document.getElementById(
        'form_container__input_field_name'
      )
      this.requestData = {
        requesterId: nameElem.value,
        message: textareaElem.value
      }

      axios.defaults.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      axios
        .post(
          '/api/transactions',
          queryString.stringify(this.requestData)
        )
        .then(res => {
          if (res.status === 200) {
            this.transactionSent = true
            this.queryAndIndeterminate()

            this.requestTransactionId = res.data.transactionId
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    resendTransaction: function () {
      this.isFailedToSendTx = false

      axios.defaults.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      axios
        .post(
          '/api/transactions',
          queryString.stringify(this.requestData)
        )
        .then(res => {
          if (res.status === 200) {
            this.queryAndIndeterminate()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    queryAndIndeterminate: function () {
      this.query = true
      this.progressIndicator = 0

      setTimeout(() => {
        if (this.requestTransactionId.length > 0) {
          this.msgHeaderChecker = setInterval(() => {
            axios
              .get(
                `/api/transactions/?${queryString.stringify({
                  transactionId: this.requestTransactionId
                })}`
              )
              .then(res => {
                if (res.status === 200 && res.data !== null) {
                  this.progressIndicator = 100
                  this.receivedBlock = true
                  this.blockId = res.data[0].blockId
                  this.txId = res.data[0].id
                  this.cardTitle = 'Block이 생성되었습니다.'
                  this.requestData = null
                }
              })
              .catch(e => {
                console.log(e)
              })
          }, 2000)
        }

        this.progressChecker = setInterval(() => {
          if (this.progressIndicator === 100) {
            clearInterval(this.progressChecker)
            clearInterval(this.msgHeaderChecker)
            if (!this.receivedBlock) {
              this.cardTitle = 'Block이 생성되지 않았습니다.'
              this.isFailedToSendTx = true
            } else {
              this.isFailedToSendTx = false
            }

            return
          }

          this.progressIndicator += 10
        }, 1000)
        this.query = false
      }, 4000)
    }
  },
  computed: {
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength &&
        errors.push('닉네임은 반드시 10자 이하여야 합니다')
      !this.$v.name.required && errors.push('닉네임을 입력해주세요!')
      return errors
    },
    messageErrors () {
      const errors = []
      if (!this.$v.message.$dirty) return errors
      !this.$v.message.maxLength &&
        errors.push('메세지는 반드시 100자 이하여야 합니다')
      !this.$v.message.required && errors.push('메세지를 입력해주세요!')
      return errors
    }
  },
  beforeDestroy () {
    clearInterval(this.progressChecker)
    clearInterval(this.msgHeaderChecker)
  }
}
</script>

<style lang="scss" scoped>
$green: #00937b;

.form_container__form {
  font-size: 16px;
  padding: 30px 30px;
  border-radius: 4px;
  margin: 50px auto;
  background-color: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
}

.form_container__input_field {
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin: 1.5rem 0 1.5rem 0;
}

.form_container__submit_button_text {
  font-size: 1.5rem;
  color: #fff;
  font-weight: bold;
}

.form_container__progress_circular {
  width: 97%;
  margin: 0 auto;
}

.form_container__progress_card {
  height: 200px;
}
</style>
