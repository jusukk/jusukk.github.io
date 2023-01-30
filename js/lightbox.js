// LIGHTBOX
//------------------------------------------------------------------------------
let lb = document.getElementById("lb");
// Get all lightbox items
let lbItems = lb.children;
// Get all lightbox triggers from projects
let lbTriggers = document.getElementById("itemSearch").getElementsByClassName("lbItem");

let lbIsOpen = false;
let index = 0

// Lightbox triggers
// Set onclick function to all triggers that will open correct lightbox item. 
// Create a temporary scope to preserve i's value
for (var i = 0; i < lbTriggers.length; i++) ((i) => {
    lbTriggers[i].onclick = () => showLb(i);
})(i);

// Toggles everytime lightbox animation ends. When closing animation ends, it hides lightbox
lb.addEventListener("animationend", (e) => {
    lbIsOpen = !lbIsOpen;
    if (!lbIsOpen) {
        hideLbEnd(index);
    }
});

// Close lightbox by pressing ESC... 
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hideLbStart();
    }
});
//...or by clicking outside
lb.addEventListener("click", (e) => {
    if (lb === e.target || e.target.tagName === "IMG"
        || e.target.tagName === "PICTURE"
        || e.target.tagName === "DIV") {
        hideLbStart();
    }
});

// Show lightbox, disable scroll & if video, play it
function showLb(i) {
    index = i; // Store current item so we know what to close
    lb.style.display = "flex";
    lb.style.animation = "fadeIn 180ms ease-in-out both";
    //document.body.style.overflow = "hidden"
    lbItems[i].style.display = "flex";
    if (lbItems[i].firstElementChild.tagName === "VIDEO") {
        lbItems[i].firstElementChild.play();
    }
}

// Start lightbox end animation
function hideLbStart() {
    lb.style.animation = "fadeOut 120ms ease-in-out both";
}

// Hide lightbox, enable scroll & if video, reset video
function hideLbEnd(i) {
    lb.style.display = "none";
    //document.body.style.overflow = "auto"
    lbItems[i].style.display = "none";
    if (lbItems[i].firstElementChild.tagName === "VIDEO") {
        lbItems[i].firstElementChild.pause();
        lbItems[i].firstElementChild.currentTime = 0;
    }
}

