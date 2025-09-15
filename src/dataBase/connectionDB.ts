import mongoose from "mongoose";


const connectionDB = async( ) => { 

    mongoose.connect(process.env.DB_URI as unknown as string )
    .then(() => {
        console.log(`success to connect ${process.env.DB_URI}..........❤✌`);
    })
    .catch((error) => { 
        console.log(`fail to connect ${process.env.DB_URI}........🤦‍♂️🙃`);
    })
}


export default connectionDB