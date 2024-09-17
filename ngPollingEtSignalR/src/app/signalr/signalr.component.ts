import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { UselessTask } from '../models/UselessTask';


@Component({
  selector: 'app-signalr',
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css']
})
export class SignalrComponent implements OnInit {

  private hubConnection?: signalR.HubConnection;
  usercount = 0;
  tasks: UselessTask[] = [];
  taskname: string = "";

  ngOnInit(): void {
    this.connecttohub()
  }

  connecttohub() {
    this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:7289/matchHub')
                              .build();

    this.hubConnection!.on('TaskList', (data) => {
        this.tasks = data
        console.log(data);
    });

    this.hubConnection!.on('UserCount', (data) => {
      this.usercount = data
      console.log(data);
  });
    
   
    this.hubConnection
        .start()
        .then(() => {
            console.log('La connexion est active!');
          })
        .catch(err => console.log('Error while starting connection: ' + err));
  }

  complete(id: number) {
    this.hubConnection!.invoke('Complete', id);
  }

  addtask() {
    this.hubConnection!.invoke('Add', this.taskname);
  }

}
