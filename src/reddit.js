function getImage(obj) {
  try {
    return obj.preview.images[0].source.url
  } catch (e) {
    return undefined
  }
}

function normalizeTitle(raw) {
  try {
    let obj = raw.data.children[0].data
    return {
      authorSlug: obj.author,
      image: getImage(obj),
      created: obj.created_utc,
      id: obj.id,
      numComments: obj.num_comments,
      permalink: `https://reddit.com/${obj.permalink}`,
      url: obj.url,
      score: obj.score,
      contentMd: obj.selftext,
      contentHtml: obj.selftext_html,
      title: obj.title,
      domain: obj.domain,
      subreddit: obj.subreddit
    }
  } catch (e) {
    console.error(e) // eslint-disable-line
    return {}
  }
}

function isValidCommentNode(raw) {
  if (
    raw.kind === "more" ||
    (!raw.data.author || !raw.data.body) ||
    raw.data.author === "[deleted]" ||
    raw.data.body === "[removed]"
  ) {
    return false
  }
  return true
}

function normalizeCommentNode(raw, index) {
  try {
    if (!isValidCommentNode(raw)) {
      return undefined
    }
    return {
      authorSlug: raw.data.author,
      contentMd: raw.data.body,
      contentHtml: raw.data.body_html,
      created: raw.data.created_utc,
      score: raw.data.score,
      redditSort: index,
      id: raw.data.id,
      comments: normalizeComments(raw.data.replies) // eslint-disable-line
    }
  } catch (e) {
    console.error(e) // eslint-disable-line
    return undefined
  }
}

function normalizeComments(raw) {
  try {
    if (!raw.data || !Array.isArray(raw.data.children)) {
      return undefined
    }
    return raw.data.children
      .map(normalizeCommentNode)
      .filter(obj => !!obj)
  } catch (e) {
    console.error(e) // eslint-disable-line
    return undefined
  }
}

export function normalize(raw) {
  const data = {
    title: normalizeTitle(raw[0]),
    comments: normalizeComments(raw[1])
  }
  return data
}

export function get({ sub, id }) {
  return fetch(`https://api.reddit.com/r/${sub}/comments/${id}?sort=confidence`)
    .then(res => {
      if (res.status.toString()[0] !== "2") throw new Error("http.non200")
      return res
    })
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) throw new Error("reddit.malformedResponse")
      if (data.length !== 2) throw new Error("reddit.malformedResponse")
      return data
    })
    .then(normalize)
}

export function validate({ pathname, hostname }) {
  if (hostname.indexOf("reddit.com") === -1) {
    throw new Error("reddit.unknownHost")
  }
  const segments = pathname.replace(/^\/|\/$/g, "").split("/")
  if (segments.length < 4 || segments[0] !== "r" || segments[2] !== "comments") {
    throw new Error("reddit.malformedLink")
  }
  return {
    sub: segments[1],
    id: segments[3]
  }
}
