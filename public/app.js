for(var i=0;i<document.querySelectorAll(".box").length;i++){
    document.querySelectorAll(".box")[i].addEventListener("mouseover",function(){
        const buttonHTML=this.querySelector(".playbutton");
        buttonHTML.classList.add("hovered");
        slideDown(this);
    })
    document.querySelectorAll(".box")[i].addEventListener("mouseout",function(){
        const buttonHTML=this.querySelector(".playbutton");
        buttonHTML.classList.remove("hovered");
        slideUp(this);
    })

}

window.addEventListener('scroll',()=>{
    let value=window.scrollY
    document.querySelector(".right").style.right=-value*0.15+"px"
    document.querySelector(".left").style.left=-value*0.15+"px"
    document.querySelector("p").style.marginTop=value*0.25+"px"
})

function slideDown(desc){
    var text=desc.querySelector(".gametext");
    var button=desc.querySelector(".playbutton");
    text.style.transition="all 0s ease-in-out";
    text.style.height="50%";
    // desc.style.transition="all 1s ease-in-out";
    desc.style.height="70vh";
    desc.style.borderRadius="2%";
    // button.style.transition="all 1s ease-in-out";
    button.style.bottom="45vh";
}

function slideUp(desc){
    var text=desc.querySelector(".gametext");
    var button=desc.querySelector(".playbutton");
    text.style.transition="all 0s ease-in";
    text.style.height="0";
    // desc.style.transition="all 1.2s ease-in-out";
    desc.style.height="35vh";
    desc.style.borderRadius="4%";
    button.style.bottom="0";
}
