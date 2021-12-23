// Opens footer links in new tab
document.querySelector("footer").addEventListener("click", function (event) {

  let aTag = event.target.closest("a");

  if (!aTag) { return; }

  let href = aTag.getAttribute("href");

  if (href.indexOf("http") == 0) {
    aTag.setAttribute("target", "_blank");
    return;
  }

  event.preventDefault();

});