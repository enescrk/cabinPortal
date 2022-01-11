import axios from 'axios';

export const panelService = {
    get,
    post,
};

function post(urlExtra,model) {
    let url = `https://cabinfitapi.cabin.com.tr/panel/${urlExtra}`

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

  axios.post(url,model,requestOptions).then(
    response => {
        return response
    }
    
  )
  .catch(error => {
    this.errorMessage = error.message;
    console.error("There was an error!", error);
  });
}
function get(urlExtra,query) {
    let url = `https://cabinfitapi.cabin.com.tr/panel/${urlExtra}${query}`

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

  axios.get(url,requestOptions).then(
    response => {
        return response
    }
    
  )
  .catch(error => {
    this.errorMessage = error.message;
    console.error("There was an error!", error);
  });
}


