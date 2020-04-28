<template>
  <div>
    <div class="row-1 mb-8">
      <base-button
        ref="cancel-button"
        class="grow mr-8" 
        @click="onCancel"
        @keydown.right.exact.prevent="$refs['submit-button'].$el.focus()"
        @keydown.down.exact.prevent="$refs['note-input'].focus()"
      >
        Cancel
      </base-button>
      <base-button
        ref="submit-button"
        type="submit" 
        :disabled="!form.title" 
        class="grow ml-8" 
        @click="onSubmit" 
        accent
        @keydown.left.exact.prevent="$refs['cancel-button'].$el.focus()"
        @keydown.down.exact.prevent="$refs['add-todo-button'].focus()"
      >
        Submit
      </base-button>
    </div>
    <div class="note-form-wrapper">
      <base-input
        ref="note-input"
        type="text"
        v-model="form.title"
        placeholder="Note title"
        label-text="Note title"
        class="mb-8"
        @keydown.enter.exact.prevent="$refs['add-todo-button'].$el.focus()"
        @keydown.up.exact.prevent="$refs['cancel-button'].$el.focus()"
        @keydown.enter.meta.exact="onSubmit"
        @keydown.enter.ctrl.exact="onSubmit"
      />
      <div>
        <div class="button-add-wrapper">
          <base-button
            ref="add-todo-button"
            @click.prevent="addTodo" 
            gray
            @keydown.left.exact.prevent="$refs['note-input'].focus()"
            @keydown.up.exact.prevent="$refs['submit-button'].$el.focus()"
          >
            <base-icon type="plus"/>
            <span class="ml-8">Add todo</span>
          </base-button>
        </div>
        <div class="todos-wrapper">
          <template v-if="!form.todos || !form.todos.length">No todos yet</template>
          <div
            v-for="(todo, index) in form.todos"
            :key="'todo--' + todo.id" 
            class="row-1 mb-8"
          >
            <template>
              <base-checkbox
                v-model="todo.value"
              />
              <base-input
                :ref="'todo-input--' + index"
                class="grow"
                :key="'base-input--' + todo.id"
                type="text"
                v-model="todo.title"
                placeholder="Todo title"
                label-text="Todo title"
                @keydown.enter.exact="addTodo"
                @keydown.enter.meta.exact="onSubmit"
                @keydown.enter.ctrl.exact="onSubmit"
                @keydown.up.exact.prevent="() => {if(index !== 0) $refs['todo-input--' + (index - 1)][0].focus()}"
                @keydown.down.exact.prevent="() => {if(index !== form.todos.length - 1) $refs['todo-input--' + (index + 1)][0].focus()}"
              />
              <base-button 
                :key="'base-button--' + todo.id" 
                @click="form.todos.splice(index, 1)"
                gray
                class="ml-8 button-remove"
              >
                <base-icon type="close"/>
              </base-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {uidGenerator} from '@/utils/'

export default {
  name: "NoteForm",
  props: {
    noteId: {
      type: String,
      default: ''
    },
    noteTitle: {
      type: String,
      default: ''
    },
    noteTodos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        title: '',
        todos: []
      }
    }
  },
  methods: {
    initForm() {
      const uid = this.noteId ? this.noteId : uidGenerator()

      this.form = {
        id: uid,
        title: this.noteTitle,
        todos: this.noteTodos.map(todo => ({...todo}))
      }
    },
    onSubmit() {
      const todos = this.form.todos.filter(todo => todo.title),
            data = {
              ...this.form,
              todos
            }

      this.$emit('submit', data)
    },
    onCancel() {
      const todos = this.form.todos.filter(todo => todo.title),
            data = {
              ...this.form,
              todos
            }

      this.$emit('cancel', data)
    },
    addTodo() {
      this.form.todos.push({
        id: uidGenerator(),
        title: '',
        value: false
      })
      this.$nextTick(() => {
        const index = this.form.todos.length - 1

        this.$refs['todo-input--' + index][0].focus()
      })
    },
    onKeyDown(e) {
      if(e.keyCode === 27) this.onCancel()
    }
  },
  beforeMount() {
    this.initForm()
  },
  mounted() {
    this.$el.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_mixins.scss';
@import '@/assets/scss/_variables.scss';

.note-form-wrapper {
  @include md {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.2rem;
  }
}
.button-remove {
  svg {
    transition: transform .8s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &:focus, &:hover {
    svg {
      transform: rotate(180deg);
    }
  }
}
.button-add-wrapper {
  @include row;
  justify-content: flex-start;
  margin-bottom: 1.6rem;
  margin-top: 1rem;
  flex-grow: 1;
  button {
    flex-grow: 1;
    @include md {
      flex-grow: 0;
    }
  }
}
.todos-wrapper {
  padding: 1.6rem;
  border: .1rem dashed $color-gray-3;
}
</style>