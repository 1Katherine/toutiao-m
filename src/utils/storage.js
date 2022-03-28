// 封装本地存储操作模块

/**
 * 存储数据
 */
export const setItem = (key, value) => {
  //   将数组和对象类型的数据转换成json个数的字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/**
 * 读取数据
 */
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 删除数据
 */
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
