/**
 * Take an array of objects of similar structure and convert it to a CSV.
 * @source     https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
 * @modifiedBy sators
 * @param      {Array}  options.data            Array of data
 * @param      {String} options.columnDelimiter Column separator, defaults to ","
 * @param      {String} options.lineDelimiter   Line break, defaults to "\n"
 * @return     {String}                         CSV
 */
module.exports = ({
	data = null,
	columnDelimiter = ",",
	lineDelimiter = "\n"
}) => {
	let result, ctr, keys;

	if (data === null || !data.length) {
		return null;
	}

	keys = Object.keys(data[0]);

	result = "";
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	data.forEach(item => {
		ctr = 0;
		keys.forEach(key => {
			if (ctr > 0) {
				result += columnDelimiter;
			}

			result +=
				typeof item[key] === "string" && item[key].includes(columnDelimiter)
					? `"${item[key]}"`
					: item[key];
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
};
