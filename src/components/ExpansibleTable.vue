<template>
  <div>
    <v-simple-table height="45vh" class="table">
      <thead>
        <tr>
          <th v-for="(trow, index) in tcolumns + 2" :key="trow.index">
            <h3 v-if="index <= tcolumns">{{index}}</h3>
            <h3 v-else>Average</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        <template class='rowWrapper' v-for="(row, rowIndex) in trows">
        <tr :key="row">
          <td class="tableRow" v-for="(column, columnIndex) in tcolumns + 2" :key="columnIndex">
            <h3 v-if="(columnIndex - 1) == -1">{{rowIndex + 1}}</h3>
            <v-text-field class='tableInput'
                          dense hide-details solo
                          v-else-if="columnIndex < tcolumns + 1"
                          type="number" @input="onInput(rowIndex)"
                          v-model.number="tableValues[rowIndex][columnIndex-1]">
            </v-text-field>
            <h3 v-else>{{rowsAverage[rowIndex]}}</h3>
          </td>
        </tr>
          <v-row class="rowSum" :key='rowIndex + 100' justify="center" no-gutters>
            <h4 class='body1'>{{`Row sum: ${rowsSum[rowIndex]}`}}</h4>
          </v-row>
        </template>
      </tbody>

    </v-simple-table>

    <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-icon>mdi-table</v-icon>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row justify="center">
          <v-btn color='indigo' dark @click="addRow">
            <v-icon>mdi-plus</v-icon>
            Add row
          </v-btn>
          <v-btn color='indigo' dark @click="reduceRow">
            <v-icon>mdi-minus</v-icon>
            Reduce row
          </v-btn>
        </v-row>
        <v-row justify="center">
          <v-btn color='orange' dark @click="addColumn">
            <v-icon>mdi-plus</v-icon>
            Add column</v-btn>
          <v-btn color='orange' dark @click="reduceColumn">
            <v-icon>mdi-minus</v-icon>
            Reduce column
          </v-btn>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-icon>mdi-settings</v-icon>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row justify="center">
            <v-btn color="yellow" @click="clearData">
              <v-icon>mdi-trash-can-outline</v-icon>
              Erase values
            </v-btn>
            <v-btn color="yellow" @click="randomizeData">
              <v-icon>mdi-counter</v-icon>
              Randomize!
            </v-btn>
            <v-switch v-model="isUseRandom" label="Use random values"></v-switch>
        </v-row>
        <v-row>
          <v-col>
            <p class="body-1">Row limit</p>
            <v-text-field dense solo v-model="rowLimiter" label="Row limit"></v-text-field>
          </v-col>
          <v-col>
            <p class="body-1">Column limit</p>
            <v-text-field dense solo v-model="columnLimiter" label="Column limit"></v-text-field>
          </v-col>
          <v-col>
            <p class="body-1">Random value range</p>
            <v-text-field dense solo v-model="randRange" label="Random value range"></v-text-field>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    </v-expansion-panels>
    <v-snackbar v-model="notification"
                :timeout="notTimeOut">
      {{alertMsg}}
      <v-btn text @click="notification = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { random } from '../utils/utils';

interface ITableData {
  trows: number;
  tcolumns: number;
  randRange: number;
  tableValues: Array<Array<number>>;
  rowsAverage: Array<number>;
  rowsSum: Array<number>;
  rowLimiter: number;
  columnLimiter: number;
  notification: boolean;
  alertMsg: string;
  notTimeOut: number;
  isUseRandom: boolean;
}

interface ISize {
  trows: number,
  tcolumns: number,
}

interface ICalcResult {
  rowAverage: Array<number>,
  rowSum: Array<number>
}

function initTableValues(randRange: number, size: ISize): Array<Array<number>> {
  let arr: Array<Array<number>> = [[]];
  for(let r = 0; r < size.trows; r++) {
    // creates new array instance in a row
    arr[r] = []
    let values: number = 0;
    for(let c = 0; c < size.tcolumns; c++) {
      let value = random(randRange);
      arr[r][c] = value;
    }
  }
  return arr;
}

function initCalcData(tableValues: Array<Array<number>>, rows: number): ICalcResult {
  let rowAverage: Array<number> = new Array(rows);
  let rowSum: Array<number> = new Array(rows);

  for(let r = 0; r < rows; r++) {
    let reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    let sum = tableValues[r].reduce(reducer);
    rowAverage[r] = sum / tableValues[r].length;
    rowSum[r] = sum;
  }

  return {
    rowAverage: rowAverage,
    rowSum: rowSum,
  };
}

