import React from "react"
import errors from "../../errors"

import "./style.css"

export default function ErrorCard({ error }) {
  return (
    <section className="error">
      <p>Error! <span dangerouslySetInnerHTML={{ __html: errors[error.message] }} /></p>
    </section>
  )
}
