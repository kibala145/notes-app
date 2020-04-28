<template>
  <div class="note-card">
    <div class="note-card__note-card-header note-card-header">
      <div class="note-card-header__note-card-header-title-wrapper">
        <span class="note-card-header__note-card-header-title-text">{{note.title}}</span>
      </div>
      <div class="note-card-header__note-card-header-actions">
        <base-button
          v-for="actionName in actions"
          :key="actionName + '-action-button'"
          @click="onActionClick(actionName)"
          class="ml-8" 
          gray
        >
          <base-icon :type="actionName"/>
        </base-button>
      </div>
    </div>
    <div class="pt-8 pb-8 pl-8 pr-8">
      <template 
        v-if="note.todos && note.todos.length"
        class="note-card__todos"  
      >
        <base-checkbox
          v-for="todo in note.todos"
          :key="todo.id"
          v-model="todo.value"
          class="flex mb-8"
          disabled
        >
          <span>{{todo.title}}</span>
        </base-checkbox>
      </template>
      <div 
        v-if="note.todos.length > 3"
        class="ml-32"
      >
        ...
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NoteCard',
  props: {
    note: Object,
    actions: {
      type: Array,
      default: () => ['edit', 'remove']
    }
  },
  methods: {
    onActionClick(actionName) {
      this.$emit(`${actionName}-note`, this.note.id)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';

.note-card {
  background-color: $color-gray-3;
  box-shadow: 0 0.2rem 0.8rem rgba(0,0,0,.25);
  min-height: 20rem;
  overflow: hidden;
}
.note-card-header {
  position: relative; 
  font-size: 2rem;
  height: 5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  color: $color-gray-1;
  &__note-card-header-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    @include md {
      // next line to disable tab navigation throught buttons
      button {
        visibility: hidden;
      }
      height: 100%;
      width: 100%;
      background-color: $color-green;
      transition: transform .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
  &__note-card-header-title-wrapper {
    height: 100%;
    max-width: calc(100% - 8rem);
    display: flex;
    flex-direction: row;
    align-items: center;
    @include md {
      background-color: $color-gray-2;
      position: absolute;
      overflow: hidden;
      left: 0;
      right: 0;
      max-width: 100%;
      transition: right .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
  &__note-card-header-title-text {
    padding-left: .8rem;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  @include md {
    &:hover &__note-card-header-actions {
      button {
        visibility: visible;
      }
    }
    &:hover &__note-card-header-title-wrapper {
      right: 100%;
    }
  }
}
</style>