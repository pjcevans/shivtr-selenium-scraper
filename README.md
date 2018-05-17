What:
A web scraper that usues Selenium-webdriver to scrape IP addresses from http://shivtr.com/ As part of an IP tracking system requested by members of a retro-gaming community

Why:
The Shivtr Admin Panel is more easily navigated by a selenium driven browser. This approach slows down scraping but as only 300 pages need to be scraped using selenium is still perfectly feasible

How:
Implemented with Selenium-webdriver the scraper logs in using provided login information and then scrapes each page of the 3 month IP log history.

Username and Password constants are required to be added to a `constants.js` file in the root of the application and should be exported thus:

var exports = module.exports = {};
exports.email = 'insert@email.com';
exports.password = 'passwordexample123';

`constants.js` should not be added to version control
