const express = require("express");
const { default: mongoose } = require("mongoose");
const DataModel = require("./model");
const UserModel = require("./model/user");
const app = express();
const cors = require("cors");
const jwtMiddleware = require("./middleware/index");
const Joi = require("joi");
const createToken = require("./middleware/createToken");

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
};
connectDB();

app.use(cors());
app.use(express.json());
const schema = Joi.object({
  password: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string().email().required(),
});

app.post("/api/addUser", async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    const create = await UserModel.create(value);
    return res.status(201).json({
      success: "User Created!",
      create,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const findUser = await UserModel.findOne({ email: req.body.email });
  if (findUser == null) {
    return res.status(404).json({
      message: "User Not Found !",
    });
  }
  const passCompare = req.body.password === findUser.password;
  if (passCompare) {
    const Token = createToken(findUser);
    res.status(200).json({
      message: "Login Successfull!",
      type: findUser.type,
      Token: Token.token,
    });
  } else {
    res.status(404).json({
      message: "Password is incorrect!",
    });
  }
});

app.get("/api/list", jwtMiddleware, async (req, res) => {
  await DataModel.find()
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Task creation failed",
        });
      res.status(201).json({
        success: true,
        createdTask,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
});

app.post("/api/create", jwtMiddleware, async (req, res) => {
  const newData = req.body;
  await DataModel.create(newData)
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Task creation failed",
        });
      res.status(201).json({
        success: true,
        createdTask,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
});

app.put("/api/update/:id", jwtMiddleware, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  await DataModel.findByIdAndUpdate(id, updatedData)
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Task creation failed",
        });
      res.status(201).json({
        success: "updated data successfully ",
        createdTask,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
});

app.delete("/api/delete/:id", jwtMiddleware, async (req, res) => {
  const id = req.params.id;
  await DataModel.findByIdAndDelete(id)
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Task creation failed",
        });
      res.status(201).json({
        success: "delete data successfully ",
        createdTask,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
});
app.get("/api/byId/:id", jwtMiddleware, async (req, res) => {
  const id = req.params.id;
  await DataModel.findById(id)
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Task creation failed",
        });
      res.status(201).json({
        success: "delete data successfully ",
        createdTask,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
});
const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
