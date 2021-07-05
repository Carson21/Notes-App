const saveIcon = document.querySelector("#save")
const deleteIcon = document.querySelector("#delete")
const newNote = document.querySelector("#new-note")
const notesElement = document.querySelector("#notes")
const noteArea = document.querySelector("#note")
const menu = document.querySelector("#menu")
const colorPicker = document.querySelector("#color-picker")
const commands = document.querySelector("#commands")

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

const noteClicked = (e) => {
  e.stopPropagation()
  changeActive(e.currentTarget)
}

const handleMainClick = () => {
  if (currentNote !== null && currentNote !== undefined) {
    getCurrentNoteElement().classList.remove("active")
    currentNote = null
    noteArea.innerHTML = null
  }
}

const changeActive = (elem) => {
  if (currentNote !== null && currentNote !== undefined) {
    getCurrentNoteElement().classList.remove("active")
  }
  setCurrentNote(elem.id)
  getCurrentNoteElement().classList.add("active")
  noteArea.innerHTML = currentNote.content
}

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

const setCurrentNote = (id) => {
  for (note of notes) {
    if (note.id === id) {
      currentNote = note
    }
  }
}

const getIndexOfNote = () => {
  for (index of notes.keys()) {
    if (notes[index].id === currentNote.id) {
      return index
    }
  }
}

const getNotes = () => {
  let notes = JSON.parse(localStorage.getItem("notes"))
  if (notes === null) {
    localStorage.setItem("notes", JSON.stringify([]))
    return []
  } else {
    return notes
  }
}

const getCount = () => {
  let localCount = JSON.parse(localStorage.getItem("count"))
  if (localCount === null) {
    localStorage.setItem("count", JSON.stringify(0))
    return 0
  } else {
    return localCount
  }
}

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

saveIcon.addEventListener("click", saveCurrentNote)
deleteIcon.addEventListener("click", deleteNote)
newNote.addEventListener("click", createNote)

for (option of commands.children) {
  if (option.nodeName === "INPUT") {
    option.addEventListener("input", (e) => {
      document.execCommand("foreColor", false, e.target.value)
    })
  }
  option.addEventListener("click", (e) => {
    document.execCommand(e.currentTarget.dataset.command, true, null)
  })
}

menu.addEventListener("click", handleMainClick)
