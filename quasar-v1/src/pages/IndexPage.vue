<template>
  <q-page class="">
    <div class="container">
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-6">
        <div class="tw-flex tw-gap-4 tw-items-center" >
          <q-select v-model="menu.strategy.value" multiple map-options :display-value="menu.strategy.value ? (menu.strategy.value.length > 1 ? `Strategies (${menu.strategy.value.length})` : (menu.strategy.value[0] ? menu.strategy.value[0].label : 'Select Strategy')) :'Select Strategy'" :clearable="menu.strategy.value && (menu.strategy.value.length > 1)" filled dense :options="menu.strategy.options" style="min-width: 170px"></q-select>
          <q-input v-model="menu.rounds.value" filled dense label="Rounds" mask="###,###,###,###" unmasked-value reverse-fill-mask></q-input>
          <q-btn @click="test" :disable="testing" class="tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-br tw-from-blue-500 tw-to-blue-800 tw-rounded-lg" label="Add New Strategy" icon-right="add" unelevated></q-btn>
        </div>
        <div>
          <q-btn @click="test" :disable="testing" class="tw-bg-gradient-to-br tw-from-blue-500 tw-to-blue-800 tw-text-white tw-rounded-lg" label="Test" icon-right="play_arrow" unelevated></q-btn>
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-6 tw-pt-6 tw-pb-4">
        <q-expansion-item v-for="item, index in menu.strategy.value" switch-toggle-side :key="index" class="tw-rounded-lg tw-overflow-hidden tw-border tw-shadow-lg">
          <template v-slot:header>
            <div class="tw-w-full tw-flex tw-justify-between tw-items-center">
              <div class="">
                <div class="tw-font-bold tw-text-lg">
                  {{ item.label }}
                </div>
              </div>
              <div>
                <div class="tw-font-bold tw-text-lg">
                  {{ total_scores[item.label] || 0 }}
                </div>
              </div>
            </div>
          </template>
          <div class="tw-border-t tw-p-4">
            <div></div>
            <div v-if="all_table_data.data[item.label]" class="tw-flex tw-flex-col tw-gap-2">
              <q-table :rows="all_table_data.data[item.label]" row-key="strategy" :columns="all_table_data.columns">
                <template v-slot:body="props">
                  <q-tr :props="props" :class="props.row.score.strategy_a > props.row.score.strategy_b ? 'tw-bg-green-100' : (props.row.score.strategy_a < props.row.score.strategy_b ? 'tw-bg-red-100' : 'tw-bg-gray-100')">
                    <q-td key="strategy" :props="props">
                      {{ props.row.strategy }}
                    </q-td>
                    <q-td key="score" :props="props">
                      <div>
                        {{ props.row.score.strategy_a }} - {{ props.row.score.strategy_b }}
                      </div>
                    </q-td>
                    <q-td v-for="i in all_table_data.rounds" :key="'round_'+i" :props="props">
                      <div class="tw-flex tw-flex-col tw-gap-2 tw-items-center">
                        <div class="tw-h-8 tw-aspect-square tw-rounded tw-flex tw-items-center tw-justify-center" :class="`${props.row[`round_${i}`].strategy_a ? 'tw-bg-green-600' : 'tw-bg-red-600'}`">

                        </div>
                        <div class="tw-h-8 tw-aspect-square tw-rounded tw-flex tw-items-center tw-justify-center" :class="`${props.row[`round_${i}`].strategy_b ? 'tw-bg-green-600' : 'tw-bg-red-600'}`"></div>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </q-expansion-item>
      </div>
    </div>
    <q-dialog v-model="dialog_add_custom_strategy.show">
      <q-card class="card"></q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {
      menu: ref({
        strategy:{
          value: [],
          options:[
            {
              value:"Always Good",
              label:"Always Good",
              description:"Always cooperates",
              code: (moves, id)=>{
                return true
              },
            },
            {
              value:"Always Bad",
              label:"Always Bad",
              description:"Always deflects",
              code: (moves, id)=>{
                return false
              },
            },
            {
              value:"Tit-for-Tat (Good)",
              label:"Tit-for-Tat (Good)",
              description:"Cooperates for first move, then copies opponent's last move",
              code: (moves, id)=>{
                if(moves.length === 0) return true
                const last_move = moves[moves.length - 1]
                return id == 's1'? last_move.strategy_b : last_move.strategy_a
              },
            },
            {
              value:"Tit-for-Tat (Bad)",
              label:"Tit-for-Tat (Bad)",
              description:"Deflects for first move, then copies opponent's last move",
              code: (moves, id)=>{
                if(moves.length === 0) return false
                const last_move = moves[moves.length - 1]
                return id == 's1'? last_move.strategy_b : last_move.strategy_a
              },
            },
            {
              value:"Tit-for-Tat (Random)",
              label:"Tit-for-Tat (Random)",
              description:"Plays random move for first move, then copies opponent's last move",
              code: (moves, id)=>{
                if(moves.length === 0) return Math.random() > 0.5
                const last_move = moves[moves.length - 1]
                return id == 's1'? last_move.strategy_b : last_move.strategy_a
              },
            },
          ],
        },
        rounds:{
          value: 10,
        }
      }),
      testing: false,
      total_scores: ref({}),
      all_records: ref({}),
      columns: [
        {
          name: 'round',
          required: true,
          label: 'Round',
          align: 'left',
          field: 'round',
          sortable: true,
        },
        { name: 'strategy_a', label: 'Strategy A', field: 'strategy_a', sortable: true },
        { name: 'strategy_b', label: 'Strategy B', field: 'strategy_b', sortable: true },
      ],
      dialog_add_custom_strategy:ref({
        show: true,

      })
    }
  },
  components: {
  },
  methods: {
    test_strategies(strategy1, strategy2, rounds = 10) {
      // console.log(strategy1 + '', 1232)
      let previous_moves = [];
      let moves = [];

      let results = {
        strategy1: 0,
        strategy2: 0,
      };

      for (let i = 0; i < rounds; i++) {
        const result1 = strategy1(previous_moves, 's1');
        const result2 = strategy2(previous_moves, 's2');

        const move_result = {
          round: i + 1,
          strategy_a: result1,
          strategy_b: result2
        };

        previous_moves.push(move_result);
        moves.push(move_result);

        if (!result1 && !result2) {
          results.strategy1 += 1;
          results.strategy2 += 1;
        } else if (result1 && !result2) {
          results.strategy1 += 0;
          results.strategy2 += 5;
        } else if (!result1 && result2) {
          results.strategy1 += 5;
          results.strategy2 += 0;
        } else {
          results.strategy1 += 3;
          results.strategy2 += 3;
        }
      }

      return {
        results,
        moves
      };
    },
    test(){
      this.testing = true
      this.menu.strategy.value.forEach((strategyA, indexA) => {
        this.all_records[strategyA.label] = {}
        strategyA.loading = true
        let score = 0
        this.menu.strategy.value.forEach((strategyB, indexB) => {
          this.all_records[strategyA.label][strategyB.label] = {}
          const results = this.test_strategies(strategyA.code, strategyB.code, this.menu.rounds.value)
          // console.log(strategyA.label, strategyB.label, results)
          score += results.results.strategy1
          this.all_records[strategyA.label][strategyB.label] = results
        })
        strategyA.loading = false
        this.total_scores[strategyA.label] = score
      })
      this.testing = false
    },
  },
  computed: {
    all_table_data(){
      let columns = [
        {
          name: 'strategy',
          required: true,
          label: 'Playing Against Strategy',
          align: 'left',
          field: 'strategy',
          sortable: true,
        },
        {
          name: 'score',
          label: 'Score',
          field: 'score',
          sortable: true,
          sort: (a, b) => parseInt(a.strategy_a) - parseInt(b.strategy_a),
          style: 'width: 100px'
        },
      ]
      let rounds = 0
      let data = {}
      Object.keys(this.all_records).map((strategy_a, index_a)=>{
        data[strategy_a] = []
        Object.keys(this.all_records[strategy_a]).map((strategy_b, index_b)=>{
          rounds = this.all_records[strategy_a][strategy_b].moves.length
          let item = {
            strategy: strategy_b,
          }
          item.score = {
            strategy_a: this.all_records[strategy_a][strategy_b].results.strategy1,
            strategy_b: this.all_records[strategy_a][strategy_b].results.strategy2,
          }
          this.all_records[strategy_a][strategy_b].moves.forEach((move, index)=>{
            item['round_'+(index+1)] = move
          })
          data[strategy_a].push(item)
        })
      })
      for(let i = 0; i < rounds; i++){
        columns.push({
          name: 'round_'+(i+1),
          label: `Round ${i+1}`,
          field: `round_${i+1}`,
        })
      }
      return {
        columns,
        data,
        rounds,
      }
    },
  },
  mounted () {
    this.menu.strategy.value = this.menu.strategy.options
  },
  created () {},
});
</script>

