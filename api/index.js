import mongoose from 'mongoose'
import fs, { accessSync } from 'fs'
import express, { json } from "express"
import cors from "cors"
import User from './models/User.js'
import Post from './models/Post.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { error } from 'console'

const upload = multer({ dest: 'uploads/' })
const app = express()

const allowedOrigin = 'http://localhost:5173';

app.use(cors({ credentials: true, origin: allowedOrigin }));
app.use(json())
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(join(__dirname, 'uploads')))

mongoose.connect('mongodb+srv://aman:dhS006JhtqUIGj2o@mern-blogapp.qxndy1m.mongodb.net/?retryWrites=true&w=majority&appName=mern-blogapp');

const salt = await bcrypt.genSalt(10);
const secretKey = '22jj4j5j3j3jkkf';

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const sPass = await bcrypt.hash(password, salt);
        const userDoc = await User.create({
            username,
            password: sPass,
        });
        res.json(userDoc)
    }
    catch (e) {
        res.status(400).json(e)
    }

})
app.post('/login', async (req, res) => {
    const { username, password } = req.body

    const userDoc = await User.findOne({ username });
    const isGenuine = await bcrypt.compare(password, userDoc.password)
    if (isGenuine) {
        jwt.sign({ username, id: userDoc._id }, secretKey, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token).json({ username, id: userDoc._id });
        })
    }
    else {
        res.status(400).json('Credentials not found!!')
    }
})
app.get('/profile', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, secretKey, {}, (err, info) => {
        if (err) throw err;
        res.json(info)
    })
})

app.get('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})
app.post('/post', upload.single('file'), async (req, res) => {
    const { title, summary, content } = req.body
    const { originalname, path } = req.file
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]

    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath)
    const { token } = req.cookies

    jwt.verify(token, secretKey, {}, async (err, info) => {
        if (err) throw err;
        const postDoc = await Post.create({
            title, summary, content, cover: newPath, author: info.id,
        })
        res.status(200).json({ postDoc })

    })


})
app.put('/post', upload.single('file'), async (req, res) => {

    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath)
    }
        
    const { token } = req.cookies
    jwt.verify(token, secretKey, {}, async (err, info) => {
        if (err) throw err;
        const { id,title, summary, content } = req.body
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
        if(!isAuthor) {
            return res.json("You're not the author")
        }
         await postDoc.updateOne({
            title, summary, content, cover: newPath?newPath:postDoc.cover, 
        })
        res.status(200).json({ postDoc })
        
    })
 


})

app.get('/post', async (req, res) => {
    const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20)
    res.json(posts)
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const postDoc = await Post.findById(id).populate('author', ['username'])
    res.json(postDoc)
})
//deleting the post
app.delete('/delete/:id', async (req, res) => {
    const { token } = req.cookies;
    const {id}=req.params
    // Verify JWT token
    jwt.verify(token, secretKey, {}, async (err, info) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Find the post by ID
            const postDoc = await Post.findById(id);

            if (!postDoc) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Check if the authenticated user is the author of the post
            if (postDoc.author.toString() !== info.id) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Delete the post cover file if exists
            if (postDoc.cover) {
                fs.unlinkSync(postDoc.cover);
            }

            // Delete the post
            await Post.findByIdAndDelete(id);

            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

const port = 4000;
app.listen(port)

// amanpartelyt@gmail.com -> mongodbatlas
// created new project and cluster name: mern-blogapp,
// username : aman
