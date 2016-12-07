import React from "react"
import Comment from "../Comment"
import { sort } from "../../sorters"
import { dispatch } from "../../events"

import "./style.css"

const SCROLL_RATIO = 0.333

export default React.createClass({
  getInitialState() {
    return {
      stack: [],
      keyboardDepth: 0
    }
  },
  componentDidMount() {
    this.manageKeyDownHandler(this.props)
    dispatch("CommentList:DOMUpdated")
  },
  componentWillReceiveProps(nextProps) {
    this.manageSortChange(nextProps)
    this.manageKeyDownHandler(nextProps)
  },
  componentDidUpdate() {
    dispatch("CommentList:DOMUpdated")
  },
  componentWillUnmount() {
    document.onkeydown = undefined
  },
  manageSortChange(nextProps) {
    if (this.props.sort !== nextProps.sort) {
      // Yes, this is a most horrible sin. Yes, it's leaking sort changes
      // to the upper component. For the moment, it'll have to do.
      sort(nextProps.sort, nextProps.comments)
      this.setState({
        stack: []
      })
    }
  },
  manageKeyDownHandler(nextProps) {
    if (nextProps.keyboardNav === true) {
      document.onkeydown = this.handleKeyDown
    } else {
      document.onkeydown = undefined
    }
  },
  validateStack(stack) {
    let list = this.props
    try {
      for (let i = 0; i < stack.length; i++) {
        list = list.comments[stack[i]]
        if (typeof list !== "object" || list === undefined) {
          throw new Error()
        }
      }
      return true
    } catch (e) {
      return false
    }
  },
  validateAndUpdateStack(depth, op) {
    const newStack = this.state.stack.slice(0, depth)
    newStack.push(op(this.state.stack[this.state.keyboardDepth]))
    if (this.validateStack(newStack)) {
      this.setState({
        stack: newStack
      })
    }
  },
  scrollToDepth(depth) {
    const node = this.container.children[depth]
    const offset = window.innerHeight * SCROLL_RATIO
    const top = (window.scrollY + node.getBoundingClientRect().top) - offset
    window.scroll({ top, behaviour: "smooth" })
  },
  updateKeyboardDepth(newDepth) {
    this.setState({
      keyboardDepth: newDepth
    }, () => this.scrollToDepth(newDepth))
  },
  handleKeyDown(ev) {
    if (ev.keyCode === 37) { // left
      ev.preventDefault()
      this.validateAndUpdateStack(this.state.keyboardDepth, (index) => index - 1)
    } else if (ev.keyCode === 38) { // up
      ev.preventDefault()
      this.updateKeyboardDepth(Math.max(0, this.state.keyboardDepth - 1))
    } else if (ev.keyCode === 39) { // right
      ev.preventDefault()
      this.validateAndUpdateStack(this.state.keyboardDepth, (index) => index + 1)
    } else if (ev.keyCode === 40) { // down
      ev.preventDefault()
      this.updateKeyboardDepth(Math.min(this.state.stack.length - 1, this.state.keyboardDepth + 1))
    }
  },
  render() {
    const self = this
    function generateHandler(stack, depth, next) {
      const newStack = stack.slice(0, depth)
      newStack.push(next)
      return function() {
        self.setState({
          stack: newStack
        })
      }
    }
    function build(list, stack, depth) {
      if (isNaN(depth)) {
        depth = 0
      }
      if (isNaN(stack[depth])) {
        stack[depth] = 0
      }
      const index = stack[depth]
      const item = list[index]
      if (item === undefined) {
        throw new Error("stack corruption")
      }
      let prev
      let prevHandler
      if (list[index - 1] !== undefined) {
        prev = list[index - 1]
        prevHandler = generateHandler(stack.slice(0), depth, index - 1)
      }
      let next
      let nextHandler
      if (list[index + 1] !== undefined) {
        next = list[index + 1]
        nextHandler = generateHandler(stack.slice(0), depth, index + 1)
      }
      let all = [
        <Comment
          key={item.id}
          depth={depth}
          keyboardDepth={self.props.keyboardNav ? self.state.keyboardDepth : undefined}
          comment={item}
          index={index}
          length={list.length}
          prev={prev}
          prevHandler={prevHandler}
          next={next}
          nextHandler={nextHandler}
        />
      ]
      if (Array.isArray(item.comments) && item.comments.length > 0) {
        all = all.concat(
          build(item.comments, stack, depth + 1)
        )
      }
      return all
    }
    return (
      <section className="comment-list" ref={(el) => { this.container = el }}>
        { build(this.props.comments, this.state.stack) }
      </section>
    )
  }
})
