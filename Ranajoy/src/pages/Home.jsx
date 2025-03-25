import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import NoteModal from '../components/NoteModal'
import axios from 'axios'
import NoteCard from '../components/NoteCard'

const Home = () => {
    const [isModalOpen, setModalOpen] = useState(false)
    const [filteredNotes, setFilteredNote] = useState(false)
    const [notes, setNotes] = useState([])
    const[currentNote, setCurrentNote] = useState(null)
    const [query, setQuery] = useState('')

    useEffect(() => {
         fetchNotes()
    }, [])

    useEffect(() => {
      setFilteredNote(
        notes.filter((note) => 
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.description.toLowerCase().includes(query.toLowerCase()) 
       )
      );
    }, [query, notes])

    const fetchNotes = async () => {
      try {
         const {data} = await axios.get("http://localhost:5000/api/note")
         setNotes(data.notes)
      } catch(error) {
          console.log(error)
      }
   }

    const closeModal = () => {
      setModalOpen(false)
    }

    const onEdit = (note) => {
         setCurrentNote(note)
         setModalOpen(true)

    }

    const addNote = async (title, description) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/note/add", 
        { title, description }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
        );
        if(response.data.success) {
             fetchNotes()
          closeModal()
        }
  
      } catch (error) {
        console.log(error)
      }
    }

   const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/note/${id}`, 
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
      );
      if(response.data.success) {
           fetchNotes()
      
      }

    } catch (error) {
      console.log(error)
    }
   }

    const editNote = async(id, title, description) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/note/${id}`, 
        { title, description }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
        );
        if(response.data.success) {
             fetchNotes()
          closeModal()
        }
  
      } catch (error) {
        console.log(error)
      }

    }
  return (
    <div className='bg-gray-100 min-h-screen'>
     <Navbar setQuery={setQuery}/>

     <div className='px-8 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
          { filteredNotes.length > 0 ? filteredNotes.map((note) => (
            <NoteCard
                  note={note}
                  onEdit={onEdit}
                  deleteNote={deleteNote}
            /> 
          )) : <p>No Notes</p>} 
     </div>

     <button
     onClick={() => setModalOpen(true)}
      className='fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full'>
         +
     </button>
     {isModalOpen && <NoteModal 
     closeModal={closeModal}
     addNote={addNote}
     currentNote={currentNote}
     editNote={editNote}
     />}
    </div>
  )
}

export default Home;
