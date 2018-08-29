export const fetch_get = (url) => {
  const ROOT_URL = 'https://ratesapi.io/api/';
  console.log(ROOT_URL + url)
	return fetch(ROOT_URL + url,
    {
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      }
    }
  ).then(response => { 
    return response.json() 
  })  
  .catch((error) => {
    console.log(error)
  });
}
