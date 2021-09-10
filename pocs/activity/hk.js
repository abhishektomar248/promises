const loginLink = "https://www.hackerrank.com/auth/login";
const emailpassObj = require("./secrets");
const { answers } = require("./code");
const puppeteer = require("puppeteer");
// creates headless browser
let browserStartPromise = puppeteer.launch({
    // visible 
    headless: false,
    // type 1sec // slowMo: 1000,
    defaultViewport: null,
    // browser setting 
    args: ["--start-maximized", "--disable-notifications"]
});
let page, browser;
browserStartPromise
    .then(function (browserObj) {
        console.log("Browser opened");
        // new tab 
        browser = browserObj
        let browserTabOpenPromise = browserObj.newPage();
        return browserTabOpenPromise;
    }).then(function (newTab) {
        page = newTab
        console.log("new tab opened ")
        let gPageOpenPromise = newTab.goto(loginLink);
        return gPageOpenPromise;
    }).then(function () {
        let emailWillBeEnteredPromise = page.type("input[id='input-1']", emailpassObj.email, { delay: 50 });
        return emailWillBeEnteredPromise;
    }).then(function () {
        let passwordWillBeEnteredPromise = page.type("input[type='password']", emailpassObj.password, { delay: 50 });
        return passwordWillBeEnteredPromise;
    }).then(function () {
        let loginWillBeDOnepromise = page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
        return loginWillBeDOnepromise;
    })
    .then(function () {
        let clickedOnAlgoPromise = waitAndClick(".track-card a[data-attr2='algorithms']", page);
        return clickedOnAlgoPromise;
    }).then(function () {
        let getToWarmUp = waitAndClick("input[value='warmup']", page);
        return getToWarmUp;
    }).then(function () {
        let waitFor3SecondsPromise = page.waitFor(3000);
        return waitFor3SecondsPromise;
    // }).then(function () {
    //     let challengeClickPromise = page.click(".challenge-submit-btn", { delay: 100 });
    //     return challengeClickPromise;``

    // })
    }).then(function(){
        let AllChallengesArrPromise=page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{delay: 100});
        return AllChallengesArrPromise;
    }).then(function(questionArr){
        //n number of question first
        console.log("number of questions",questionArr.length);
        let qWillBeSolvedPromise=questionSolver(page,questionArr[0],answers[0]);
        return qWillBeSolvedPromise;
    })
function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
        waitForModalPromise
            .then(function () {
                let clickModal =
                    cPage.click(selector, { delay: 100 });
                return clickModal;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err)
            })
    }
    )
}
// return a promise -> that will submit a given question 
function questionSolver(page, question, answer) {
    return new Promise(function (resolve, reject) {
        let qWillBeCLickedPromise = question.click();

        qWillBeCLickedPromise
            //click
            // code type 
            // ctrl A+ ctrl x
            // click on editor 
            // ctrl A+ctrl v
            //  reached to editor
            .then(function () {
                // focus // ye humne phele click kiya kyu ki jaise ki developer n phele bas question hi banaya aur inout wala part baad 
                //m add kiya ho isliye humne ye phle click kiya 
                let waitFOrEditorToBeInFocus =
                    waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            // click
            .then(function () {
                return waitAndClick(".checkbox-input", page);
            }).then(function () {
     return page.waitForSelector("textarea.custominput", { visible: true });// yha humne phele "#input-1" likha par ye baar baar change ho 
     //rha tha isliye humne dusra selector choose kiya 
            })
            .then(function () {
                return page.type("textarea.custominput", answer, { delay: 10 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                return page.keyboard.press("X", { delay: 100 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            })
            .then(function () {
                // focus 
                let waitFOrEditorToBeInFocus =
                    waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            .then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("V", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            }).then(function () {
               // return page.click("button.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled", { delay: 50 });
                return page.click(".hr-monaco__run-code", { delay: 50 });
            })
            .then(function () {
                resolve();
            }).catch(function (err) {
                console.log(err)
                reject(err);
            })
    })
}
