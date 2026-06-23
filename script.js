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

  // contacts app window
  const contactsApp = document.querySelector("#contactsAppOpen");
  const contactsAppClose = document.querySelector("#contactsclose");

  if (contactsApp) {
      dragElement(contactsApp);
  }

  if (contactsAppClose && contactsApp) {
      contactsAppClose.addEventListener("click", function() {
          closeWindow(contactsApp);
      });
  }

  const contactsIcon = document.getElementById("contactsicon");

  function handleContactsIconTap(element) {
      if (element.classList.contains("selected")) {
          deselectIcon(element);
          openWindow(contactsApp);
      } else {
          selectIcon(element);
      }
  }

  if (contactsIcon) {
      contactsIcon.addEventListener("click", function(e) {
          e.stopPropagation();
          handleContactsIconTap(this);
      });
  }

  addWindowTapHandling(contactsApp);

  // weather app window
  const weatherApp = document.querySelector("#weatherAppOpen");
  const weatherAppClose = document.querySelector("#weatherclose");

  if (weatherApp) {
      dragElement(weatherApp);
  }

  if (weatherAppClose && weatherApp) {
      weatherAppClose.addEventListener("click", function() {
          closeWindow(weatherApp);
      });
  }

  const weatherIcon = document.getElementById("weathericon");

  function handleWeatherIconTap(element) {
      if (element.classList.contains("selected")) {
          deselectIcon(element);
          openWindow(weatherApp);
          fetchWeather();
      } else {
          selectIcon(element);
      }
  }

  if (weatherIcon) {
      weatherIcon.addEventListener("click", function(e) {
          e.stopPropagation();
          handleWeatherIconTap(this);
      });
  }

  document.getElementById("weatherRefresh").addEventListener("click", fetchWeather);

  addWindowTapHandling(weatherApp);

  function fetchWeather() {
      const status = document.getElementById("weatherStatus");
      const temp = document.getElementById("weatherTemp");
      const wind = document.getElementById("weatherWind");
      const humidity = document.getElementById("weatherHumidity");
      const updated = document.getElementById("weatherUpdated");

      status.textContent = "Loading...";
      temp.textContent = "";
      wind.textContent = "";
      humidity.textContent = "";
      updated.textContent = "";

      // Auckland coordinates
      fetch("https://api.open-meteo.com/v1/forecast?latitude=-36.8485&longitude=174.7633&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=Pacific%2FAuckland")
          .then(res => res.json())
          .then(data => {
              const c = data.current;
              const codes = {
                  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
                  45: "Fog", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle",
                  55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
                  71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Light showers",
                  81: "Showers", 82: "Heavy showers", 95: "Thunderstorm",
              };
              status.textContent = codes[c.weather_code] ?? "Unknown";
              temp.textContent = "Temperature: " + c.temperature_2m + "°C";
              wind.textContent = "Wind: " + c.wind_speed_10m + " km/h";
              humidity.textContent = "Humidity: " + c.relative_humidity_2m + "%";
              updated.textContent = "Updated: " + new Date(c.time).toLocaleString();
          })
          .catch(() => {
              status.textContent = "Failed to load weather.";
          });
  }

  // doom app window
  const doomApp = document.querySelector("#doomAppOpen");
  const doomAppClose = document.querySelector("#doomclose");
  let dosbox_DOOM = null;

  if (doomApp) {
      dragElement(doomApp);
  }

  if (doomAppClose && doomApp) {
    doomAppClose.addEventListener("click", function() {
      closeWindow(doomApp);
      if (dosbox_DOOM) {
        document.getElementById("DOOM").innerHTML = "";
        document.activeElement.blur();
        dosbox_DOOM = null;
        window.doomStarted = false;
      }
    });
  }

  const doomIcon = document.getElementById("doomicon");

  function handleDoomIconTap(element) {
      if (element.classList.contains("selected")) {
          deselectIcon(element);
          openWindow(doomApp);
          if (!window.doomStarted) {
              window.doomStarted = true;
              dosbox_DOOM = new Dosbox({
                  id: "DOOM",
                  onload: function(dosbox) {
                      dosbox_DOOM.run("https://thedoggybrad.github.io/doom_on_js-dos/DOOM-@evilution.zip", "./DOOM/DOOM.EXE");
                  },
                  onrun: function(dosbox, app) {
                      console.log("App '" + app + "' is runned");
                  }
              });
          }
      } else {
          selectIcon(element);
      }
  }

  if (doomIcon) {
      doomIcon.addEventListener("click", function(e) {
          e.stopPropagation();
          handleDoomIconTap(this);
      });
  }

  addWindowTapHandling(doomApp);

  // Desktop Icon Selection Logic
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