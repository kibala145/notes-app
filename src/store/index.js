import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes: [],
    history: null,
    historyPointerIndex: null,
    editNote: null
  },
  mutations: {
    SET_NOTES(state, value) {
      state.notes = value
    },
    SET_EDIT_NOTE(state, value) {
      state.editNote = value
    },
    SET_HISTORY(state, value) {
      state.history = value
    },
    PUSH_HISTORY(state, value) {
      state.history.push(value)
    },
    SLICE_HISTORY_FROM_POINTER_TO_END(state) {
      state.history.splice(state.historyPointerIndex + 1)
    },
    SET_HISTORY_POINTER_INDEX(state, value) {
      state.historyPointerIndex = value
    }
  },
  actions: {
    initNotesFromLocalStorage({commit, dispatch}) {
      const notesString = localStorage.getItem('notes'),
            notesValue = JSON.parse(notesString)
      
      commit('SET_NOTES', notesValue || [])
      dispatch('updateHistory')
    },
    removeNote({dispatch}, id) {
      const notesString = localStorage.getItem('notes'),
            notesArr = JSON.parse(notesString),
            noteToRemoveIndex = notesArr.findIndex(note => note.id === id)

      if(noteToRemoveIndex !== -1) {
        notesArr.splice(noteToRemoveIndex, 1)

        dispatch('setNotes', notesArr)
        dispatch('updateHistory')
      } else {
        console.error('Error happened while')
      }
    },
    createNote({state, dispatch}, value) {
      const notes = [...state.notes],
            newNote = {...value}

      notes.push(newNote)
      dispatch('setNotes', notes)
      dispatch('updateHistory')
    },
    replaceNote({state, dispatch}, {index, value}) {
      const notes = [...state.notes]

      notes.splice(index, 1, value)

      this.dispatch('setNotes', notes)
      dispatch('updateHistory')
    },
    setNotes({commit}, value) {
      commit('SET_NOTES', value)

      const notesStr = JSON.stringify(value)

      localStorage.setItem('notes', notesStr)
    },
    submitNote({state, dispatch}, value) {
      const noteValue = value,
            noteId = noteValue.id,
            noteEditedIndex = state.notes.findIndex(note => note.id === noteId)

      if(noteEditedIndex !== -1) 
        dispatch('replaceNote', {index: noteEditedIndex, value: noteValue})
      else 
        dispatch('createNote', noteValue)
    },
    // Call this action after every notes state prop change
    updateHistory({state, commit}) {
      const notesCopy = state.notes.map(note => ({...note, todos: note.todos.map(todo => ({...todo}))}))

      if(state.historyPointerIndex !== null && state.historyPointerIndex < state.history.length - 1) {
        commit('SLICE_HISTORY_FROM_POINTER_TO_END')
      }

      if(state.history === null)
        commit('SET_HISTORY', [notesCopy])
      else
        commit('PUSH_HISTORY', notesCopy)

      commit('SET_HISTORY_POINTER_INDEX', state.history.length - 1)
    },
    undo({commit, state, dispatch}) {
      const newIndex = Math.max(0, state.historyPointerIndex - 1)

      commit('SET_HISTORY_POINTER_INDEX', newIndex)
      dispatch('setNotes', state.history[newIndex])
    },
    redo({commit, state, dispatch}) {
      const newIndex = Math.min(state.history.length - 1, state.historyPointerIndex + 1)

      commit('SET_HISTORY_POINTER_INDEX', newIndex)
      dispatch('setNotes', state.history[newIndex])
    }
  },
  modules: {
  }
})
