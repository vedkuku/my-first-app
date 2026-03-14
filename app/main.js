// import = pull in specific thinkgs from another file

import { fetchThreat, NVD_BASE_URL} from './threats.js';
console.log('using API:', NVD_BASE_URL);

const result = await fetchThreat('CVE-2024-21762');
console.log(`${result.id} - ${result.severity} - ${result.score}`);
