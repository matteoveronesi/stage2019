google.charts.load('current', {'packages': ['gantt'], 'language': 'it_it'}) 

/**
 * Costruisce il grafico svg di un progetto partendo da i dati forniti
 * 
 * @param {array} rows contiene le righe di un progetto, overo i Case
 */
function draw_chart(rows) {
    var data = new google.visualization.DataTable()
    data.addColumn('string', 'Task ID')
    data.addColumn('string', 'Task Name')
    data.addColumn('string', 'Resource')
    data.addColumn('date', 'Start Date')
    data.addColumn('date', 'End Date')
    data.addColumn('number', 'Duration')
    data.addColumn('number', 'Percent Complete')
    data.addColumn('string', 'Dependencies')

    data.addRows(rows)

    var options = {
        height: rows.length * 42 + 50,
        gantt: {
            criticalPathEnabled: false,
            labelStyle: {
                fontName: "SF"
              },
            innerGridHorizLine: {
                stroke: "#00000000"
            }
        }
    }

    var chart = new google.visualization.Gantt(document.getElementById('chart'))

    chart.draw(data, options)
}