import React from "react"
import { validate, get } from "../../reddit"
import { parseLink } from "../../utils"
import errors from "../../errors"

import "./style.css"

function SourceButton({ link, title, onClick }) {
  return (
    <button
      type="button"
      className="unbutton"
      onClick={() => onClick(link)}
    >
      {title}
    </button>
  )
}

export default React.createClass({
  getInitialState() {
    return {
      value: "",
      error: undefined
    }
  },
  handleChange(ev) {
    this.setState({
      value: ev.target.value,
      error: undefined
    })
  },
  handleError(err) {

  },
  handleSubmit(ev) {
    ev.preventDefault()
    this.submitLink(this.state.value)
  },
  handleClick(link) {
    this.submitLink(link)
  },
  submitLink(link) {
    try {
      const parsed = parseLink(link)
      const data = validate(parsed)
      this.props.onSubmit(get.bind(null, data))
    } catch (e) {
      this.setState({
        error: errors[e.message]
      })
    }
  },
  render() {
    let error
    if (this.state.error) {
      error = <p className="input-error" dangerouslySetInnerHTML={{ __html: this.state.error }} />
    }
    return (
      <section className="source-input">
        <h2 className="text-center">Try it out!</h2>
        <p><strong>Paste</strong> any Reddit link here, or <strong>select</strong> a curated link below:</p>
        <form onSubmit={this.handleSubmit}>
          <div className="flexible-row">
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="https://www.reddit.com/r/worldnews/comments/5g6pob/us_presidentelect_donald_trump_has_spoken/" />
            <input className="sans-serif" type="submit" value="Submit" />
          </div>
          { error }
        </form>
        <div className="source-buttons flexible-row sans-serif">
          <SourceButton title="Politics" link="https://www.reddit.com/r/worldnews/comments/5g6pob/us_presidentelect_donald_trump_has_spoken/" onClick={this.handleClick} />
          <SourceButton title="IAmA" link="https://www.reddit.com/r/IAmA/comments/4tnhf2/i_am_matt_damon_ask_me_anything/" onClick={this.handleClick} />
          <SourceButton title="AskReddit" link="https://www.reddit.com/r/AskReddit/comments/5c3qt3/what_is_a_100_legal_move_in_a_game_or_sport_that/" onClick={this.handleClick} />
        </div>
      </section>
    )
  }
})
