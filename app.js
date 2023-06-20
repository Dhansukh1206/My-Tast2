const express = require('express');
const { default: mongoose } = require('mongoose');
const DataModel = require('./model');
const app = express();
const cors = require('cors')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb://localhost:27017/test`, {
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
connectDB();

app.use(cors())
app.use(express.json());

app.get('/api/list', async (req, res) => {
    await DataModel.find()
        .then((createdTask) => {
            if (!createdTask) return res.status(404)
                .json({
                    message: "Task creation failed",
                })
            res.status(201)
                .json({
                    success: true,
                    createdTask
                })
        }).catch((error) => {
            res.status(404)
                .json({
                    success: false,
                    error: error.message
                })
        })
})

app.post('/api/create', async (req, res) => {
    const newData = req.body
    await DataModel.create(newData)
        .then((createdTask) => {
            if (!createdTask) return res.status(404)
                .json({
                    message: "Task creation failed",
                })
            res.status(201)
                .json({
                    success: true,
                    createdTask
                })
        }).catch((error) => {
            res.status(404)
                .json({
                    success: false,
                    error: error.message
                })
        })
})

app.put('/api/update/:id', async (req, res) => {
    const id = req.params.id
    const updatedData = req.body
    await DataModel.findByIdAndUpdate(id, updatedData)
        .then((createdTask) => {
            if (!createdTask) return res.status(404)
                .json({
                    message: "Task creation failed",
                })
            res.status(201)
                .json({
                    success: 'updated data successfully ',
                    createdTask
                })
        }).catch((error) => {
            res.status(404)
                .json({
                    success: false,
                    error: error.message
                })
        })
})

app.delete('/api/delete/:id', async (req, res) => {
    const id = req.params.id
    await DataModel.findByIdAndDelete(id)
        .then((createdTask) => {
            if (!createdTask) return res.status(404)
                .json({
                    message: "Task creation failed",
                })
            res.status(201)
                .json({
                    success: 'delete data successfully ',
                    createdTask
                })
        }).catch((error) => {
            res.status(404)
                .json({
                    success: false,
                    error: error.message
                })
        })
})
app.get('/api/byId/:id', async (req, res) => {
    const id = req.params.id
    await DataModel.findById(id)
        .then((createdTask) => {
            if (!createdTask) return res.status(404)
                .json({
                    message: "Task creation failed",
                })
            res.status(201)
                .json({
                    success: 'delete data successfully ',
                    createdTask
                })
        }).catch((error) => {
            res.status(404)
                .json({
                    success: false,
                    error: error.message
                })
        })
})
const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});