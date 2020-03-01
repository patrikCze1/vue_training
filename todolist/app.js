Vue.component("modal", {
  props: {
    value: {
      required: true
    }
  },
  template: `
    <transition name="modal-tr"
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp">

        <div v-if="value" id="myModal" class="modal">
            <div class="modal-content">
                <span v-on:click="close" class="close">&times;</span>
                <p>Before you can delete todo you have to allow this action.</p>
            </div>
        </div>
    </transition>
    `,
  methods: {
    close() {
      this.$emit("close-modal");
    }
  }
});

Vue.component("todo-item", {
  template: `
  <div>
    <p>
        Allow delete
        <input type="checkbox" v-model="canDelete" id="switch" /><label for="switch">Toggle</label>
    </p>
    
    <transition-group tag="ul" name="todos">
        <li v-for="(todo, index) in todos" :key="index" @mouseover="highlight(todo.category, index)" @mouseleave="mouseleave" :class="[todo.category, todo.style]" v-on:click="deleteTodo(index)" class="todoItem">
            {{ todo.todo }}
        </li>
    </transition-group>

    <hr v-if="todos.length">
    <p v-else>No todos, create new one.</p>
    
    <todo-form @todo-submitted="addTodo"></todo-form>
  </div>
  `,
  data() {
    return {
      canDelete: false,
      todos: this.getTodosFromLocalStorage()
    };
  },
  methods: {
    addTodo(todo) {
      this.todos.push(todo);
      this.saveToLocalStorage(this.todos);
    },
    deleteTodo(index) {
      if (this.canDelete) {
        Vue.delete(this.todos, index);
        this.saveToLocalStorage(this.todos);
      } else {
        this.$emit("open-modal-window");
      }
    },
    highlight(category, id) {
      if (this.canDelete) {
        this.todos[id].style = "todoItemHover";
      } else {
        this.todos.forEach(todo => {
          if (todo.category != category) {
            todo.style = "bgColTrans";
          }
        });
      }
    },
    mouseleave() {
      this.todos.forEach(todo => {
        todo.style = "";
      });
    },
    saveToLocalStorage(array) {
      localStorage.setItem("todos", JSON.stringify(array));
    },
    getTodosFromLocalStorage() {
      if (!localStorage.getItem("todos")) {
        return [];
      }
      let array = [];
      const todos = JSON.parse(localStorage.getItem("todos"));
      todos.forEach(todo => {
        array.push(todo);
      });
      return array;
    }
  }
});

Vue.component("todo-form", {
  template: `
    <div>
        <form class="todoForm" @submit.prevent="onSubmit">
            <ul v-if="errors.length">
                <li v-for="e in errors" :key="e.id" v-on:click="removeError(e.id)" class="animated fadeInUp todoItem error">{{e.text}}</li>
            </ul>
            
            <div class="row">
                <input v-model="todo" placeholder="Todo" id="todo" >
                
                <select v-model="category" id="category">
                    <option disabled>Category</option>
                    <option v-for="category in categories" :value="category.value" :class="category.value">{{category.name}}</option>
                </select>
            </div>

            <div class="row">
                <input type="submit" value="Submit" id="button"> 
            </div>
        </form>
    </div>
    `,
  data() {
    return {
      todo: null,
      category: null,
      categories: [
        { name: "Job", value: "cat1" },
        { name: "Shop", value: "cat2" },
        { name: "Event", value: "cat3" }
      ],
      errors: []
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.todo && this.category) {
        const todo = {
          todo: this.todo,
          category: this.category,
          style: ""
        };

        this.$emit("todo-submitted", todo);
        this.todo = null;
        this.category = null;
      } else {
        if (!this.todo) {
          this.errors.push({ text: "Todo is required", id: 1 });
          document.getElementById("todo").classList.add("errorInput");
        }
        if (!this.category) {
          this.errors.push({ text: "Category is required", id: 2 });
          document.getElementById("category").classList.add("errorInput");
        }
      }
    },
    removeError(id) {
      if (this.errors.lenght == 1) {
        this.errors = [];
      } else {
        if (id === 2) {
          this.errors.pop();
          document.getElementById("category").classList.remove("errorInput");
        } else {
          this.errors.shift();
          document.getElementById("todo").classList.remove("errorInput");
        }
      }
    }
  }
});

Vue.component("actual-time", {
  template: `
    <div>
        {{ time }}
    </div>
    `,
  data() {
    return {
      time: ""
    };
  },
  mounted() {
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const date = new Date();

      this.time =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
  }
});

var app = new Vue({
  el: "#app",
  data: {
    name: "Todo-list",
    modalOpen: false,
    infoOpen: false
  },
  methods: {
    openModal() {
      this.modalOpen = !this.modalOpen;
    },
    showInfo() {
      this.infoOpen = true;
    },
    hideInfo() {
      this.infoOpen = false;
    }
  }
});
