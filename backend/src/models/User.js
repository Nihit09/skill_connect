const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'], // 'seller' can offer paid skills, 'user' is default
        default: 'user'
    },
    reputation: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    exchanges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange'
    }],
    profile: {
        bio: { type: String, maxLength: 500 },
        avatar: { type: String }, // URL to image
        socialLinks: {
            linkedin: String,
            github: String,
            website: String
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Method to check password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate Auth Token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id.toString(), role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
};

// Hide private data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.__v;

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
