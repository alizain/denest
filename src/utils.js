import moment from "moment-timezone"

const tz = moment.tz.guess()
const div = document.createElement("div")
const a = document.createElement("a")

export function formatTime(time) {
  if (!time) {
    throw new Error()
  }
  if (time.toString().length === 10) {
    time *= 1000
  }
  return moment(time).tz(tz).fromNow()
}

export function titleCase(str) {
  return str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
}

export function filterObj(allowed, obj) {
  return Object.keys(obj).reduce((final, key) => {
    if (allowed.indexOf(key) !== -1) {
      final[key] = obj[key]
    }
    return final
  }, {})
}

export function decodeBody(str) {
  div.innerHTML = str
  return { __html: div.textContent }
}

export function parseLink(link) {
  if (typeof link !== "string" || link.length <= 0) {
    throw new Error("parseLink.invalidUrl")
  }
  a.href = link
  return {
    protocol: a.protocol,
    hostname: a.hostname,
    port: a.port,
    pathname: a.pathname,
    search: a.search,
    hash: a.hash,
    host: a.host
  }
}
