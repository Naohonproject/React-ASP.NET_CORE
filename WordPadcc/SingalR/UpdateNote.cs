using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Utils;

namespace WordPadcc
{
    public class RealtimeHubs : Hub
    {
        public async Task SendMessage(string nodeContent)
        {
            await Clients.All.SendAsync("update-node-content", nodeContent);
        }
    }
}
