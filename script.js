topBar.style.zIndex = 1000;
document.addEventListener("DOMContentLoaded", () => {

  // clock
  const timeElement = document.querySelector("#timeElement");
  if (timeElement) {
    setInterval(() => {
      timeElement.innerHTML = new Date().toLocaleString();
    }, 1000);
  }

  // dragging
  function dragElement(element) {
    if (!element) return;

    let initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    const header = document.getElementById(element.id + "header");
    const dragHandle = header || element;

    dragHandle.addEventListener("mousedown", startDragging);

    function startDragging(e) {
      initialX = e.clientX;
      initialY = e.clientY;
      document.addEventListener("mouseup", stopDragging);
      document.addEventListener("mousemove", onDrag);
    }

    function onDrag(e) {
      currentX = initialX - e.clientX;
      currentY = initialY - e.clientY;
      initialX = e.clientX;
      initialY = e.clientY;
      element.style.top = (element.offsetTop - currentY) + "px";
      element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("mousemove", onDrag);
    }
  }

  var topBar = document.querySelector("#topBar");
  var biggestIndex = 1;

  function closeWindow(element) {
    if (element) {
      element.classList.add('hidden');
      element.style.display = "none";
    }
  }

  function openWindow(element) {
    if (element) {
      element.classList.remove('hidden');
      element.style.display = "block";
      element.style.position = "absolute";
      biggestIndex++;
      element.style.zIndex = biggestIndex;
      topBar.style.zIndex = biggestIndex + 1;
    }
  }

  function addWindowTapHandling(element) {
    element.addEventListener("mousedown", () => handleWindowTap(element));
  }

  function handleWindowTap(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
  }

  // welcome window
  const welcomeScreen = document.querySelector("#welcome");
  const welcomeScreenClose = document.querySelector("#welcomeclose");
  const welcomeScreenOpen = document.querySelector("#welcomeopen");

  dragElement(welcomeScreen);
  addWindowTapHandling(welcomeScreen);

  if (welcomeScreenClose) {
    welcomeScreenClose.addEventListener("click", () => closeWindow(welcomeScreen));
  }
  if (welcomeScreenOpen) {
    welcomeScreenOpen.addEventListener("click", () => openWindow(welcomeScreen));
  }

  // notes window
  const notesApp = document.querySelector("#notesAppOpen");
  const notesAppClose = document.querySelector("#notesclose");

  dragElement(notesApp);
  addWindowTapHandling(notesApp);

  if (notesAppClose && notesApp) {
    notesAppClose.addEventListener("click", function() {
      closeWindow(notesApp);
    });
  }

  // contacts window
  const contactsApp = document.querySelector("#contactsAppOpen");
  const contactsAppClose = document.querySelector("#contactsclose");

  dragElement(contactsApp);
  addWindowTapHandling(contactsApp);

  if (contactsAppClose && contactsApp) {
    contactsAppClose.addEventListener("click", function() {
      closeWindow(contactsApp);
    });
  }

  // weather window
  const weatherApp = document.querySelector("#weatherAppOpen");
  const weatherAppClose = document.querySelector("#weatherclose");

  dragElement(weatherApp);
  addWindowTapHandling(weatherApp);

  if (weatherAppClose && weatherApp) {
    weatherAppClose.addEventListener("click", function() {
      closeWindow(weatherApp);
    });
  }

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

  document.getElementById("weatherRefresh").addEventListener("click", fetchWeather);

  // doom window
  const doomApp = document.querySelector("#doomAppOpen");
  const doomAppClose = document.querySelector("#doomclose");
  let dosbox_DOOM = null;
  let doomFocused = false;
  let doomEverStarted = false;

  const dosApp = document.querySelector("#dosAppOpen");
  const dosAppClose = document.querySelector("#dosclose");
  let dosbox_DOSEMU = null;
  let dosemuFocused = false;
  let dosemuEverStarted = false;

  let terminalFocused = false;

  // clicking outside doom or the dos emulator unfocuses it
  document.addEventListener("mousedown", function(e) {
    if (doomApp && !doomApp.contains(e.target)) {
      doomFocused = false;
    }
    if (dosApp && !dosApp.contains(e.target)) {
      dosemuFocused = false;
    }
  });

  dragElement(doomApp);
  addWindowTapHandling(doomApp);

  doomApp.addEventListener("mousedown", function(e) {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      doomFocused = true;
    }
  });

  dragElement(dosApp);
  addWindowTapHandling(dosApp);

  dosApp.addEventListener("mousedown", function(e) {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      dosemuFocused = true;
    }
  });

  // notes inputs steal focus back from doom
  const noteTitleInput = document.getElementById('noteTitle');
  const noteContentInput = document.getElementById('noteContent');

  noteTitleInput.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    doomFocused = false;
    dosemuFocused = false;
    setTimeout(() => noteTitleInput.focus(), 0);
  });

  noteContentInput.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    doomFocused = false;
    dosemuFocused = false;
    setTimeout(() => noteContentInput.focus(), 0);
  });

  if (doomAppClose && doomApp) {
    doomAppClose.addEventListener("click", function() {
      closeWindow(doomApp);
      doomFocused = false;
      if (dosbox_DOOM) {
        const canvas = document.querySelector("#DOOM canvas");
        if (canvas) {
          canvas.blur();
          canvas.width = 0;
          canvas.height = 0;
        }
        document.getElementById("DOOM").innerHTML = "";
        dosbox_DOOM = null;
      }
      document.body.tabIndex = -1;
      document.body.focus();
    });
  }

  if (dosAppClose && dosApp) {
    dosAppClose.addEventListener("click", function() {
      closeWindow(dosApp);
      dosemuFocused = false;
      if (dosbox_DOSEMU) {
        const canvas = document.querySelector("#DOSEMU canvas");
        if (canvas) {
          canvas.blur();
          canvas.width = 0;
          canvas.height = 0;
        }
        document.getElementById("DOSEMU").innerHTML = "";
        dosbox_DOSEMU = null;
      }
      document.body.tabIndex = -1;
      document.body.focus();
    });
  }

  const terminalApp = document.querySelector("#terminalAppOpen");
  const terminalAppClose = document.querySelector("#terminalclose");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");
  let pyodideInstance = null;
  let pyodideLoading = null;
  let handleCommandFn = null;
  let commandHistory = [];
  let historyIndex = 0;

  dragElement(terminalApp);
  addWindowTapHandling(terminalApp);

  terminalApp.addEventListener("mousedown", function(e) {
    if (e.target !== terminalInput) {
      terminalInput.focus();
    }
  });

  terminalInput.addEventListener("focus", function() {
    terminalFocused = true;
  });

  terminalInput.addEventListener("blur", function() {
    terminalFocused = false;
  });

  function appendTerminalOutput(text) {
    terminalOutput.textContent += text;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function loadPyodideOnce() {
    if (pyodideInstance) return Promise.resolve(pyodideInstance);
    if (pyodideLoading) return pyodideLoading;
    appendTerminalOutput("Loading Python...\n");
    pyodideLoading = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
    }).then(function(pyodide) {
      pyodide.setStdout({ batched: function(msg) { appendTerminalOutput(msg + "\n"); } });
      pyodide.setStderr({ batched: function(msg) { appendTerminalOutput(msg + "\n"); } });
      pyodideInstance = pyodide;
      return fetch("terminal.py")
        .then(function(res) {
          if (!res.ok) throw new Error("no terminal.py found");
          return res.text();
        })
        .then(function(code) {
          return pyodide.runPythonAsync(code);
        })
        .then(function() {
          handleCommandFn = pyodide.globals.get("handle_command");
        })
        .catch(function() {
          appendTerminalOutput("(no terminal.py loaded)\n");
        })
        .then(function() {
          appendTerminalOutput("Python ready.\n");
          return pyodide;
        });
    });
    return pyodideLoading;
  }

  function runPythonCommand(command) {
    loadPyodideOnce().then(function() {
      if (!handleCommandFn) {
        appendTerminalOutput("no command handler loaded\n");
        return;
      }
      const result = handleCommandFn(command);
      if (result !== undefined && result !== null && result !== "") {
        appendTerminalOutput(String(result) + "\n");
      }
    }).catch(function(err) {
      appendTerminalOutput(String(err) + "\n");
    });
  }

  document.addEventListener("keydown", function(e) {
    if (e.target === terminalInput) {
      if (e.key === "Enter") {
        const command = terminalInput.value;
        terminalInput.value = "";
        appendTerminalOutput(">>> " + command + "\n");
        if (command.trim() !== "") {
          commandHistory.push(command);
        }
        historyIndex = commandHistory.length;
        runPythonCommand(command);
      } else if (e.key === "ArrowUp") {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
        e.preventDefault();
      }
      e.stopImmediatePropagation();
      return;
    }
    const anyStarted = doomEverStarted || dosemuEverStarted;
    const anyFocused = doomFocused || dosemuFocused;
    if (anyStarted && !anyFocused) {
      e.stopImmediatePropagation();
    }
  }, true);

  ["keyup", "keypress"].forEach(function(eventType) {
    document.addEventListener(eventType, function(e) {
      if (e.target === terminalInput) {
        e.stopImmediatePropagation();
        return;
      }
      const anyStarted = doomEverStarted || dosemuEverStarted;
      const anyFocused = doomFocused || dosemuFocused;
      if (anyStarted && !anyFocused) {
        e.stopImmediatePropagation();
      }
    }, true);
  });

  if (terminalAppClose && terminalApp) {
    terminalAppClose.addEventListener("click", function() {
      closeWindow(terminalApp);
      terminalInput.blur();
    });
  }

  // half-life window
  const halflifeApp = document.querySelector("#halflifeAppOpen");
  const halflifeAppClose = document.querySelector("#halflifeclose");

  dragElement(halflifeApp);
  addWindowTapHandling(halflifeApp);

  if (halflifeAppClose && halflifeApp) {
    halflifeAppClose.addEventListener("click", function() {
      closeWindow(halflifeApp);
    });
  }

  // desktop icons
  const notesIcon = document.getElementById("notesicon");
  const doomIcon = document.getElementById("doomicon");
  const dosIcon = document.getElementById("dosicon");
  const terminalIcon = document.getElementById("terminalicon");
  const halflifeIcon = document.getElementById("halflifeicon");
  const contactsIcon = document.getElementById("contactsicon");
  const weatherIcon = document.getElementById("weathericon");
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

  if (notesIcon) {
    notesIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(notesApp);
      } else {
        selectIcon(this);
      }
    });
  }

  if (contactsIcon) {
    contactsIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(contactsApp);
      } else {
        selectIcon(this);
      }
    });
  }

  if (weatherIcon) {
    weatherIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(weatherApp);
        fetchWeather();
      } else {
        selectIcon(this);
      }
    });
  }

  if (doomIcon) {
    doomIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(doomApp);
        doomFocused = true;
        if (!dosbox_DOOM) {
          doomEverStarted = true;
          dosbox_DOOM = new Dosbox({
            id: "DOOM",
            onload: function(dosbox) {
              dosbox_DOOM.run("DOOM-@evilution.zip", "./DOOM/DOOM.EXE");
            },
            onrun: function(dosbox, app) {
              console.log("App '" + app + "' is runned");
            }
          });
        }
      } else {
        selectIcon(this);
      }
    });
  }

  if (dosIcon) {
    dosIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(dosApp);
        dosemuFocused = true;
        if (!dosbox_DOSEMU) {
          dosemuEverStarted = true;
          dosbox_DOSEMU = new Dosbox({
            id: "DOSEMU",
            onload: function(dosbox) {
              dosbox_DOSEMU.run("js-dos-v3.zip", "COMMAND.COM");
            },
            onrun: function(dosbox, app) {
              console.log("App '" + app + "' is runned");
            }
          });
        }
      } else {
        selectIcon(this);
      }
    });
  }

  if (terminalIcon) {
    terminalIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(terminalApp);
        terminalInput.focus();
        loadPyodideOnce();
      } else {
        selectIcon(this);
      }
    });
  }

  if (halflifeIcon) {
    halflifeIcon.addEventListener("click", function(e) {
      e.stopPropagation();
      if (this.classList.contains("selected")) {
        deselectIcon(this);
        openWindow(halflifeApp);
      } else {
        selectIcon(this);
      }
    });
  }

  // clicking desktop deselects icons
  document.addEventListener("click", function(e) {
    if (selectedIcon && !selectedIcon.contains(e.target)) {
      deselectIcon(selectedIcon);
    }
  });

});

// notes logic
const saveBtn = document.getElementById('saveBtn');
let notes = JSON.parse(localStorage.getItem('notes')) || [];

function addNote() {
  const noteTitleInput = document.getElementById('noteTitle');
  const noteContentInput = document.getElementById('noteContent');
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (title === '' || content === '') {
    alert('Please fill in both title and content.');
    return;
  }

  const newNote = {
    id: Date.now(),
    title: title,
    content: content
  };

  notes.push(newNote);
  saveToLocalStorage();
  renderNotes();

  noteTitleInput.value = '';
  noteContentInput.value = '';
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveToLocalStorage();
  renderNotes();
}

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

  document.querySelector('#notesAppOpen').appendChild(notesList);
}

saveBtn.addEventListener('click', addNote);

renderNotes();