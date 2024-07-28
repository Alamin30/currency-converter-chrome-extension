<template>
  <div>
    <h1>Currency Converter</h1>
    <form @submit.prevent="convertCurrency">
      <label for="rate">Conversion Rate (USD to BDT):</label>
      <input type="number" v-model="rate" id="rate" required />
      <button type="submit">Convert</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rate: 1
    };
  },
  methods: {
    convertCurrency() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'convertCurrency',
          rate: this.rate
        });
      });
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 10px;
}
form {
  display: flex;
  flex-direction: column;
}
label {
  margin-top: 10px;
}
button {
  margin-top: 20px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
