export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export interface Element {
  z: number;
  symbol: string;
  name: string;
  mass: number;
  category: ElementCategory;
  /** Display row in the periodic table grid (1–7 main, 8 lanthanides, 9 actinides) */
  row: number;
  /** Display column in the periodic table grid (1–18) */
  col: number;
}

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal":     "#ff6b35",
  "alkaline-earth":   "#ffd166",
  "transition-metal": "#06d6a0",
  "post-transition":  "#4499ff",
  "metalloid":        "#a78bfa",
  "nonmetal":         "#00ff41",
  "halogen":          "#f72585",
  "noble-gas":        "#ffbe0b",
  "lanthanide":       "#c77dff",
  "actinide":         "#ff85a1",
};

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  "alkali-metal":     "Alkali Metal",
  "alkaline-earth":   "Alkaline Earth Metal",
  "transition-metal": "Transition Metal",
  "post-transition":  "Post-Transition Metal",
  "metalloid":        "Metalloid",
  "nonmetal":         "Nonmetal",
  "halogen":          "Halogen",
  "noble-gas":        "Noble Gas",
  "lanthanide":       "Lanthanide",
  "actinide":         "Actinide",
};

// [z, symbol, name, mass, category, row, col]
type Raw = [number, string, string, number, ElementCategory, number, number];

