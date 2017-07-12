var net = require('net')
var chatserver = net.createServer()
    clientList = []

chatserver.on('connection', function(client){
    client.name = client.remoteAddress+':'+client.remotePort
    console.log(client.name + " just joined \n")

    client.write('ServerMessage : Hi '+ client.name + '!\n')

    clientList.push(client)
    client.on('data', function(data){
        client.write("You Said:  "+ data+ '\n')
        // client.write('\n')
        broadcast(data, client)
    })
    
    client.on('end', function(){
        console.log(client.name +" just left \n")
        clientList.splice(clientList.indexOf(client), 1 )
    })

    client.on('error', function(e){
        console.log(e)
    })
})

broadcast = function(data, client){
    var cleanup = []
    for(var i=0;i<clientList.length;i+=1){
        if(clientList[i] !== client){
            if(clientList[i].writable){
                clientList[i].write(client.name+ " says: "+ data)
            }
            else{
                cleanup.push(clientList[i])
                clientList[i].destroy()
            }
        }
    }
    for(var i=0;i<cleanup.length;i+=1){
        clientList.splice(clientList.indexOf(cleanup[i]),1)
    }
}

chatserver.listen(9000)