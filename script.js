topBar.style.zIndex = 1000;
document.addEventListener("DOMContentLoaded", () => {

  //clock
  const timeElement = document.querySelector("#timeElement");
  if (timeElement) {
    setInterval(() => {
      timeElement.innerHTML = new Date().toLocaleString();
    }, 1000);
  }
  //draggable
  function dragElement(element) {
    if (!element) return; // Safety check

    let initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    const header = document.getElementById(element.id + "header");
    const dragHandle = header || element;

    dragHandle.onmousedown = startDragging;

    function startDragging(e) {
      e.preventDefault();
      initialX = e.clientX;
      initialY = e.clientY;
      document.onmouseup = stopDragging;
      document.onmousemove = onDrag;
    }

    function onDrag(e) {
      e.preventDefault();
      currentX = initialX - e.clientX;
      currentY = initialY - e.clientY;
      initialX = e.clientX;
      initialY = e.clientY;
      element.style.top = (element.offsetTop - currentY) + "px";
      element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  var topBar = document.querySelector("#topBar")
  // window management magical stuff
  function closeWindow(element) {
    if (element) {
      element.classList.add('hidden');
      element.style.display = "none";
   } 
  }

  function openWindow(element) {
    if (element) {
      // Remove 'hidden' class to show
      element.classList.remove('hidden');
      // DO NOT set style.display = "block" here if CSS handles it.
      // If you must, ensure it matches your CSS exactly:
      element.style.display = "block"; 
      element.style.position = "absolute"; // Ensure dragging works
      biggestIndex++;  // Increment biggestIndex by 1
      element.style.zIndex = biggestIndex;
      topBar.style.zIndex = biggestIndex + 1;
    }
  }

  // welcome window
  const welcomeScreen = document.querySelector("#welcome");
  const welcomeScreenClose = document.querySelector("#welcomeclose");
  const welcomeScreenOpen = document.querySelector("#welcomeopen");

  dragElement(welcomeScreen);

  if (welcomeScreenClose) {
    welcomeScreenClose.addEventListener("click", () => closeWindow(welcomeScreen));
  }
  if (welcomeScreenOpen) {
    welcomeScreenOpen.addEventListener("click", () => openWindow(welcomeScreen));
  }

  // notes app window
  const notesApp = document.querySelector("#notesAppOpen");
  const notesAppClose = document.querySelector("#notesclose");
  
  if (notesApp) {
    dragElement(notesApp); 
  }

  if (notesAppClose && notesApp) {
    notesAppClose.addEventListener("click", function() {
      closeWindow(notesApp);
    });
  }

  // --- 6. Desktop Icon Selection Logic ---
  const notesIcon = document.getElementById("notesicon");
  let selectedIcon = undefined;

  function selectIcon(element) {
    if (selectedIcon && selectedIcon !== element) {
      selectedIcon.classList.remove("selected");
    }
    element.classList.add("selected");
    selectedIcon = element;
  } 

  function deselectIcon(element) {
    if (element) {
      element.classList.remove("selected");
    }
    selectedIcon = undefined;
  }

  function handleIconTap(element) {
    if (element.classList.contains("selected")) {
      deselectIcon(element);
      openWindow(notesApp); // Open if already selected
    } else {
      selectIcon(element);
    }
  }

  if (notesIcon) {
    notesIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      handleIconTap(this);
    });
  }

  // global click to deselect
  document.addEventListener("click", function(e) {
    if (selectedIcon && !selectedIcon.contains(e.target)) {
      deselectIcon(selectedIcon);
    }
  });

  var biggestIndex = 1;
  function addWindowTapHandling(element) {
    element.addEventListener("mousedown", () =>
      handleWindowTap(element)
    );
  }
  function handleWindowTap(element) {
    biggestIndex++;  // Increment biggestIndex by 1
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
  }
  addWindowTapHandling(welcomeScreen);
  addWindowTapHandling(notesApp);
}
); 