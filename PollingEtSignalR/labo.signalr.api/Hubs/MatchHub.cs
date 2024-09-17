using labo.signalr.api.Controllers;
using labo.signalr.api.Data;
using labo.signalr.api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace labo.signalr.api.Hubs
{
    public class MatchHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public MatchHub(ApplicationDbContext context)
        {
            _context = context;
        }
        static int usercount = 0;
        public override async Task OnConnectedAsync()
        {
            base.OnConnectedAsync();
             List<UselessTask> uselessTasks =  await _context.UselessTasks.ToListAsync();
            await Clients.Caller.SendAsync("TaskList", uselessTasks);
            await Clients.All.SendAsync("UserCount", usercount++);



        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            base.OnDisconnectedAsync(exception);
            await Clients.All.SendAsync("UserCount", usercount--);


        }


        public async Task Add(string taskText)
        {
            UselessTask uselessTask = new UselessTask()
            {
                Completed = false,
                Text = taskText
            };
            _context.UselessTasks.Add(uselessTask);
            await _context.SaveChangesAsync();
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());

        }

        public async Task Complete(int id)
        {
            UselessTask? task = await _context.FindAsync<UselessTask>(id);
            if (task != null)
            {
                task.Completed = true;
                await _context.SaveChangesAsync();
            }
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());
        }


    }
}
