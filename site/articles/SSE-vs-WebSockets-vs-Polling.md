!{{
    "dateCreated": 1657265841999,
    "dateUpdated": 1657265841999,
    "pageTitle": "SSE vs WebSockets vs Polling",
    "tags": "[]",
    "id": "ab1bc3aa-3264-4501-bdb4-a39ba306f069",
    "abstract": "I wrote this article some time ago for SmashingMagazine.com. It explores how SSE compares to WebSockets for streaming data to a client."
}}

# SSE vs WebSockets vs Polling

This article: "[Using SSE Instead Of WebSockets For Unidirectional Data Flow Over HTTP/2](https://www.smashingmagazine.com/2018/02/sse-websockets-data-flow-http2/)" explores the differences between 3 approaches for FE to BE communication. It is from a past where SSE was going to take over other methods for streaming. Nowadays things a different. SSE wasn't picked by the developers -> it just wasn't needed as is. People who needed streaming didn't need a pre-defined text based protocol. Everybody wanted their own thing.