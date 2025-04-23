/*
assumbtions:
- csv file contains data for persons
- birth date in the csv file formated as MM/DD/YYYY
- birth time formated as 12 hour (am, pm)

Task requirements:
- change the birth date format to matach the person country format (as posible)
- calculate the age of the person in 1st October 2025
- add the calculated age to the person data
- create a paragraph from the formated data
- save new data in a new file

*/
// 4 date   5 time 6 country 9 timezone 8 language 7 country name 2 name 3 full email 0 id 1 gender 
// you will not copy the code .. you will write it yourself. character by character.


import { DateTime } from 'luxon';
import * as fs from 'fs';

// 1. Read CSV File
const data = fs.readFileSync('C:/Users/ataaa/OneDrive/سطح المكتب/nodejs/excersis2/MOCK_DATA.csv', { encoding: 'utf-8' });
const lines = data.split('\n').filter(line => line.trim() !== ''); // Remove empty lines

let output = '';

// 2. Process Each Line
lines.forEach((line, index) => {
    // Skip header row if exists
    if (index === 0 && line.startsWith('id,')) return;

    const columns = line.split(',');
    
    // 3. Validate Columns
    if (columns.length < 10) {
        console.error(`Skipping malformed line: ${line}`);
        return;
    }

    // 4. Parse Date/Time
    try {
        const dateTime = DateTime.fromFormat(
            `${columns[4].trim()} ${columns[5].trim()}`, 
            'MM/dd/yyyy t', 
            { zone: columns[9].trim() }
        );

        if (!dateTime.isValid) {
            console.error(`Invalid date for line ${index}: ${line}`);
            return;
        }

        // 5. Format Localized Date
        const locale = `${columns[8].trim()}-${columns[6].trim()}`;
        const localDatetime = dateTime.setLocale(locale).toLocaleString(DateTime.DATETIME_FULL);

        // 6. Calculate Age in 2025
        const oct2025 = DateTime.fromISO('2025-10-01', { zone: columns[9].trim() });
        const ageDiff = oct2025.diff(dateTime, 'years').years;

        // 7. Gender-Specific Pronoun
        const pronoun = columns[1].trim().toLowerCase() === 'male' ? 'his' : 'her';

        // 8. Generate Output Template
        output += `${columns[0]} - ${columns[2]} is born in ${columns[7]} in ${localDatetime}
${pronoun} age in 2025 will be almost ${Math.round(ageDiff)} years
${pronoun} contact info is: ${columns[3]}
----------------------
`;
    } catch (error) {
        console.error(`Error processing line ${index}:`, error.message);
    }
});

// 9. Write Results to File
fs.writeFileSync('C:/Users/ataaa/OneDrive/سطح المكتب/nodejs/excersis2/output_results.txt', output);
console.log('Processing complete! Results saved to output_results.txt');
