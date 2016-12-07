import React from "react"
import { formatTime } from "../../utils"

import "./style.css"

function TitleImage({ image }) {
  return (
    <div
      className="img"
      style={{ backgroundImage: `url(${image})` }}
    />
  )
}

export default function TitleCard({ title }) {
  if (!title) {
    return null
  }
  return (
    <section className="title-card">
      { title.image === undefined ? null : <TitleImage image={title.image} /> }
      <div className="content">
        <p className="title">
          <strong>{title.title}</strong>
        </p>
        <div className="meta sans-serif">
          <p className="subreddit"><strong>/r/{title.subreddit}</strong></p>
          <p className="points">{title.score} points</p>
          <p className="created">created {formatTime(title.created)}</p>
          <p className="comments">{title.numComments} comments</p>
        </div>
        <div className="links sans-serif">
          <p className="permalink">
            <a href={title.permalink}>View on reddit</a>
          </p>
          <p className="url">
            <a href={title.url}>View on {title.domain}</a>
          </p>
        </div>
      </div>
    </section>
  )
}
