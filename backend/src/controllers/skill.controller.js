const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res) => {
    try {
        const { title, description, category, difficulty, isPaid, price } = req.body;

        // Check if user is seller if trying to create paid skill
        if (isPaid && req.user.role !== 'seller') {
            return res.status(403).json({
                success: false,
                error: 'Only sellers can create paid skills. Upgrade your account.'
            });
        }

        const skill = await Skill.create({
            title,
            description,
            category,
            difficulty,
            isPaid,
            price: isPaid ? price : 0,
            owner: req.user._id
        });

        // Add to user's skills list
        await User.findByIdAndUpdate(req.user._id, { $push: { skills: skill._id } });

        res.status(201).json({ success: true, data: skill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get current user's skills
// @route   GET /api/skills/my-skills
// @access  Private
exports.getMySkills = async (req, res) => {
    try {
        const skills = await Skill.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: skills.length, data: skills });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all skills (with filters)
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res) => {
    try {
        const { category, difficulty, search, isPaid, owner } = req.query;
        const query = {};

        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (isPaid !== undefined) query.isPaid = isPaid === 'true';
        if (owner) query.owner = owner;

        if (search) {
            query.$text = { $search: search };
        }

        const skills = await Skill.find(query)
            .populate('owner', 'firstName lastName reputation level')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: skills.length, data: skills });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Public
exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)
            .populate('owner', 'firstName lastName reputation level profile');

        if (!skill) {
            return res.status(404).json({ success: false, error: 'Skill not found' });
        }

        res.status(200).json({ success: true, data: skill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update skill
// @route   PATCH /api/skills/:id
// @access  Private (Owner)
exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ success: false, error: 'Skill not found' });
        }

        // Check ownership
        if (skill.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update this skill' });
        }

        // Update fields
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'category', 'difficulty', 'isPaid', 'price', 'images'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ success: false, error: 'Invalid updates!' });
        }

        updates.forEach((update) => skill[update] = req.body[update]);
        await skill.save();

        res.status(200).json({ success: true, data: skill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private (Owner)
exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ success: false, error: 'Skill not found' });
        }

        if (skill.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this skill' });
        }

        await skill.deleteOne();

        // Remove from user's skills list
        await User.findByIdAndUpdate(skill.owner, { $pull: { skills: skill._id } });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
