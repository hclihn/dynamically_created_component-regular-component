/*global Vue Vuetify */
new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    idx: 0,
    isActive: true,
    styleObj: { fontSize: "12px" },
    colors: ["green", "red", "blue", "pink", "yellow"],
    values: [],
    comps: [],
    test_str: "This is an example.",
    name: "John",
    html1: `
    <div>Hello {{name}}! {{$options.test_me}}</div>
    <div><v-btn @click="say_hi"><v-icon left>mdi-pencil</v-icon> Edit
    </v-btn></div><br/>
    <p><v-btn>B</v-btn> Computed: {{test}}</p>
    `,
    html2: `
    <div>Method: {{get_name()}} {{$options.test_me}}</div>
    <p>D <v-btn text small color="primary" @click="say_hi">Primary</v-btn></p>
    <v-text-field label="User Name" v-model="name"></v-text-field>
    `,
    html3: `<div>Name: {{name}}</div>`
  },
  test_me: 123,
  computed: {
    test() {
      return `My name is ${this.name}`;
    }
  },
  provide: {
    foo: "bar"
  },
  methods: {
    say_hi() {
      alert(`Hi, there! ${this.name}.`);
      this.name = this.name === "Mary" ? "John" : "Mary";
      this.$nextTick(function () {
        console.log("nextTick", this.name); // => 'updated'
      });
    },
    get_name() {
      return this.name;
    },
    get_color(i) {
      return this.colors[this.idx % this.colors.length];
    },
    c_change(data, event) {
      console.log("change", event, data);
      //his.$set(this.values[i], "data", t);
    },
    add() {
      const i = this.idx;
      const c = this.get_color(i);
      const cls = Vue.component("test-comp");
      this.values.push({ data: `This color is ${c}. Edit me!`, idx: i });
      var ins = new cls({
        propsData: {
          name: `Test Step #${i + 1}`,
          color: c,
          text: this.values[i].data,
          readOnly: i % 2 === 0
        }
      });
      this.idx++;
      ins.$on("change", this.c_change);
      ins.$mount(); // pass nothing
      //         console.log(this.$refs)
      this.$refs.container.appendChild(ins.$el);
    },
    add_tmpl() {
      const i = this.idx;
      const c = this.get_color(i);
      this.values.push({ data: `This color is ${c}. Edit me!`, idx: i });
      this.comps.push(`<test-comp color="${c}"
            name="Tmpl Test Step #${i + 1}"
            v-bind:class="{ active: isActive}"
            v-bind:style="styleObj"
            v-model="values[${i}].data"
          ></test-comp>`);
      this.idx++;
    }
  }
});
