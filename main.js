// main.js

// Getting all of the elements needed
const deleteIcon = document.querySelector("#delete")
const newNote = document.querySelector("#new-note")
const notesElement = document.querySelector("#notes")
const noteArea = document.querySelector("#note")
const menu = document.querySelector("#menu")
const colorPicker = document.querySelector("#color-picker")
const commands = document.querySelector("#commands")
const fontSelect = document.querySelector("select")

// A function to save the current note
const saveCurrentNote = () => {
  if (notes.length !== 0) {
    notes.splice(getIndexOfNote(), 1)
    currentNote.content = noteArea.innerHTML
    notes.unshift(currentNote)
    localStorage.setItem("notes", JSON.stringify(notes))
    renderNotes()
    getCurrentNoteElement().classList.add("active")
  }
}

// renders all the elements on the left side of the page where you click which note you want
const renderNotes = () => {
  notesElement.innerHTML = null
  while (notesElement.firstChild) {
    notesElement.removeChild(notesElement.lastChild)
  }
  for ([i, note] of notes.entries()) {
    let root = document.createElement("div")
    let title = document.createElement("h4")

    root.classList.add("note")
    root.id = note.id
    title.innerHTML = note.name
    title.classList.add("note-title")
    root.appendChild(title)
    root.addEventListener("click", noteClicked)
    notesElement.appendChild(root)
    if (i + 1 !== notes.length) {
      let hr = document.createElement("hr")
      hr.classList.add("lines")
      notesElement.appendChild(hr)
    }
  }
}

// Is fired after a note is clicked
const noteClicked = (e) => {
  e.stopPropagation()
  changeActive(e.currentTarget)
}

// When the main menu on the left side is clicked, this is fired
const handleMainClick = () => {
  if (currentNote !== null && currentNote !== undefined) {
    getCurrentNoteElement().classList.remove("active")
    currentNote = null
    fontSelect.value = 3
    noteArea.innerHTML = null
    noteArea.setAttribute("contenteditable", "false")
  }
}

// Whenever the selection changes on the contenteditable div, the font size selection sets itself to the current fontsize of that text
const changeFontSelection = () => {
  if (document.activeElement === noteArea) {
    fontSelect.value = document.queryCommandValue("FontSize")
  }
}

// A function to change the active note
const changeActive = (elem) => {
  if (currentNote !== null && currentNote !== undefined) {
    getCurrentNoteElement().classList.remove("active")
  }
  setCurrentNote(elem.id)
  getCurrentNoteElement().classList.add("active")
  noteArea.setAttribute("contenteditable", "true")
  noteArea.innerHTML = currentNote.content
}

// A function to delete a note
const deleteNote = () => {
  if (notes.length !== 0) {
    if (confirm("Are you sure you want to delete this note?")) {
      notes.splice(getIndexOfNote(), 1)
      currentNote = null
      noteArea.innerHTML = null
      localStorage.setItem("notes", JSON.stringify(notes))
      renderNotes()
    }
  }
}

// A function to create a note
const createNote = (e) => {
  e.stopPropagation()
  let name = prompt("Note Name?")
  if (name === "" || name === null) {
    return
  }
  updateCount()
  notes.unshift({ id: `n-${count}`, name: name, content: null })
  currentNote = notes[0]
  localStorage.setItem("notes", JSON.stringify(notes))
  renderNotes()
  changeActive(getCurrentNoteElement())
}

// Sets the current note from an id
const setCurrentNote = (id) => {
  for (note of notes) {
    if (note.id === id) {
      currentNote = note
    }
  }
}

// Gets an index of a note in the notes array based on the current note
const getIndexOfNote = () => {
  for (index of notes.keys()) {
    if (notes[index].id === currentNote.id) {
      return index
    }
  }
}

// Will get the notes that are saved in LocalStorage
const getNotes = () => {
  let notes = JSON.parse(localStorage.getItem("notes"))
  if (notes === null) {
    localStorage.setItem("notes", JSON.stringify([]))
    return []
  } else {
    return notes
  }
}

// Gets the count from LocalStorage used to create the ids for the notes
const getCount = () => {
  let localCount = JSON.parse(localStorage.getItem("count"))
  if (localCount === null) {
    localStorage.setItem("count", JSON.stringify(0))
    return 0
  } else {
    return localCount
  }
}

// Updates the count used to id the notes
const updateCount = () => {
  count++
  localStorage.setItem("count", count)
}

const getCurrentNoteElement = () => {
  return document.querySelector(`#${currentNote.id}`)
}

noteArea.innerHTML = null

let notes = getNotes()
let currentNote = notes[0]
let count = getCount()
renderNotes()
if (currentNote !== undefined) {
  changeActive(getCurrentNoteElement())
}

// Adding event listeners
deleteIcon.addEventListener("click", deleteNote)
newNote.addEventListener("click", createNote)
noteArea.addEventListener("input", saveCurrentNote)
document.addEventListener("selectionchange", changeFontSelection)
menu.addEventListener("click", handleMainClick)

// For loop adds event listeners to react to clicks of the rich text editor buttons
for (option of commands.children) {
  if (option.nodeName === "INPUT") {
    option.addEventListener("input", (e) => {
      document.execCommand("foreColor", false, e.target.value)
    })
    continue
  } else if (option.nodeName === "SELECT") {
    option.addEventListener("input", (e) => {
      document.execCommand("fontSize", false, e.target.value)
    })
  } else if (option.dataset.command === "insertImage") {
    option.addEventListener("click", () => {
      let link = prompt("What is the url of the image?", "https://")
      if (link !== null && link !== "") {
        document.execCommand("insertImage", false, link)
      }
    })
    continue
  } else if (option.dataset.command === "insertLink") {
    option.addEventListener("click", () => {
      let link = prompt("What is the link?", "https://")
      if (link !== null && link !== "") {
        document.execCommand("createLink", false, link)
      }
    })
    continue
  }
  option.addEventListener("click", (e) => {
    document.execCommand(e.currentTarget.dataset.command, true, null)
  })
}
