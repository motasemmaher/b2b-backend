//Requiring the necessaru package
const fs = require("fs"); 
//Exporting the me5thod
module.exports =
{
    //A method to upload base64 to a image file
    upload(path,image)
    {
        image = image.slice(image.indexOf(',') + 1);
        fs.writeFileSync(path,image,{encoding: 'base64'},(err)=>{ } );
    } 
};


