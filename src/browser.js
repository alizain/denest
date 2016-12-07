import Promise from "bluebird"

Promise.config({
  longStackTraces: true,
  warnings: true
})

import smoothscroll from "smoothscroll-polyfill"

smoothscroll.polyfill()

import { el } from "./events"

el.addEventListener("CommentList:DOMUpdated", () => {
  window.setTimeout(() => {
    document.body.style.minHeight = `${document.body.clientHeight}px`
  }, 0)
}, false)
