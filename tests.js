var test = require('tape');
var extract = require('./extract.js');

let samples = [
  {in: 'false && true  || true      // returns true'},
  {in: 'false && (true || true)     // returns false'},
  {in: 'a || b > 3 || ~0 > 0 || true'},
  {in: '(-/*1*/3 /*2*/ == /*3*/ -/*4*/3)'},
  {in: 'photoParam["needFront"] == 1 || photoParam["needBack"] == 1 || photoParam["needNohat"] == 1'},
  {in: 'if (time in m)'},
  {in: ' if (!Object.keys(data).length) return; // data hasn\'t loaded yet'},
  {in: 'if((e.target == sidebarToggle[0]) || (e.target == $(".sidebar-toggle-line-wrap")[0]) || (e.target == sidebarToggleLine1st[0]) || (e.target == sidebarToggleLine2nd[0]) || (e.target == sidebarToggleLine3rd[0])){'},
  {in: 'if (this.$element[0] instanceof document.constructor && !this.options.selector) {'},
  {in: 'if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)'},
  {in: 'for(let i = 0; i < 5 || a > 2; i++){}'},
  {in: ' if (!((milliseconds >= 0 && days >= 0 && months >= 0) || (milliseconds <= 0 && days <= 0 && months <= 0))) {'},
  {in: 'if ( !defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate ) ) {'},
  {in: 'while(i=n.iterateNext() && n.next())'},
  {in: 'while (base64String.length % 4) {'},
  {in: ' while ( new Date( targetYear, targetMonth, targetDate ).getMonth() !== targetMonth )'},
  {in: '( ( elem = elem[ +(dir == 1) ] ) && elem.nodeType !== 9 )'},
  {in: 'while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {'},
  {in: 'false & (true || true)'},
  {in: 'a > b ? val1 : val2'},
  {in: 'a > b ? c > d ? val1 : val3 : val2'},
  {in: 'var status = age >= 18 ? "adult" : "minor";'},
];

test('Tests', t => {
  t.plan(samples.length * 2);

  for(let sample of samples){
    let ast = extract.extract(sample.in);
    t.notEqual(ast, null, 'Extract ' + sample.in);
    let astRooted = extract.findAstRoot(ast);
    var acceptableRoots = ['LogicalExpression', 'BinaryExpression', 'UnaryExpression'];
    t.ok(
      astRooted
      && astRooted.type
      && acceptableRoots.includes(astRooted.type)
      , 'Found Root ' + (astRooted || {}).type
    );
  }
});

