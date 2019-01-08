<template>
  <div class="form_container">
    <form class="form_container__form" v-on:submit.prevent>
      <div class="form_container__input_field">
        <v-text-field
                v-model="name"
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
        <v-btn
                type="submit"
                color="#00937B"
                block
                large
                @click="sendTransaction"
        >
          <span class="form_container__submit_button_text">메세지 전송</span>
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
  import axios from '~/plugins/axios'
  import {validationMixin} from 'vuelidate'
  import {required, maxLength} from 'vuelidate/lib/validators'

  const queryString = require('querystring')

  export default {
    mixins: [validationMixin],

    validations: {
      name: {required, maxLength: maxLength(10)},
      message: {required, maxLength: maxLength(100)}
    },
    name: 'new',
    data () {
      return {
        name: '',
        message: ''
      }
    },
    methods: {
      sendTransaction: function () {
        this.$v.$touch()
        if (this.nameErrors.length > 0) {
          return
        }
        if (this.messageErrors.length > 0) {
          return
        }

        const textareaElem = document.getElementById('form_container__input_field_textarea')
        axios.defaults.headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        axios.post('/api/transactions',
          queryString.stringify({
            message: textareaElem.value
          })
        ).then((res) => {
          if (res.status === 200) {
            alert('요청이 처리되었습니다.')
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('닉네임은 반드시 10자 이하여야 합니다')
        !this.$v.name.required && errors.push('닉네임을 입력해주세요!')
        return errors
      },
      messageErrors () {
        const errors = []
        if (!this.$v.message.$dirty) return errors
        !this.$v.message.maxLength && errors.push('메세지는 반드시 100자 이하여야 합니다')
        !this.$v.message.required && errors.push('메세지를 입력해주세요!')
        return errors
      }
    }
  }
</script>

<style lang="scss" scoped>
  $green: #00937B;
  
  .form_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #ffffff;
    min-height: 500px;
    padding-bottom: 2rem;
  }
  
  .form_container__form {
    font-size: 16px;
    width: 40%;
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
</style>
