let btn_show_element = document.getElementsByClassName("header_left_text");
let show_element = document.getElementsByClassName("header_left_vars");
let link_home = document.getElementsByClassName("link_home");
let link_work = document.getElementsByClassName("link_work");
let link_gopro = document.getElementsByClassName("link_gopro");
let avatar_image = document.getElementsByClassName("avatar_image");
let Header_text = document.getElementsByClassName("Header_text");
var n = 0;

if (document.referrer == '') {
    console.log('referrer')
    window.location.replace('/');
}

function inMouse() {
    show_element[0].style.opacity = 1;
    n=1
    show_element[0].addEventListener("mouseover", inMouse);
    show_element[0].addEventListener("mouseout",outMouse);
}

function outMouse() {
    setTimeout(()=>{
        if(n==0){
            show_element[0].style.opacity = 0;
            show_element[0].removeEventListener("mouseover", inMouse);
            show_element[0].removeEventListener("mouseout",outMouse);
        }
    },100)
    n=0
}
link_home[0].addEventListener("click",()=>{window.location.replace('/home')});
link_work[0].addEventListener("click",()=>{window.location.replace('/work')});
avatar_image[0].addEventListener("click",()=>{window.location.replace('/account')});
Header_text[0].addEventListener("click",()=>{window.location.replace('/home')});
Header_text[1].addEventListener("click",()=>{window.location.replace('/home')});
btn_show_element[0].addEventListener("mouseover", inMouse);
btn_show_element[0].addEventListener("mouseout", outMouse);
