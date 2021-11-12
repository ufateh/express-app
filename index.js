const port = 8080
const express = require('express');
const app = express();

const statusMap = new Map();


let cars = require('./cars.json');
// load the data and then initilize the service.
init();


app.get('/', (req, res) => {
    res.send('Service running!. Access /status to get cars status.')
})

app.get('/status', (req, res) => {
    res.json(Array.from(statusMap));
})


app.post('/ping/:vehicleId/:status', (req,res)=>{
    let id = req.params.vehicleId;
    let status = req.params.status;
    if(statusMap.has(id)){
        let obj = statusMap.get(id);
        obj.status = status;
        statusMap.set(id,obj);
        res.send('Vehicle status updated!')
    }else{
        res.status(400).send('No such vehicle registered in database.')
    }
    
});

function simulator(){
    
    // one second interval.

    for (const entry of statusMap.entries()) {
        let id = entry[0];
        setInterval(function() {
            let status = getRandomStatus();
            let obj = statusMap.get(id);
            obj.status = status;
            statusMap.set(id,obj);
        }, 3000);
    }
}

function getRandomStatus(){
    let i = Math.round(Math.random());
    if(i==1){
        return 'online'
    }else{
        return 'offline'
    }
}


function init(){
    for(let i=0;i<cars.length;i++){
        let info = cars[i];
        if(info.vehicles && info.vehicles.length>0){
            for(let j=0;j<info.vehicles.length;j++){
                let customObject = {
                    name : info.name,
                    address: info.address,
                    vehicleId : info.vehicles[j].vehicleId,
                    regNo: info.vehicles[j].regNo,
                    status: 'offline'
                }
                statusMap.set(info.vehicles[j].vehicleId, customObject);
            }
            
        }
    }
    // simulator to change status of vahicles
    simulator();

    app.listen(port,function(){
        console.log('service running on port '+ port);
    });
}
