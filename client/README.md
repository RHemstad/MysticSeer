
# Mystic Seer Client Side Read Me

## Setting up for Vite

Create your project folder
Make sure node is installed
npm create vite@latest client --template vanilla
choose framework: vanilla
select variant: javascript

cd into client
npm install

## Run the client side
npm run dev  //make sure you cd into client folder in order for this to work


## Important Notes
On script.js (client directory) put the render.com server address when ready to deploy
For localhost purposes just use http:localhost:5000

Deployment on verce occurs when pushed to main

## TroubleShooting
if you get the request failed, check your api key against:
https://openai.com/blog/openai-api

you may need to install axios if you run into 404 errors with get responses
npm i axios



