import { Component, OnInit } from '@angular/core';
import { UselessTask } from '../models/UselessTask';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.css']
})
export class PollingComponent implements OnInit {

  title = 'labo.signalr.ng';
  tasks: UselessTask[] = [];
  taskname: string = "";

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.updateTasks();
  }

  complete(id: number) {
    let x = lastValueFrom(this.http.get<any>("https://localhost:7289/api/UselessTasks/Complete/"+id))
  }

  addtask() {
    
    let x = lastValueFrom(this.http.post("https://localhost:7289/api/UselessTasks/Add?taskText="+this.taskname,""))

  }

  async updateTasks() {
    this.tasks = await lastValueFrom(this.http.get<UselessTask[]>("https://localhost:7289/api/UselessTasks/GetAll"))
    setTimeout(() => {this.updateTasks()}, 500);
  }
}
