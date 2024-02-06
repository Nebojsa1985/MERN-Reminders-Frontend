import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  //display
  const editContainer = document.querySelector(".edit-container");
  const createContainer = document.querySelector(".create-container");
  const remindersContainer = document.querySelector(".reminders-container");
  const showEdit = () => (editContainer.style.display = "flex");
  const hideEdit = () => (editContainer.style.display = "none");
  const showCreate = () => (createContainer.style.display = "flex");
  const hideCreate = () => (createContainer.style.display = "none");
  const showReminders = () => (remindersContainer.style.display = "grid");
  const hideReminders = () => (remindersContainer.style.display = "none");
  const newBtnHandle = () => {
    hideEdit();
    hideReminders();
    showCreate();
  };
  const cancelBtnHandle = () => {
    hideCreate();
    hideEdit();
    showReminders();
  };
  //
  const [notes, setNotes] = useState(null);
  const [createReminders, setCreateReminders] = useState({
    head: "",
    description: "",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    head: "",
    description: "",
  });

  //show reminders
  const fetchNotes = async () => {
    const res = await axios.get("https://remindersback.onrender.com/reminder");
    setNotes(res.data.notes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);
  //delete reminder
  const deleteNote = async (_id) => {
    if (window.confirm("Do you really want to delete reminder?")) {
      const res = await axios.delete(
        `https://remindersback.onrender.com/reminder/${_id}`
      );
      const newNotes = [...notes].filter((note) => {
        return note._id !== _id;
      });
      setNotes(newNotes);
    }
  };
  //create reminder
  const createRemindersUpdate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCreateReminders((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const createNew = async (e) => {
    hideEdit();
    hideCreate();
    showReminders();
    const res = await axios.post(
      "https://remindersback.onrender.com/reminder",
      createReminders
    );
    setNotes([...notes, res.data.note]);
  };
  //Update reminder
  const handleChangeOfEditFields = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEditForm((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const editNote = async (e) => {
    hideReminders();

    showEdit();
    setEditForm({
      id: e.target.parentElement.id,
      head: e.target.parentElement.querySelector(".reminder-head").innerHTML,
      description: e.target.parentElement.querySelector(".reminder-description")
        .innerHTML,
    });
    document.querySelector(".edit-container").id = e.target.parentElement.id;
    document.querySelector(".edit-head").value =
      e.target.parentElement.querySelector(".reminder-head").innerHTML;
    document.querySelector(".edit-description").value =
      e.target.parentElement.querySelector(".reminder-description").innerHTML;
  };

  const saveEditedReminder = async (e) => {
    hideEdit();
    showReminders();

    setEditForm({
      id: e.target.parentElement.id,
      head: e.target.parentElement.querySelector(".edit-head").innerHTML,
      description:
        e.target.parentElement.querySelector(".edit-description").innerHTML,
    });
    const head = editForm.head;
    const description = editForm.description;
    const res = await axios.put(
      `https://remindersback.onrender.com/reminder/${editForm.id}`,
      {
        head,
        description,
      }
    );
    fetchNotes();
  };

  //
  return (
    <div className="App">
      <h1 className="head-h1">Reminders</h1>
      <button className="new-btn" onClick={newBtnHandle}>
        🆕
      </button>
      <div className="create-container">
        <h1>Create reminder</h1>
        <input
          placeholder="Enter reminder..."
          type="text"
          name="head"
          onChange={createRemindersUpdate}
        />
        <textarea
          placeholder="Enter reminder description..."
          cols="30"
          rows="5"
          name="description"
          spellCheck="false"
          onChange={createRemindersUpdate}
        ></textarea>

        <button className="create-confirm-btn" onClick={createNew}>
          ✔️
        </button>
        <button className="create-cancel-btn" onClick={cancelBtnHandle}>
          ❌
        </button>
      </div>

      <div className="edit-container">
        <h1>Edit reminder</h1>
        <input
          type="text"
          name="head"
          className="edit-head"
          onChange={handleChangeOfEditFields}
        />
        <textarea
          cols="30"
          rows="5"
          name="description"
          className="edit-description"
          spellCheck="false"
          onChange={handleChangeOfEditFields}
        ></textarea>

        <button onClick={saveEditedReminder} className="save-btn">
          💾
        </button>
        <button className="create-cancel-btn" onClick={cancelBtnHandle}>
          ❌
        </button>
      </div>

      <div className="reminders-container">
        {notes &&
          notes.map((reminder) => {
            return (
              <div
                key={reminder._id}
                id={reminder._id}
                className="reminder-div"
              >
                <h3 className="reminder-head">{reminder.head}</h3>
                <h5 className="reminder-description">{reminder.description}</h5>
                <button
                  onClick={() => deleteNote(reminder._id)}
                  className="delete-btn"
                >
                  ❌
                </button>
                <button onClick={(e) => editNote(e)} className="edit-btn">
                  ✏️
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
