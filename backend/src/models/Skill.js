const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 20
    },
    category: {
        type: String,
        required: true,
        enum: ['Sales', 'Web Development', 'Design', 'Data Science', 'Marketing', 'Music', 'Language', 'Other']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
        validate(value) {
            if (this.isPaid && value <= 0) {
                throw new Error('Price must be greater than 0 for paid skills');
            }
        }
    },
    images: [{
        type: String // URLs
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for search
skillSchema.index({ title: 'text', description: 'text' });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
