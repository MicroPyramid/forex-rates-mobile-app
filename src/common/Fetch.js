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
    if(response.status === 200) {
      return response.json() 
    } else {
      return response
    }
  })  
  .catch((error) => {
    console.log(error)
  });
}
