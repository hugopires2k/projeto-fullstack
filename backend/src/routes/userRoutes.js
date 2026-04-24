const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.getProfile);

router.get('/', authMiddleware, roleMiddleware('admin'), userController.getUsers);
router.get('/:id', authMiddleware, roleMiddleware('admin'), userController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), userController.updateUser);
router.patch('/:id/password', authMiddleware, roleMiddleware('admin'), userController.updatePassword);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;
