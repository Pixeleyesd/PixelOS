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
    if (!element) return;

    let initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    const header = document.getElementById(element.id + "header");
    const dragHandle = header || element;

    dragHandle.addEventListener("mousedown", startDragging); // only fires on header

    function startDragging(e) {
      e.preventDefault();
      e.stopPropagation(); // dont bubble up to window tap handler
      initialX = e.clientX;
      initialY = e.clientY;
      document.addEventListener("mouseup", stopDragging);
      document.addEventListener("mousemove", onDrag);
    }

    function onDrag(e) {
        // removed e.preventDefault() cuz this was blocking text selection in the window
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.removeEventListener("mouseup", stopDragging);   // use removeEventListener
        document.removeEventListener("mousemove", onDrag);       // not null assignment
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
}); 

// Select DOM elements
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const saveBtn = document.getElementById('saveBtn');
const notesContainer = document.querySelector('main'); // Or a specific div for notes list

// Initialize notes array from localStorage or empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Function to save a new note
function addNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (title === '' || content === '') {
        alert('Please fill in both title and content.');
        return;
    }

    const newNote = {
        id: Date.now(), // Unique ID based on timestamp
        title: title,
        content: content
    };

    notes.push(newNote);
    saveToLocalStorage();
    renderNotes();
    
    // Clear inputs
    noteTitleInput.value = '';
    noteContentInput.value = '';
}

// Function to delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveToLocalStorage();
    renderNotes();
}

// Function to save array to localStorage
function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
    const existingNotesList = document.getElementById('notesList');
    if (existingNotesList) {
        existingNotesList.remove();
    }

    const notesList = document.createElement('div');
    notesList.id = 'notesList';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesList.appendChild(noteElement);
    });

    document.querySelector('#notesAppOpen').appendChild(notesList); // correct container :/
}

// Event Listener for Save Button
saveBtn.addEventListener('click', addNote);

// Load notes on page load
renderNotes();