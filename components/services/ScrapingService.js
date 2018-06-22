const puppeteer = require('puppeteer');
const fileExists = require('../../util/helpers').fileExists;

class ScrapingService {
    static async  openBrowser() {
        try {
            return await puppeteer.launch();
        } catch(e) {
            console.log('Error: Cant open browser.');
        }
    }
    
    static async openPage(browser) {
        try {
            const page = await browser.newPage();
            
            page.setViewport({
                width: 1280,
                height: 800,
                deviceScaleFactor: 2,
            });
        
            await page.goto('https://yumba.ca/#/on-the-menu');
        
            return page;
    
        } catch (error) {
            console.log('Error: Cant open the page.');
        }
    }
    
    static async closeBrowser(browser, callback) {
        try {
            await browser.close().then(() => {
                callback();
            });    
        } catch (error) {
            console.log('Error: Cant close the browser.');
        }
    }

    static async getMenuImage() {
        let date = new Date();
        let fileName = `menu-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}.jpeg`;
    
        let path = `./public/images/menu/${fileName}`;
    
        return await fileExists(path).then( async exist => {
            if (exist) {
                return fileName;
            } else {
                const browser = await ScrapingService.openBrowser();
                const page = await ScrapingService.openPage(browser);
                
                const menuElement = await page.$('.meals-grid-wrapper');
                
                // Prepare page to take screenshot
                await page.$eval('.navbar', el => {
                    el.style.display = 'none';
                });
                await page.$eval('.section', el => {el.style.padding = '20px';});
                
                await menuElement.screenshot({
                    path: `./public/images/menu/${fileName}`,
                    quality: 80,
                    type: 'jpeg'
                });
    
                await ScrapingService.closeBrowser(browser, () => {
                    console.log('Page closed.');
                });
    
                return fileName;
            }
        });
    
    }
    
    async getList() {
        try {
            const browser = await ScrapingService.openBrowser();
            const page = await ScrapingService.openPage(browser);
    
            if (!page) throw new Error('Page can\'t be open');
            
            const menu = await page.evaluate(() => {
                let items = []; // Create an empty array that will store our data
                let elements = document.querySelectorAll('#entreeMeals .meal-name span'); // Select all Products
                const title = document.querySelector('.meals-grid-wrapper > h5');
        
                for (let element of elements){ // Loop through each proudct
                    let name = element.innerHTML;
                    items.push(name); // Push an object with the data onto our array
                }
        
                return {
                    items: items,
                    title: title && title.innerText
                };
            });

    
            return menu;
        } catch (error) {
            console.log(`Error: When getting image list. (${error})`);
        }
    }
}

module.exports = ScrapingService;