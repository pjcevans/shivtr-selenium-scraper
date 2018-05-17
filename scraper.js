var fs = require('fs');
var page = 1;
var constants = require("./constants.js"); // import username / password from a separate file
// This file should not be version controlled and should have the format:
// var exports = module.exports = {};
// exports.email = 'insert@email.com';
// exports.password = 'passwordexample123';

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var outputArray = [];

function scrapeCurrentPage() {
  for (let i = 2; i < 12; i++) {

    let item = {"player": "", "ip": ""}
    // These asynchronous driver commands need to finish before we push the result to the array and move on to the next item / page.
    driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[" + i + "]/div[1]/a[1]")).getText().then(function(text){ // syncronously scrape current page
      //console.log(JSON.stringify(text))
      if (i === 2) {
        console.log("scraping page" + page);
        page++;
      }
      if (text === "application") { // For people without accepted user accounts the name parameter appears embedded in a string
        driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[" + i + "]/div[1]")).getText().then(function(name){
          let extractedName = name.substring(0, name.lastIndexOf('submitted a new application') - 1) // extract the name from the string
          item["player"] = extractedName; //
        });
      } else if (text === "comment") {
        driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[" + i + "]/div[1]")).getText().then(function(name){
          let extractedName = name.substring(name.lastIndexOf("Applicant added a new comment in ") + 33, name.lastIndexOf('\'s application'))
          item["player"] = extractedName;
        });
      } else {
        item["player"] = text;
      }

    }, function(error) {
      console.log("Error reading first player name")
    }).then(() => {
      driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[" + i + "]/div[2]/span[4]")).getText().then(function(text){ // synchronously navigate to next page
        item["ip"] = text;
        //console.log(item)

        //console.log(outputArray)
      }, function(error) {
        console.log("Error reading first player IP")
      });
    }).then(() => {
      outputArray.push(item)
      //console.log("scraped the page!")
    });

  }
}

function moveToNextPage() {
  let body = driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[2]/div[1]/a[1]")) // Find An element on the old page which will change
  driver.findElement(By.xpath("//div[@class='pagination remote']/a[@class='next_page']")).click() // Click to move to next page
  driver.wait(until.stalenessOf(body), 6000); // Wait until old  element unloaded (ie new page loaded)
}


driver.get('http://shivtr.com/site_admin/171269/audit_logs');
driver.findElement(By.id('user_email')).sendKeys(constants.email);
driver.findElement(By.id('user_password')).sendKeys(constants.password);
driver.findElement(By.name('commit')).click();
driver.wait(until.titleIs('Site Admin | Shivtr'), 1000);
driver.get('http://shivtr.com/site_admin/171269/audit_logs').then(() => { // First promise, loads first page then begins scraper
  // var hello = 0;
  // This needs to be a test to stop scraping new pages when the end page is reached
  // driver.findElements(By.xpath("//div[@class='pagination remote']/a[@class='next_page']")).then(function(array){console.log(array.length)});
  // console.log(hello)
  // console.log(hello)
  // console.log(hello.length)

  for(let i = 1; i < 299; i++) {
    // This log statement shows that functions are called in order but asynchronously (however as both functions are synchronous this does not cause problems)
    // console.log("starting to scrape page " + i)
    scrapeCurrentPage()
    moveToNextPage()
  }


}, function(error) {
  console.log("Error in main scraping loop")
}).then(() => {
  // console.log(outputArray)
  var file = fs.createWriteStream('array.txt');
  file.on('error', function(err) { console.log("error writing to export file") });
  outputArray.forEach(function(v) { file.write("{'player':'" + v.player + "','ip':'" + v.ip + "'},\n"); });
  file.end();
})
//
// .then(() => { // Fourth promise, fulfilled when next page button is clicked
// }, function(error) {
//   console.log("Error navigating to next page");
// }).then(() => { // Fifth promise, fulfilled when second lot of data has been read
//   scrapeCurrentPage();
// }, function(error) {
//   console.log("Error looping over page items");
// });;






// for (let i = 2; i < 12; i++) {
//   console.log("scraping item 2")
//   let item = {"player": "", "ip": ""}
//   driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[" + i + "]/div[1]/a[1]")).getText().then(function(text){
//     console.log(JSON.stringify(text))
//     if (text === "application" || text === "comment") {
//       console.log("ALERT!!!!>:")
//     }
//     item["player"] = text;
//   }, function(error) {
//     console.log("Error reading second player name")
//   }).then(() => {
//     driver.findElement(By.xpath("//div[@id='audit_logs_index']/div[" + i + "]/div[2]/span[4]")).getText().then(function(text){
//       item["ip"] = text;
//       outputArray.push(item)
//       console.log(outputArray)
//     });
//   }, function(error) {
//     console.log("Error reading second player IP")
//   })
// }
