const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

// Helper function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    console.log("Launching browser...");
    // Launch the browser with the --disable-http2 flag
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-http2'],
      timeout: 60000, 
    });

    // Read URLs from the Excel file
    const workbook = xlsx.readFile('restaurant-urls.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const urlsData = xlsx.utils.sheet_to_json(sheet);

    // Array to hold all the data
    let allItems = [];

    for (let index = 0; index < urlsData.length; index++) {
      const url = urlsData[index].url;
      console.log(`Navigating to URL: ${url}`);

      // Create a new page
      const page = await browser.newPage();

      console.log("Setting user agent...");
      // Set a user-agent string
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      console.log("Navigating to URL...");
      // Go to the Zomato page
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // Increase the timeout to 60 seconds

      console.log("Scrolling down the page...");
      // Scroll down the page
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      //data extraction
      console.log("Extracting data...");
      const items = await page.evaluate(() => {
        const item = [];
        const nameSelector = '.sc-1s0saks-15.iSmBPS';
        const priceSelector = '.sc-17hyc2s-1.cCiQWA';
        const votesSelector = '.sc-z30xqq-4.hTgtKb';
        const descriptionSelector = '.sc-1s0saks-12.hcROsL';
        const restaurantNameSelector = '.sc-7kepeu-0.sc-iSDuPN.fwzNdh';

        const nameElements = document.querySelectorAll(nameSelector);
        const priceElements = document.querySelectorAll(priceSelector);
        const votesElements = document.querySelectorAll(votesSelector);
        const descriptionElements = document.querySelectorAll(descriptionSelector);
        const restaurantName = document.querySelector(restaurantNameSelector)?.textContent.trim() || "Unknown";

        for (let i = 0; i < nameElements.length; i++) {
          const name = nameElements[i] ? nameElements[i].textContent.trim() : null;
          const price = priceElements[i] ? priceElements[i].textContent.trim() : null;
          const votes = votesElements[i] ? votesElements[i].textContent.trim() : null;
          const description = descriptionElements[i] ? descriptionElements[i].textContent.trim() : null;

          item.push({ restaurant: restaurantName, name, price, votes, description });
        }

        return item;
      });

      console.log(`Data extracted for URL: ${url}`, items);

      // Add the items to the allItems array
      allItems = allItems.concat(items);

      console.log("Closing page...");
      await page.close();
    }

    console.log("Closing browser...");
    await browser.close();

    console.log("Creating Excel file...");
    // Create an Excel file sheet
    const worksheet = xlsx.utils.json_to_sheet(allItems);
    const resultWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(resultWorkbook, worksheet, "Items");
    xlsx.writeFile(resultWorkbook, "zomato-items.xlsx");

    console.log("Scraping completed and data saved to zomato-items.xlsx");
  } catch (error) {
    console.error("Error:", error);
  }
})();





