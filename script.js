setInterval(function () {
    document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

// Make the window element draggable
dragElement(document.getElementById("welcome"));

function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    // Look for an element with ID = element.id + "header" e.g. "windowheader"
    var header = document.getElementById(element.id + "header");
    if (header) {
        header.onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = onDrag; // Fixed: was incorrectly named dragElement (same as outer fn)
    }

    function onDrag(e) { // Fixed: renamed from dragElement to avoid overwriting the outer function
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top  = (element.offsetTop  - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var welcomeScreen = document.querySelector("#welcome")
function closeWindow(element) {
  element.style.display = "none"
}
function openWindow(element) {
  element.style.display = "flex"
}