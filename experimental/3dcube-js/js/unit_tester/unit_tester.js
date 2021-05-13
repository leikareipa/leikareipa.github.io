/*
 * Most recent known filename: js/unit_tester/unit_tester.js
 *
 * Tarpeeksi Hyvae Soft 2018
 *
 * Basic unit-testing, relying on try/catch.
 * 
 * The functions of note are require(), reject(), and run_tests(). The first two will
 * throw on conditional failure, so you'll want to call them on the code you want
 * to test; and the third takes as an argument a function which contains calls to
 * the first two on the data to be tested, runs it, and construcst a HTML report on
 * the results.
 * 
 * The function you may want to pass to run_tests() could be something like this:
 * 
 *      tests_fn = function()
 *      {
 *          unit_text_n.test_unit("Unit 1", function()
 *          {
 *              unit_test_n.require((1 === 1), "Expected to pass.");
 *              unit_test_n.reject((1 === 2), "Expected to fail.");
 *          });
 * 
 *          unit_text_n.test_unit("Unit 2", function()
 *          {
 *              unit_test_n.reject((1 === 2), "Expected to fail.");
 *          });
 *      };
 * 
 * In that case, the HTML report would include entries called 'Unit 1' and 'Unit 2',
 * which correspond to units of code by those name, along with information about
 * whether all of the tests for that unit in the function passed or whether any
 * one of them failed.
 *
 */

"use strict"

