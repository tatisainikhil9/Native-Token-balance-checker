
# Native Token Balance Checker
This repository consist of two front end application which fetches the native token balance of an externally owned account. (example : Ethereum is the native token on Ethereum blockchain).
Along with the native token balance of the account, also fetch and display the percentage change in balance in the last 12 hours.
If the balance reduces by 10% in the last 12 hours, the user should be notified with an alert on the application.

## How to Run

### HTML front end application
- Just open the Flint_Assignment.html file in the Flint_Assignment_HTML folder.
- You need to choose a network and input the externally owned address for which you want to fetch balance and calculate the percentage change past 12 hours.
- After clicking the button you will be shown the balance and percentage change. 

### React App (Follow these steps)
#### Prerequisites

- Node.js and npm installed on your machine.

#### Steps

1. Clone the repository

2. Navigate to the project directory

   ``` cd Native-Token-balance-checker ```

3. Install dependencies:
```npm install``` and ```npm install ethers ethers-react```

4. Start the application:

   ```npm start``` 

   The app will be accessible at [http://localhost:3000](http://localhost:3000) in your browser.

## Code Overview

### `src/App.js`
Main App Component which launches a component for each Network

### `src/NetworkDataDisplay.js`
This component displays information about a network, such as its balance and percentage change. It utilizes Ethereum's JSON-RPC provider to fetch data, calculate the balance change, and set up automatic updates at specified intervals. The component also generates an alert message if the balance decreases by more than 10% in the last 12 hours. It includes sub-components for displaying the network name, balance, percentage change, and alert message. The data is fetched and updated asynchronously to provide real-time information, making it suitable for monitoring Ethereum networks in a web application.
