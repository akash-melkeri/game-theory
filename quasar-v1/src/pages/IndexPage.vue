<template>
  <q-page class="">
    <div class="tw-bg-green-400">hello</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup () {
    return {}
  },
  components: {},
  methods: {
    test_strategies(strategy1, strategy2, rounds = 10) {
      let previous_moves = [];

      let results = {
        strategy1_wins: 0,
        strategy2_wins: 0,
        draws: 0
      };

      for (let i = 0; i < rounds; i++) {
        const result1 = strategy1(previous_moves);
        const result2 = strategy2(previous_moves);

        const move_result = {
          round: i + 1,
          strategy_a: result1,
          strategy_b: result2
        };

        previous_moves.push(move_result);

        if (result1 && !result2) {
          results.strategy1_wins++;
        } else if (!result1 && result2) {
          results.strategy2_wins++;
        } else {
          results.draws++;
        }
      }

      return results;
    }
  },
  computed: {},
  mounted () {

  },
  created () {},
});
</script>
