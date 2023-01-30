// TAB
//------------------------------------------------------------------------------
let tabs = document.getElementById("tabMenu").children;

let itemsAll = document.getElementById("itemSearch").children;
let itemsGames = document.getElementById("itemSearch").getElementsByClassName("itemGame");
let items3d = document.getElementById("itemSearch").getElementsByClassName("item3d");
let items2d = document.getElementById("itemSearch").getElementsByClassName("item2d");

// Reset every tab button and then set tab active
function showTab(tab) {
    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("btnTabActive");
    }
    tab.classList.add("btnTabActive");
}

//Hides every items and then show only showItems
function showItems(showItems) {
    if (showItems != itemsAll) {
        for (i = 0; i < itemsAll.length; i++) {
            itemsAll[i].style.display = "none";
        }
    }
    for (i = 0; i < showItems.length; i++) {
        showItems[i].style.display = "flex";
    }
}

// Tab click events
tabAll.addEventListener("click", (e) => {
    showTab(tabs[0]);
    showItems(itemsAll);
});
tabGames.addEventListener("click", (e) => {
    showTab(tabs[1]);
    showItems(itemsGames);
});  
tab3d.addEventListener("click", (e) => {
    showTab(tabs[2]);
    showItems(items3d);
});
tab2d.addEventListener("click", (e) => {
    showTab(tabs[3]);
    showItems(items2d);
});  