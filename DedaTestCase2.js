/*
TEST CASE 2
-Sign in
-dave 7 -- password [username,password]
-type in https://csc450-fa23-project-team-8.vercel.app/assessment_manager
-able to select an assessment
*/



const puppeteer = require('puppeteer');

async function DedaTestCase2() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720});
    //nav to home page type in username pass
    await page.goto('https://csc450-fa23-project-team-8.vercel.app/', { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('#email', 'jeff123@gmail.com');
    await page.type('#password',"password");
    //Screenshot for documentation
    await page.screenshot({path: 'DedaTestCases/TestCase2/1.png'}),

    //navigate to the assessement_manager page then click and delete test assessment
    await Promise.all([
        //login button
        page.click('#submit'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Patients")'//once text on pages loads will properly go to next pg
        ),

        //Page on home    
        await page.screenshot({path: 'DedaTestCases/TestCase2/2.png'}),

        //go to assessment manager page by link
        await page.goto('https://csc450-fa23-project-team-8.vercel.app/assessment_manager/'), // wait until page load
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Publish")'
        ),

        //loaded page documentation
        await page.screenshot({path: 'DedaTestCases/TestCase2/3.png'}),
        
        //mark checkbox wait till view shows up and delete assessment
        await page.click('#checkbox'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("View")'
        ),
        await page.screenshot({path: 'DedaTestCases/TestCase2/4.png'}),

        //for deleting the assessment then wait for browser and quit
        await page.click('#delete'),
        
        await page.waitForNetworkIdle(),
        
        //refresh page
        await page.goto('https://csc450-fa23-project-team-8.vercel.app/assessment_manager/'), // wait until page load
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Publish")'
        ),
        console.log("completed"),
        //screenshot-pdf
        await page.screenshot({path: 'DedaTestCases/TestCase2/5.png'}),
        
        browser.close()
 
       
    ]);

 
}
DedaTestCase2();
  
