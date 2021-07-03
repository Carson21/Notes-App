const save = document.querySelector("#save");
const newNote = document.querySelector("#new-note");
const notesElement = document.querySelector("#notes");
const noteArea = document.querySelector("#note");

const saveCurrentNote = () => {
    
}

const renderNotes = () => {
    notesElement.innerHTML = null;
    for(note of notes) {
        let root = document.createElement("div");
        let title = document.createElement("h4");
        root.classList.add("note");
        root.id = note.id;
        title.innerHTML = note.name;
        title.classList.add("note-title");
        root.appendChild(title);
        root.addEventListener("click", noteClicked);
        notesElement.appendChild(root);
    }
}

const noteClicked = (e) => {
    changeActive(e.currentTarget);
}

const changeActive = (elem) => {
    getCurrentNoteElement().classList.remove("active");
    setCurrentNote(elem.id);
    getCurrentNoteElement().classList.add("active");
    noteArea.innerHTML = currentNote.content;
}

const deleteNote = () => {

}

const createNote = () => {
    let name = prompt("Note Name?");
    updateCount();
    notes.unshift({id: `n-${count}`, name: name, content: null});
    currentNote = notes[0];
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    changeActive(getCurrentNoteElement());
}

const setCurrentNote = (id) => {
    for (note of notes) {
        if (note.id === id) {
            currentNote = note;
        }
    }
}

const getNotes = () => {
    let notes = JSON.parse(localStorage.getItem("notes"));
    if(notes === null) {
        localStorage.setItem("notes", JSON.stringify([]));
        return [];
    } else {
        return notes;
    }
}

const getCount = () => {
    let localCount = JSON.parse(localStorage.getItem("count"));
    if(localCount === null) {
        localStorage.setItem("count", JSON.stringify(0));
        return 0;
    } else {
        return localCount;
    }
}

const updateCount = () => {
    count++;
    localStorage.setItem("count", count);
}

const getCurrentNoteElement = () => {
    return document.querySelector(`#${currentNote.id}`);
}

noteArea.innerHTML = null;

let notes = getNotes();
let currentNote = notes[0];
let count = getCount();
renderNotes();
changeActive(getCurrentNoteElement());


save.addEventListener("click", saveCurrentNote);
newNote.addEventListener("click", createNote);

