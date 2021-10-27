<template>
  <div :class="type_liste">
    <div class="case"
         style="position: relative;"
         v-for="casemonop in cases"
         :key="casemonop.id"
         v-bind:id="'case_' + casemonop.id"
         v-bind:class="{['categorie_' + casemonop.categorie_rue] : casemonop.categorie_rue, [casemonop.type]: true}">

      <span class="bandeau_couleur"><b v-if="casemonop.type != 'rue'">{{ casemonop.name }}</b></span>

      <span v-bind:class="{'case-text': casemonop.type === 'rue', 'case-img': casemonop.type === 'compagnie' || casemonop.type === 'taxe' || casemonop.type === 'parc' || casemonop.type === 'prison' || casemonop.type === 'communaute'}">
          <b v-if="casemonop.type === 'rue'">{{ casemonop.name }}</b>
          <img v-if="casemonop.type === 'compagnie' || casemonop.type === 'taxe' || casemonop.type === 'parc' || casemonop.type === 'prison' || casemonop.type === 'communaute'" :src="require('../assets/' + casemonop.img)" :alt="casemonop.alt">
          <b v-if="casemonop.type === 'chance'" style="font-size: 30px; color: #000f9f">?</b>
      </span>
    
      <span><i v-if="casemonop.price">{{ casemonop.price }}€</i></span>
      <div class="pawn_container"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListeCases",
  props: ['cases', 'type_liste']
}
</script>

<style>

.property0{
  border: solid 2px green;
}

.property1{
  border: solid 2px red;
}

.property2{
  border: solid 2px orange;
}

.property3{
  border: solid 2px purple;
}

</style>