export const fetch_get = (url) => {
  const ROOT_URL = 'https://ratesapi.io/api/';
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
  });
}
    // if (Platform.OS === 'ios') {
    //     AlertIOS.alert('Offline', 'Unable to perform this action, Please try again later');
    //   }
    //   else {
    //     ToastAndroid.show('Unable to perform this action, Please try again later', ToastAndroid.LONG);
    //   }
