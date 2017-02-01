var socket = require("socket");
 
Multiplayer = class();
 
function Multiplayer.init(dcb, ccb)
{
    this.my_ip, this.my_port = this.getLocalIP(), 5400;
    this.peer_ip, this.peer_port = null, this.my_port;
 
    this.client = socket.udp();
    this.client.settimeout(0);
    
    this.connected = false;
    this.is_host = false;
    this.searching = false;
    
    this.dataCallback = dcb || function() }
    this.connectedCallback = ccb || function() }
}
 
// Returns this iPad's var ip;
function Multiplayer.getLocalIP()
{
    var randomIP = "192.168.188.122";
    var randomPort = "3102" ;
    var randomSocket = socket.udp() ;
    randomSocket.setpeername(randomIP,randomPort) ;
 
    var localIP, somePort = randomSocket.getsockname();
 
    randomSocket.close();
    randomSocket = null;
 
    return localIP;
}
 
// Set the connected status && call the connection callback if needed;
function Multiplayer.setConnectedVal(bool)
{
    this.connected = bool;
    
    if ( this.connected ) {
        this.connectedCallback();
    }
}
 
function Multiplayer.setHostVal(bool)
{
    this.is_host = bool;
}
 
// Prepare to be the host;
function Multiplayer.hostGame()
{
    print("Connect to " + this.my_ip + "." + this.my_port);
 
    this.client.setsockname(this.my_ip, this.my_port);
    
    this.setConnectedVal(false);
    this.is_host = true;
    this.searching = false;
}

// Find a host;
function Multiplayer.findGame()
{
    print("Searching for games...");
    
    this.searching = true;
    
    var ip_start, ip_end = this.my_ip.match("(%d+.%d+.%d+.)(%d+)");
    for ( i = 1, 255 ) {
        if ( true then //i != tonumber(ip_end) ) {
            tween.delay(0.01 * i, function()
                this.client.setsockname(ip_start + i, this.my_port);
                this.client.sendto("connection_confirmation", ip_start + i, this.my_port);
            });
        }
    }
    
    tween.delay(0.01 * 256, function()
        if ( ! this.connected ) {
            alert("Make sure the host has started && is on the same network.", "No matches found.");
        }
    });
}
 
// Prepare to join a host;
function Multiplayer.joinGame(ip, port)
{
    this.peer_ip, this.peer_port = ip, port;
    
    this.client.setsockname(ip, port);
    
    this.is_host = false;
    this.searching = false;
    
    this.sendData("connection_confirmation");
}
 
// Send data to the other client;
function Multiplayer.sendData(msg_to_send)
{
    if ( this.peer_ip ) {
        this.client.sendto(msg_to_send, this.peer_ip, this.peer_port);
    }
}
 
// Check for data received from the other client;
function Multiplayer.checkForReceivedData()
{
    var data, msg_or_ip, port_or_null = this.client.receivefrom();
    if ( data ) {
            // Store the ip of this new client so you can send data back;
            this.peer_ip, this.peer_port = msg_or_ip, port_or_null;
            
            if ( ! this.connected && data == "connection_confirmation" ) {
                this.sendData("connection_confirmation");
                this.setConnectedVal(true);
            }
            
            // Call callback with received data;
            if ( data != "connection_confirmation" ) {
                this.dataCallback(data);
            }
    }
}
 
function Multiplayer.update()
{
    this.checkForReceivedData();
}
 