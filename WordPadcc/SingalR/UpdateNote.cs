using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace WordPadcc
{
    public class RealtimeHubs : Hub
    {
        // define a function that let client send the event and payload
        public async Task SendMessage(string nodeContent)
        {
            // set up event name and payload to push to client
            await Clients.All.SendAsync("update-node-content", nodeContent);
        }

        public async Task SendToOthers(string message)
        {
            await Clients.Others.SendAsync("password-setting", message);
        }
    }
}
