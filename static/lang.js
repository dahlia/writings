 (function () {
   function linkClick() {
     const lang = this.getAttribute('hreflang');
     document.cookie = 'accept-language=' + lang
       + '; path=/; max-age=31536000'
   }
   var links = document.querySelectorAll('a[rel=alternate][hreflang]');
   links.forEach(function (link) {
     link.addEventListener('click', linkClick);
   });
 })();