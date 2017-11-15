const puppeteer = require('puppeteer');

async function getMenuImage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let fileName = '';

    page.setViewport({
        width: 1280,
        height: 800,
        deviceScaleFactor: 2,
    });
    await page.goto('https://yumba.ca/#/on-the-menu');
    const menuElement = await page.$('.meals-grid-wrapper');
    const navigation = await page.$eval('.navbar', el => {
        el.style.display = 'none';
    });

    const container = await page.$eval('.section', el => {el.style.padding = '20px'});

    try {
        console.log("Create screen shot");
        fileName = `menu-${new Date().getTime()}.jpeg`;
        await menuElement.screenshot({
            path: `./public/images/menu/${fileName}`,
            quality: 80,
            type: 'jpeg'
        });
    } catch (error) {
        console.log(`Error: When taking screenshot. ${error}`);
    }
  
    await browser.close().then(() => {
        console.log('closed');
    });
    return fileName;
};

module.exports = {
    getMenuImage: getMenuImage,
}