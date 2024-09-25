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

import { DateTime } from 'luxon';
import * as fs from 'fs';
// Reading the CSV file
let data = fs.readFileSync('./MOCK_DATA.csv', { encoding: 'utf-8', flag: 'r' });

let data_array = data.split('\n');
let new_data = '';

data_array.forEach(line => {
    // split each line by comma
    let ln = line.split(',');

    // Parsing date and time using the correct format and zone
    let full = DateTime.fromFormat(`${ln[4]} ${ln[5]}`, 'MM/dd/yyyy t', { zone: ln[9] });
    console.log(full.toISO());

    // Setting the locale correctly
    let local_datetime = full.setLocale(`${ln[8]}-${ln[6]}`).toLocaleString(DateTime.DATETIME_FULL);

    // Parsing October 2025 date and time with the correct format
    let october = DateTime.fromISO('2025-10-01T00:00:00', { zone: ln[9] });

    // Calculating the difference in years
    let diff = october.diff(full, 'years');

    // Gender-based pronoun selection "if he is male so it will be his otherwise it would be her"
    let g = ln[1] === 'male' ? 'his' : 'her';

    // Creating the output template
    let temp = `${ln[0]} - ${ln[2]} is born in ${ln[7]} in ${local_datetime}
${g} age in 2025 will be almost ${Math.round(diff.years)} years
his her contact info is : ${ln[3]}
----------------------
`;

    // Adding the result to new_data
    new_data += temp;
});

// Writing the output to a new file
fs.writeFileSync('./new_data.txt', new_data, { encoding: 'utf-8' });
