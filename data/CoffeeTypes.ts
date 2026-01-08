export const CoffeeTypes = {
    Espresso: {
        en: 'Espresso',
        zh: '特浓咖啡'
    },
    EspressoMacchiato: {
        en: 'Espresso Macchiato',
        zh: '浓缩玛奇朵'
    },
    Cappuccino: {
        en: 'Cappuccino',
        zh: '卡布奇诺'
    },
    Mocha: {
        en: 'Mocha',
        zh: '摩卡'
    },
    FlatWhite: {
        en: 'Flat White',
        zh: '平白咖啡'
    },
    Americano: {
        en: 'Americano',
        zh: '美式咖啡'
    },
    CafeLatte: {
        en: 'Cafe Latte',
        zh: '拿铁'
    },
    EspressoConPanna: {
        en: 'Espresso Con Panna',
        zh: '浓缩康宝蓝'
    },
    CafeBreve: {
        en: 'Cafe Breve',
        zh: '半拿铁'
    }
} as const;

type CoffeeEn = typeof CoffeeTypes[keyof typeof CoffeeTypes]['en'];
type CoffeeZh = typeof CoffeeTypes[keyof typeof CoffeeTypes]['zh'];

export type CoffeeValue = CoffeeEn | CoffeeZh;
