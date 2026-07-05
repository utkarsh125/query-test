# Understanding the HTTP QUERY Method.

## Why does it even exist?
HTTP gives you `GET` and `POST`, and for years everyone has been stuck picking the lesser evil for **"search-like** requests:
- `GET` with query params; clean, cacheable, idempotent... but URLs have length limits (~2000 chars in practice),
  and you cannot easily express nested/structured filters (arrays of objects, complex boolean logic) in query string.
- `GET` with a body; technically allowed by HTTP spec, but almost every client, proxy, and server library either strips it
  ignores it, or actively refuses to send it. `fetch` won't let you. Axios historically was inconsistent. Not reliable
- `POST` with a body; solves the payload problem, but semantically `POST` means "create/mutate something". It is NOT cacheable, not idempotent by contract, and search engines/CDNs/browsers treat it that way.

So, you end up either mangling your filters into a URL, or lying to HTTP by callking a read operation a `POST`.

**`QUERY`** is a new HTTP method (IETF draft, championed largely by _Evan Wallace_ + browser vendors gradually adopting it). It is designed specifically to fix the problems above. It's **a safe, cacheable-by-design, idempotent** method that **carries a request body**.

Think of it as: _"POST's syntax, GET's semantics."_

## The Core Mental Model

| Method  | Body allowed          | Safe (no side effects) | Idempotent | Cacheable       |
|---------|------------------------|--------------------------|------------|-----------------|
| GET     | Discouraged/unreliable | Yes                      | Yes        | Yes             |
| POST    | Yes                    | No                       | No         | No (by default) |
| QUERY   | Yes                    | Yes                      | Yes        | Yes             |

**`QUERY`** is essentially: _"I want to read/search/filter data, my request is too complex for a URL, but I promise this doesn't change server state."_
The response to a `QUERY` request can be cached, exactly like a `GET` response, because the semantics guarantee it's a read.

## Test it out
Just clone this repository and install the deps using `npm install`
Run the server and client on separate terminals using `npm run server` and `npm run client` on separate terminals and observe the `server` terminal. That's all.