const RAW: Raw[] = [
  // Period 1
  [1,   "H",  "Hydrogen",      1.008,   "nonmetal",        1, 1],
  [2,   "He", "Helium",        4.003,   "noble-gas",       1, 18],
  // Period 2
  [3,   "Li", "Lithium",       6.941,   "alkali-metal",    2, 1],
  [4,   "Be", "Beryllium",     9.012,   "alkaline-earth",  2, 2],
  [5,   "B",  "Boron",         10.811,  "metalloid",       2, 13],
  [6,   "C",  "Carbon",        12.011,  "nonmetal",        2, 14],
  [7,   "N",  "Nitrogen",      14.007,  "nonmetal",        2, 15],
  [8,   "O",  "Oxygen",        15.999,  "nonmetal",        2, 16],
  [9,   "F",  "Fluorine",      18.998,  "halogen",         2, 17],
  [10,  "Ne", "Neon",          20.180,  "noble-gas",       2, 18],
  // Period 3
  [11,  "Na", "Sodium",        22.990,  "alkali-metal",    3, 1],
  [12,  "Mg", "Magnesium",     24.305,  "alkaline-earth",  3, 2],
  [13,  "Al", "Aluminum",      26.982,  "post-transition", 3, 13],
  [14,  "Si", "Silicon",       28.086,  "metalloid",       3, 14],
  [15,  "P",  "Phosphorus",    30.974,  "nonmetal",        3, 15],
  [16,  "S",  "Sulfur",        32.065,  "nonmetal",        3, 16],
  [17,  "Cl", "Chlorine",      35.453,  "halogen",         3, 17],
  [18,  "Ar", "Argon",         39.948,  "noble-gas",       3, 18],
  // Period 4
  [19,  "K",  "Potassium",     39.098,  "alkali-metal",    4, 1],
  [20,  "Ca", "Calcium",       40.078,  "alkaline-earth",  4, 2],
  [21,  "Sc", "Scandium",      44.956,  "transition-metal",4, 3],
  [22,  "Ti", "Titanium",      47.867,  "transition-metal",4, 4],
  [23,  "V",  "Vanadium",      50.942,  "transition-metal",4, 5],
  [24,  "Cr", "Chromium",      51.996,  "transition-metal",4, 6],
  [25,  "Mn", "Manganese",     54.938,  "transition-metal",4, 7],
  [26,  "Fe", "Iron",          55.845,  "transition-metal",4, 8],
  [27,  "Co", "Cobalt",        58.933,  "transition-metal",4, 9],
  [28,  "Ni", "Nickel",        58.693,  "transition-metal",4, 10],
  [29,  "Cu", "Copper",        63.546,  "transition-metal",4, 11],
  [30,  "Zn", "Zinc",          65.38,   "transition-metal",4, 12],
  [31,  "Ga", "Gallium",       69.723,  "post-transition", 4, 13],
  [32,  "Ge", "Germanium",     72.630,  "metalloid",       4, 14],
  [33,  "As", "Arsenic",       74.922,  "metalloid",       4, 15],
  [34,  "Se", "Selenium",      78.971,  "nonmetal",        4, 16],
  [35,  "Br", "Bromine",       79.904,  "halogen",         4, 17],
  [36,  "Kr", "Krypton",       83.798,  "noble-gas",       4, 18],
  // Period 5
  [37,  "Rb", "Rubidium",      85.468,  "alkali-metal",    5, 1],
  [38,  "Sr", "Strontium",     87.62,   "alkaline-earth",  5, 2],
  [39,  "Y",  "Yttrium",       88.906,  "transition-metal",5, 3],
  [40,  "Zr", "Zirconium",     91.224,  "transition-metal",5, 4],
  [41,  "Nb", "Niobium",       92.906,  "transition-metal",5, 5],
  [42,  "Mo", "Molybdenum",    95.96,   "transition-metal",5, 6],
  [43,  "Tc", "Technetium",    97,      "transition-metal",5, 7],
  [44,  "Ru", "Ruthenium",     101.07,  "transition-metal",5, 8],
  [45,  "Rh", "Rhodium",       102.906, "transition-metal",5, 9],
  [46,  "Pd", "Palladium",     106.42,  "transition-metal",5, 10],
  [47,  "Ag", "Silver",        107.868, "transition-metal",5, 11],
  [48,  "Cd", "Cadmium",       112.411, "transition-metal",5, 12],
  [49,  "In", "Indium",        114.818, "post-transition", 5, 13],
  [50,  "Sn", "Tin",           118.710, "post-transition", 5, 14],
  [51,  "Sb", "Antimony",      121.760, "metalloid",       5, 15],
  [52,  "Te", "Tellurium",     127.60,  "metalloid",       5, 16],
  [53,  "I",  "Iodine",        126.904, "halogen",         5, 17],
  [54,  "Xe", "Xenon",         131.293, "noble-gas",       5, 18],
  // Period 6
  [55,  "Cs", "Cesium",        132.905, "alkali-metal",    6, 1],
  [56,  "Ba", "Barium",        137.327, "alkaline-earth",  6, 2],
  [57,  "La", "Lanthanum",     138.905, "lanthanide",      6, 3],
  // Lanthanides — displayed in row 8
  [58,  "Ce", "Cerium",        140.116, "lanthanide",      8, 4],
  [59,  "Pr", "Praseodymium",  140.908, "lanthanide",      8, 5],
  [60,  "Nd", "Neodymium",     144.242, "lanthanide",      8, 6],
  [61,  "Pm", "Promethium",    145,     "lanthanide",      8, 7],
  [62,  "Sm", "Samarium",      150.36,  "lanthanide",      8, 8],
  [63,  "Eu", "Europium",      151.964, "lanthanide",      8, 9],
  [64,  "Gd", "Gadolinium",    157.25,  "lanthanide",      8, 10],
  [65,  "Tb", "Terbium",       158.925, "lanthanide",      8, 11],
  [66,  "Dy", "Dysprosium",    162.500, "lanthanide",      8, 12],
  [67,  "Ho", "Holmium",       164.930, "lanthanide",      8, 13],
  [68,  "Er", "Erbium",        167.259, "lanthanide",      8, 14],
  [69,  "Tm", "Thulium",       168.934, "lanthanide",      8, 15],
  [70,  "Yb", "Ytterbium",     173.054, "lanthanide",      8, 16],
  [71,  "Lu", "Lutetium",      174.967, "lanthanide",      8, 17],
  // Period 6 continued
  [72,  "Hf", "Hafnium",       178.49,  "transition-metal",6, 4],
  [73,  "Ta", "Tantalum",      180.948, "transition-metal",6, 5],
  [74,  "W",  "Tungsten",      183.84,  "transition-metal",6, 6],
  [75,  "Re", "Rhenium",       186.207, "transition-metal",6, 7],
  [76,  "Os", "Osmium",        190.23,  "transition-metal",6, 8],
  [77,  "Ir", "Iridium",       192.217, "transition-metal",6, 9],
  [78,  "Pt", "Platinum",      195.084, "transition-metal",6, 10],
  [79,  "Au", "Gold",          196.967, "transition-metal",6, 11],
  [80,  "Hg", "Mercury",       200.592, "transition-metal",6, 12],
  [81,  "Tl", "Thallium",      204.383, "post-transition", 6, 13],
  [82,  "Pb", "Lead",          207.2,   "post-transition", 6, 14],
  [83,  "Bi", "Bismuth",       208.980, "post-transition", 6, 15],
  [84,  "Po", "Polonium",      209,     "metalloid",       6, 16],
  [85,  "At", "Astatine",      210,     "halogen",         6, 17],
  [86,  "Rn", "Radon",         222,     "noble-gas",       6, 18],
  // Period 7
  [87,  "Fr", "Francium",      223,     "alkali-metal",    7, 1],
  [88,  "Ra", "Radium",        226,     "alkaline-earth",  7, 2],
  [89,  "Ac", "Actinium",      227,     "actinide",        7, 3],
  // Actinides — displayed in row 9
  [90,  "Th", "Thorium",       232.038, "actinide",        9, 4],
  [91,  "Pa", "Protactinium",  231.036, "actinide",        9, 5],
  [92,  "U",  "Uranium",       238.029, "actinide",        9, 6],
  [93,  "Np", "Neptunium",     237,     "actinide",        9, 7],
  [94,  "Pu", "Plutonium",     244,     "actinide",        9, 8],
  [95,  "Am", "Americium",     243,     "actinide",        9, 9],
  [96,  "Cm", "Curium",        247,     "actinide",        9, 10],
  [97,  "Bk", "Berkelium",     247,     "actinide",        9, 11],
  [98,  "Cf", "Californium",   251,     "actinide",        9, 12],
  [99,  "Es", "Einsteinium",   252,     "actinide",        9, 13],
  [100, "Fm", "Fermium",       257,     "actinide",        9, 14],
  [101, "Md", "Mendelevium",   258,     "actinide",        9, 15],
  [102, "No", "Nobelium",      259,     "actinide",        9, 16],
  [103, "Lr", "Lawrencium",    266,     "actinide",        9, 17],
  // Period 7 continued
  [104, "Rf", "Rutherfordium", 267,     "transition-metal",7, 4],
  [105, "Db", "Dubnium",       268,     "transition-metal",7, 5],
  [106, "Sg", "Seaborgium",    271,     "transition-metal",7, 6],
  [107, "Bh", "Bohrium",       272,     "transition-metal",7, 7],
  [108, "Hs", "Hassium",       270,     "transition-metal",7, 8],
  [109, "Mt", "Meitnerium",    278,     "transition-metal",7, 9],
  [110, "Ds", "Darmstadtium",  281,     "transition-metal",7, 10],
  [111, "Rg", "Roentgenium",   282,     "transition-metal",7, 11],
  [112, "Cn", "Copernicium",   285,     "transition-metal",7, 12],
  [113, "Nh", "Nihonium",      286,     "post-transition", 7, 13],
  [114, "Fl", "Flerovium",     289,     "post-transition", 7, 14],
  [115, "Mc", "Moscovium",     290,     "post-transition", 7, 15],
  [116, "Lv", "Livermorium",   293,     "post-transition", 7, 16],
  [117, "Ts", "Tennessine",    294,     "halogen",         7, 17],
  [118, "Og", "Oganesson",     294,     "noble-gas",       7, 18],
];

export const ELEMENTS: Element[] = RAW.map(([z, symbol, name, mass, category, row, col]) => ({
  z, symbol, name, mass, category, row, col,
}));

export const ELEMENT_BY_Z = new Map<number, Element>(ELEMENTS.map((e) => [e.z, e]));

/** Simplified electron shell filling (visual approximation) */
export function getElectronShells(z: number): number[] {
  const maxPerShell = [2, 8, 18, 32, 32, 18, 8];
  const shells: number[] = [];
  let rem = z;
  for (const max of maxPerShell) {
    if (rem <= 0) break;
    shells.push(Math.min(rem, max));
    rem -= Math.min(rem, max);
  }
  return shells;
}

/** Neutron count for most common/stable isotope */
export function getNeutrons(el: Element): number {
  return Math.round(el.mass) - el.z;
}
