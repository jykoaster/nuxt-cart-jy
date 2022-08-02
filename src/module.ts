import { Module } from '@nuxt/types'

interface Options {
  cartFormat: {
    items: Array<object | null>
    total: number
    quantity: number
    [key: string]: any
  }
  prefix: string
}

const myModule: Module<Options> = function (moduleOptions) {
  const { resolve, join } = require('path')
  // const { readdirSync } = require('fs')
  const options = {
    ...moduleOptions,
    ...this.options.cartCustom,
  }

  if (!options.prefix) options.prefix = 'cartCustom_'
  if (!options.cartFormat)
    options.cartFormat = { items: [], total: 0, quantity: 0 }

  const pluginsToSync = ['plugins/index.ts', 'plugins/storage.ts', 'util.ts']
  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join('cartCustom', pathString),
      options,
    })
  }

  // const foldersToSync = []
  // for (const pathString of foldersToSync) {
  //   const path = resolve(__dirname, pathString)
  //   for (const file of readdirSync(path)) {
  //     this.addTemplate({
  //       src: resolve(path, file),
  //       fileName: join('authCustom', pathString, file),
  //       options,
  //     })
  //   }
  // }
}

export default myModule
module.exports.meta = require('../package.json')
