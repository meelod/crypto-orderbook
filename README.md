# NASCENT TAKE HOME TEST

## Assignment

Please thoroughly review the provided Assignment requirements PDF for the description.

## Candidate Notes

Currently, the Orderbook pulls the data from the server and then updates the client side
whenever orders are made from the user. The reason I have done it like this is because I wanted to first
test to see if the orders would be executed without having to change the JSON files. If given more time, I would have updated the server.js code so that users can update the JSON on the server.

For the design, I wanted it to replicate the Orderbook and Order Forms from the Coinbase cryptobook video.
It made sense not to make any changes if it was already working well for so many users, at least that
is my assumption. One aspect about the orderbook I kept was how the bids and asks are sorted,
where the top of the bids are the highest and the bottom of the asks are the lowest. In the future,
I would have added a way to highlight which of the ask orders would be fulfilled first if the user
decided to do a market order.

My test cases right now check to see if the webpage and the orderbook are present. In the future, a good
test case to implement would be to check to see if connection to the server is valid and if data is being pulled
and shown on the orderbook. Another good test case would be to see if orders are updating the server.

## About the Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode along with the mock server\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The mock server is running on [http://localhost:3001](http://localhost:3001).

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
