const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        fs.readFile('./index.html', 'utf8', (err, content) => {
            if (err) {
                console.error('error :', err);
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content);
            }
        });
    } else if (req.url === "/nn") {
        fs.readFile('./frond.js', 'utf8', (err, content) => {
            if (err) {
                console.error('error :', err);
            } else {
                res.writeHead(200, { "Content-Type": "text/javascript" });
                res.end(content);
            }
        });
    } else if (req.url === "/dd") {
        if (req.method === "GET") {
            fs.readFile('./data.json', 'utf8', (err, content) => {
                if (err) {
                    console.error('error :', err);
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(content);
                }
            });
        } else if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
            req.on("end", () => {
                try {
                    const parsedData = JSON.parse(body);
                    fs.readFile('./data.json', 'utf8', (err, existingData) => {
                        if (err) {
                            console.error('Error reading existing data:', err);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Internal Server Error");
                        } else {
                            const data = JSON.parse(existingData);
                            if (!data[0].entries) {
                                data[0].entries = [];
                            }
                            data[0].entries.push(parsedData);
                            fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
                                if (err) {
                                    console.error('Error writing data:', err);
                                    res.writeHead(500, { "Content-Type": "text/plain" });
                                    res.end("Internal Server Error");
                                } else {
                                    res.writeHead(200, { "Content-Type": "text/plain" });
                                    res.end("Data saved successfully");
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Bad Request");
                }
            });
        } else if (req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const parsedData = JSON.parse(body);
                    fs.readFile('./data.json', 'utf8', (err, edata) => {
                        if (err) {
                            console.error('Error reading existing data:', err);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Internal Server Error");
                        } else {
                            const data = JSON.parse(edata);
                            if (!data[0].entries) {
                                data[0].entries = [];
                            }

                            const parsedText = parsedData.text;

                            const index = data[0].entries.findIndex(entries => {
                                const entryText = entries.text
                                console.log(entryText);
                                return entryText === parsedText;
                            });

                            if (index !== -1) {
                                data[0].entries[index] = parsedData;
                                console.log(parsedData);
                                fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
                                    if (err) {
                                        console.error('Error writing data:', err);
                                        res.writeHead(500, { "Content-Type": "text/plain" });
                                        res.end("Internal Server Error");
                                    } else {
                                        console.log('Data updated successfully');
                                        res.writeHead(200, { "Content-Type": "text/plain" });
                                        res.end("Data updated successfully");
                                    }
                                });
                            } else {
                                console.error('Entry not found:', parsedText);
                                res.writeHead(404, { "Content-Type": "text/plain" });
                                res.end("Entry not found");
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Bad Request");
                }
            });
        } else if (req.method === "DELETE") {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const parsedData = JSON.parse(body);
                    fs.readFile('./data.json', 'utf8', (err, edata) => {
                        if (err) {
                            console.error('Error reading existing data:', err);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Internal Server Error");
                        } else {
                            const data = JSON.parse(edata);
                            if (!data[0].entries) {
                                data[0].entries = [];
                            }
    
                            const parsedText = parsedData.text;
    
                            const index = data[0].entries.findIndex(entry => entry.text === parsedText);
    
                            if (index !== -1) {
                                data[0].entries.splice(index, 1); // Remove the entry
                                fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
                                    if (err) {
                                        console.error('Error writing data:', err);
                                        res.writeHead(500, { "Content-Type": "text/plain" });
                                        res.end("Internal Server Error");
                                    } else {
                                        console.log('Data deleted successfully');
                                        res.writeHead(200, { "Content-Type": "text/plain" });
                                        res.end("Data deleted successfully");
                                    }
                                });
                            } else {
                                console.error('Entry not found:', parsedText);
                                res.writeHead(404, { "Content-Type": "text/plain" });
                                res.end("Entry not found");
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Bad Request");
                }
            });
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
