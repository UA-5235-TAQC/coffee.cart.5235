export enum Ingredient {
    Espresso = 'espresso',
    SteamedMilk = 'steamed milk',
    MilkFoam = 'milk foam',
    WhippedCream = 'whipped cream',
    ChocolateSyrup = 'chocolate syrup',
    Water = 'water',
    SteamedCream = 'steamed cream',
}

export type IngredientValue = keyof typeof Ingredient | typeof Ingredient[keyof typeof Ingredient];