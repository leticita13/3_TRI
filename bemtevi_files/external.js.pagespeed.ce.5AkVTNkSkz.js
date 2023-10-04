var deferredPrompt;var audio=new Audio();audio.preload='none';var hasErrors;var lastUrl;var canPause;function play(url,loaderId,slug){if(canPause){audio.pause();audio.currentTime=0;}
if(lastUrl!=url||hasErrors){audio.src=url;lastUrl=url;hasErrors=false;canPause=false;audio.onerror=function(){hasErrors=true};if(loaderId){document.getElementById(loaderId).style.display='block';audio.addEventListener('canplay',_=>{document.getElementById(loaderId).style.display='none';});}}
var playPromise=audio.play();if(playPromise!==undefined){playPromise.then(_=>{canPause=true;}).catch(error=>{hasErrors=true;});}
if(navigator.vibrate){navigator.vibrate(5);}}
function share(title,instant_url,audio_url,slug){fetch(audio_url).then(r=>r.blob()).then(blobFile=>new File([blobFile],"myinstants.mp3",{type:"audio/mp3"})).then(file=>{navigator.share({files:[file],}).then(()=>{gtag('event','share',{'type':'web_share','url':instant_url,});var request=new XMLHttpRequest();request.open('GET',`/analytics/share/${slug}/`,true);request.send();});});}
function copyLink(url){var dummy=document.createElement('input');document.body.appendChild(dummy);var url=new URL(url);url.searchParams.set('utm_source','copy');url.searchParams.set('utm_medium','share');dummy.value=url;dummy.select();document.execCommand('copy');document.body.removeChild(dummy);gtag('event','share',{'type':'copy_link','url':url.toString(),});return false;}
function copyInstantLink(url,slug){copyLink(url);var request=new XMLHttpRequest();request.open('GET',`/analytics/share/${slug}/`,true);request.send();}
function copyEmbed(){var textarea=document.getElementById('instant-embed');textarea.select();document.execCommand('copy');gtag('event','embed_copied',{'url':window.location.toString(),});return false;}
function install(platform){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.then((choiceResult)=>{if(choiceResult.outcome==='accepted'){gtag('event','webapp_installed',{'location':platform,});}else{gtag('event','webapp_dismissed',{'location':platform,});}
deferredPrompt=null;});}}
async function favorite(instant_id){fetch(`/api/v1/favorite/add/${instant_id}/`).then(response=>{console.log(response);if(response.status==200){gtag('event','favorite_add',{'instant_id':`${instant_id}`,});}else if(response.status==401){window.location=`/accounts/login/?next=${window.location}`;}});}
function setNavbarUser(){var usernameCookie=document.cookie.split('; ').find(row=>row.startsWith('username='));if(usernameCookie){var username=usernameCookie.split('=')[1];var navLogin=document.getElementById('nav-login');navLogin.innerHTML=`<img src="/media/images/icons/account.svg" alt="User account icon" class="nav-icon-left" width="24" height="24">${username}`;navLogin.classList.add('dropdown-toggle');navLogin.href='#';navLogin.setAttribute('data-bs-toggle','dropdown');}}
function setInstallButtons(){var btnAddInstantPage=document.getElementById("install-app-instant-page");var btnAddNav=document.getElementById("install-app-nav");var btnAddDesktop=document.getElementById("install-app-desktop");if(navigator.standalone||window.matchMedia('(display-mode: standalone)').matches){btnAddDesktop.classList=['d-none'];if(btnAddInstantPage){btnAddInstantPage.classList=['d-none'];}
if(btnAddNav){btnAddNav.classList=['d-none'];}}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;if(!(navigator.standalone||window.matchMedia('(display-mode: standalone)').matches)){btnAddDesktop.classList.remove('invisible');if(btnAddInstantPage){btnAddInstantPage.classList.remove('invisible');}
if(btnAddNav){btnAddNav.classList.remove('invisible');}}
return false;});window.addEventListener('appinstalled',(event)=>{gtag('event','webapp_installed_total');});if(btnAddInstantPage){btnAddInstantPage.addEventListener('click',(e)=>{install('instant_page');});}
if(btnAddNav){btnAddNav.addEventListener('click',(e)=>{install('nav');});}
if(btnAddDesktop){btnAddDesktop.addEventListener('click',(e)=>{install('desktop');});}}
function hideWebShareIfNotSupported(root){if(!navigator.canShare||!navigator.canShare({files:[new File(["foo"],"foo.mp3",{type:"audio/mp3"})]})){root.querySelectorAll('.webshare').forEach(function(el){el.style.display='none';});}}
function showSearchBar(){var installBtn=document.getElementById('install-app-nav');installBtn.classList=['d-none'];var searchBtn=document.getElementById('btn-search');searchBtn.classList=['d-none'];var brand=document.getElementById('brand');brand.classList=['d-none'];var searchbar=document.getElementById('searchbar');searchbar.classList.remove('d-none');searchbar.classList.remove('d-md-flex');searchbar.focus();document.querySelector('#searchbar > div > input').focus();}
function setTooltips(root){var tooltipTriggerList=[].slice.call(root.querySelectorAll('[data-bs-toggle="tooltip"]'));var tooltipList=tooltipTriggerList.map(function(tooltipTriggerEl){if(!tooltipTriggerEl.getAttribute('listener')){var tooltip=new bootstrap.Tooltip(tooltipTriggerEl);tooltipTriggerEl.addEventListener('show.bs.tooltip',function(){setTimeout(function(){tooltip.hide();},1000);});tooltipTriggerEl.setAttribute('listener',true);}
return tooltip;})}
if(document.readyState!=='loading'){hideWebShareIfNotSupported(document);setNavbarUser();setInstallButtons();setTooltips(document);}else{document.addEventListener('DOMContentLoaded',function(){hideWebShareIfNotSupported(document);setNavbarUser();setInstallButtons();setTooltips(document);});}