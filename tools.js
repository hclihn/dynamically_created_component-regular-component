/*eslint no-unused-vars: ["error", { "vars": "local" }] */
/*global set_style_mixin */
/*exported set_style_mixin */

var set_style_mixin = {
  mounted() {
    if (this.$options.styles) {
      console.log(`Added styles to Component ${this.$options.name}`);
      this.$el.insertAdjacentHTML(
        "beforebegin",
        `<style>${this.$options.styles}</style>`
      );
    }
  }
};
