const csvHeaderInterface = {
    'City': 0,
    'Condition': 1
}

const csvParseOptions = {
    skip_empty_lines: true,
    skip_lines_with_empty_values: true
}

module.exports = {
    csvHeaderInterface,
    csvParseOptions
}