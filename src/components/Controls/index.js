import React from "react"
import cls from "classnames"
import { titleCase } from "../../utils"

import "./style.css"

function SortControlOption({ value, current, onChange }) {
  const classes = cls("sort", "unbutton", value)
  return (
    <button
      type="button"
      className={classes}
      disabled={current === value}
      onClick={() => onChange(value)}
    >
      {titleCase(value)}
    </button>
  )
}

export function SortControl({ options, current, onChange }) {
  return (
    <div className="sort-control flexible-row">
      <div className="label">Sort</div>
      { options.map(key => <SortControlOption key={key} value={key} current={current} onChange={onChange} />) }
    </div>
  )
}

export function KeyboardNavControl({ current, onClick }) {
  const classes = cls("unbutton", current.toString())
  return (
    <div className="keyboard-nav-control">
      <button type="button" className={classes} onClick={onClick}>Keyboard</button>
    </div>
  )
}

export function KeyboardTip({ show }) {
  const classes = cls("sans-serif", "keyboard-nav-tip")
  if (!show) {
    return (
      <p className={classes}>Try enabling keyboard mode for faster navigation</p>
    )
  }
  return (
    <p className={classes}>Now you can use the arrow keys to move around!</p>
  )
}

export function Controls({ children, keyboardTip }) {
  return (
    <section key="controls" className="controls">
      <div className="flexible-row sans-serif">
        { children }
      </div>
      <KeyboardTip show={keyboardTip} />
    </section>
  )
}
