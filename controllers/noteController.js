const User = require("../models/User")
const Note = require("../models/Node")
// use async handler
const asyncHandler = require('express-async-handler')
// hashing our user password
const bcrypt = require('bcrypt')
const { el } = require("date-fns/locale")
const { findOne } = require("../models/User")