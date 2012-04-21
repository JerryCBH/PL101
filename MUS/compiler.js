// Compiler and functions for the MUS Language.

var endTime = function(t, expr){
    if(expr.tag === 'note' || expr.tag === 'rest')
        return t + expr.dur;
    if(expr.tag === 'seq')
        return t + endTime(0, expr.left) + endTime(0, expr.right);
    if(expr.tag === 'par')
        return Math.max(endTime(t, expr.left), endTime(t, expr.right));
    if(expr.tag === 'repeat')
        return t + endTime(0, expr.section)*expr.count;
};

var compileT = function(t, expr){
    if(expr.tag === 'note')
        return [{tag:'note', pitch: convertPitch(expr.pitch), start: t, dur: expr.dur}];
    if(expr.tag === 'rest')
        return [{tag:'rest', start: t, dur: expr.dur}];
    if(expr.tag === 'seq')
        return compileT(t, expr.left).concat(compileT(endTime(t,expr.left),expr.right));
    if(expr.tag === 'par')
        return compileT(t, expr.left).concat(compileT(t, expr.right));
    if(expr.tag === 'repeat'){
	var notes = [];
	var time = endTime(0, expr.section);
	for(i=0;i<expr.count;i++){
        	notes = notes.concat(compileT(t+time*i, expr.section));
	}
	return notes;
    }
};

var convertPitch = function(pitch){
    var midiArray = {c:0,d:2,e:4,f:5,g:7,a:9,b:11};
    return 12 + 12*pitch.slice(1) + midiArray[pitch.slice(0,1)];
};
 
var compile = function(musexpr){
    return compileT(0, musexpr);
};

// Testing
var melody_mus = { tag: 'seq',
left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'repeat', section: { tag: 'seq',
         left: { tag: 'par', left:{tag:'note',pitch:'b5',dur:50}, right:{ tag: 'seq', left:{tag:'note',pitch:'a5',dur:20}, right:{tag:'rest',dur:20} }},
         right: { tag: 'note', pitch: 'd4', dur: 500 } }, count: 3},
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };


console.log(melody_mus);
console.log(compile(melody_mus));