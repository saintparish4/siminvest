const fetcher = (...args: [RequestInfo | URL, RequestInit?]) => fetch(...args).then((res) => res.json());

export default fetcher;