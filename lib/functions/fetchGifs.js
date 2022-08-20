// export async function fetchGifs(term) {
//   try {
//     const API_KEY = "U1CdpjPMQXjXVfHbTeKXz6AJkvhvKAwQ";
//     const BASE_URL = "http://api.giphy.com/v1/gifs/search";
//     const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
//     const res = await resJson.json();
//     return res.data;
//   } catch (error) {
//     console.warn(error);
//   }
// }
