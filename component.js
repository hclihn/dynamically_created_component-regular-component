/*global Vue set_style_mixin */
Vue.component("test-comp", {
  mixins: [set_style_mixin],
  model: {
    prop: "text",
    event: "change"
  },
  props: {
    color: {
      type: String,
      default: "blue"
    },
    text: {
      type: String,
      default: "Enter text here"
    },
    name: {
      type: String,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      canEdit: false,
      myTemplate: `<div class="test-comp" :style="{color: color}">
      <div style="color: black;">{{name}}:&nbsp;
      <span v-if="readOnly"><v-icon size="18px">mdi-pencil-off</v-icon></span>
      <span v-else><v-btn icon x-small color="blue" 
      v-on:click="canEdit = !canEdit" :disabled="canEdit">
      <v-icon>mdi-pencil</v-icon></v-btn></span>
      </div>
      <div :contentEditable="canEdit" @blur="onEdit" v-text="text" class="editme" 
        @keydown.enter="endEdit"></div>
    </div>`
    };
  },
  methods: {
    onEdit(evt) {
      var src = evt.target.textContent;
      this.canEdit = !this.canEdit;
      this.$emit("change", src);
    },
    endEdit(evt) {
      evt.target.blur();
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  template: `
    <v-template :template="myTemplate" parent-name="test-comp" :static="readOnly"></v-template>
  `,
  styles: `
  .test-comp {
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px;
    margin: 2px;
  }
  .test-comp .editme {
    padding: 2px;
    border: 1px solid #ccc;
    margin: 2px;
  }
  `
});

Vue.component("v-template", {
  //functional: true,
  props: {
    template: {
      type: String,
      required: true,
      validate: (v) => v.trim() !== ""
    },
    parentName: {
      type: String,
      default: "",
      validate: (v) => v.trim() !== ""
    },
    static: {
      type: Boolean,
      default: false
    },
    special: {
      type: [String, Array],
      validate: (v) => {
        if (typeof v === "string") {
          return v.trim() !== "";
        }
        return v.every((e) => typeof e === "string" && e.trim() !== "");
      }
    }
  },
  data() {
    return {
      rendered: null
    };
  },
  render(h) {
    if (this.static && this.rendered) {
      console.log("static contine");
      return this.rendered;
    }
    console.log(this.$parent);
    let p = this.$root;
    if (this.parentName) {
      p = this.$parent;
      while (p && p.$options.name !== this.parentName) p = p.$parent;
      if (!p) p = this.$root;
    }
    console.log(p);
    let opts = {
      props: p.$options._propKeys,
      data() {
        return p.$data;
      },
      beforeCreate() {
        this.$createElement = h;
      },
      //model: p.$options.model,
      components: p.$options.components,
      computed: p.$options.computed,
      methods: p.$options.methods,
      filters: p.$options.filters,
      directives: p.$options.directives,
      provide: p._provided,
      template: `<div>${this.template}</div>`
    };
    if (this.special) {
      console.log("special", this.special);
      if (Array.isArray(this.special)) {
        this.special.forEach((n) => {
          opts[n] = p.$options[n];
        });
      } else {
        opts[this.special] = p.$options[this.special];
      }
    }
    let data = {
      on: Object.assign({}, p.$attrs, p.$listeners),
      nativeOn: Object.assign({}, p.$attrs, p.$listeners),
      attrs: p.$attrs
    };

    if (typeof p.$props !== "undefined") {
      data.props = p.$props;
      //opts.props = Object.keys(ctx.parent.$options.propsData);
    }
    if (this.static) {
      console.log("static first");
      console.log(opts, data);
      this.rendered = h(opts, data);
      return this.rendered;
    }
    console.log(opts, data);
    return h(opts, data);
  }
});