const unit_test_n = {};
{
    // The HTML element into which we'll print the test results.
    unit_test_n.resultsTable = undefined;

    // A list of all the tests performed.
    unit_test_n.testList = [];

    // What the test will be called on the HTML report. You might use the name
    // of the program, for instance. This is user-facing.
    unit_test_n.testName = "";

    // Used by tests to evaluate conditions which must be true.
    unit_test_n.require = function(condition = false, failMessage = "")
    {
        k_assert((failMessage.length > 0), "Empty fail strings are discouraged.");
        
        if (!condition)
        {
            throw Error(failMessage);
        }

        unit_test_n.testList.push(failMessage);
    }

    // Used by tests to evaluate conditions which must be false. In practice, this
    // means passing in a function which attempts to perform illegal actions, like
    // initializing objects with values out of bounds. If something down the pipeline
    // throws on it, this will catch and consider it a success; otherwise the program
    // is considered to have failed to reject an illegal condition.
    //
    /// FIXME: Will return 'pass' by not throwing if code inside the illegal function
    ///        throws for any reason, including for just not working at all. For the
    ///        moment, you'll want to first verify with require() that the code works
    ///        with non-illegal operations.
    unit_test_n.reject = function(illegal_f = Function, failMessage = "")
    {
        k_assert((illegal_f instanceof Function), "Expected a function.");
        k_assert((failMessage.length > 0), "Empty fail strings are discouraged.");

        let rejected = false;
        try
        {
            illegal_f();
        }
        catch (err)
        {
            rejected = true;
        }

        if (!rejected)
        {
            throw Error(failMessage);
        }

        unit_test_n.testList.push(failMessage);
    }

    // Truncates the given real value to four decimals. (The tests here only care
    // about accuracy down to four digits.)
    unit_test_n.tr4 = function(real = 0.0)
    {
        return (Math.round(real * 10000) / 10000);
    }

    // Test the helper functions etc. that belong to the unit tester, to verify that
    // they work as expected.
    unit_test_n.verify_tester_functionality = function()
    {
        try
        {
            unit_test_n.require(((1 + 1) === 2), "This should never fail.");
            unit_test_n.reject(function(){ const i = 0; i = 1; }, "This should always fail.");

            unit_test_n.require((unit_test_n.tr4(14568.787566) === 14568.7876), "Truncating a positive value.");
            unit_test_n.require((unit_test_n.tr4(-14568.787566) === -14568.7876), "Truncating a negative value.");
            unit_test_n.require((unit_test_n.tr4(0.00001) === 0), "Truncation rounding down.");
            unit_test_n.require((unit_test_n.tr4(0.00005) === 0.0001), "Truncation rounding up.");
        }
        catch (err)
        {
            window.alert("The unit tester does not appear to be functioning properly. As a precaution, testing has been halted.");
            throw 0; // Assume this isn't caught by anything in the code below, so we exit.
        }
    }

    // Expects to receive a function which will test all the relevant individual
    // elements of the given unit. If any of the tests throw, will assume that
    // the unit failed its tests. Will indicate in the HTML results table either
    // a pass or fail, accordingly, using the unit name provided.
    unit_test_n.test_unit = function(unitName = "", individual_tests_f = Function)
    {
        k_assert((individual_tests_f instanceof Function), "Expected a function.");
        k_assert((unitName.length > 0), "No name string provided.");

        unit_test_n.testList = [];
        
        // Create a new row in the results table, for showing the name of this
        // unit, and whether its test(s) passed or failed.
        const resultsElement = document.createElement("tr");

        // Run the tests, and add the result onto the table row.
        {
            // Give the test result a colored tag, which is either 'pass' or 'fail';
            const tagElement = document.createElement("td");

            let resultText = unitName;
            tagElement.className = "tag_test_success";

            // Run the tests.
            try
            {
                individual_tests_f();
            }
            catch (err)
            {
                resultText = unitName + " - Fails on:";
                tagElement.className = "tag_test_fail";

                // If we failed, indicate the first throw's error message, as well.
                {
                    var errorElement = document.createElement("ul");
                    const errorList = document.createElement("li");

                    errorElement.className = "small_text";

                    errorList.appendChild(document.createTextNode(err.message));
                    errorElement.appendChild(errorList);
                }

                /// Re-throw to trickle down to the debugger.
                //throw err;
            }

            tagElement.appendChild(document.createTextNode(resultText));
            if (errorElement !== undefined)
            {
                tagElement.appendChild(errorElement);
            }
            resultsElement.appendChild(tagElement);

            // Make the result tag clickable: when you click it, it expands to show a list of all
            // the individual tests performed. When you click it again, it hides the list.
            let expandTag = false;
            const list = unit_test_n.testList.slice(0); // Get a closure copy of the test list.
            const originalHeight = tagElement.offsetHeight;
            const clicker = function()
            {
                expandTag = !expandTag;
                if (expandTag)
                {
                    // Create a list of all the tests performed.
                    let listElement = document.createElement("ul");
                    for (let i = 0; i < list.length; i++)
                    {
                        const testList = document.createElement("li");
                        listElement.className = "small_text";
 
                        testList.appendChild(document.createTextNode(list[i]));
                        listElement.appendChild(testList);
                    }

                    // Append the list element, but keep it hidden from view. This lets us first get its
                    // height without disturbing the document layout, and then use it to animate a transition
                    // of the tag's height to accommodate the list.
                    listElement.style.display = "block";
                    listElement.style.visibility = "hidden";
                    listElement.style.position = "absolute";
                    tagElement.appendChild(listElement);

                    // Resize the tag (this'll trigger a transition), and unhide the list about once
                    // the transition is finished.
                    tagElement.style.height = (listElement.clientHeight + tagElement.clientHeight).toString() + "px";
                    setTimeout(function()
                               {
                                   listElement.style.visibility = "visible";
                                   listElement.style.visibility = "relative";
                               }, 250);
                }
                else
                {
                    // Collapse the tag and hide the list of tests.
                    tagElement.innerHTML = unitName; /// FIXME: Don't use innerHTML.
                    setTimeout(function() { tagElement.style.height = originalHeight; }, 10);
                }
            }

            // Enable the click show/hide functionality only for labels that indicate a passing
            // test. Failed tests automatically expand to show the name of the first test that failed.
            if (tagElement.className === "tag_test_success")
            {
                tagElement.onclick = clicker;
            }
        }

        // Add the row onto the results table. We're done with this unit's tests.
        unit_test_n.resultsTable.appendChild(resultsElement);
    }

    // Adds the display name of the totality of the tests at the top of the table.
    unit_test_n.results_table_insert_header = function(text = "")
    {
        k_assert((text.length > 0), "No header text given.");
        
        const header = document.createElement("tr");
        const data = document.createElement("td");
        const dataText = document.createTextNode(text);
        
        data.className = "large_text";

        data.appendChild(dataText);
        header.appendChild(data);
        unit_test_n.resultsTable.appendChild(header);

        unit_test_n.results_table_insert_hline();
    }

    // Add vertical spacing into the table.
    unit_test_n.results_table_insert_vspacer = function(height = "0px")
    {
        const spacer = document.createElement("td");
        spacer.style.paddingBottom = height;
        
        unit_test_n.resultsTable.appendChild(spacer);
    }

    // Add a horizontal line into the table.
    unit_test_n.results_table_insert_hline = function()
    {
        const spacer = document.createElement("td");
        spacer.style.paddingBottom = "23px";
        spacer.style.borderTop = "1px dashed";
        
        unit_test_n.resultsTable.appendChild(spacer);
    }

    // Initialize the HTML table for printing out the results.
    unit_test_n.initialize_html_report = function()
    {
        unit_test_n.resultsTable = document.createElement("table");
        unit_test_n.resultsTable.className = "results_table";
        document.body.appendChild(unit_test_n.resultsTable);

        unit_test_n.results_table_insert_header("Unit tests for \"" + unit_test_n.testName + "\"");
    }

    unit_test_n.finalize_html_report = function()
    {
        unit_test_n.results_table_insert_vspacer("21px");

        // Add a date stamp at the bottom of the report.
        const row = document.createElement("tr");
        row.className = "date_stamp";
        const data = document.createElement("td");
        data.appendChild(document.createTextNode("Tests completed on " + Date() + "."));
        row.appendChild(data);
        unit_test_n.resultsTable.appendChild(row);
    }

    // Call this with a function containing the unit tests you want run.
    unit_test_n.run_tests = function(test_suite_f = Function,
                                     testName = "")
    {
        k_assert((test_suite_f instanceof Function), "Expected a function containing the unit tests to run.");
        k_assert((testName.length > 0), "Empty test names are discouraged.");

        this.testName = testName;

        unit_test_n.initialize_html_report();
        unit_test_n.verify_tester_functionality();
        test_suite_f();
        unit_test_n.finalize_html_report();
    }
}