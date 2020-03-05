Vue.component("calculator", {
  template: `
      <div>
        <div class="row">
            <form @submit.prevent="onSubmit" class="col s12">
            <h1>How it works</h1>
            <p class="push-s5" >Do you wanna know when you should got to bed so you will have enought sleep? Just write what time you wanna wake up.
  
                <div class="row">
                    <div class="input-field col s6">
                        <input v-model.number="hour" v-on:change="hideResult" id="hourId" type="number" min="0" max="23" class="validate">
                        <label for="hourId">Hour</label>
                    </div>
                    <div class="input-field col s6">
                        <input v-model.number="minute" v-on:change="hideResult" id="minuteId" type="number" min="0" max="59" class="validate">
                        <label for="minuteId">Minute</label>
                    </div>
                </div>
                <input type="submit" id="btn" value="Calculate" class="waves-effect waves-light btn-large">
            </form>
        </div>          
      </div>
      `,
  data() {
    const date = new Date();
    return {
      hour: date.getHours(),
      minute: date.getMinutes()
    };
  },
  methods: {
    onSubmit() {
      if (this.hour == null || this.minute == null) {
        console.log('error')
        return;
      }

      let result = { hour: 0, minute: 0 };
      let hourMinusTime = 0;

      if (this.minute < 30) {
        const minusMinutes = this.minute - 30;
        result.minute = 60 + minusMinutes;
        hourMinusTime = this.hour - 8;
      } else {
        result.minute = this.minute - 30;
        hourMinusTime = this.hour - 7;
      }

      if (hourMinusTime < 0) {
        result.hour = 24 + hourMinusTime;
      } else {
        result.hour = hourMinusTime;
      }

      if (result.hour < 10) result.hour = "0" + result.hour;
      if (result.minute < 10) result.minute = "0" + result.minute;

      this.$emit("return-result", result);
    },
    hideResult() {
      this.$emit("hide-result")
    }
  }
});

const app = new Vue({
  el: "#app",
  data: {
    name: "What time go to bed",
    result: null
  },
  methods: {
    showResult(result) {
      this.result = result;
    },
    hideResult() {
      this.result = null;
    }
  }
});
