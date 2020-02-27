Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">

            <div class="product-image">
                <img :src="image" alt="Image">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-show="inStock">{{ inventory }}</p>
                <p v-if="inventory > 10">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out</p>
                <p v-else>Out of stock</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants" 
                    :key="variant.id"
                    class="color-box"
                    :style="{ backgroundColor: variant.color }"
                    @mouseover='updateProduct(index)'>
                </div>


                <button v-on:click="addToCart" 
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">
                    Add to cart
                </button>

              <h2>Reviews</h2>
              
              <p v-if="reviews.length < 1">No reviews yet.</p>

              <ul v-else >
                  <li v-for="r in reviews"> {{ r }} </li>
              </ul>
              <product-review @review-submitted="addReview"></product-review>
            </div>

            
        </div>`,
  data() {
    return {
      product: "Sock",
      brand: "Vue",
      selectedVariant: 0,
      inventory: 1,
      details: ["100% cotton", "soft", "unisex"],

      variants: [
        {
          id: 1,
          color: "green",
          image: "./images/green.png",
          quantity: 0
        },
        {
          id: 2,
          color: "blue",
          image: "./images/blue.png",
          quantity: 8
        }
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].id);
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(this.selectedVariant);
    },
    addReview(review) {
        this.reviews.push(review)
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].image;
    },
    inStock() {
      return this.variants[this.selectedVariant].quantity;
    },
    shipping() {
      if (this.premium) return "Free";
      else return "9";
    }
  }
});

Vue.component("product-review", {
  props: {},
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        Errors:
        <ul>
            <li v-for="e in errors" class="danger">{{ e }}</li>
        </ul>
    </p>
    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
        </select>
    </p>
        
    <p>
        <input type="submit" value="Submit">  
    </p>    

    </form>
        `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
      onSubmit() {
          if (this.name && this.review && this.rating) {
              const productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
          } else {
              if (!this.name) this.errors.push('Name is required')
              if (!this.review) this.errors.push('Review is required')
              if (!this.rating) this.errors.push('Rating is required')
          }
          
      }
  },

  computed: {}
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },

  methods: {
    updateCart(id) {
      this.cart.push(id);
    }
  }
});
