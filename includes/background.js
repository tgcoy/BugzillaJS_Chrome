chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if(request.cmd=="get"){
    var result=localStorage.getItem(request.name);
    result=JSON.parse(result);
    sendResponse(result);
    return;
  }
  
  if(request.cmd=="set"){
    localStorage[request.name]=request.value;
    return;
  }
});
