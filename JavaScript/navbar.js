document.addEventListener("DOMContentLoaded", function () {
  initializeHeader();
  initializeNavbar();
  initializeScrollEvent();
  initializeMenuToggle();
});

function initializeHeader() {
  const header = document.getElementById("head");
  const headItem = [{
    icon: "bx bxs-home",
    text: "DataWebsite",
    href: "https://anand-ramnarain.github.io/Data_Website/index.html",
    class: "logo"
  }];

  addIconToHeader(header);
  appendHeaderItems(header, headItem);
}

function addIconToHeader(header) {
  const navIcon = document.createElement("div");
  navIcon.classList.add("nav-icon");

  const itemIcon = document.createElement("i");
  itemIcon.className = "bx bx-search-alt-2";
  navIcon.appendChild(itemIcon);

  const menuIcon = document.createElement("div");
  menuIcon.id = "menu-icon";
  menuIcon.className = "bx bx-menu";
  navIcon.appendChild(menuIcon);

  header.appendChild(navIcon);
}

function appendHeaderItems(header, headItem) {
  for (let items of headItem) {
    const an = document.createElement("a");
    an.setAttribute("href", items.href);

    if (items.icon) {
      const iconElement = document.createElement("i");
      iconElement.className = items.icon;
      an.appendChild(iconElement);
    }

    an.appendChild(document.createTextNode(items.text));
    if (items.class) an.classList.add(items.class);
    header.insertBefore(an, header.firstChild);
  }
}

function initializeNavbar() {
  const navbar = document.getElementById("navbar");
  const navItems = [
    { text: "Home", href: "https://anand-ramnarain.github.io/Data_Website/index.html" },
    { text: "Blogs", href: "https://anand-ramnarain.github.io/Data_Website/html/blog-post.html" },
    { text: "Design", href: "https://anand-ramnarain.github.io/Data_Website/html/design-main.html" },
    { text: "Data-Visualisation", href: "https://anand-ramnarain.github.io/Data_Website/html/data-visual-main.html" },
    { text: "Data-Art", href: "https://anand-ramnarain.github.io/Data_Website/html/data-art.html" },
];


  appendNavbarItems(navbar, navItems);
}

function appendNavbarItems(navbar, navItems) {
  const ulElement = document.createElement("ul");
  ulElement.classList.add("navlist");

  for (let item of navItems) {
    const liElement = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.setAttribute("href", item.href);
    anchor.appendChild(document.createTextNode(item.text));
    if (item.class) anchor.classList.add(item.class);
    liElement.appendChild(anchor);
    ulElement.appendChild(liElement);
    navbar.appendChild(ulElement);

    anchor.addEventListener("onclick", function(){
      setActive(anchor);
    });
  }
}

function setActive(activeElement) {
  const anchors = document.querySelectorAll("#navbar a");
  for (let anchor of anchors) {
    if (anchor === activeElement) anchor.classList.add("active");
    else anchor.classList.remove("active");
  }
}

function initializeScrollEvent() {
  const header = document.querySelector("header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", window.scrollY > 80);
    header.classList.toggle("shadow", window.scrollY > 0);
  });
}

function initializeMenuToggle() {
  const menu = document.querySelector("#menu-icon");
  const navlist = document.querySelector(".navlist");

  menu.onclick = function() {
    menu.classList.toggle("bx-x");
    navlist.classList.toggle("open");
  }

  window.onscroll = function() {
    menu.classList.remove("bx-x");
    navlist.classList.remove("open");
  }
}

const urlCategoryMap = {
  "blog-post": "https://anand-ramnarain.github.io/Data_Website/html/blog-post.html",
  "reading-post": "https://anand-ramnarain.github.io/Data_Website/html/blog-post.html",
  "reflection-post":"https://anand-ramnarain.github.io/Data_Website/html/blog-post.html",
  "blog3":"https://anand-ramnarain.github.io/Data_Website/html/blog-post.html",
  "design-main": "https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "wireframes":"https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "style-guide":"https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "revised-style-guide":"https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "planning-visual-data":"https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "more-planning-data-visuals":"https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "as&sol":"https://anand-ramnarain.github.io/Data_Website/html/design-main.html",
  "data-visual-main":"https://anand-ramnarain.github.io/Data_Website/html/data-visual-main.html",
  "data-visual":"https://anand-ramnarain.github.io/Data_Website/html/data-visual-main.html",
  "data-visual-2":"https://anand-ramnarain.github.io/Data_Website/html/data-visual-main.html"
};


document.addEventListener("DOMContentLoaded", function() {
  const currentPage = location.pathname;

  const links = document.querySelectorAll("#navbar a"); 

  links.forEach(link => {
      for (let segment in urlCategoryMap) {
          if (currentPage.includes(segment) && link.getAttribute("href") === urlCategoryMap[segment]) {
              link.classList.add("active");
              break;
          }
      }
  });
});


