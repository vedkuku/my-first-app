//Basic types - telling typescript exactly what each variable holds

const cveID:string = 'CVE-2024-21762';
const score:number = 9.8;
const ispatched: boolean = false;

//TypeScript catches this immediately - try uncommenting it
//const badScore: number = 'critical';


// Interface - defining the exact shape of an object

interface Threat {
    id : string;
    score: number;
    severity: 'critical' | 'high' | 'medium' |'low';  //only these 4 values

    vendor: string;
    patched : boolean;
    patchedAt?: Date;  // ? means optional - may or may not exist
};


//function with typed parameters and return type

function getSeverityLabel(score: number) : string {

    if (score >= 9.0) return 'Critical - patch now';
    if (score>= 7.0) return 'High - patch this week';
    if (score >= 4.0) return 'Medium - plan patch';
    return 'Low monitor';
}


//Typed array - array of Threat objects, nothing else allowed

const threats: Threat[] = [
    { id: 'CVE-2024-001', score: 9.8, severity: 'critical', vendor: 'Fortinet', patched: false },
    { id: 'CVE-2024-002', score: 7.2, severity: 'high', vendor: 'Cisco', patched: true },
    { id: 'CVE-2024-003', score: 4.1, severity: 'medium', vendor: 'PAN', patched: false},
];

//filter and map work exactly the same - now with type safety

const unpatched = threats.filter(t => !t.patched);
unpatched.forEach(t => {
    console.log(`${t.id} - ${getSeverityLabel(t.score)}`);
});

// Generic - afunction that works with ANY type, not just one

// T is placeholder - it gets replaced with the real type when called

interface ApiResponse<T> {
    data: T;
    error: string | null;
    status: number;
}

//use it with Threat array

const response: ApiResponse<Threat[]> =  {
    data: threats,
    error: null,
    status: 200,
};

console.log(`status: ${response.status}`);
console.log(`Threat returened: ${response.data.length}`);
console.log(`Error: ${response.error}`);