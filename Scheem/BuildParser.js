var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('Scheem.peg', 'utf-8');

// Show the PEG grammar file
console.log(data);

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do a test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"]);

// Second test
var input = "(define factorial\n" + "(lambda (n)\n" + "(if (= n 0) 1\n" + "(* n ;; Comment within ().\n(factorial (- n ' (1) ))))))";
console.log("Test Input: " + input);
var output = parse(input);
console.log("Output: \n" + output);
assert.deepEqual( output, [
   "define",
   "factorial",
   [
      "lambda",
      [
         "n"
      ],
      [
         "if",
         [
            [
               "=",
               "n",
               "0"
            ],
            "1",
            [
               "*",
               "n",
               [
                  "factorial",
                  [
                     "-",
                     "n",
                     [
                        "qoute",
                        [
                           "1"
                        ]
                     ]
                  ]
               ]
            ]
         ]
      ]
   ]
]);


console.log("Success");