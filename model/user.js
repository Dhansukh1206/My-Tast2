const {
      Schema,
      model
  } = require("mongoose");
  
  const MySchema = new Schema({
      email: {
          type: String,
          required: true,
      },
      password: {
          type: String,
          required: true,
      },
      type: {
          type: String,
          required: true,
      },
  });
  
  const UserModel = model("user", MySchema)
  
  module.exports = UserModel