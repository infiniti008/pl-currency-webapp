<template>
  <div v-if="data && data.records?.[0]" class="page" :style="cssVars">
    <header>
      <p class="color-base">{{ data.name }}</p>
      <p style="color: #A4D0A4;">{{ data.previousDateTime }} - {{ data.dateTime }}</p>
    </header>
    <main>
      <div class="table">
        <div class="head">
          <div class="head-item first">
            <span class="head-item-text">Currency</span>
          </div>
          <div class="head-item">
            <span class="head-item-text">Previous</span>
          </div>
          <div class="head-item">
            <span class="head-item-text">Diff</span>
          </div>
          <div class="head-item last color-base">
            <span class="head-item-text">Now</span>
          </div>
        </div>
        <div class="row" v-for="record in data.records">
          <div class="row-top" :style="{ color: record.COLOR }">
            {{ record.NAME }}
          </div>
          <div class="row-bottom">
            <div class="row-item currency">
              {{ record.CURRENCY }}
              <svg :class="record.ARROW_CLASS" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 34" version="1.1">
                <g style="transform: translate(2px, 1px) scale(1.5);">
                  <path
                    d="M4.973,4.175 L9.975,7.919 L9.975,3.979 L4.973,0.036 L0.004,4.078 L0.004,7.996 L0.016,8.007 L4.973,4.175 Z">
                  </path>
                  <path class="arrow-d-second"
                    d="M4.973,11.958 L9.975,15.909 L9.975,11.971 L4.973,8.005 L0.004,12.069 L0.004,15.987 L0.016,15.997 L4.973,11.958 Z">
                  </path>
                </g>
              </svg>
              {{ record.CURRENCY_BASE }}
            </div>
            <div class="row-item rate">
              <span class="currency-s">{{ record.PREVIOUS_VALUE_S }}</span><span class="currency-e">{{
                record.PREVIOUS_VALUE_E }}</span>
            </div>
            <div class="row-item rate" :class="record.DIFF_STYLE">
              <span class="currency-s-diff">{{ record.DIFF_S }}</span><span class="currency-e-diff">{{ record.DIFF_E
              }}</span>
            </div>
            <div class="row-item rate last">
              <span class="currency-s currency-s-last">{{ record.LAST_VALUE_S }}</span><span class="currency-e">{{
                record.LAST_VALUE_E
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <p class="copyright">Produced by Currency Notifications App</p>
      <div class="image-qr">
        <img
          src="data:image/webp;base64,UklGRloRAABXRUJQVlA4TE0RAAAvR8FRAOZQ27YNY/3/dqqRKVNETIC+Mz5HA26EK0K++Dxz7Mj/r0iS08vMzMzMzMzMzMzMzMzMzMyDPdXcPVU5zcPMzFRT0dWVLzPfy8mXK6iJWN71ZG5eQKySRSYzwwGYO+Qp1hX9RZ7MEpygDyDWHEJUYrkKlZG6Q4kugD7WJQTlra2INOoSHTrF2oISeWimmPmJDiELXfIwghYk2aZta2rZa4xr27+2bdu2bdu2bdu2bfOZB0MCJEmmbX3btm3b9rNt29a3bdu2bdu2/3/G7eq/JEiSJDXy5AaTeqrHUPfMwO4bbq1tixQ6IKUiX9dxHGLLXEKN3d01JXa3ClwLcP4ZXKaHLYBDAbtFIJE3QAEeQkgJ5JtzKIBeKIBDziGmGQpgO6ICCqABupgUKcCJtoLJtwAogDbUtI0k7e71/wG79vgDMRwBAAhEL+gHvaCf2LZt14Tdtmuy3Qea7DrbM/uvyG3bRt0q3GP6BwehGtPBfx38d93solghYhFuP772CLcfX7ult5d8Hd0/IddO8nUlV3/51NF9FHLjbem/hXyd8a0n+Ovovgu+5ZdPO/Ftx3Z/h3wdxfe/+zD42ymfuuFbDuntxl9H90/k83mh9q8d8vscmfsn8t3+jG+cTa598qu7+yby+7w7ufmFfOYv+Lczu29CfnyNrx7k+hNfP8mnf91HEV9H+X7eSb7HR+Cbf1xXpfGEybwqZk19+dbm/t2c82U3KWuZMhYoY5bSZytrsbJXq/wOVT6mmtdo9JIWP7AnoMa0+o31jLX7updPDD4UitJjgBTEhqSmgEM0K1ISCZlaKaRUCswkpEQBpXRV5nxVPUnj17T9F8WHb7nlsVzNvlDtNOmTFFdKpu5LQDwWoASACmOxwAWmHiwU/Tvcv7+OvnICYQQAQL5u+Nc/Bdb2H+rcJH0KMZmll0TiAAtgiIwnAeEQs3CUfpB3fUltsgoyjfCsdlzW9tJMryEtFiCoxyMnBe/XNVepHBMK0z3tc9FxTiqSiBg44jFD6WNV7z4qRnesyVbmnqLR//yOBq5YgJCWPUtN3qFWLKySTgne6y6vwHeDQ+LzqMo+tfkXNaIHVn4H+2hcnK8ZuBNIS0Gp3mr0CvWh5W+cGLzKjweiAQN/Qok5VO0k8tP+j/dJzzcbvqRkc+kGkfgD4eylEpwQ4B/v46u3Qqp1k8QC8vmR8P7IcOpQtfgVFaHqKXxBv0EuHGJrryYfUQ2qHJEeIHk2/FYkpaYav0MlqHxEHOI1yMbve27Tj6gCNS6jO8+kTyFrS7X4BRWg7kMS0ykeMcjHr9n662Lqg5opuZwu8BtySDhzgZQLvuUi3c5P2vrJFDyT+6WVjwr7OAV/vyid0uuUb8glgUiDF1BdnXuYHtnw+5Jbqc3fUFybv0hqogsMGSV8DcWV2aQ0xM9/X/VgDxPBG2n0Gmq7Iug1XPlCgXgAd5IRXbvAI3TSbCPlSIbWUidL4z2q7RWcn9pwHEUbNKo2BHNG04ZOrFvMbYZu5G48KnyRAHBIgdAM//6UVv8xpgVwZW7kbuqUFQUi6YqX/vLazsrC8X+BqWwyktxd9gSUFL7xP4b+7ILVODH8ZEUMF5Hjozdd8zJALP3LZmu5ywM+9FWt6+CoA755gYJaRk2P8K45ZHlndhQrBMPkaX3q3v1FT53BnHOOHDt8/ca1BkVNWnZIN1ZpAIDRtWFHhU90FF9KP7VLgsYO859wiOGqVAoWtOJzbDImhZFI6afPNx8/ceDMjQCgR151W28/hyDGDCyvwTMobFrlXjzOC/Dkz2/FAGw6NpWRSb0fvx7bmSwK0AkrfPPboO5mLhWFbWMfuo3BN5cVCrDx6GRGKkVOnh4wYwOAzlmJPfxzGn/4G4gtopa/Ql3vOjH4FEKY2wojiZV78WqoXC0B+hINz45/RQxe9JqXoa65ZJgFDF60jUYl4WRPMmw1acq4Rfs4M3n5Yav1Czv36HHmkqzHT3uDqgAzGt42hM9Mmybq2trarxto/8cp7f5D4GWSMoOtt+64tOOwdRsAOmVFDg7v+3gKYkppCmGnmPCNpyU72n9hCth++kyc4i9fBX568MqfdeiIS0MmKNEfYFbTn0MQhxvVvQ/24yPwzROUymh85LlRZlDAdtNmIHX6zDcNUvWVD1CM0Sm16fFLoc1bjom/hAevD3+4Ur3jsCRevQ7Qn2y6s39sZ//4Ft72mUzPLngpgB79CtlPnuU648AhgN5FnXPj9AL+E+V3irIWV2kdYwDRevykGFiym9GYUnGoOVRmFHwqZ44Cc5bt9p2ibcHAIeARCIgEBBwcCVGgWJcvtKFUtzCHQHi/4FKfol4UKwRTVBieq/X/eYNlawqwi3+G/9cyxI0VZW1q7dQMsexU4CdtSC5kkDNBTBDjG8Qgp+OT8UhT9Zs9e3Ob4UpIEUqEAiFHyFBSmJiD5sxan/4gDaE6BzyGkZGCPYILXfCSAOcdO8GcWaCFA8Dy9kyd/0RsRbX5C7ra172hi3YeXTQmfXx7eIDoITqYFqa5lFHIyG0ZhYTAIKQoyS9KjBJhRBykHWmRMOMPM5geAAu2dMy18+y5ANOb7vxtLZ5YpMkH6OpY/3UIuVVjFtMXxU6GtWnmIsXA1KcI1fEmTCYjBuZ10KCEKAFGgOEjOHORUxl6Kczc1T8DMEKB9m0S8p0eATCqNjjCw7Q6d6CqPlmTM8NfFyDNZHqj1KRvC1CklPoWooGpYaoDmHJTOSSvuULxbzA8DBfHOZuJzE+gPcIiJ0Tvu+Sloa9UNR/oFHfpCsDgsqPHw39hleOiqnGEUaE4qyOK/nqUsvR6LgqSU5F55f//B0IC7jR34O4Ew8GwcWwcC8echUz3pRXCEpDTo++9iJrQU1Cx5uevTrbbdzsVRWAQ2c7Pn05o1ygFnMtHtE6zSv9icX4A+fDcVjhKJXo/HwXJyYFByWbAu/eaO3K3rVJtzOIYODqBNgsZHUgrRVycFH3qlpeHPlJUr/v9p+tIdjDZAXHxE9d3R+Pc8NVNoSyoEi2AR+xLmtD/pShSSgzyv5RafAHMtppidAQqMytNOJMOCuOQ7fzDvIfv6fIwX8q4olWWVFMLRGNb0VwBNuVDuwHmTE0aAl2hY0DDkOclq3L0SlDAHEsbBbBcNz/m9AuAaQ2XEF/p/c8cd7TKctqsJMQCGGLnozF0RYBOMdRa/PcH8pSmE0FuSWntSGheTzKSnoLl7NkAkHTtRq7pqo0FWNlZgBi/7WfPJ/0A0jp/QkyjXNgEyDjeyTaZJzAUCmaYdn1dll4wlKFV93TELDgxejmL6QMAS3f2Zk7VPnzq0a8A1zs4fJCHkDOfDQJEpyyrzRJ2QwfB+C+2JpQgE9hDa/EwLGnztBhST6LqNIbThLrJiKpv17wcAExcelCTP9JzrTs0FmA41SsOhHh/Os8aD3oBoFMWV5MCzodFbz+utTTHkiGs65gRGo7CB4uQZBG+CfzMWte04a9/mVOlN+96DisBrO2u5hADIWPe0aqeW0VHg8ErAVtlxkDw5qgjDQF4kBA7HFXefegdq7noyih5v6M3b2UumbbqGIBBZNvikBVA+EnuF3SB+PYKmEG5F4lyA07i91Mm0415yGIeslyI7AXOu9E8hk76g0e7z1/46X2XLj9y4+ZCx0++j7lm9f7hALC9f5RDUAdvaof4j6TWX/r4Xnx/KpTh+ZDzovQEBGlhKwlggxEJDB0LXbjbV249/LCTgYlPu2Q9EwDmNsM15Lu8tqd9iap6YOVPCb7mIS1kJQCsMSCCCSSGLrz1K3PjMzIePp668igAGF83ikdDwEDObrey91MVHOE91ZAWtVIA1hwYyYRSkm7fWg43N3TcUsI+yhteAQAT6qbRkJWI+JEHVvtW15fR1e7OOR255i5tTwVYqVcQE0waPbBAl8HOkUMI/rj3M3H+/r63zNnQsnu3HABEscILWfEF6LPhjQbNKSPpam19TcgCoCxrTwdYtquviOWts7LHk0AP9qW9QzFvxXsvXnr1Qq2c5mxoeb8hcjS/MwAADK267eqf4pCA30AKnh3+H4kPpKs5ZGgJMHhR2z1XcRbkWKqTFxORBrcOFNolbZQUK8JnAZERVL/13XUlIDf3p6GZRwevgK4GYW3OCH8nISirOgtzfJyJSbtXVxYOcLoSOxru6aITVrgnXu15i1iJ+wXXvWI+yafv6BxXHLiWn+DxomU2gJr5aGu7q3LM18yOiUoj+pdCN5koJ+/eCzC46rSZt20779D+wa0z4p8FHOIT8yELCxBZWpshuu741jfFVfceJuotYAN3I8AcDSwYxuw2bwHAjIZn2RRoeS47jEWIJDTRw2mrzV/EVaYjwubeLoB/4XQ1wFL2FF3Ch8DLrFMUK0RbLGuJEHd9ewdXcgyevdnf8Llpv2nrAOzmnw2JF2rwBPqqdx/EX/iO58T/ehe1AU7atQefXwD0K5sUjbPiENEiia3U9n/oq+1/JDRTxODFloLZTH/nVdX3H3G5slu7DMCKzlwJ98MV94rRF6t8kDDfBSdF73vglQGGzdvmSixqfPqy+fiJXZulAAaV7R8UEM0bm0PNv0FjLX8hobgCiL9Km3nbc1s0XrG+y3Txuerxzly1Sp+QN7+Jl+W6+S3RwWOhVk65gT/5iWEEDzV99XEz1Bh//cnKDb3rTwCgT1H/qPBRyC/0avRh6TKkAN//jiH7utfCiH7QN3E3d8PLAbYMp3ofHT7VxJ+9BU3egbNO+PtNyUwvPKPjvAegviPt8PDeZLpVd7wCHoOrjt+IhrwUxC/hJ2cskIOgM9jTvZqGGIjk+Y6P3v5wGXv6Mva0WyDz7xWdeas6i1ZxFjmzirNwDWfZuu7add0167hrPrCJu21Td/um7ratvL3P2NY7+Of9ghvRUMAhAQlnb1xaNf0ErY0vzIvEmRH0TNKK6ELhEF603Jia6YzPK+2D3+W2yEHQGmxi7NQNOeWCxLpq/Sf01iercbz/jkP88mEBzNq3cRD0BrPKIEuUmwDI53sxwpmLxWgONjC2aB7ZfL1IcjN9VOmQHz9LrmOZTUpLgUwUJGbW0tpsbPMP/OujYrInkDpGul8OYgAOqX6BKFaI9lir37B1lhXxy+An5JffIQdBf+zFKdXlI396d/YyMTWANXpDSmWIn9KQzNmyJ0B1yFNyVZF90gK8O3uB2v6Pg1AJWJOPWDtJJygWeHe5jbInwVQD1uIX0sfqDxaA1Hg14qtyWA6CkaH83/sOIjME73+od49Dgn4itKQyqnMbJhW++tECQM3LJBWVRuLb3/PTR/Adpjqwpp/JGK/8IG5mQmb9054AUyFYuyRqnCWxMni/MvoCPX2MmryFMVWCsYLyG0jIIw7x4hLJv2WtK9yTqRaMfafcasXlUDiIY6jq45BC0b+XOb8+Vs1grNlnKm5TUl1xSMgr8Z8Fg7wzwq9bmXvG4UYOgqkdjLX+g5qXSJ+kmDziECsS9Ih7znsBhApH6Yd4d1fW5jg/uqj88NeD0Hba5t+pcYHMuUpqoj9yCPgicYDHAvDiiQcuCN3GjAadGf44yLu5lr50TD4a8/LJZ/1UUIK5W5M31LhA+Y2yjVRSG8UUVOCCvJBp+vIinkJx9hnhz2ODV3u5FzY0Ns0hw24PAOqI4Nfst/jJdxo+51O1b1HrGrWuU+cO9R7R+DXzyMiphIPra9UHInW+DnnS2yG93vKpP772kVte91WU5/8BLL/1R/xyuX/S/vW/9HqR61/p7RdfJ/c/2t/64687uX6R3i75LKf7JfiXR771l74e4esv8uun+yTk60i+ruTbJ9/jDtyPwd+/8p1P4Jv/uM9Crp+kt4vc8pJfr9zvUL7jD8TXH3+/4m8P/vXJfRDl+/y7fMb/+OpPrp/c4FCN6eC/Dv67LnwsAA==">
      </div>
    </main>
  </div>
  <H2 v-else>LOADING DATA</H2>
</template>

<script>
import { templateMixin } from './templateMixin.js';
import CardV1 from './ui/CardV1.vue';

export default {
  name: "SubscriptionsStoriesV1",
  mixins: [templateMixin],
  components: {
    CardV1
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  async created() {
    const body = document.querySelector('body');
    body.classList.add('subscriptions-stories-v1');
    await this.getData();
    await this.prepareData();
  },
  computed: {
    cssVars() {
      return {
        '--main-color': this.data.color
      }
    },
  }
};
</script>
<style lang="scss">
body.subscriptions-stories-v1 {
  width: 1080px;
  height: 1920px;
}
</style>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;600;900&display=swap');

.page {
  padding: 26px 10px 10px;
  margin: 0;
  font-weight: 700;
  width: 1080px;
  height: 1920px;
  box-sizing: border-box;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Roboto Slab', serif;
}

.page header {
  text-align: center;
  font-size: 46px;
  margin-bottom: 28px;
  font-family: 'Roboto Slab', serif;
}

.page header p {
  padding: 0;
  margin: 0;
}

.table {
  margin: 0 15px;
}

.head {
  font-size: 48px;
  padding: 16px 0;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid var(--main-color);
  color: #643A6B;
}

.head-item {
  text-align: center;
  line-height: 44px;
  margin-left: 24px;
}

.head-item.last {
  text-align: end;
  padding-right: 44px;
}

.head-item.first {
  text-align: start;
  margin-left: 8px;
}

.head-item:last-child {
  border-right: none;
}

.head-item-text {
  display: inline-block;
  min-width: 60%;
}

.row {
  border-bottom: 1px solid var(--main-color);
}

.row-top {
  padding-top: 4px;
  margin-left: 8px;
  font-size: 38px;
}

.row-bottom {
  padding: 2px 0;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-size: 54px;
}

.row-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-item.last {
  margin-right: 6px;
  justify-content: end;
}

.row-item.rate {
  font-size: 62px;
}

.row-item.currency {
  color: var(--main-color);
  font-weight: 900;
  margin-left: 6px
}

.diff-up {
  color: #1B9C85;
}

.diff-down {
  color: #B04759;
}

.currency-s {
  font-weight: 900;
  color: rgb(255, 186, 0);
}

.currency-e {
  color: #D8D8D8;
}

.currency-s-diff {
  color: #D8D8D8;
}

.currency-e-diff {
  font-weight: 900;
}

.currency-s-last {
  color: var(--main-color);
}

.arrow-left {
  height: 58px;
  margin: 0px 4px 0 16px;
  transform: rotate(-90deg);
  fill: #47A992;
  stroke: #47A992;
}

.arrow-right {
  height: 58px;
  margin: 2px 16px 0 4px;
  transform: rotate(90deg);
  fill: #A459D1;
  stroke: #A459D1;
}

.arrow-center {
  height: 58px;
  margin: 0px 8px 0 12px;
  transform: rotate(-90deg);
}

.arrow-center .arrow-d-second {
  transform: rotate(180deg) translate(-10px, -27px);
}

.bot-image {
  display: flex;
  justify-content: center;
}

.bot-image img {
  width: 100%;
}

.color-base {
  color: var(--main-color);
}

.copyright {
  text-align: center;
  margin: 0;
  font-size: 30px;
  font-weight: 400;
  margin-top: 10px;
}

.image-qr {
  display: flex;
  justify-content: center;
}

.image-qr img {
  width: 420px;
}
</style>
