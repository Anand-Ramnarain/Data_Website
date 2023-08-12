const header = document.querySelector("header")

window.addEventListener("scroll", function(){
    header.classList.toggle("sticky", this.window.scrollY>80)
})

let menu = document.querySelector('#menu-icon')
let navlist = document.querySelector('.navlist')

menu.onclick = () =>{
    menu.classList.toggle('bx-x')
    navlist.classList.toggle('open')
}

window.onscroll = () =>{
    menu.classList.remove('bx-x')
    navlist.classList.remove('open')
}

const sr = ScrollReveal({
    origin: 'top',
    distance:'85px',
    duration: 2500,
    reset: true
})

sr.reveal('.home-text',{delay:300})
sr.reveal('.home-img',{delay:400})

sr.reveal('.middle-text',{})
sr.reveal('.row-btn, .blog-content',{delay:300})

sr.reveal('.middle-text',{})
sr.reveal('.row-btn, .design-content',{delay:300})

sr.reveal('.visual-img',{})
sr.reveal('.visual-text',{delay:300})

sr.reveal('.art-img',{})
sr.reveal('.art-text',{delay:300})