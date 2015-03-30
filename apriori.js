//NodeJs

var fs = require('fs');
process.stdin.resume();
process.stdin.setEncoding('utf8');
var _input;
var tokens;
var items = [];
var candidates = {};
var transactions = [];
var frequents = {};

var writeLine = function(data){
	process.stdout.write(data.toString());
	process.stdout.write("\r\n");
}
var readInput = function(filename){
	_input = fs.readFileSync(filename);
}
var createChildSets = function(data){
	var results = [];
	for(var i = 0; i < data.length ; i++) {
		var ele = data.shift();
		
		results.push(data.slice());
		//writeLine(results);
		data.push(ele);
	}
	//writeLine(results);
	return results;
}
var initItemSets = function(t){
	t = t.replace(/\s+/g, '');
	
	var itemsets = t.split(',');
	// convert every item value to lowercase
	itemsets.every(function(ele,index,array){
		array[index] = ele.toLowerCase();
		return true;
	});
	// add to transactions in sorted order
	transactions.push(itemsets.sort().slice());
	for(var j = 0; j < itemsets.length ; j++){
		
		 if(candidates[itemsets[j]] === undefined) { candidates[itemsets[j]] = 1; items.push(itemsets[j]); }
		 else candidates[itemsets[j]]++;
	}

}

var findSupport = function(itemSet){
	if(!(itemSet.length && itemSet.length > 0)) return -1;

	itemSet = itemSet.sort();
	
	var count = 0;
	transactions.every(function(ele,index,array){
		
		var f = true;
		for(var i = 0 ; i < itemSet.length ; i++){
			if(array[index].indexOf(itemSet[i].toString()) == -1) { f = false; break; } 
		}
		if(f) count++;
		return true;		
	});
	
	return count;
}
var findfrequentSets = function(){
	var index = 2;
	
	while( Object.keys(candidates).length > index ){
		frequents = {};
		// find frequent sets from the candidate sets
		for(var i = 0; i < Object.keys(candidates).length ; i++){
			if(candidates[Object.keys(candidates)[i]] >= threshold) frequents[Object.keys(candidates)[i]] = candidates[Object.keys(candidates)[i]];
		}
		// find new candidate sets
		candidates = {};
		
		// for every itemset in frequents for K items 
		for(var i = 0; i < Object.keys(frequents).length; i++){
			// expanding itemsets for K + 1 items
			for(var j = 0 ; j < items.length ; j++){

				if(Object.keys(frequents)[i].indexOf(items[j]) != -1) continue;
				
				var temp = (Object.keys(frequents)[i]).split(',');
				temp.push(items[j]);
				
				// check if subsets of the itemsets are frequent or not
				if( temp.sort() in candidates) continue;
				var childSets = createChildSets(temp);
				var flag = true;
				for(var k = 0 ; k < childSets.length ; k++){
					if(!(childSets[k].sort().toString() in frequents)){
						flag = false;
						break;
					}
					
				}
				if(flag){

						candidates[temp.sort()] = findSupport(temp);
						
				}

			}
		}
		index++;
		//break;

	}
	frequents = {};
	for(var i = 0; i < Object.keys(candidates).length ; i++){
			if(candidates[Object.keys(candidates)[i]] >= threshold) frequents[Object.keys(candidates)[i]] = candidates[Object.keys(candidates)[i]];
	}
}
readInput("input.txt");

tokens = _input.toString().split('\r\n');
threshold = tokens.shift();

for(var i = 0; i < tokens.length ; i++){

	initItemSets(tokens[i]);	
}
findfrequentSets();
writeLine(Object.keys(frequents));
process.exit(0);
