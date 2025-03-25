import express from 'express'
import Note from '../models/Note.js'
import middleware from '../middleware/middleware.js';

const router = express.Router()

router.post('/add', middleware, async (req, res) => {
    try {
        console.log("Received request body:", req.body); // 🔍 Debugging line

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and Description are required" });
        }

        const newNote = new Note({ title, description, userId: req.user.id });
        await newNote.save();

        return res.status(200).json({ success: true, message: "Note Created Successfully" });

    } catch (error) {
        console.error("Error in Adding Note:", error); // Logs full error
        return res.status(500).json({ success: false, message: "Error in Adding Note" });
    }
});

 router.get('/', async (req, res) => {
    try{
        const notes = await Note.find()
        return res.status(200).json({success: true, notes})
    } catch(error) {
        return res.status(500).json({success: false, message: "cant retrive notes" })
    }
 })

 router.put("/:id", async(req, res) => {
    try {
          const {id} = req.params;
          const updateNote = await Note.findByIdAndUpdate(id, req.body)
          return res.status(200).json({success: true, updateNote})
        } catch(error) {
            return res.status(500).json({success: false, message: "cant update notes" })
        }
    })
 
    router.delete("/:id", async(req, res) => {
        try {
              const {id} = req.params;
              const updateNote = await Note.findByIdAndDelete(id)
              return res.status(200).json({success: true, updateNote})
            } catch(error) {
                return res.status(500).json({success: false, message: "cant delete notes" })
            }
        })
 
export default router;