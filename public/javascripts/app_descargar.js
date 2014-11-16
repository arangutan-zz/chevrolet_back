window.onload = function() {

console.log(navigator.userAgent)
var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};


if ( isMobile.Android() ) {
		document.location.href = "https://play.google.com/store/apps/details?id=com.colmedia.periodistaschevrolet&hl=es_419";
	}else if(isMobile.iOS()){
		document.location.href="https://itunes.apple.com/us/app/periodistas-chevrolet/id934234806?l=es&ls=1&mt=8";
	}else if(isMobile.Windows()){
		document.location.href="";
	}
}
