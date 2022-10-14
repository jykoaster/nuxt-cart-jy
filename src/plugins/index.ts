import { Plugin } from '@nuxt/types'
import { itemFormat } from '../..'
import { getIndex } from '../util'
import { Storage } from './storage'

const options = JSON.parse(`<%= JSON.stringify(options) %>`)

const myPlugin: Plugin = (ctx, inject) => {
  const storage = new Storage(ctx)
  const allFn = {
    addItem(data: itemFormat) {
      try {
        const index = getIndex(storage.state.cart.items, data.id)
        if (index !== -1)
          return console.error(`[nuxt-cart-jy] id '${data.id}' was existed`)
        const cartItems = storage.state.cart.items.slice(0)
        const total = data.discount
          ? data.price * data.discount * data.quantity
          : data.price * data.quantity
        cartItems.push(data)
        const cart = {
          ...storage.state.cart,
          items: cartItems,
          quantity: storage.state.cart.quantity + data.quantity,
          total: storage.state.cart.total + total,
        }
        storage.setUniversal('cart', cart)
      } catch (error) {
        console.error(error)
      }
    },
    editItem(id: string, data: itemFormat) {
      try {
        data.quantity = Number(data.quantity)
        if (isNaN(data.quantity))
          return console.error(`[nuxt-cart-jy] quantity type must be 'number'`)
        const index = getIndex(storage.state.cart.items, id)
        if (index === -1)
          return console.error(`[nuxt-cart-jy] id '${id}' is not exist`)
        const cartItems = storage.state.cart.items.slice(0)
        const total = data.discount
          ? data.price * data.discount * data.quantity
          : data.price * data.quantity
        const oldTotal = cartItems[index].discount
          ? cartItems[index].price *
            cartItems[index].discount *
            cartItems[index].quantity
          : cartItems[index].price * cartItems[index].quantity
        const newTotal = storage.state.cart.total - oldTotal + total
        const newQuantity =
          storage.state.cart.quantity -
          storage.state.cart.items[index].quantity +
          data.quantity
        cartItems[index] = data
        const cart = {
          ...storage.state.cart,
          items: cartItems,
          quantity: newQuantity,
          total: newTotal,
        }
        storage.setUniversal('cart', cart)
      } catch (error) {
        console.error(error)
      }
    },
    removeItem(id: string) {
      try {
        const index = getIndex(storage.state.cart.items, id)
        if (index === -1)
          return console.error(`[nuxt-cart-jy] id '${id}' is not exist`)
        const cartItems = storage.state.cart.items.slice(0)
        const oldTotal = cartItems[index].discount
          ? cartItems[index].price *
            cartItems[index].discount *
            cartItems[index].quantity
          : cartItems[index].price * cartItems[index].quantity
        const newTotal = storage.state.cart.total - oldTotal
        const newQuantity =
          storage.state.cart.quantity - storage.state.cart.items[index].quantity
        cartItems.splice(index, 1)
        const cart = {
          ...storage.state.cart,
          items: cartItems,
          quantity: newQuantity,
          total: newTotal,
        }
        storage.setUniversal('cart', cart)
      } catch (error) {
        console.error(error)
      }
    },
    setCart(key: string, value: any) {
      if (typeof(storage.state.cart[key])==='undefined')
        return console.error(
          `[nuxt-cart-jy] You haven't set property ${key} when cart was initial`
        )
      const obj = JSON.parse(JSON.stringify(storage.state.cart))
      obj[key] = value
      storage.setUniversal('cart', obj)
    },
    showCart() {
      return storage.state.cart
    },
    clearCart() {
      storage.setUniversal('cart', options.cartFormat)
    },
  }
  inject('cartCustom', allFn)
}

export default myPlugin
