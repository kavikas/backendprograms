const http= require("http");   //module
const fs=require('fs');
const server = http.createServer((req,res)=>{             //creating server
   // res.writeHead(200,{"Content-Type":"application/JSON"}); 
    fs.readFile("student.json", (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error reading the file");
        } else {
            res.end(data); // Send the JSON data
        }
    });  
});
server.listen(3000,()=>{
    console.log("server is running on port http://localhost:3000")
}) 
    
    /*res.write(`Addition: ${modules.add(10,12)}`);
    res.write(`subtract:${modules.subtract(10,12)}`);
    res.write(`multiply:${modules.multiply(10,12)}`);
    res.write(`divide:${modules.divide(20,10)}`);
    res.write('')
    res.end();*/



    
   //console.log("hello");
   /*const modules=require('./modules');//importing a file 
   console.log(modules.add(10,20));*/



  