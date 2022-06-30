const Table = require('cli-table3')


function tableChoices(tableData) {
  const table = new Table({
    chars: {
      'top': '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '',
      'left-mid': '',
      'mid': '',
      'mid-mid': '',
      'right': '',
      'right-mid': '',
      'middle': ' '
    },
    style: { 'padding-left': 0, 'padding-right': 0, head: [], border: [] },
    colWidths: [40]
  })
  tableData.forEach(row => table.push(row))
  return table.length > 0
    ? table.toString().split('\n')
    : []
}


module.exports = tableChoices