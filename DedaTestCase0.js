
/*
TESTS: <Noah Deda>'s Delete Assesment Black Box tests".
TEST CASE 0
-Sign in
-jeff123 -- password [username, password]
-Click Assessment Manager
-ERROR too many hooks vvvvvv
-Click Assessment Manager OR try again
-loads the page properly
-Select a test
- Press Delete button
  -Removes from storage[The admin is able to delete assessments from the database.]
  
*/

const puppeteer = require('puppeteer');

  
async function DedaTestCase0() {
    
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720});
    //nav to home page type in username pass
    await page.goto('https://csc450-fa23-project-team-8.vercel.app/', { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('#email', 'jeff123@gmail.com');
    await page.type('#password',"password");
    await page.screenshot({path: 'DedaTestCases/TestCase0/1.png'}),

    //navigate to the assessement_manager page then click and delete test assessment
    await Promise.all([
        //login button
        page.click('#submit'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Patients")'//once text on pages loads will properly go to next pg
        ),

        //document home
        await page.screenshot({path: 'DedaTestCases/TestCase0/2.png'}),

        //go to assessment manager page
        page.click('#assessment_manager_button'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Publish")'
        ),
        //load assessment page
        await page.screenshot({path: 'DedaTestCases/TestCase0/3.png'}),
        
        //mark checkbox wait till view shows up and delete assessment
        await page.click('#checkbox'),
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("View")'
        ),


        await page.screenshot({path: 'DedaTestCases/TestCase0/4.png'}),
        //for deleting the assessment then wait for browser and quit
        await page.click('#delete'),
        
        await page.waitForNetworkIdle(),
        
        //refresh page
        await page.goto('https://csc450-fa23-project-team-8.vercel.app/assessment_manager/'), // wait until page load
        await page.waitForFunction(
            'document.querySelector("body").innerText.includes("Publish")'
        ),
        console.log("completed"),
        //screenshot-sc
        await page.screenshot({path: 'DedaTestCases/TestCase0/5.png'}),
        
        browser.close()

 
       
    ]);

 
}

DedaTestCase0();
  
