<template>
  <div class="menu">
    Menu
  </div>
</template>

<script>

// let TELEGRAM_USER = '';
// const DAYS_LIMIT = 15;
// const IS_DEV_MODE = window.location.search.indexOf('isDevMode=true') !== -1;
// const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '';

// if (userId) {
//   TELEGRAM_USER = userId.toString();
// }

// if (IS_DEV_MODE) {
//   TELEGRAM_USER='208067133';
// }

export default {
  name: 'PageMenu',
  components: {
    // Button
  },
  data: () => {
    return {
      // pointsList: {},
      // transportsList: {},
      // datesList: [],
      // selectedPoint: 0,
      // selectedTransport: 'auto',
      // selectedDate: 0
    };
  },
  // computed: {
  //   isAddButtonEnabled() {
  //     return ( 
  //       parseInt(this.selectedDate) !== 0 && 
  //       parseInt(this.selectedPoint) !== 0 && 
  //       parseInt(this.selectedTransport) !== 0
  //     );
  //   }
  // },
  // created() {
  //   this.initEditor();
  // },
  // methods: {
  //   async initEditor() {
  //     try {
  //       this.$bus.$emit('toggleLoading', true);

  //       await this.getTransportsList();
  //       await this.getPointsList();
  //       this.getDataList();
  //     } catch(error) {
  //       console.error(error);
  //       this.showError(error);
  //     } finally {
  //       this.$bus.$emit('toggleLoading', false);
  //     }
  //   },
  //   async getPointsList() {
  //     try {
  //       const pointsList = await getPointsList();
  //       this.pointsList = pointsList;
  //     } catch (error) {
  //       console.error(error);
  //       this.showError(error);
  //     }
  //   },
  //   async getTransportsList() {
  //     try {
  //       const transportsList = await getTransportList();
  //       this.transportsList = transportsList;
  //     } catch (error) {
  //       console.error(error);
  //       this.showError(error);
  //     }
  //   },
  //   getDataList() {
  //     let dates = [];
  //     const date = new Date();

  //     dates.push(date.toISOString().substring(0, 10));

  //     for(let i = 1; i < DAYS_LIMIT; i++) {
  //       date.setDate(date.getDate() + 1);
  //       dates.push(date.toISOString().substring(0, 10));
  //     }

  //     dates = dates.map(item => item.split('-').reverse().join('.'));

  //     this.datesList = dates;
  //   },
  //   async handleClickButton() {
  //     if(this.selectedDate && this.selectedPoint && this.selectedTransport) {
  //       try {
  //         this.$bus.$emit('toggleLoading', true);
          
  //         await addSubscription(TELEGRAM_USER, this.selectedPoint, this.selectedDate);
  //         this.showSuccess();
  //       } catch(error) {
  //         console.error(error);

  //         this.showError(error);
  //       } finally {
  //         this.resetEditor();
  //         this.$bus.$emit('toggleLoading', false);
  //       }
  //     }
  //   },
  //   resetEditor() {
  //     this.selectedPoint = 0;
  //     this.selectedTransport = 'auto';
  //     this.selectedDate = 0;
  //   },
  //   showError(error) {
  //     this.$bus.$emit('open-modal', {
  //       name: 'notify-modal',
  //       data: {
  //         content: error,
  //         title: 'Ошибка'
  //       }
  //     });
  //   },
  //   showSuccess() {
  //     const content = `
  //       <p>${this.transportsList[this.selectedTransport]}</p>
  //       <p>${this.pointsList[this.selectedPoint]}</p>
  //       <p>${this.selectedDate}</p>
  //     `;
  //     this.$bus.$emit('open-modal', {
  //       name: 'notify-modal',
  //       data: {
  //         content,
  //         title: 'Уведомление успешно создано'
  //       }
  //     });
  //   }
  // }
}
</script>

<style lang="scss">
@import '../styles/variables/colors.scss';

.editor {
  padding: 10px 10px 80px 10px;

  &__select-group {
    margin: 15px 0;

    p {
      margin-bottom: 10px;
    }

    select {
      height: 36px;
      width: 100%;
      font-size: 16px;
      border: 2px solid $--yellow;
      border-radius: 6px;
    }
  }

  .button {
    width: 100%;
  }
}
</style>