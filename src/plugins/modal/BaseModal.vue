<template>
  <base-transition>
    <div v-show="visible" class="modal">
      <div class="modal-content">
        <p class="text-center fs-22">
          {{text}}
        </p>
        <div class="row">
          <base-button
            ref="cancel-button"
            @click="hide"
            class="mr-8 grow"
            @keydown.right.exact.prevent="$refs['confirm-button'].$el.focus()"
          >
            Cancel
          </base-button>
          <base-button
            ref="confirm-button"
            @click="confirm" 
            accent
            class="grow"
            @keydown.left.exact.prevent="$refs['cancel-button'].$el.focus()"
          >
            Confirm
          </base-button>
        </div>
      </div>
    </div>
  </base-transition>
</template>


<script>
import Modal from './index'

export default {
  data() {
    return {
      visible: false,
      text: '',
      // adding callback function variable
      onConfirm: {}
    }
  },
  methods: {
    hide() {
      this.visible = false;
    },
    confirm() {
      if(typeof this.onConfirm === 'function') {
        this.onConfirm();
        this.hide();
      } else {
        this.hide();
      }
    },
    show(params) {
      this.visible = true;
      this.$nextTick(() => this.$refs['confirm-button'].$el.focus())
      this.text = params.text;
      this.onConfirm = params.onConfirm;
    },
    onKeyDown(e) {
      switch(e.keyCode){
        case 27:
          this.hide()
          e.stopPropagation()
          break
        case 9:
          if(e.shiftKey) this.$refs['cancel-button'].$el.focus()
          else this.$refs['confirm-button'].$el.focus()
          e.preventDefault()
          break
        default:
          break
      }
    },
  },
  beforeMount() {
    // here we need to listen for emited events
    // we declared those events inside our plugin
    Modal.EventBus.$on('show', (params) => {
      this.show(params)
    })
  },
  mounted() {
    this.$el.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style scoped>
.modal {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,.25);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000
}
.modal-content {
  width: min(36rem, 80vw);
  background-color: white;
  box-shadow: 0 0.2rem 0.8rem rgba(0,0,0,.25);
  padding: 1.6rem;
}
</style>