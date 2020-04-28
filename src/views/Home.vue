<template>
  <div class="home">
    <div class="page-wrapper">
      <div v-if="notes && notes.length" class="row mb-8">
        <base-button
          ref="undo-button"
          @click="undoHandler"
          class="mr-8" 
          gray
          :disabled="undoDisabled"
          @keydown.right.exact.prevent="$refs['redo-button'].$el.focus()"
          @keydown.down.exact.prevent="$refs['add-note-button'].$el.focus()"
        >
          <base-icon :fill="undoDisabled ? '#BDBDBD' : '#4F4F4F'" type="left"/>
        </base-button>
        <base-button
          ref="redo-button"
          @click="redoHandler"
          gray
          :disabled="redoDisabled"
          @keydown.left.exact.prevent="$refs['redo-button'].$el.focus()"
          @keydown.down.exact.prevent="$refs['add-note-button'].$el.focus()"
        >
          <base-icon :fill="redoDisabled ? '#BDBDBD' : '#4F4F4F'" type="right"/>
        </base-button>
      </div>
      <base-button
        ref="add-note-button"
        @click="$router.push('/create/')"
        class="width-100 mb-8"
        accent
        @keydown.up.exact.prevent="$refs['undo-button'].disabled ? $refs['redo-button'].$el.focus() : $refs['undo-button'].$el.focus()"
      >
        <!-- In case of simplicity using svg inline -->
        <base-icon height="1.8rem" width="1.8rem" type="create-note" fill="white" class="mr-8"/>
        Create note
      </base-button>
      <div v-if="notes && notes.length" class="pl-0 home__note-cards-wrapper">
        <note-card 
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @edit-note="editNote"
          @remove-note="removeNoteHandler"
          class="home__note-card"
        />
      </div>
      <template v-else>
        <p class="text-center">You don't have any notes, tap button above to create some.</p>
        <hr>
        <ul>
          Some shortcuts:
          <li>Tap <b>"Esc"</b> to close popup</li>
          <li>While on edit page, focusing on any element, tap <b>"Esc"</b> to cancel edit(or create)</li>
          <li>While on edit page, focusing on note title input, tap <b>"Enter"</b> to focus "Add todo" button</li>
          <li>While on edit page, focusing on todo title input, tap <b>"Enter"</b> to add todo and quickly jump to another one</li>
          <li>While on edit page, focusing on note title input or todo title input, tap <b>"CMD" + "Enter" or "Ctrl" + "Enter"</b> to submit edit(or create)</li>
          <li>While on home page, use <b>"CMD" + "z" or "Ctrl" + "z"</b> to revert last change, and use <b>"CMD" + "Shift" + "z" or "Ctrl" + "Shift" + "z"</b> to reverse your last revert</li>
          <li>Also feel free to use arrow buttons for navigation!</li>
        </ul>
      </template>
      <!-- <Note /> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NoteCard from '@/components/NoteCard.vue'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
    NoteCard
  },
  computed: {
    ...mapState({
      notes: state => state.notes,
      undoDisabled: state => !(state.historyPointerIndex),
      redoDisabled: state => !(state.history && state.historyPointerIndex !== null && state.historyPointerIndex !== state.history.length - 1),
    })
  },
  methods: {
    ...mapActions([
      'removeNote',
      'undo',
      'redo'
    ]),
    editNote(id) {
      this.$router.push(`edit/${id}/`)
    },
    removeNoteHandler(id) {
      this.$modal.show({text: 'Remove note?', onConfirm: () => this.removeNote(id)})
    },
    undoHandler() {
      this.$modal.show({text: "Undo last modification?", onConfirm: () => this.undo()})
    },
    redoHandler() {
      this.$modal.show({text: "Redo last modification?", onConfirm: () => this.redo()})
    },
    onKeyDown(e) {
      const ctrlOrMeta = e.metaKey || e.ctrlKey,
            shiftKey = e.shiftKey,
            zKey = Boolean(e.keyCode === 90)

      if(ctrlOrMeta && zKey && !shiftKey && !this.undoDisabled) {
        this.undoHandler()
      }
      if(ctrlOrMeta && zKey && shiftKey && !this.redoDisabled) {
        this.redoHandler()
      }
    }
  },
  mounted() {
    document.body.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy() {
    document.body.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.home {
  &__note-cards-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1.2rem;
    @media screen and (min-width: $screen-width-1) {
      grid-template-columns: 49% 49%;
      column-gap: 2%;
    }
    @media screen and (min-width: $screen-width-2) {
      grid-template-columns: 32% 32% 32%;
      column-gap: 2%;
    }
    @media screen and (min-width: $screen-width-3) {
      grid-template-columns: 24% 24% 24% 24%;
      column-gap: 1%;
    }
  }
}
.home__note-card {
  &:first-child {
    margin-top: 0;
  }
  flex-shrink: 0;
}
</style>