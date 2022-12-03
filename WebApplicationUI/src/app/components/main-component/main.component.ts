import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  public Field: Cell[][] = [];
  public cellValue = -1;
  public win = 0;
  public moving = false;

  public wonStr = 'Ти виграв!';
  public loseStr = 'Ти програв!';

  constructor(private client: HttpClient) {}
  public start() {
    this.client.get(environment.baseUrl + '/Game').subscribe((data) => {
      this.Field = data as Cell[][];
      if (this.cellValue === 0) {
        this.moving = true;
        this.serverMove();
      }
    });
  }

  public async move(cell: Cell) {
    if (cell.value === null) {
      this.moving = true;
      cell.value = this.cellValue;
      this.checkWin(this.cellValue);
      if (this.win === 0) this.serverMove();
    }
  }
  public serverMove() {
    this.client
      .post(
        environment.baseUrl +
          '/Game/ServerMove?value=' +
          (this.cellValue === 0 ? 1 : 0),
        this.Field
      )
      .subscribe((data) => {
        this.Field = data as Cell[][];
        this.checkWin(this.cellValue === 0 ? 1 : 0);
        this.moving = false;
      });
  }
  public checkWin(value: number) {
    let result = value === this.cellValue ? 1 : -1;
    let res = false;
    const _boardSize = 3;
    for (let i = 0; i < _boardSize; i++) {
      res = true;
      for (let j = 0; j < _boardSize; j++) {
        if (this.Field[i][j].value !== value) res = false;
      }
      if (res) {
        this.resulting(result);
        return;
      }
    }
    for (let i = 0; i < _boardSize; i++) {
      res = true;
      for (let j = 0; j < _boardSize; j++) {
        if (this.Field[j][i].value !== value) res = false;
      }
      if (res) {
        this.resulting(result);
        return;
      }
    }
    res = true;
    for (let i = 0; i < _boardSize; i++) {
      if (this.Field[i][i].value !== value) res = false;
    }
    if (res) {
      this.resulting(result);
      return;
    }

    res = true;
    for (let i = 0; i < _boardSize; i++) {
      if (this.Field[i][_boardSize - 1 - i].value !== value) res = false;
    }
    if (res) {
      this.resulting(result);
      return;
    }
    //check draw
    let v = this.Field.reduce((a, b) => a.concat(b)).filter(
      (a) => a.value === null
    );
    if (v === undefined || v.length === 0) {
      this.resulting(2);
      return;
    }
  }
  private resulting(result: number) {
    this.win = result;
    this.moving = false;
    this.Field = [];
  }
}
export interface Cell {
  position: Position;
  value: number;
}
export interface Position {
  x: number;
  y: number;
}
