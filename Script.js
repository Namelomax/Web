const canvas = document.getElementById('coordinateCanvas');
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}.${month}.${day}, ${hours}:${minutes}:${seconds}`;
    }

    function drawStaticFigures() {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw x-axis
        context.beginPath();
        context.moveTo(0, centerY);
        context.lineTo(canvas.width, centerY);
        context.strokeStyle = 'black';
        context.stroke();

        for (let i = -100; i <= 100; i += 50) {
            context.beginPath();
            context.arc(centerX + i, centerY, 3, 0, Math.PI * 2);
            context.fillStyle = 'black';
            context.fill();
            context.strokeStyle = 'black';
            context.stroke();
        }

        // Draw y-axis
        context.beginPath();
        context.moveTo(centerX, 0);
        context.lineTo(centerX, canvas.height);
        context.strokeStyle = 'black';
        context.stroke();

        for (let i = -100; i <= 100; i += 50) {
            context.beginPath();
            context.arc(centerX, centerY - i, 3, 0, Math.PI * 2);
            context.fillStyle = 'black';
            context.fill();
            context.strokeStyle = 'black';
            context.stroke();
        }

        // Draw quarter circle
        const canvasRadius = 50;
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, canvasRadius, Math.PI, Math.PI * 1.5);
        context.closePath();
        context.fillStyle = 'rgba(0, 128, 255, 0.3)';
        context.fill();
        context.strokeStyle = 'blue';
        context.stroke();

        // Draw rectangle
        const rectWidth = 100;
        const rectHeight = 50;
        context.beginPath();
        context.rect(centerX - rectWidth, centerY, rectWidth, rectHeight);
        context.fillStyle = 'rgba(255, 0, 0, 0.3';
        context.fill();
        context.strokeStyle = 'red';
        context.stroke();

        // Draw triangle
        const triangleHeight = 50;
        context.beginPath();
        context.moveTo(centerX, centerY - triangleHeight);
        context.lineTo(centerX + rectWidth / 2, centerY);
        context.lineTo(centerX, centerY);
        context.closePath();
        context.fillStyle = 'rgba(0, 255, 0, 0.3)';
        context.fill();
        context.strokeStyle = 'green';
        context.stroke();

        // Labels
        context.font = '12px Arial';
        context.fillStyle = 'black';
        context.fillText('R', centerX + 100, centerY + 20);
        context.fillText('R/2', centerX + 50, centerY + 20);
        context.fillText('-R', centerX - 100, centerY + 20);
        context.fillText('-R/2', centerX - 50, centerY + 20);

        context.textAlign = 'right';
        context.fillText('R', centerX - 10, centerY - 100);
        context.fillText('R/2', centerX - 10, centerY - 50);
        context.fillText('-R', centerX - 10, centerY + 100);
        context.fillText('-R/2', centerX - 10, centerY + 50);
        context.textAlign = 'left';
    }


    function drawPoint(x, y, R) {
        const canvasWidth =210; // Width of your canvas
        const canvasHeight = 200; // Height of your canvas
        const scalex = canvasWidth / (2 * R);
        const scaley = canvasHeight / (2 * R);// Adjust this scale factor as needed for your canvas
        const scaledX = centerX + x * scalex;
        const scaledY = centerY - y * scaley;

        context.beginPath();
        context.arc(scaledX, scaledY, 3, 0, Math.PI * 2);
        context.fillStyle = 'red';
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
    }

    // Event listener for R input change
    document.getElementById('R').addEventListener('input', function () {
        const newR = parseFloat(this.value);
        const selectedX = parseFloat(document.querySelector('input[name="x"]:checked').value);
        const selectedY = parseFloat(document.getElementById('y').value);
        drawStaticFigures(newR);
        drawPoint(selectedX, selectedY);
    });

    drawStaticFigures();
    document.addEventListener('DOMContentLoaded', function () {
        function saveTableToLocalStorage() {
            const resultsTable = document.getElementById('resultsTable');
            const tableRows = resultsTable.rows;
            const tableData = [];

            for (let i = 1; i < tableRows.length; i++) {
                const row = tableRows[i];
                const rowData = {
                    R: parseFloat(row.cells[0].textContent),
                    x: parseFloat(row.cells[1].textContent),
                    y: parseFloat(row.cells[2].textContent),
                    result: row.cells[3].textContent,
                    timestamp: new Date(row.cells[4].textContent).toISOString(),
                    runtime: row.cells[5].textContent,
                };
                tableData.push(rowData);
            }

            localStorage.setItem('tableData', JSON.stringify(tableData));
        }

        function loadTableFromLocalStorage() {
            const savedTableData = JSON.parse(localStorage.getItem('tableData')) || [];
            const resultsTable = document.getElementById('resultsTable');
            resultsTable.innerHTML = `
    <tr>
        <th>R</th>
        <th>X</th>
        <th>Y</th>
        <th>Результат</th>
        <th>Текущее время</th>
        <th>Время выполнения скрипта</th>
    `;
            savedTableData.forEach(data => {
                data.timestamp = formatTimestamp(new Date(data.timestamp));
                const newRow = resultsTable.insertRow(1);
                newRow.innerHTML = `
        <td>${data.R}</td>
        <td>${data.x}</td>
        <td>${data.y}</td>
        <td>${data.result}</td>
        <td>${data.timestamp}</td>
        <td>${data.runtime}</td>
    `;
            });
        }


        loadTableFromLocalStorage()

        document.getElementById('pointForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const R = parseFloat(document.getElementById('R').value);
            const y = parseFloat(document.getElementById('y').value);
            const checkboxes = document.querySelectorAll('input[name="x"]:checked');
            const xValues = Array.from(checkboxes).map(el => parseFloat(el.value));
            if (checkboxes.length === 0) {
                document.getElementById('checkboxError').textContent = 'Select at least one x value.';
                return;
            } else {
                document.getElementById('checkboxError').textContent = '';
            }
            Promise.all(xValues.map(x => {
                return fetch(`Script.php?R=${R}&x=${x}&y=${y}`)
                    .then(response => response.json())
                    .then(data => {
                        return {
                            x: x,
                            result: data[0].result,
                            runtime: data[0]['script_runtime'],
                            timestamp: formatTimestamp(data[0].timestamp),
                        };
                    });
            })).then(results => {
                const resultsTable = document.getElementById('resultsTable');
                const resultMessage = document.getElementById('resultMessage');
                results.forEach(result => {
                    const newRow = resultsTable.insertRow(1);
                    newRow.innerHTML = `
                        <td>${R}</td>
                        <td>${result.x}</td>
                        <td>${y}</td>
                        <td>${result.result}</td>
                        <td>${formatTimestamp(result.timestamp)}</td>
                        <td>${result.runtime}</td>
                    `;
                    if (result.result === 'Попадание') {
                        resultMessage.textContent = `Результат: ${result.result}`;
                    }
                });

                if (results.some(result => result.result === 'Непопадание')) {
                    resultMessage.textContent = 'Результат: Непопадание';
                }
                saveTableToLocalStorage();
                drawStaticFigures();

                xValues.forEach(x => {
                    drawPoint(x, y,R);
                });

                const tableData = Array.from(resultsTable.rows).slice(1).map(row => ({
                    R: parseFloat(row.cells[0].textContent),
                    x: parseFloat(row.cells[1].textContent),
                    y: parseFloat(row.cells[2].textContent),
                    result: row.cells[3].textContent,
                    timestamp: formatTimestamp(row.cells[4].timestamp),
                    runtime: row.cells[5].textContent,
                }));
                console.log(tableData)
                saveTableToLocalStorage(tableData);
            }).catch(error => {
                console.error('Ошибка:', error);
            });
        });

    });


    function updateCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const newR = parseFloat(document.getElementById('R').value);

        const selectedXCheckboxes = document.querySelectorAll('input[name="x"]:checked');
        const selectedY = parseFloat(document.getElementById('y').value);

        drawStaticFigures(newR);

        selectedXCheckboxes.forEach(checkbox => {
            const selectedX = parseFloat(checkbox.value);
            drawPoint(selectedX, selectedY, newR);
        });
    }
    document.getElementById('pointForm').addEventListener('submit', function (event) {
        event.preventDefault();
        updateCanvas();
    });

    document.getElementById('R').addEventListener('input', updateCanvas);