import Vue from 'vue'

export default (options) => {
  const Elemt = Vue.extend(options.childs)
  const vmElemt = new Elemt({
    el: document.createElement('div'),
    // props:{
    //     ...defaultState,
    //     ...options
    // },
    data: {
      data: options
    },
    methods: {
      _close(e) {
        this.$mount().$el.remove()
        options.closeDialog(e)
      }
    }
  })

  document.body.appendChild(vmElemt.$mount().$el)
  // document.getElementById('app').appendChild(vmElemt.$mount().$el)
}
