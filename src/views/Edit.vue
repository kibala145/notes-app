<template>
  <div class="edit">
    <div class="page-wrapper">
      <note-form
        :note-title="note && note.title"
        :note-id="note && note.id"
        :note-todos="note && note.todos"
        @submit="onNoteFormSubmit"
        @cancel="onNoteFormCancel"
      />
    </div>
  </div>
</template>

<script>
import store from './../store'
import NoteForm from '@/components/NoteForm'
import {mapActions} from 'vuex'

export default {
  name: 'Edit',
  components: {
    NoteForm
  },
  props: {
    mode: {
      type: String,
      validator: value => ['edit', 'create'].includes(value)
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      note: null
    }
  },
  computed: {
    modalTextSubmit() {
      return this.mode === 'edit' ? 'Save changes?' : 'Save new note?'
    },
    modalTextCancel() {
      return this.mode === 'edit' ? 'All unsaved changes will be lost.\n Still cancel changes?' : 'All filled data will be lost. Cancel adding new note?'
    }
  },
  methods: {
    ...mapActions(['submitNote']),
    initNote() {
      const mode = this.mode,
            id = this.id,
            notes = this.$store.state.notes

      switch(mode) {
        case 'edit':
          this.note = notes.find(note => note.id === id)
          break
        case 'create':
          this.note = {
            title: "",
            todos: []
          }
          break
        default:
          break
      }
    },
    onNoteFormSubmit(value) {
      if(this.compareNotes(value, this.note)) {
        this.$router.push('/')
        return
      }
  
      this.$modal.show({
        text: this.modalTextSubmit, 
        onConfirm: () => {
          this.submitNote(value)
          this.$router.push('/')
        }
      })
    },
    onNoteFormCancel(value) {
      if(this.compareNotes(value, this.note)) {
        this.$router.push('/')
        return
      }

      this.$modal.show({
        text: this.modalTextCancel,
        onConfirm: () => {
          this.$router.push('/')
        }
      })
    },
    compareNotes(value1, value2) {
      const titleNotChanged = value1.title === value2.title,
            todosLengthNotChanged = value1.todos.length === value2.todos.length,
            // Check if properties are the same
            todosAreTheSame = value1.todos.every((todo, index) => (value2.todos[index] && (Object.keys(todo).every(todoProperty => todo[todoProperty] === value2.todos[index][todoProperty]))))
    
      return titleNotChanged && todosLengthNotChanged && todosAreTheSame
    }
  },
  watch: {
    mode(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.initNote()
      }
    }
  },
  beforeMount() {
    this.initNote()
  },
  beforeRouteEnter(to, from, next) {
    if(to.name === 'Edit') {
      const noteEditingId = to.params.id,
            notes = store.state.notes,
            noteEditing = notes.find(note => note.id === noteEditingId)

      if(noteEditing) next()
      else next('/')
    } else 
      next()
  }
}
</script>