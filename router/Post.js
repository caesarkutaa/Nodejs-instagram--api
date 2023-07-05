/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who created the post
 *         title:
 *           type: string
 *           description: Post title
 *         content:
 *           type: string
 *           description: Post content
 *         images:
 *           type: string
 *           description: Post images
 *         likes:
 *           type: array
 *           description: Post likes
 *         dislikes:
 *           type: array
 *           description: Post dislikes
 *         desc:
 *           type: string
 *           description: Post description
 */


/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 * /posts/{id}/like:
 *   put:
 *     summary: Like a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to like
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked successfully
 * /posts/timeline/all:
 *   get:
 *     summary: Get all posts from timeline
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Retrieved timeline posts successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */




const express = require('express')
const router = express.Router()
const { createpost, getpost, updatePost,deletePost,likePost,gettimelinePost } = require('../controllers/post')




router.post('/', createpost)
router.get('/:id', getpost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/timeline/all', gettimelinePost)






module.exports = router;