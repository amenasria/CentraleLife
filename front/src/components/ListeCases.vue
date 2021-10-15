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

      <div style="z-index: 300; position: absolute; right: 0; width: 15px; height: max-content; align-self: center">
        <div v-if="users[0].position === casemonop.id" style="background: green; height: 10px; width: 10px; margin-bottom: 2px; border-radius: 5px"></div>
        <div v-if="users[1].position === casemonop.id" style="background: red; height: 10px; width: 10px; margin-bottom: 2px; border-radius: 5px"></div>
        <div v-if="users[2].position === casemonop.id" style="background: orange; height: 10px; width: 10px; margin-bottom: 2px; border-radius: 5px"></div>
        <div v-if="users[3].position === casemonop.id" style="background: purple; height: 10px; width: 10px; margin-bottom: 2px; border-radius: 5px"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ['cases', 'type_liste', 'users']
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