function initData(randRange: number) {
  let size = {
    trows: 5,
    tcolumns: 5,
  }
  let tableValues = initTableValues(randRange, size);
  let calcResult = initCalcData(tableValues, size.trows);

  let data: ITableData = {
    trows: size.trows,
    tcolumns: size.tcolumns,
    randRange: randRange,
    tableValues: tableValues,
    rowsAverage: calcResult.rowAverage,
    rowsSum: calcResult.rowSum,
    rowLimiter: 10,
    columnLimiter: 10,
    notification: false,
    alertMsg: '',
    notTimeOut: 3000,
    isUseRandom: false,
  }
  return data;
}

export default Vue.extend({
  name: 'exspansible-table',

  components: {
  },

  data: () => { return initData(100) },

  methods: {
    onInput(payload: number) {
      this.calculateDataByIndex(payload);
    },

    addRow() {
      // console.log('+Row');
      if(this.trows <= this.rowLimiter) {
        if(this.isUseRandom) {
          let newRow = [] as Array<number>
          for(let i = 0; i < this.tcolumns; i++) {
            newRow.push(random(this.randRange));
          }
          console.log(newRow);
          // this.tableValues.push([]);
          Vue.set(this.tableValues, this.tableValues.length, newRow);
        } else {
          let newRow = Array(this.tcolumns).fill(0);
          Vue.set(this.tableValues, this.trows, newRow);
        }
        this.calculateDataByIndex(this.trows);
        this.trows++;
      } else {
        this.showAlert("Row's limit reached");
      }
    },

    reduceRow() {
      // console.log('-Row');
      if(this.trows > 1) {
        this.tableValues.pop();
        this.trows--;
        this.rowsAverage.pop();
        this.rowsSum.pop();
      } else {
        this.showAlert("Table's row count should be more than 1");
      }
    },

    addColumn() {
      // console.log('+Column');
      if(this.tcolumns <= this.columnLimiter) {
        this.tableValues.map((item, index) => {
          // TODO: add ability to set random numbers;
          let value = (this.isUseRandom) ? random(this.randRange) : 0;
          this.tableValues[index].push(value);
        })
        this.tcolumns++;
        this.calculateData();
      } else {
        this.showAlert('Columns limit reached');
      }
    },

    reduceColumn() {
      // console.log('-Column');
      if(this.tcolumns > 1) {
        this.tableValues.map((item, index) => {
          this.tableValues[index].pop();
        })
        this.tcolumns--;
        this.calculateData();
      } else {
        this.showAlert("Table's column count should be more than 1");
      }
    },

    clearData() {
      this.tableValues.map((item, rowIndex) => {
        this.tableValues[rowIndex].splice(0, this.tcolumns);
        this.rowsAverage.fill(0);
        this.rowsSum.fill(0);
      });
    },

    calculateData() {
      this.tableValues.map((r, rowIndex) => {
        let rowSum = 0;
        this.tableValues[rowIndex].map((item, columnIndex) => {
          rowSum = rowSum + item;
        });
        this.rowsAverage[rowIndex] = rowSum / this.tcolumns;
        this.rowsSum[rowIndex] = rowSum;
      });
    },

    calculateDataByIndex(rowIndex: number) {
      let rowSum = 0;
      this.tableValues[rowIndex].map((item) => {
        rowSum = rowSum + item;
      });
      this.rowsAverage[rowIndex] = rowSum / this.tcolumns;
      this.rowsSum[rowIndex] = rowSum;
    },

    randomizeData() {
      this.tableValues.map((r, rowIndex) => {
        this.tableValues[rowIndex].map((c, columnIndex) => {
          this.tableValues[rowIndex].splice(columnIndex, 1, random(this.randRange));
        });
      });
      this.calculateData();
    },

    showAlert(text: string) {
      this.alertMsg = text;
      this.notification = true;
    }
  }

})
</script>

<style scoped lang="scss">
  .table {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }
  .tableRow {
    padding-top: 1rem;
    padding-bottom: 2rem;
  }
  h3 {
    color: #757575;
  }
  h4 {
    color: #757575;
  }
  .rowSum {
    text-align: center;
    white-space: nowrap;
    transform: translate(48vw, -1.8rem) translateX(-65%); /* a bit messy */
  }
</style>
