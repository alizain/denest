import "./browser"
import "./app.css"

import React from "react"
import { render } from "react-dom"

// import { initial } from "./reddit"
import treeSort from "./treeSort"
import { sorters } from "./sorters"
import TitleCard from "./components/TitleCard/index.js"
import ErrorCard from "./components/ErrorCard/index.js"
import LoadingCard from "./components/LoadingCard/index.js"
import SourceInput from "./components/SourceInput/index.js"
import { Controls, SortControl, KeyboardNavControl } from "./components/Controls/index.js"
import CommentList from "./components/CommentList/index.js"

const App = React.createClass({
  getInitialState() {
    return {
      title: undefined,
      comments: undefined,
      loading: false,
      error: undefined,
      sortOptions: Object.keys(sorters),
      sort: "tree",
      keyboardNav: false
    }
  },
  handleNewData(response) {
    const sorted = treeSort(response)
    this.setState({
      title: sorted.title,
      comments: sorted.comments,
      loading: false,
      error: undefined
    })
  },
  handleError(err) {
    this.setState({
      title: undefined,
      comments: undefined,
      loading: false,
      error: err
    })
  },
  handleSourceSubmit(getter) {
    this.setState({
      loading: true,
      error: undefined
    })
    getter()
      .then(this.handleNewData, this.handleError)
      .catch(this.handleError)
  },
  handleSortChange(val) {
    this.setState({
      sort: val
    })
  },
  handleKeyboardClick() {
    this.setState({
      keyboardNav: !this.state.keyboardNav
    })
  },
  render() {
    let body = [
      <section key="spacer" className="spacer" /> // blank section for spacing
    ]
    if (this.state.error) {
     body.unshift(
       <ErrorCard key="error" error={this.state.error} />
     )
    } else if (this.state.loading) {
      body.unshift(
        <LoadingCard key="loading" />
      )
    } else if (this.state.title && this.state.comments) {
      body = [
        <TitleCard key="title" title={this.state.title} />,
        <Controls key="controls" keyboardTip={this.state.keyboardNav}>
          <SortControl options={this.state.sortOptions} current={this.state.sort} onChange={this.handleSortChange} />
          <KeyboardNavControl current={this.state.keyboardNav} onClick={this.handleKeyboardClick} />
        </Controls>,
        <CommentList key="commentList" comments={this.state.comments} sort={this.state.sort} keyboardNav={this.state.keyboardNav} />
      ]
    }
    return (
      <main>
        <SourceInput loading={this.state.loading} onSubmit={this.handleSourceSubmit} />
        { body }
      </main>
    )

  }
})

render(<App />, window.document.getElementById("root"))
