APP NAME: Hatchlink--Server API

TO DEMO:
user name: testuser
password: 1234ABC!b

URL: https://hatchlink-client-htzq76g67.vercel.app/
GITHUB: https://github.com/zeeatwork/hatchlink-server
HEROKU: https://blooming-reef-68223.herokuapp.com/

SUMMARY: HatchLink is an app that allows self-taught developers to create an account rate learning resources of all kinds. Users can share resource names, type of teaching tool (book, online, self-guided), rating, cost and other details. Users have the ability to add and rate all resources after logging in.

TECHNOLOGY USED: This app used JavaScript throughout. React.JS was used as a client side framework. Server-technology relies on Node.JS with Express. Database implementation performed in PostgreSQL. Client side deployment was performed in Vercel whele server-side deployment (including the database) was performed in Heroku.

API DOCUMENTATION: HatchLink is designed as a RESTful API. It uses simple decriptive URLs, accepts standard request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

Login authentification to the API is performed via JWT-Authentification. Username passwords are hashed for encryption. Here are the HTTP RESPONSE CODES:

200 - OK Everything worked as expected.
400 - Bad Request The request was unacceptable, often due to missing a required parameter.
404 - Not Found The requested resource doesn't exist.
500 - Server Errors Something went wrong on HatchLink's end. (These are rare.)

ERROR TYPES:
authentication_error Failure to properly authenticate yourself in the request.
validation error: At login or signup endpoints- duplicate username, password too short or simple (must be more than 8 characters, use upper and lowercase letters, special characters and numbers).
validation error: in forms--attempting to submit a form without required information

METHODS & ENDPOINTS
api/resources
GET -- retrieves resources from hatchlink_resources database to display on main resources page
POST -- adds new resource submitted by user from addResource form client to hatchlink_resources database

api/resources/:resource_id
GET -- retrieves a single resource with expanded information from hatchlink_resources database after client's selection by click
DELETE -- deletes resource by client request by delete button on expanded resource page (client side)
PATCH -- updates resource information via update form submitted by user

api/reviews
POST -- Adds review to associated resource. Linked to client side request from resource review form. Database linked by resource id == review's parent id. Adds review to hatchlink_reviews database.

api/auth
POST -- retrieves username and hashed password from client-side login request, authenticates with JWT, sends appropriate response (error, ok => site access)

api/users
POST -- Adds new users from sign up form to hatchlink_user database

SAMPLE CALLS & RESPONSES

Sign-up REQUEST: {
"password": "Wwdi123\$" (hashed during transmission),
"user_name": "sara121",
"full_name": "Sara Abrams"
}
RESPONSE: 201 "created"

REVIEW REQUEST: body{
"comment": "good lectures, explained loops well",
"overall_rating": 6,
"communication_rating": 8,
"has_exercises": true ,
"has_materials": true,
"has_quizzes": false,
"parent_id": 4 (linked to resource id 4),
}

RESOPONSE: 201 with request body

URL: https://hatchlink-client-htzq76g67.vercel.app/
