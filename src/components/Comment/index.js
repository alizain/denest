import React from "react"
import cls from "classnames"
import { decodeBody, formatTime } from "../../utils"
import "./style.css"

const ELLIPSES = "…"

function DepthIndicator({ depth, keyboardDepth }) {
  const classes = cls({
    depth: true,
    enabled: !isNaN(keyboardDepth),
    active: depth >= keyboardDepth
  })
  return (
    <div className={classes}>{depth + 1}</div>
  )
}

function ConditionalControl({ value, obj, handler, textTrue, textFalse }) {
  const classes = cls(value, "unbutton")
  const isValid = obj && typeof obj === "object"
  return (
    <button
      type="button"
      disabled={!isValid}
      onClick={handler}
      className={classes}
    >
      { isValid ? textTrue(obj) : textFalse(obj) }
    </button>
  )
}

function Index({ value, ellipses, current }) {
  const classes = cls("index", { current, ellipses })
  return (
    <div className={classes}>{ ellipses ? ELLIPSES : value }</div>
  )
}

function IndexIndicator({ index, length, max }) {
  if (max % 2 === 0) { max += 1 }
  const all = []
  const halfMax = Math.floor(max / 2)
  let i = 0
  let stop = length
  let pre = false
  let post = false
  if (length > max) {
    if (index >= halfMax) {
      if (index >= halfMax + 1) {
        pre = true
      }
      if (index + halfMax >= length) {
        i = length - max
      } else {
        if (index + halfMax < length - 1) {
          post = true
        }
        i = index - halfMax
        stop = i + max
      }
    } else {
      post = true
      stop = max
    }
  }
  if (pre) {
    all.push(<Index key="pre" ellipses />)
  }
  for (i; i < stop; i++) {
    all.push(<Index key={i + 1} value={i + 1} current={i === index} />)
  }
  if (post) {
    all.push(<Index key="post" ellipses />)
  }
  return (
    <div className="indicators flexible-row">
      { all }
    </div>
  )
}

export default function Comment({ depth, keyboardDepth, comment, index, length, prev, prevHandler, next, nextHandler }) {
  return (
    <div className="comment">
      <div className="controls flexible-row sans-serif">
        <DepthIndicator depth={depth} keyboardDepth={keyboardDepth} />
        <ConditionalControl
          value="prev"
          obj={prev}
          handler={prevHandler}
          textTrue={(obj) => `< previous (${obj.score} points)`}
          textFalse={() => "< previous"}
        />
        <IndexIndicator index={index} length={length} max={5} />
        <ConditionalControl
          value="next"
          obj={next}
          handler={nextHandler}
          textTrue={(obj) => `next (${obj.score} points) >`}
          textFalse={() => "next >"}
        />
      </div>
      <div className="meta sans-serif">
        <p className="author"><strong>{comment.authorSlug}</strong>{ depth === 0 ? "" : " replied"}</p>
        <p className="points">{comment.score} points</p>
        <p className="points">{Math.round(comment.treeSort)} tree points</p>
        <p className="created">replied {formatTime(comment.created)}</p>
      </div>
      <div className="content" dangerouslySetInnerHTML={decodeBody(comment.contentHtml)} />
    </div>
  )
}
