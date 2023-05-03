import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('../../tasks.csv', import.meta.url)

const fileStream = fs.createReadStream(csvPath)

const csvParse = parse({ from: 2, delimiter: ',' })

async function run () {
  const rows = fileStream.pipe(csvParse);

  for await (const row of rows) {
    const newTask = {
        title: row[0],
        description: row[1]
    }

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify(newTask),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.text())
    .then((data) => {
      console.log('taskId', JSON.parse(data).id)
    })

    await new Promise(r => setTimeout(r, 1000))
  }
}

run()