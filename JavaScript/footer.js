document.addEventListener("DOMContentLoaded", function () {
  const footbar = document.getElementById("footer");
  const footItems = [
    {
      text: "GitHub: ",
      href: "https://github.com/Anand-Ramnarain/Data_Website",
      linkText: "Click Here",
    },
    {
      text: "Website: ",
      href: "https://anand-ramnarain.github.io/Data_Website/",
      linkText: "Click Here",
    },
  ];

  const sec = document.createElement("section");
  sec.classList.add("footer-text");

  const textElement = document.createElement("p");
  textElement.textContent = "Data Website: ";

  footItems.forEach((data) => {
  
    const spanElement = document.createElement("span");
    spanElement.classList.add("foot");
    spanElement.textContent = data.text;
    textElement.appendChild(spanElement);

    const anchors = document.createElement("a");
    anchors.setAttribute("href", data.href);
    anchors.setAttribute("target", "_blank");
    anchors.textContent = data.linkText;
    textElement.appendChild(anchors);
  });
  sec.appendChild(textElement);

  footbar.appendChild(sec);
});
