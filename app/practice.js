//OBJECTS - group related data together
const threat = {
    id: 'CVE-2025-12345',
    score: 9.8,
    vendor: 'Fortinet',
    patched: false,
};

//Access valudes
console.log(threat.score);
console.log(threat.vendor);

//Desctructring - extract values into named variables

const { id, score, vendor } = threat;
console.log(id);

//Functions - two ways to write them

function analyzeThreat(t) {
    if (t.score >= 9.0) return 'Critical - patch immediately' ;

    if (t.score >= 7.0) return 'High - Patch this week';
    return 'Monitor';
};

//Arrow Function - shorter syntax, same result

const getSeverity = (score) => {
    if (score >= 9.0) return 'Critical';
    if (score >= 7.0) return ' High';
    return 'Medium';

};

console.log(analyzeThreat(threat));
console.log(getSeverity(threat.score));

//Array of Objects

const threats = [
    {id: 'CVE-2024-001', score: 9.8, vendor: 'Fortinet'},
    {id: 'CVE-2024-002', score: 7.5, vendor: "Palo Alto"},
    {id: 'CVE-2024-003', score: 5.4, vendor: 'CISCO'}

];


//Filter + arrow function combined

const severity = threats.filter(t => t.score >= 9.0);
console.log(severity);

const ids = threats.map(t => t.id);
console.log(ids);

// forEach - do something with each item, no return value

threats.forEach(threat => {
       console.log(`${threat.vendor}: ${threat.score}`);

});

//for .... of - cleaner way to loop

for (const threat of threats) {
    if (threat.score >= 7.0) {
        console.log(`Action needed: ${threat.id}`);
    }
}
