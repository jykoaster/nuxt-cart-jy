# Get Started

Set module in `nuxt.config.js`

```
modules: {
  ['nuxt-cart-jy', { options... }],
},

```

or

```
modules: {
  'nuxt-cart-jy',
},
cartCustom:{
  options...
}
```

# Usage

The module will record your cart data ,and auto calculate result after data was changed. It have some base properties , and you can custom your own properties.

# API reference

When you use with this package, it will auto inject `$cartCustom` in your context

## `addItem(data:{id:string,price:number,quantity: number,discount?: number})`

- return:`Boolean`
- Description:Add new items

## `editItem(id: string, data:{id:string,price:number,quantity: number,discount?: number})`

- return:`Boolean`
- Description:Edit exist items by `id`

## `removeItem(id: string)`

- return:`Boolean`
- Description:Remove exist items by `id`

## `setCart(key:string,value:any)`

- return:`Void`
- Description:Set custom property

## `showCart()`

- return:`Object`
- Description:Show full cart data

## `clearCart()`

- return:`void`
- Description:Initial cart data

# Options

## `cartFormat`

- Type:`Object`
- Default:`{ items: [], total: 0, quantity: 0 }`
- Description:You can set some custom preperties,and the default properties is required

ex:

wrong:

```
{
  //  without default properties
  time:'2022/08/02' //  custom property
}
```

right:

```
{
  // with default properties
  items: [],
  total: 0,
  quantity: 0,
  time:'2022/08/02' //  custom property
}
```

## `prefix`

- Type:`String`
- Default:`cartCustom_`
- Description: Prefix for cookies
