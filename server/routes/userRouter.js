import express from 'express';
import { uploadAvatar } from '../config/multerUpload.js';
import { authenticateUserToken } from '../middlewares/authServices.js';

import {getCurrentUser, updateAvatarController} from '../controllers/userControllers.js';
import { updateFieldController } from '../controllers/userControllers.js';
import { searchUser } from '../controllers/userControllers.js';
import { deleteAvatarController } from '../controllers/userControllers.js';

import {getUserChats} from "../controllers/chatControllers.js";
import { createUserChat} from "../controllers/chatControllers.js";
import { getChatMessagesController } from "../controllers/chatControllers.js";

const router = express.Router();

router.get('/me', authenticateUserToken,  getCurrentUser)

router.get('/validate-token', authenticateUserToken, (req, res) => {
    return res.status(200).json({
        // success: true,
        // message: 'token is valid',
        // user: req.user
        userId:  req.user.id
    })
})

router.post('/updateProfile/avatar', authenticateUserToken, uploadAvatar, updateAvatarController)

router.delete('/updateProfile/avatar', authenticateUserToken, deleteAvatarController)

router.put('/updateProfile/:field', authenticateUserToken, updateFieldController)

router.get('/search', authenticateUserToken, searchUser)

router.get("/chats", authenticateUserToken, getUserChats)

router.get("/chats/:chatId/messages", authenticateUserToken, getChatMessagesController)

router.post("/chats", authenticateUserToken, createUserChat)
//
// router.put("/chats/:id")
//
// router.delete("/chats/:id")
//
// router.get("/chats/:id/members")
//
// router.post("/chats/:id/members")
//
// router.delete("/chats/:id/members")

export default router;