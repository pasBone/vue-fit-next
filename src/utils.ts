/** 获取 translate 值 */
export function getTranslateValue(el: HTMLElement) {
  const match = el.style.transform.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/)
  if (match)
    return { x: Number(match[1]), y: Number(match[2]) }
  return { x: 0, y: 0 }
}

/** 生成 nanoid */
export function nanoId(size: number) {
  const urlAlphabet
  = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
  let id = ''
  let i = size
  while (i--)
    id += urlAlphabet[(Math.random() * 64) | 0]
  return id
}
