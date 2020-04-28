<template>
  <div id="app">
    <h1 class="text-center">Notes Application</h1>
    <base-transition :name="transitionName">
      <router-view/>
    </base-transition>
    <base-modal />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      transitionName: 'fade'
    }
  },
  methods: {
    ...mapActions([
      'initNotesFromLocalStorage'
    ])
  },
  watch: {
    // Watching route to change between transitions
    '$route' (to, from) {
      const toDepth = to.path.split('/').length,
            fromDepth = from.path.split('/').length

      this.transitionName = toDepth > fromDepth ? 'slide-left' : 'slide-right'
    }
  },
  beforeMount() {
    this.initNotesFromLocalStorage()
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-bottom: 3.2rem;
}
</style>
