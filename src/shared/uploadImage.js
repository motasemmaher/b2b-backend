const fs = require("fs"); 

module.exports =
{
    upload(path,image)
    {
        fs.writeFileSync(path,image,{encoding: 'base64'},(err)=>{ } );
    } 
};


