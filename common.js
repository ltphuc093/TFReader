var config = require('./config');

var apiDomain_Development = "http://test5.tdtu.edu.vn"; // http://localhost:11579 or http://test5.tdtu.edu.vn
var apiDomain_Production = "https://vfis.tdtu.edu.vn";

var apiDomain = apiDomain_Development;
var apiKey = "";
initDomainAPI = function() {
    if(config.lauch_mode == "Development"){
        apiDomain =  apiDomain_Development;
    }
    else {
        apiDomain =  apiDomain_Production;
    }
};

initAPIKey = async function() {
    var request = require('request');
    return new Promise((resolve, reject) => {
        var options = {
          'method': 'POST',
          'url': common.apiPath + '/Api/AppChupHinh_GetApiKey',
        };
        request(options, function (error, response) {
          if (error) reject(error);
          apiKey = response.body.key;
          resolve(response.body);
        });
      }).catch((error) => {

      });
}

getDomainAPI = function(){
    return apiDomain;
}

module.exports = {
    initDomainAPI : initDomainAPI,
    getDomainAPI : getDomainAPI,
    apiPath : apiDomain,
    apiKey : apiKey,
    initAPIKey: initAPIKey,
}