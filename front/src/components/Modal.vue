<template>
  <transition name="fade">
    <div class="modal" v-if="show">
      <div class="modal-backdrop" @click="closeModal()"/>

      <div class="modal-dialog">
        <div class="modal-header">
          <div class="close-btn-header">
            <button type="button" class="modal-close" @click="closeModal()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
                <path
                  fill="currentColor"
                  d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="title-header">
            <slot name="header"/>
          </div>
        </div>

        <div class="modal-body">
          <slot name="body"/>
        </div>

        <div class="modal-footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal", // Source: https://medium.com/notonlycss/how-to-build-a-modal-in-vue-js-b3db644afaeb
  data() {
    return {
      show: false
    };
  },
  methods: {
    closeModal() {
      this.show = false;
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      this.show = true;
      document.querySelector("body").classList.add("overflow-hidden");
    }
  }
};
</script>


<style>
    .modal {
        overflow-x: hidden;
        overflow-y: auto;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 600;
        }

    .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        }

    .modal-dialog {
        background-color: #ffffff;
        position: relative;
        width: 600px;
        margin: 50px auto;
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        z-index: 2;
        }

    @media screen and (max-width: 992px) {
        .modal-dialog {
            width: 90%;
        }
    }

    .modal-close {
        width: 25px;
        border: 0;
        background-color: transparent;
        cursor: pointer;
        margin: 0;
    }

    .modal-header {
        padding: 10px 20px 0px;
        display: flex;
        flex-direction: column;
    }

    .title-header {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-header > h1 {
      margin: 0 0 0.2em;
    }

    .close-btn-header {
        display: flex;
        flex-direction: row-reverse;

    }

    .modal-body {
        padding: 0px 20px 10px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .modal-footer {
        margin-top: 10px;
        padding: 15px 20px 15px;
        background-color: #eff0f4;
        border-radius: 0 0 5px 5px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.2s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

</style>