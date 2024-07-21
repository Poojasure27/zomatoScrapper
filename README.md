# Zomato Data Scraper

This project contains a Node.js script that uses Puppeteer to scrape restaurant data from Zomato. The script navigates to specified restaurant URLs, extracts relevant information (like name, price, votes, and description of dishes), and saves the data into an Excel file.

## Features

- Navigates to multiple restaurant pages on Zomato.
- Extracts data such as restaurant name, dish name, price, votes, and description.
- Saves the extracted data into an Excel file (`zomato-items.xlsx`).

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/get-npm)
- [Puppeteer](https://pptr.dev/)
- [xlsx](https://www.npmjs.com/package/xlsx)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/zomato-data-scraper.git
   cd zomato-data-scraper

2. Install the dependencies:
    npm install

3. Create an Excel file (restaurant-urls.xlsx) in the root directory of the project. This file should contain the restaurant URLs to be scraped, with a structure similar to the given excel(sample):
     
## Usage
Run the script:
   node puppeteer.js

The script will launch a headless browser, navigate to each URL listed in restaurant-urls.xlsx, extract the relevant data, and save it to zomato-items.xlsx.

