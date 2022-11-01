## push to heroku

- `git add .`
- `git commit -m "react-create-app on Heroku"`
- `git push heroku master`
- `heroku open`

## To run in in docker
First run:
`docker build -t rumineat-client .`

Then run:
`docker run -d -p 3001:3001 rumineat-client`

To run from source:  
`yarn install`  
`yarn start-dev`  
`go to localhost:3001`
