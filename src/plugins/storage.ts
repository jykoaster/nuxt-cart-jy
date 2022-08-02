import type { Context } from '@nuxt/types'
import cookie from 'cookie'
import Vue from 'vue'
import { isUnset } from '../util'
const options = JSON.parse(`<%= JSON.stringify(options) %>`)
export class Storage {
  public ctx: Context
  public prefix: String
  public options: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _state: any
  private _useVuex: boolean = true

  constructor(ctx: Context) {
    this.ctx = ctx
    this.prefix = options.prefix
    this.options = {
      cartFormat: options.cartFormat,
      path: '/',
    }
    this._initState()
  }

  setUniversal<V extends unknown>(key: string, value: V): V | void {
    if (isUnset(value)) {
      return this.removeUniversal(key)
    }
    this.setCookie(key, value)

    this.setState(key, value)

    return value
  }

  getUniversal(key: string): unknown {
    let value

    // Local state
    if (process.server) {
      value = this.getState(key)
    }

    // Cookies
    if (isUnset(value)) {
      value = this.getCookie(key)
    }

    // Local state
    if (isUnset(value)) {
      value = this.getState(key)
    }

    return value
  }

  removeUniversal(key: string): void {
    this.setCookie(key, undefined)
    this.removeState(key)
  }

  _initState(): void {
    Vue.set(this, '_state', {})

    this._useVuex = !!this.ctx.store
    if (this._useVuex) {
      const storeModule = {
        namespaced: true,
        state: () => ({
          cart: this.getCookie('cart') || options.cartFormat,
        }),
        mutations: {
          SET(state: any, payload: any) {
            Vue.set(state, payload.key, payload.value)
          },
        },
      }

      this.ctx.store.registerModule('cartCustom', storeModule, {
        preserveState: Boolean(this.ctx.store.state.cartCustom),
      })

      this.state = this.ctx.store.state.cartCustom
    } else {
      Vue.set(this, 'state', {})

      // eslint-disable-next-line no-console
      console.warn(
        '[AUTH] The Vuex Store is not activated. This might cause issues in auth module behavior, like redirects not working properly.' +
          'To activate it, see https://nuxtjs.org/docs/2.x/directory-structure/store'
      )
    }
  }

  getState(key: string): unknown {
    if (key[0] !== '_') {
      return this.state[key]
    } else {
      return this._state[key]
    }
  }

  setState<V extends unknown>(key: string, value: V): V {
    if (key[0] === '_') {
      Vue.set(this._state, key, value)
    } else if (this._useVuex) {
      this.ctx.store.commit('cartCustom/SET', {
        key,
        value,
      })
    } else {
      Vue.set(this.state, key, value)
    }

    return value
  }

  removeState(key: string): void {
    this.setState(key, undefined)
  }

  getCookie(key: string): unknown {
    if (process.server && !this.ctx.req) {
      return
    }

    const _key = this.prefix + key

    const cookies = this.getCookies()

    const value = cookies[_key]
      ? decodeURIComponent(cookies[_key] as string)
      : undefined

    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch (_) {}
    }
    return value
  }

  getCookies(): Record<string, unknown> {
    const cookieStr = process.client
      ? document.cookie
      : this.ctx.req.headers.cookie

    return cookie.parse(cookieStr || '') || {}
  }

  setCookie<V extends unknown>(key: string, value: V): V {
    const _options = Object.assign({}, this.options)

    // Unset null, undefined
    if (isUnset(value)) {
      _options.maxAge = -1
    }

    // Accept expires as a number for js-cookie compatiblity
    if (typeof _options.expires === 'number') {
      _options.expires = new Date(Date.now() + _options.expires * 864e5)
    }
    const _key = this.prefix + key
    let _value
    if (typeof value === 'string') {
      _value = value
    }
    _value = JSON.stringify(value)
    const serializedCookie = cookie.serialize(_key, _value, _options)
    if (process.client) {
      // Set in browser
      document.cookie = serializedCookie
    } else if (process.server && this.ctx.res) {
      // Send Set-Cookie header from server side
      let cookies = (this.ctx.res.getHeader('Set-Cookie') as string[]) || []
      if (!Array.isArray(cookies)) cookies = [cookies]
      cookies.unshift(serializedCookie)
      this.ctx.res.setHeader(
        'Set-Cookie',
        cookies.filter(
          (v, i, arr) =>
            arr.findIndex((val) =>
              val.startsWith(v.substr(0, v.indexOf('=')))
            ) === i
        )
      )
    }
    return value
  }
}
