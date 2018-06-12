const puppeteer = require('puppeteer');
const fileExists = require('../util/helpers').fileExists;


async function openBrowser() {
    try {
        return await puppeteer.launch();
    } catch(e) {
        console.log('Error: Cant open browser.');
    }
}

async function openPage(browser) {
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

async function closeBrowser(browser, callback) {
    try {
        await browser.close().then(() => {
            callback();
        });    
    } catch (error) {
        console.log('Error: Cant close the browser.');
    }
}


async function getMenuImage() {
    let date = new Date();
    let fileName = `menu-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}.jpeg`;

    let path = `./public/images/menu/${fileName}`;

    return await fileExists(path).then( async exist => {
        if (exist) {
            return fileName;
        } else {
            const browser = await openBrowser();
            const page = await openPage(browser);
            
            const menuElement = await page.$('.meals-grid-wrapper');
            const navigation = await page.$eval('.navbar', el => {
                el.style.display = 'none';
            });

            const container = await page.$eval('.section', el => {el.style.padding = '20px'});
            
            await menuElement.screenshot({
                path: `./public/images/menu/${fileName}`,
                quality: 80,
                type: 'jpeg'
            });

            await closeBrowser(browser, () => {
                console.log('Page closed.');
            });

            return fileName;
        }
    });

};

async function getMenuList() {
    try {
        const browser = await openBrowser();
        const page = await openPage(browser);

        if (!page) throw new Error('Page can\'t be open');
        
        const result = await page.evaluate(() => {
            let data = []; // Create an empty array that will store our data
            let elements = document.querySelectorAll('#entreeMeals .meal-name span'); // Select all Products
    
            for (var element of elements){ // Loop through each proudct
                let name = element.innerText;
                data.push(name); // Push an object with the data onto our array
            }
    
            return data; // Return our data array
        });

        return result;
    } catch (error) {
        console.log(`Error: When getting image list. (${error})`);
    }
}

module.exports = {
    getMenuImage: getMenuImage,
    getMenuList: getMenuList,
}