<template>
  <div class="form_container">
    <div class="form_container__error_message">
      <p v-show="!email.valid">유효한 이메일 주소를 입력해주세요.</p>
    </div>
    <form class="form_container__form">
      <div class="form_container__input_field">
        <label class="form_container__form_label" for="name">이름</label>
        <input type="text" name="name" id="name" class="form_container__form_input" v-model="name" required>
      </div>
      <div class="form_container__input_field">
        <label class="form_container__form_label" for="email">이메일</label>
        <input type="text" name="email" id="email" class="form_container__form_input" v-model="email" required>
      </div>
      <div class="form_container__input_field">
        <label class="form_container__form_label" for="file">파일 업로드</label>
        <input type="file" name="file" id="file" class="form_container__form_input" required>
      </div>
      <div class="form_container__button_container">
        <button class="form_container__submit_button">
          제출
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'new',
    data () {
      return {
        name: '',
        email: {
          value: '',
          valid: true
        }
      }
    },
    methods: {
      isEmail: (address) => {
        // Regular expression from W3C HTML5.2 input specification:
        // https://www.w3.org/TR/html/sec-forms.html#email-state-typeemail
        // eslint-disable-next-line no-useless-escape
        const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        return emailRegExp.test(address)
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

  .form_container__form_label {
    font-size: 1.3rem;
    font-family: "Apple SD Gothic Neo",sans-serif;
    color: #7f828b;
    margin-bottom: 5px;
  }

  .form_container__form_input {
    padding: 12px;
    border: 1px solid #cfd9db;
    background-color: #ffffff;
    border-radius: 0.25em;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
  }

  .form_container__button_container {
    display: block;
    text-decoration: none;
    margin-top: 2rem;
    text-align: center;
  }

  .form_container__button_container:hover {
    background-color: $green;
    color: #ffffff;
    cursor: pointer;
  }

  .form_container__submit_button {
    outline: none;
    width: 100%;
    height: 40px;
    text-align: center;
    background: #fff;
    border: 2px solid $green;
    color: $green;
    letter-spacing: 1px;
    text-shadow: none;
    font: {
      size: 1rem;
      weight: bold;
    }
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      color: white;
      background: $green;
    }

    &:active {
      //letter-spacing: 2px;
      letter-spacing: 2px;
    }
  }
</style>
