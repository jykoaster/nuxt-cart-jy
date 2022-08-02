import 'vue'
import '@nuxt/types'
declare module 'vue/types/options' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface ComponentOptions<V> {
    cartCustom?: true | false | 'guest'
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $cartCustom: any
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $cartCustom: any
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface Store<S> {
    $cartCustom: any
  }
}

interface itemFormat {
  id: string
  price: number
  quantity: number
  discount?: number
}
