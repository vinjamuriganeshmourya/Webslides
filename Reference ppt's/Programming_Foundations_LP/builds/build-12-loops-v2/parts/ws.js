
(function(){
  var KEY='ws:'+(document.title||'worksheet');
  function fields(){ return [].slice.call(document.querySelectorAll('input[type=text],textarea')); }
  var tag=document.querySelector('.ws-save'), t=null;
  function flash(){ if(!tag) return; tag.classList.add('on');
    clearTimeout(t); t=setTimeout(function(){ tag.classList.remove('on'); },1100); }
  try{
    var saved=JSON.parse(localStorage.getItem(KEY)||'{}');
    fields().forEach(function(f,i){ if(saved[i]!=null) f.value=saved[i]; });
  }catch(e){}
  document.addEventListener('input',function(){
    try{
      var v={}; fields().forEach(function(f,i){ if(f.value) v[i]=f.value; });
      localStorage.setItem(KEY,JSON.stringify(v)); flash();
    }catch(e){}
  });
})();
