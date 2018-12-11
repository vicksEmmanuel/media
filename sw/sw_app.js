if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js",{scope:"./"})
  .then(function(reg){
        console.log("Service Worker Registered",reg);
  })
  .catch(function(err){
        console.log("Service Worker Failed to Register",err);
  });
}else{
  console.log("No ServiceWorker");
}
