class animation{
  static get SUPPORTS_INTERSECTION_OBSERVER(){
    return ("IntersectionObserver" in window);
  }
  static get THRESHOLD(){
    return 1;
  }
  static get HANDLED_CLASS(){
    return "sliding";
  }
  static init(){
    if(this._instance){
      this._instance._disconnect();
    }
    this._instance=new animation();
  }

  constructor(){
    const divs=document.querySelectorAll("div");
    const config={
      rootMargin:"10px 0px",
      threshhold: animation.THRESHOLD
    }

    if(!animation.SUPPORTS_INTERSECTION_OBSERVER){
      return;
    }

    this._onIntersection=this._onIntersection.bind(this);
    this._observer=new IntersectionObserver(this._onIntersection,config);
    var x=this._observer;
    divs.forEach(function(div){
      if(div.classList.contains(animation.HANDLED_CLASS)){
        return;
      }
      x.observe(div);
    });
  }

  _disconnect(){
    if(!this._observer){
      return;
    }
     this._observer.disconnect();
  }

  _onIntersection(entries){
    var leac=this;
    entries.forEach(function(entry){
      if(entry.intersectionRatio<0){
        return;
      }
      var lecode=entry.target.getBoundingClientRect();
      if(entry.target.classList.contains(animation.HANDLED_CLASS)){
        entry.target.classList.remove("sliding");
        return;
      }
      $("#property").removeClass("sliding");
        setTimeout(function(){
              entry.target.classList.add("sliding");
         }, 10);
         $("#property").removeClass("sliding");
          //entry.target.classList.remove("sliding");
    });
  }
}
