const fs = require("fs");
const http=require("http");

fs.readFile('./sample.json','utf8',(err,data)=>{
    if(err){
        console.log("Cannot open file");
        return
    }
    //console.log(data);

    const jsonData=JSON.parse(data);
   const filteredData=jsonData.filter((user)=>user.amount>1500);
   fs.writeFile("./data.json",JSON.stringify(filteredData),(err)=>{
    if(err){
        console.log("ERROR in writing file");
        return;
    }
})
});