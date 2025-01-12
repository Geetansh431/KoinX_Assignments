
# KoinX

This project is a server-side application built with Node.js and MongoDB that tracks and provides statistics for three cryptocurrencies: Bitcoin, Matic, and Ethereum. The application fetches real-time data from the CoinGecko API and includes endpoints to retrieve and analyze this data.


## Features

- A scheduled job runs every 2 hours to fetch the latest price (in USD), market cap (in USD), and 24-hour change for Bitcoin, Matic, and Ethereum from the CoinGecko API.
- The fetched data is stored in a MongoDB database.
- Retrieves the most recent statistics for a specified cryptocurrency which includes details such as the latest price, market cap, and 24-hour change percentage.
- Computes the standard deviation of the price for the last 100 records stored in the database for a specified cryptocurrency.


## Tech Stack

**Node.js**: Backend runtime environment.

**Express.js**: Framework for creating RESTful APIs.

**MongoDB**: Database to store cryptocurrency data.

**Mongoose**: ODM for MongoDB.

**Node-cron**: For scheduling background jobs.

**Axios**: For making HTTP requests to the CoinGecko API.



## API Endpoints

#### update Crypto data on demand

```http
  GET api/cryptocurrency/update-crypto-data
```


#### Get stats

```http
  GET api/cryptocurrency/stats?coin=${coin name}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `coin name`      | `string` | **Required**. name of the coin |


#### Get deviation

```http
  GET api/cryptocurrency/deviation?coin=${coin name}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `coin name`      | `string` | **Required**. name of the coin |






## Run Locally

#### Clone the project

```bash
git clone https://github.com/YourUsername/cryptocurrency-tracker.git  
cd cryptocurrency-tracker  
```

#### Install dependencies

```bash
  npm install
```

#### Set Up Environment Variables

A template file, .env.example, is provided in the repository.

Copy the .env.example file and rename it to .env

```bash
  cp .env.example .env
```

Fill in the required values in the .env file (e.g., MongoDB connection string, port number)


#### Start the server

```bash
  npm run start
```


## Example output

### Stats API

Request:
````http
GET http://localhost:5000/stats?coin=ethereum  
````

response:
````json
{  
  "price": 2000,  
  "marketCap": 500000000,  
  "24hChange": 2.5  
}  
````

### Deviation API

Request:
````http
GET http://localhost:5000/deviation?coin=bitcoin  
````

response:
````json
{  
  "deviation": 4082.48  
}  
````

## Authors

- [Geetansh431](https://www.github.com/Geetansh431)


## Thank You!❤️


We sincerely appreciate your interest in this project. If you have any questions, suggestions, or need assistance, feel free to reach out through the issue tracker or discussions. Your feedback is invaluable and will help improve this project. Happy coding! 🤩