const puppeteer = require('puppeteer');

 async function DedaUploadTest() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720});
    //nav to home page type in username pass
    await page.goto('https://csc450-fa23-project-team-8.vercel.app/', { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('#email', 'jeff123@gmail.com');
    await page.type('#password',"password");
    await page.screenshot({path: 'DedaTestCases/TestCase0/1.png'}),


    //navigate to the assessement_manager page then go to upload assessment page
    await Promise.all([
        //login button
        page.click('#submit'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Patients")'//once text on pages loads will properly go to next pg
        ),
     

        //go to assessment manager page
        page.click('#assessment_manager_button'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Publish")'
        ),


        //go to upload assessment page
        page.click('#Upload'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Sample Assessment")'
        ),
    ]);

        //Upload dummy file method
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#browse'),

        ]);
        await fileChooser.accept(['LiamTestCases/TestCase3/fullJson.zip']);
        await page.waitForTimeout(3000),//depreicated but the other reccomended method didnt work for me



        await page.click('#uploadFile'),
        await page.waitForTimeout(2000),//depreicated but the other reccomended method didnt work for me
        console.log("completed");

        
        browser.close()
 
}
DedaUploadTest();
  