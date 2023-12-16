
/*
TEST CASE 1
  -Sign in
  -jeff123 -- password [username, password]
  -click assessment manager
  -sign out
  -sign out properly
*/
const puppeteer = require('puppeteer');

async function DedaTestCase1() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720});
    //nav to home page type in username pass
    await page.goto('https://csc450-fa23-project-team-8.vercel.app/', { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('#email', 'jeff123@gmail.com');
    await page.type('#password',"password");
    await page.screenshot({path: 'DedaTestCases/TestCase1/1.png'}),


    //navigate to the assessement_manager page then click and delete test assessment
    await Promise.all([
        //login button
        page.click('#submit'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Patients")'//once text on pages loads will properly go to next pg
        ),
        await page.screenshot({path: 'DedaTestCases/TestCase1/2.png'}),
        //go to assessment manager page
        page.click('#assessment_manager_button'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Publish")'
        ),
        await page.screenshot({path: 'DedaTestCases/TestCase1/3.png'}),
        //sign out
        await Promise.all([
            page.click('#signOut'),
            page.waitForNavigation({timeout:'3000'}),        
            console.log("completed")
            
        ]),
        await page.screenshot({path: 'DedaTestCases/TestCase1/4.png'}),
        
        browser.close()

 
       
    ]);

 
}
DedaTestCase1();