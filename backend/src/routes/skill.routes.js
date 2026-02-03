const express = require('express');
const {
    createSkill,
    getSkills,
    getMySkills,
    getSkillById,
    updateSkill,
    deleteSkill
} = require('../controllers/skill.controller');
const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/my-skills', auth, getMySkills);

router.route('/')
    .post(auth, createSkill)
    .get(getSkills);

router.route('/:id')
    .get(getSkillById)
    .patch(auth, updateSkill)
    .delete(auth, deleteSkill);

module.exports = router;
