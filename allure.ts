import { defineConfig } from "allure";
 
export default defineConfig({

  name: "Sakani Automation Report",

  output: "./allure-report",

  plugins: {

    awesome: {

      options: {

        singleFile: true,

        reportLanguage: "en",

      },

    },

  },

});
 