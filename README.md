# Nodejs-instagram--api
# Instagram API Documentation

This API documentation provides an overview of the endpoints and functionalities available for managing users, posts, and likes in an Instagram-like application.

## Base URL

The base URL for all API endpoints is: `https://localhost:3000/`

## Authentication

All API requests require authentication. You need to include an access token in the request headers for authentication. Obtain the access token by registering your application with Instagram.

## Endpoints

### User Endpoints

#### 1. Get User Information

- Endpoint: `/users/:userId`
- Method: `GET`
- Description: Retrieves the information of a specific user.
- Request Parameters:
  - `userId` (required): The unique identifier of the user.
- Response:
  - `200 OK`: Returns the user information in JSON format.
  - `404 Not Found`: If the user does not exist.

#### 2. Create User

- Endpoint: `/users`
- Method: `POST`
- Description: Creates a new user.
- Request Body:
  - `username` (required): The username of the user.
  - `name` (optional): The name of the user.
- Response:
  - `201 Created`: Returns the newly created user information in JSON format.
  - `400 Bad Request`: If the request body is missing required fields.

### Post Endpoints

#### 1. Get Post Information

- Endpoint: `/posts/:postId`
- Method: `GET`
- Description: Retrieves the information of a specific post.
- Request Parameters:
  - `postId` (required): The unique identifier of the post.
- Response:
  - `200 OK`: Returns the post information in JSON format.
  - `404 Not Found`: If the post does not exist.

#### 2. Create Post

- Endpoint: `/posts`
- Method: `POST`
- Description: Creates a new post.
- Request Body:
  - `userId` (required): The unique identifier of the user creating the post.
  - `caption` (optional): The caption of the post.
  - `imageURL` (required): The URL of the image associated with the post.
- Response:
  - `201 Created`: Returns the newly created post information in JSON format.
  - `400 Bad Request`: If the request body is missing required fields.

### Like Endpoints

#### 1. Like Post

- Endpoint: `/posts/:postId/like`
- Method: `POST`
- Description: Likes a post.
- Request Parameters:
  - `postId` (required): The unique identifier of the post to like.
  - `userId` (required): The unique identifier of the user liking the post.
- Response:
  - `200 OK`: Returns a success message indicating the post has been liked.
  - `404 Not Found`: If the post or user does not exist.

#### 2. Unlike Post

- Endpoint: `/posts/:postId/unlike`
- Method: `POST`
- Description: Removes the like from a post.
- Request Parameters:
  - `postId` (required): The unique identifier of the post to unlike.
  - `userId` (required): The unique identifier of the user unliking the post.
- Response:
  - `200 OK`: Returns a success message indicating the post has been unliked.
  - `404 Not Found`: If the post or user does not exist.

## Error Handling

In case of an error, the API will return an appropriate HTTP status code along with a JSON response containing an error message.

Example Error Response:

```json
{
  "error": "Invalid access token"
}
```


## Conclusion

This API documentation provides an overview of the available endpoints for managing users, posts, and likes in an Instagram-like application. Make sure to include the required authentication and handle errors appropriately when using the API. If you have any questions or need further assistance, please refer to the API documentation or contact the API support team.
