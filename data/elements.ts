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
  // Trend data
  radius: number | null;        // picometers (pm)
  ionization: number | null;    // 1st IE, kJ/mol
  ionization2: number | null;   // 2nd IE, kJ/mol
  electronegativity: number | null; // Pauling scale
  affinity: number | null;      // kJ/mol
}

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal":     "#ff6b35",
  "alkaline-earth":   "#ffd166",
  "transition-metal": "#06d6a0",
  "post-transition":  "#4499ff",
  "metalloid":        "#a78bfa",
  "nonmetal":         "#72b872",
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

// [z, symbol, name, mass, category, row, col, radius, ionization, ionization2, electronegativity, affinity]
type Raw = [number, string, string, number, ElementCategory, number, number, number|null, number|null, number|null, number|null, number|null];

const RAW: Raw[] = [
  // Period 1
  [1,   "H",  "Hydrogen",      1.008,   "nonmetal",        1, 1, 37, 1312.0, null, 2.20, 72.8],
  [2,   "He", "Helium",        4.003,   "noble-gas",       1, 18, 31, 2372.3, 5250.5, null, -48.0],
  // Period 2
  [3,   "Li", "Lithium",       6.941,   "alkali-metal",    2, 1, 152, 520.2, 7298.1, 0.98, 59.6],
  [4,   "Be", "Beryllium",     9.012,   "alkaline-earth",  2, 2, 112, 899.5, 1757.1, 1.57, -48.0],
  [5,   "B",  "Boron",         10.811,  "metalloid",       2, 13, 82, 800.6, 2427.1, 2.04, 27.0],
  [6,   "C",  "Carbon",        12.011,  "nonmetal",        2, 14, 77, 1086.5, 2352.6, 2.55, 121.8],
  [7,   "N",  "Nitrogen",      14.007,  "nonmetal",        2, 15, 75, 1402.3, 2856.0, 3.04, -6.7],
  [8,   "O",  "Oxygen",        15.999,  "nonmetal",        2, 16, 73, 1313.9, 3388.3, 3.44, 141.0],
  [9,   "F",  "Fluorine",      18.998,  "halogen",         2, 17, 71, 1681.0, 3374.2, 3.98, 328.0],
  [10,  "Ne", "Neon",          20.180,  "noble-gas",       2, 18, 69, 2080.7, 3952.3, null, -116.0],
  // Period 3
  [11,  "Na", "Sodium",        22.990,  "alkali-metal",    3, 1, 186, 495.8, 4562.0, 0.93, 52.8],
  [12,  "Mg", "Magnesium",     24.305,  "alkaline-earth",  3, 2, 160, 737.7, 1450.7, 1.31, -40.0],
  [13,  "Al", "Aluminum",      26.982,  "post-transition", 3, 13, 143, 577.5, 1816.7, 1.61, 41.7],
  [14,  "Si", "Silicon",       28.086,  "metalloid",       3, 14, 118, 786.5, 1577.1, 1.90, 134.1],
  [15,  "P",  "Phosphorus",    30.974,  "nonmetal",        3, 15, 110, 1011.8, 1907.0, 2.19, 72.0],
  [16,  "S",  "Sulfur",        32.065,  "nonmetal",        3, 16, 103, 999.6, 2252.0, 2.58, 200.4],
  [17,  "Cl", "Chlorine",      35.453,  "halogen",         3, 17, 99, 1251.2, 2298.0, 3.16, 348.6],
  [18,  "Ar", "Argon",         39.948,  "noble-gas",       3, 18, 97, 1520.6, 2665.8, null, -96.0],
  // Period 4
  [19,  "K",  "Potassium",     39.098,  "alkali-metal",    4, 1, 227, 418.8, 3052.0, 0.82, 48.4],
  [20,  "Ca", "Calcium",       40.078,  "alkaline-earth",  4, 2, 197, 589.8, 1145.4, 1.00, 2.4],
  [21,  "Sc", "Scandium",      44.956,  "transition-metal",4, 3, 162, 633.1, 1235.0, 1.36, 18.1],
  [22,  "Ti", "Titanium",      47.867,  "transition-metal",4, 4, 147, 658.8, 1309.8, 1.54, 7.6],
  [23,  "V",  "Vanadium",      50.942,  "transition-metal",4, 5, 134, 650.9, 1414.0, 1.63, 50.6],
  [24,  "Cr", "Chromium",      51.996,  "transition-metal",4, 6, 128, 652.9, 1590.6, 1.66, 64.3],
  [25,  "Mn", "Manganese",     54.938,  "transition-metal",4, 7, 127, 717.3, 1509.0, 1.55, -50.0],
  [26,  "Fe", "Iron",          55.845,  "transition-metal",4, 8, 126, 762.5, 1561.9, 1.83, 15.7],
  [27,  "Co", "Cobalt",        58.933,  "transition-metal",4, 9, 125, 760.4, 1648.0, 1.88, 63.7],
  [28,  "Ni", "Nickel",        58.693,  "transition-metal",4, 10, 124, 737.1, 1753.0, 1.91, 112.0],
  [29,  "Cu", "Copper",        63.546,  "transition-metal",4, 11, 128, 745.5, 1957.9, 1.90, 118.4],
  [30,  "Zn", "Zinc",          65.38,   "transition-metal",4, 12, 134, 906.4, 1733.3, 1.65, -58.0],
  [31,  "Ga", "Gallium",       69.723,  "post-transition", 4, 13, 135, 578.8, 1979.3, 1.81, 28.9],
  [32,  "Ge", "Germanium",     72.630,  "metalloid",       4, 14, 122, 762.0, 1537.5, 2.01, 119.0],
  [33,  "As", "Arsenic",       74.922,  "metalloid",       4, 15, 119, 947.0, 1798.0, 2.18, 78.0],
  [34,  "Se", "Selenium",      78.971,  "nonmetal",        4, 16, 116, 941.0, 2045.0, 2.55, 195.0],
  [35,  "Br", "Bromine",       79.904,  "halogen",         4, 17, 114, 1139.9, 2103.0, 2.96, 324.6],
  [36,  "Kr", "Krypton",       83.798,  "noble-gas",       4, 18, 110, 1350.8, 2350.4, 3.00, -96.0],
  // Period 5
  [37,  "Rb", "Rubidium",      85.468,  "alkali-metal",    5, 1, 248, 403.0, 2632.1, 0.82, 46.9],
  [38,  "Sr", "Strontium",     87.62,   "alkaline-earth",  5, 2, 215, 549.5, 1064.2, 0.95, 5.0],
  [39,  "Y",  "Yttrium",       88.906,  "transition-metal",5, 3, 180, 616.0, 1181.0, 1.22, 29.6],
  [40,  "Zr", "Zirconium",     91.224,  "transition-metal",5, 4, 160, 660.0, 1267.0, 1.33, 41.1],
  [41,  "Nb", "Niobium",       92.906,  "transition-metal",5, 5, 146, 664.0, 1382.0, 1.60, 86.1],
  [42,  "Mo", "Molybdenum",    95.96,   "transition-metal",5, 6, 139, 685.0, 1558.0, 2.16, 71.9],
  [43,  "Tc", "Technetium",    97,      "transition-metal",5, 7, 136, 702.0, 1472.0, 1.90, 53.0],
  [44,  "Ru", "Ruthenium",     101.07,  "transition-metal",5, 8, 134, 711.0, 1617.0, 2.20, 101.3],
  [45,  "Rh", "Rhodium",       102.906, "transition-metal",5, 9, 134, 720.0, 1744.0, 2.28, 109.7],
  [46,  "Pd", "Palladium",     106.42,  "transition-metal",5, 10, 137, 805.0, 1875.0, 2.20, 53.7],
  [47,  "Ag", "Silver",        107.868, "transition-metal",5, 11, 144, 731.0, 2074.0, 1.93, 125.6],
  [48,  "Cd", "Cadmium",       112.411, "transition-metal",5, 12, 151, 867.8, 1631.4, 1.69, -68.0],
  [49,  "In", "Indium",        114.818, "post-transition", 5, 13, 167, 558.3, 1820.7, 1.78, 38.9],
  [50,  "Sn", "Tin",           118.710, "post-transition", 5, 14, 140, 708.6, 1411.8, 1.96, 107.3],
  [51,  "Sb", "Antimony",      121.760, "metalloid",       5, 15, 140, 833.7, 1594.9, 2.05, 103.2],
  [52,  "Te", "Tellurium",     127.60,  "metalloid",       5, 16, 142, 869.3, 1790.0, 2.10, 190.2],
  [53,  "I",  "Iodine",        126.904, "halogen",         5, 17, 133, 1008.4, 1845.9, 2.66, 295.2],
  [54,  "Xe", "Xenon",         131.293, "noble-gas",       5, 18, 130, 1170.4, 2046.4, 2.60, -77.0],
  // Period 6
  [55,  "Cs", "Cesium",        132.905, "alkali-metal",    6, 1, 265, 375.7, 2234.3, 0.79, 45.5],
  [56,  "Ba", "Barium",        137.327, "alkaline-earth",  6, 2, 222, 502.9, 965.2, 0.89, 14.0],
  [57,  "La", "Lanthanum",     138.905, "lanthanide",      6, 3, 187, 538.1, 1067.0, 1.10, 53.0],
  // Lanthanides — displayed in row 8
  [58,  "Ce", "Cerium",        140.116, "lanthanide",      8, 4, 181, 534.4, 1052.0, 1.12, 55.0],
  [59,  "Pr", "Praseodymium",  140.908, "lanthanide",      8, 5, 182, 527.0, 1020.0, 1.13, 93.0],
  [60,  "Nd", "Neodymium",     144.242, "lanthanide",      8, 6, 181, 533.1, 1040.0, 1.14, 184.9],
  [61,  "Pm", "Promethium",    145,     "lanthanide",      8, 7, 180, 540.0, 1050.0, 1.13, 12.5],
  [62,  "Sm", "Samarium",      150.36,  "lanthanide",      8, 8, 180, 544.5, 1068.0, 1.17, 15.6],
  [63,  "Eu", "Europium",      151.964, "lanthanide",      8, 9, 199, 547.1, 1085.0, 1.20, 11.2],
  [64,  "Gd", "Gadolinium",    157.25,  "lanthanide",      8, 10, 179, 593.4, 1170.0, 1.20, 13.2],
  [65,  "Tb", "Terbium",       158.925, "lanthanide",      8, 11, 176, 593.8, 1150.0, 1.10, 112.4],
  [66,  "Dy", "Dysprosium",    162.500, "lanthanide",      8, 12, 175, 573.0, 1130.0, 1.22, 34.0],
  [67,  "Ho", "Holmium",       164.930, "lanthanide",      8, 13, 174, 581.0, 1140.0, 1.23, 32.6],
  [68,  "Er", "Erbium",        167.259, "lanthanide",      8, 14, 173, 589.3, 1150.0, 1.24, 30.1],
  [69,  "Tm", "Thulium",       168.934, "lanthanide",      8, 15, 172, 596.7, 1160.0, 1.25, 99.0],
  [70,  "Yb", "Ytterbium",     173.054, "lanthanide",      8, 16, 194, 603.4, 1174.8, 1.10, -1.9],
  [71,  "Lu", "Lutetium",      174.967, "lanthanide",      8, 17, 172, 523.5, 1340.0, 1.27, 33.4],
  // Period 6 continued
  [72,  "Hf", "Hafnium",       178.49,  "transition-metal",6, 4, 159, 658.5, 1440.0, 1.30, 17.2],
  [73,  "Ta", "Tantalum",      180.948, "transition-metal",6, 5, 146, 761.0, 1500.0, 1.50, 31.0],
  [74,  "W",  "Tungsten",      183.84,  "transition-metal",6, 6, 139, 770.0, 1700.0, 2.36, 78.8],
  [75,  "Re", "Rhenium",       186.207, "transition-metal",6, 7, 137, 760.0, 1260.0, 1.90, 5.8],
  [76,  "Os", "Osmium",        190.23,  "transition-metal",6, 8, 135, 840.0, 1600.0, 2.20, 104.0],
  [77,  "Ir", "Iridium",       192.217, "transition-metal",6, 9, 136, 880.0, 1600.0, 2.20, 151.0],
  [78,  "Pt", "Platinum",      195.084, "transition-metal",6, 10, 139, 870.0, 1791.0, 2.28, 205.0],
  [79,  "Au", "Gold",          196.967, "transition-metal",6, 11, 144, 890.1, 1980.0, 2.54, 222.7],
  [80,  "Hg", "Mercury",       200.592, "transition-metal",6, 12, 151, 1007.1, 1810.0, 2.00, -48.0],
  [81,  "Tl", "Thallium",      204.383, "post-transition", 6, 13, 170, 589.4, 1971.0, 1.62, 36.4],
  [82,  "Pb", "Lead",          207.2,   "post-transition", 6, 14, 175, 715.6, 1450.5, 1.87, 34.4],
  [83,  "Bi", "Bismuth",       208.980, "post-transition", 6, 15, 155, 703.0, 1610.0, 2.02, 90.9],
  [84,  "Po", "Polonium",      209,     "metalloid",       6, 16, 190, 812.1, 1800.0, 2.00, 136.0],
  [85,  "At", "Astatine",      210,     "halogen",         6, 17, 147, 899.0, 1600.0, 2.20, 233.0],
  [86,  "Rn", "Radon",         222,     "noble-gas",       6, 18, 140, 1037.0, 2065.0, 2.20, -68.0],
  // Period 7
  [87,  "Fr", "Francium",      223,     "alkali-metal",    7, 1, 260, 380.0, 2100.0, 0.79, 46.9],
  [88,  "Ra", "Radium",        226,     "alkaline-earth",  7, 2, 221, 509.3, 979.0, 0.90, 9.6],
  [89,  "Ac", "Actinium",      227,     "actinide",        7, 3, 215, 499.0, 1170.0, 1.10, 33.8],
  // Actinides — displayed in row 9
  [90,  "Th", "Thorium",       232.038, "actinide",        9, 4, 206, 587.0, 1110.0, 1.30, 112.7],
  [91,  "Pa", "Protactinium",  231.036, "actinide",        9, 5, 200, 568.0, 1128.0, 1.50, 53.0],
  [92,  "U",  "Uranium",       238.029, "actinide",        9, 6, 196, 597.6, 1420.0, 1.38, 50.9],
  [93,  "Np", "Neptunium",     237,     "actinide",        9, 7, 190, 604.5, 1130.0, 1.36, 45.9],
  [94,  "Pu", "Plutonium",     244,     "actinide",        9, 8, 187, 584.7, 1128.0, 1.28, -48.3],
  [95,  "Am", "Americium",     243,     "actinide",        9, 9, 180, 578.0, 1158.0, 1.13, 9.9],
  [96,  "Cm", "Curium",        247,     "actinide",        9, 10, 169, 581.0, 1196.0, 1.28, 27.2],
  [97,  "Bk", "Berkelium",     247,     "actinide",        9, 11, 166, 601.0, 1186.0, 1.30, -165.2],
  [98,  "Cf", "Californium",   251,     "actinide",        9, 12, 168, 608.0, 1206.0, 1.30, -97.3],
  [99,  "Es", "Einsteinium",   252,     "actinide",        9, 13, 165, 619.0, 1216.0, 1.30, -28.6],
  [100, "Fm", "Fermium",       257,     "actinide",        9, 14, 167, 627.0, 1225.0, 1.30, 34.0],
  [101, "Md", "Mendelevium",   258,     "actinide",        9, 15, 173, 635.0, 1235.0, 1.30, 93.9],
  [102, "No", "Nobelium",      259,     "actinide",        9, 16, 176, 642.0, 1254.0, 1.30, -223.2],
  [103, "Lr", "Lawrencium",    266,     "actinide",        9, 17, 161, 470.0, 1428.0, 1.30, -30.0],
  // Period 7 continued (Predicted values denoted with *)
  [104, "Rf", "Rutherfordium", 267,     "transition-metal",7, 4, null, 580.0, 1390.0, null, null],
  [105, "Db", "Dubnium",       268,     "transition-metal",7, 5, null, 656.0, 1547.0, null, null],
  [106, "Sg", "Seaborgium",    271,     "transition-metal",7, 6, null, 757.0, 1732.0, null, null],
  [107, "Bh", "Bohrium",       272,     "transition-metal",7, 7, null, 742.0, 1785.0, null, null],
  [108, "Hs", "Hassium",       270,     "transition-metal",7, 8, null, 733.0, 1756.0, null, null],
  [109, "Mt", "Meitnerium",    278,     "transition-metal",7, 9, null, 812.0, 1829.0, null, null],
  [110, "Ds", "Darmstadtium",  281,     "transition-metal",7, 10, null, 967.0, 1891.0, null, null],
  [111, "Rg", "Roentgenium",   282,     "transition-metal",7, 11, null, 1020.0, 1903.0, null, null],
  [112, "Cn", "Copernicium",   285,     "transition-metal",7, 12, null, 1155.0, 2170.0, null, null],
  [113, "Nh", "Nihonium",      286,     "post-transition", 7, 13, null, 705.0, 2238.0, null, 66.6],
  [114, "Fl", "Flerovium",     289,     "post-transition", 7, 14, null, 824.0, 1601.0, null, null],
  [115, "Mc", "Moscovium",     290,     "post-transition", 7, 15, null, 538.0, 1756.0, null, 35.3],
  [116, "Lv", "Livermorium",   293,     "post-transition", 7, 16, null, 724.0, 1332.0, null, 74.9],
  [117, "Ts", "Tennessine",    294,     "halogen",         7, 17, null, 743.0, 1786.0, null, 165.9],
  [118, "Og", "Oganesson",     294,     "noble-gas",       7, 18, null, 860.0, 1560.0, null, 5.4],
];

export const ELEMENTS: Element[] = RAW.map(([z, symbol, name, mass, category, row, col, radius, ionization, ionization2, electronegativity, affinity]) => ({
  z, symbol, name, mass, category, row, col, radius, ionization, ionization2, electronegativity, affinity,
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
