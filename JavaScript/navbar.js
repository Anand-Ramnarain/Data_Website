document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("head");
  const headItem = [
    { icon: "bx bxs-home", text: "DataWebsite", href: "https://anand-ramnarain.github.io/Data_Website/index.html", class: "logo" },
  ];

  const navbar = document.getElementById("navbar");
  const navItems = [
    { text: "Home", href: "https://anand-ramnarain.github.io/Data_Website/index.html" },
    { text: "Blogs", href: "https://anand-ramnarain.github.io/Data_Website/html/blog-post.html" },
    { text: "Design", href: "https://anand-ramnarain.github.io/Data_Website/html/design-main.html" },
    { text: "Data-Visualisation", href: "https://anand-ramnarain.github.io/Data_Website/html/data-visual.html" },
    { text: "Data-Art", href: "https://anand-ramnarain.github.io/Data_Website/html/data-art.html" },
  ];

  const ulElement = document.createElement("ul");
  ulElement.classList.add("navlist");

  const navIcon = document.createElement("div");
  navIcon.classList.add("nav-icon");

  const itemIcon = document.createElement("i");
  itemIcon.setAttribute("href", itemIcon.href);
  itemIcon.className = "bx bx-search-alt-2";
  navIcon.appendChild(itemIcon);

  const menuIcon = document.createElement("div");
  menuIcon.id = "menu-icon";
  menuIcon.className = "bx bx-menu";

  navIcon.appendChild(menuIcon);
  header.appendChild(navIcon);

  for (let items of headItem) {
    const an = document.createElement("a");
    an.setAttribute("href", items.href);

    if (items.icon) {
      const iconElement = document.createElement("i");
      iconElement.className = items.icon;
      an.appendChild(iconElement);
    }

    an.appendChild(document.createTextNode(items.text));

    if (items.class) {
      an.classList.add(items.class);
    }

    header.insertBefore(an, header.firstChild);
  }

  for (let item of navItems) {
    const liElement = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.setAttribute("href", item.href);

    anchor.appendChild(document.createTextNode(item.text));

    if (item.class) {
      anchor.classList.add(item.class);
    }

    liElement.appendChild(anchor);
    ulElement.appendChild(liElement);

    navbar.appendChild(ulElement);

    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // You might not need this if you want the links to actually navigate
      setActive(anchor);
    });
  }

  function setActive(activeElement) {
    const anchors = document.querySelectorAll("#navbar a");
    for (let anchor of anchors) {
      if (anchor === activeElement) {
        anchor.classList.add("active");
      } else {
        anchor.classList.remove("active");
      }
    }
  }
});

const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", this.window.scrollY > 80);
});

let menu = document.querySelector("#menu-icon");
let navlist = document.querySelector(".navlist");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navlist.classList.toggle("open");
};

window.onscroll = () => {
  menu.classList.remove("bx-x");
  navlist.classList.remove("open");
};
