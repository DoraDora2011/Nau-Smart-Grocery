export type ProductCollection = "all" | "category";

export type ProductCatalogItem = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  collection?: ProductCollection;
  groups?: string[];
  price: number;
  oldPrice?: number | null;
  image: string;
  detail?: string;
  sellUnit: string;
  sellUnitLabel: string;
  packageSize: number;
  packageUnit: string;
  displayUnit: string;
  aliases: string[];
};

export const productCatalog: ProductCatalogItem[] = [
  {
    id: "bestdeal-001",
    name: "Dưa Hấu Không Hạt",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 19800,
    oldPrice: 195000,
    image: "/assets/products/Best deal/watermelon-001.png",
    detail: "kg",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Dưa Hấu Không Hạt"
    ]
  },
  {
    id: "bestdeal-002",
    name: "Lạp Xưởng Nướng Đá Vị Cay…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 80900,
    oldPrice: 192500,
    image: "/assets/products/Best deal/sausage-002.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Lạp Xưởng Nướng Đá Vị Cay…"
    ]
  },
  {
    id: "bestdeal-003",
    name: "Bàn Chải Điện Đa Năng Perfect",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 159000,
    oldPrice: 399000,
    image: "/assets/products/Best deal/toothbrush-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Bàn Chải Điện Đa Năng Perfect"
    ]
  },
  {
    id: "bestdeal-004",
    name: "Quạt Sạc Để Bàn Tích Điện…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 119000,
    oldPrice: 279000,
    image: "/assets/products/Best deal/fan-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Quạt Sạc Để Bàn Tích Điện…"
    ]
  },
  {
    id: "bestdeal-005",
    name: "Lạp Xưởng Tươi Đài Loan L C…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 80900,
    oldPrice: 187500,
    image: "/assets/products/Best deal/sausage-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Lạp Xưởng Tươi Đài Loan L C…"
    ]
  },
  {
    id: "bestdeal-006",
    name: "Ấm Pha Trà Đa Năng Joyoung",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 549000,
    oldPrice: 1290000,
    image: "/assets/products/Best deal/kettle-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Ấm Pha Trà Đa Năng Joyoung"
    ]
  },
  {
    id: "bestdeal-007",
    name: "2 Lớp Giấy Lụa Lau Mặt Elene",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 25900,
    oldPrice: 59000,
    image: "/assets/products/Best deal/tissue-002.png",
    detail: "260 tờ / Lô",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "2 Lớp Giấy Lụa Lau Mặt Elene"
    ]
  },
  {
    id: "bestdeal-008",
    name: "Tương Ớt Siracha Dellycook …",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 33900,
    oldPrice: 77800,
    image: "/assets/products/Best deal/chilli-sauce-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Tương Ớt Siracha Dellycook …"
    ]
  },
  {
    id: "bestdeal-009",
    name: "Sạc Dự Phòng Energizer…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 219000,
    oldPrice: null,
    image: "/assets/products/Best deal/energy-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Sạc Dự Phòng Energizer…"
    ]
  },
  {
    id: "bestdeal-010",
    name: "Bánh Nậm Hoa Doanh Tôm Thịt",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 18000,
    oldPrice: 40200,
    image: "/assets/products/Best deal/vietnamese-cake-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Bánh Nậm Hoa Doanh Tôm Thịt",
      "tôm"
    ]
  },
  {
    id: "bestdeal-011",
    name: "Bánh Nậm Hoa Doanh Tôm Thịt",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 30500,
    oldPrice: 68400,
    image: "/assets/products/Best deal/vietnamese-cake-002.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Bánh Nậm Hoa Doanh Tôm Thịt",
      "tôm"
    ]
  },
  {
    id: "bestdeal-012",
    name: "Hộp Quai Matsu Trung",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 25000,
    oldPrice: 55000,
    image: "/assets/products/Best deal/plastic-box-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Hộp Quai Matsu Trung"
    ]
  },
  {
    id: "bestdeal-013",
    name: "Thú Nhồi Bông Na Tra Tinh…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 49000,
    oldPrice: 109000,
    image: "/assets/products/Best deal/teddy-bear-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Thú Nhồi Bông Na Tra Tinh…"
    ]
  },
  {
    id: "bestdeal-014",
    name: "Nồi Cơm Điện Tử Tefal RK7301…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 690000,
    oldPrice: 1490000,
    image: "/assets/products/Best deal/cooker-001.png",
    detail: "1L",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 1000,
    packageUnit: "ml",
    displayUnit: "1L/hộp",
    aliases: [
      "Nồi Cơm Điện Tử Tefal RK7301…"
    ]
  },
  {
    id: "bestdeal-015",
    name: "Nước mắm đầu bếp tôm cốt…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 19000,
    oldPrice: 43500,
    image: "/assets/products/Best deal/fish-sauce-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Nước mắm đầu bếp tôm cốt…",
      "tôm",
      "nước mắm",
      "mắm"
    ]
  },
  {
    id: "bestdeal-016",
    name: "Hộp 6 Hũ Nước Yến Red Nest…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 62000,
    oldPrice: 195000,
    image: "/assets/products/Best deal/bird-nest-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Hộp 6 Hũ Nước Yến Red Nest…"
    ]
  },
  {
    id: "bestdeal-017",
    name: "Cá Thu",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 289500,
    oldPrice: null,
    image: "/assets/products/Best deal/bestdeal-017.png",
    detail: "600g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/hũ",
    aliases: [
      "Cá Thu",
      "cá thu",
      "cá"
    ]
  },
  {
    id: "bestdeal-018",
    name: "Bình Đun Siêu Tốc Perfect PF…",
    category: "bestdeal",
    categoryLabel: "Best deal",
    collection: "all",
    groups: [
      "bestdeal"
    ],
    price: 119000,
    oldPrice: 419000,
    image: "/assets/products/Best deal/kettle-002.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Bình Đun Siêu Tốc Perfect PF…"
    ]
  },
  {
    id: "dairy-001",
    name: "Trứng gà",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 28000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-001.png",
    detail: "hộp 10 quả",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 10,
    packageUnit: "piece",
    displayUnit: "10 quả/hộp",
    aliases: [
      "Trứng gà",
      "trứng",
      "trứng gà",
      "thịt gà",
      "gà"
    ]
  },
  {
    id: "dairy-002",
    name: "Trứng vịt",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 36000,
    oldPrice: 50500,
    image: "/assets/products/egg-dairy/dairy-002.png",
    detail: "hộp 10 quả",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 10,
    packageUnit: "piece",
    displayUnit: "10 quả/hộp",
    aliases: [
      "Trứng vịt",
      "trứng",
      "trứng gà"
    ]
  },
  {
    id: "dairy-003",
    name: "Trứng vịt muối",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 26000,
    oldPrice: 50500,
    image: "/assets/products/egg-dairy/dairy-003.png",
    detail: "hộp 4 quả từ 240g-280g",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 240,
    packageUnit: "g",
    displayUnit: "240g/hộp",
    aliases: [
      "Trứng vịt muối",
      "trứng",
      "trứng gà",
      "muối"
    ]
  },
  {
    id: "dairy-004",
    name: "Trứng vịt bắc thảo",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 26000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-004.png",
    detail: "hộp 4 quả từ 240g-280g",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 240,
    packageUnit: "g",
    displayUnit: "240g/hộp",
    aliases: [
      "Trứng vịt bắc thảo",
      "trứng",
      "trứng gà"
    ]
  },
  {
    id: "dairy-005",
    name: "Sữa đậu nành Fami Canxi Ít ...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 4500,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-005.png",
    detail: "50 bịch/thùng",
    sellUnit: "box",
    sellUnitLabel: "thùng",
    packageSize: 50,
    packageUnit: "piece",
    displayUnit: "50 bịch/thùng",
    aliases: [
      "Sữa đậu nành Fami Canxi Ít ...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "dairy-006",
    name: "Sữa tiệt trùng Mlekovita ...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 29000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-006.png",
    detail: "1L",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 1000,
    packageUnit: "ml",
    displayUnit: "1L/hộp",
    aliases: [
      "Sữa tiệt trùng Mlekovita ...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "dairy-007",
    name: "Sữa tươi tiệt trùng ít đường Vina...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 36500,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-007.png",
    detail: "180ML (Lốc 4 hộp)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 720,
    packageUnit: "ml",
    displayUnit: "4 hộp x 180ml/lốc",
    aliases: [
      "Sữa tươi tiệt trùng ít đường Vina...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "đường"
    ]
  },
  {
    id: "dairy-008",
    name: "Sữa tươi tiệt trùng ít đường Dut...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 33500,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-008.png",
    detail: "180ML (Lốc 4 hộp)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 720,
    packageUnit: "ml",
    displayUnit: "4 hộp x 180ml/lốc",
    aliases: [
      "Sữa tươi tiệt trùng ít đường Dut...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "đường"
    ]
  },
  {
    id: "dairy-009",
    name: "Sữa lúa mạc ít đường Milo A2 ...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 33000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-009.png",
    detail: "180ML (Lốc 4 hộp)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 720,
    packageUnit: "ml",
    displayUnit: "4 hộp x 180ml/lốc",
    aliases: [
      "Sữa lúa mạc ít đường Milo A2 ...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "đường"
    ]
  },
  {
    id: "dairy-010",
    name: "Bột pha sẵn Ensure Original vani...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 250000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-010.png",
    detail: "237ML (Lốc 6 chai sữa)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 1422,
    packageUnit: "ml",
    displayUnit: "6 hộp x 237ml/lốc",
    aliases: [
      "Bột pha sẵn Ensure Original vani...",
      "bột"
    ]
  },
  {
    id: "dairy-011",
    name: "Sữa dinh dưỡng pha sẵn Abbo...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 54000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-011.png",
    detail: "110ML (Lốc 4 hộp)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 440,
    packageUnit: "ml",
    displayUnit: "4 hộp x 110ml/lốc",
    aliases: [
      "Sữa dinh dưỡng pha sẵn Abbo...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "thịt bò",
      "bò",
      "đường"
    ]
  },
  {
    id: "dairy-012",
    name: "Sữa chua ăn Vinamilk...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 22900,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-012.png",
    detail: "Lốc 4 hộp",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 4,
    packageUnit: "piece",
    displayUnit: "4 hộp/lốc",
    aliases: [
      "Sữa chua ăn Vinamilk...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "dairy-013",
    name: "Sữa chua uống hương dâu Yo...",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 29500,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-013.png",
    detail: "170ML (Lốc 4 hộp)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 680,
    packageUnit: "ml",
    displayUnit: "4 hộp x 170ml/lốc",
    aliases: [
      "Sữa chua uống hương dâu Yo...",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "dairy-014",
    name: "Sữa chua uống hương nho Fristi",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 25000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-014.png",
    detail: "80ML (Lốc 6 chai)",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 480,
    packageUnit: "ml",
    displayUnit: "6 hộp x 80ml/lốc",
    aliases: [
      "Sữa chua uống hương nho Fristi",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "dairy-015",
    name: "Sữa đặc có đường Ông Thọ…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 32500,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-015.png",
    detail: "380g (Lon)",
    sellUnit: "can",
    sellUnitLabel: "lon",
    packageSize: 380,
    packageUnit: "g",
    displayUnit: "380g/lon",
    aliases: [
      "Sữa đặc có đường Ông Thọ…",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "đường"
    ]
  },
  {
    id: "dairy-016",
    name: "Sữa đặc có đường Ông Thọ…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 26500,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-016.png",
    detail: "380g (Hộp)",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 380,
    packageUnit: "g",
    displayUnit: "380g/hộp",
    aliases: [
      "Sữa đặc có đường Ông Thọ…",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "đường"
    ]
  },
  {
    id: "dairy-017",
    name: "Sữa đặc có đường Ông Thọ…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 19400,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-017.png",
    detail: "165g (Tuýp)",
    sellUnit: "tube",
    sellUnitLabel: "tuýp",
    packageSize: 165,
    packageUnit: "g",
    displayUnit: "165g/tuýp",
    aliases: [
      "Sữa đặc có đường Ông Thọ…",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "đường"
    ]
  },
  {
    id: "dairy-018",
    name: "Kem ốc quế vani Celano cây",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 20000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-018.png",
    detail: "66g",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 66,
    packageUnit: "g",
    displayUnit: "66g/sản phẩm",
    aliases: [
      "Kem ốc quế vani Celano cây"
    ]
  },
  {
    id: "dairy-019",
    name: "Kem socola và hạt socola…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 85000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-019.png",
    detail: "307g",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 307,
    packageUnit: "g",
    displayUnit: "307g/sản phẩm",
    aliases: [
      "Kem socola và hạt socola…"
    ]
  },
  {
    id: "dairy-020",
    name: "Bột phô mai StFood",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 45000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-020.png",
    detail: "gói 100g",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/sản phẩm",
    aliases: [
      "Bột phô mai StFood",
      "bột"
    ]
  },
  {
    id: "dairy-021",
    name: "Phô mai sợi Paysan Breton",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 53000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-021.png",
    detail: "gói 70g",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 70,
    packageUnit: "g",
    displayUnit: "70g/sản phẩm",
    aliases: [
      "Phô mai sợi Paysan Breton"
    ]
  },
  {
    id: "dairy-022",
    name: "Phô mai vị truyền thống Con B…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 64000,
    oldPrice: 655000,
    image: "/assets/products/egg-dairy/dairy-022.png",
    detail: "224g (16 miếng)",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 224,
    packageUnit: "g",
    displayUnit: "224g/sản phẩm",
    aliases: [
      "Phô mai vị truyền thống Con B…"
    ]
  },
  {
    id: "dairy-023",
    name: "Phô mai vị dâu Con Bò Cười B…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 47500,
    oldPrice: 505000,
    image: "/assets/products/egg-dairy/dairy-023.png",
    detail: "78g (15 viên)",
    sellUnit: "bunch",
    sellUnitLabel: "bó",
    packageSize: 78,
    packageUnit: "g",
    displayUnit: "78g/bó",
    aliases: [
      "Phô mai vị dâu Con Bò Cười B…",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "dairy-024",
    name: "Bơ thực vật Tường An vị bơ sữa…",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "category",
    groups: [],
    price: 9000,
    oldPrice: null,
    image: "/assets/products/egg-dairy/dairy-024.png",
    detail: "80g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 80,
    packageUnit: "g",
    displayUnit: "80g/hũ",
    aliases: [
      "Bơ thực vật Tường An vị bơ sữa…",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "meat-001",
    name: "Ba Rọi Heo",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 242000,
    oldPrice: null,
    image: "/assets/products/meat/meat-001.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/pack",
    aliases: [
      "Ba Rọi Heo",
      "thịt heo",
      "heo"
    ]
  },
  {
    id: "meat-002",
    name: "Cốt Lết Heo Thảo Mộc Đóng Vi",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 156000,
    oldPrice: 195000,
    image: "/assets/products/meat/meat-002.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/pack",
    aliases: [
      "Cốt Lết Heo Thảo Mộc Đóng Vi",
      "thịt heo",
      "heo"
    ]
  },
  {
    id: "meat-003",
    name: "Nạc dăm heo",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 129500,
    oldPrice: 136500,
    image: "/assets/products/meat/meat-003.png",
    detail: "700g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 700,
    packageUnit: "g",
    displayUnit: "700g/pack",
    aliases: [
      "Nạc dăm heo",
      "thịt heo",
      "heo"
    ]
  },
  {
    id: "meat-004",
    name: "Sườn Non Heo",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 208600,
    oldPrice: null,
    image: "/assets/products/meat/meat-004.png",
    detail: "700g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 700,
    packageUnit: "g",
    displayUnit: "700g/pack",
    aliases: [
      "Sườn Non Heo",
      "thịt heo",
      "heo"
    ]
  },
  {
    id: "meat-005",
    name: "Thăn Bò",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 226100,
    oldPrice: null,
    image: "/assets/products/meat/meat-005.png",
    detail: "700g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 700,
    packageUnit: "g",
    displayUnit: "700g/pack",
    aliases: [
      "Thăn Bò",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "meat-006",
    name: "Bít Tết Bò Úc",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 450000,
    oldPrice: null,
    image: "/assets/products/meat/meat-006.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/pack",
    aliases: [
      "Bít Tết Bò Úc",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "meat-007",
    name: "Bắp Bò",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 215600,
    oldPrice: null,
    image: "/assets/products/meat/meat-007.png",
    detail: "700g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 700,
    packageUnit: "g",
    displayUnit: "700g/pack",
    aliases: [
      "Bắp Bò",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "meat-008",
    name: "Sườn Bò Việt Nam Khay",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 268000,
    oldPrice: null,
    image: "/assets/products/meat/meat-008.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/pack",
    aliases: [
      "Sườn Bò Việt Nam Khay",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "meat-009",
    name: "Phi Lê Ức Gà CP",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 55100,
    oldPrice: null,
    image: "/assets/products/meat/meat-009.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/pack",
    aliases: [
      "Phi Lê Ức Gà CP",
      "thịt gà",
      "gà"
    ]
  },
  {
    id: "meat-010",
    name: "Đùi Tỏi Gà CP",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 56900,
    oldPrice: null,
    image: "/assets/products/meat/meat-010.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/pack",
    aliases: [
      "Đùi Tỏi Gà CP",
      "thịt gà",
      "gà",
      "tỏi"
    ]
  },
  {
    id: "meat-011",
    name: "Má Đùi Gà Tươi CP",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 45000,
    oldPrice: null,
    image: "/assets/products/meat/meat-011.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/pack",
    aliases: [
      "Má Đùi Gà Tươi CP",
      "thịt gà",
      "gà"
    ]
  },
  {
    id: "meat-012",
    name: "Cánh gà tươi CP",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 68000,
    oldPrice: null,
    image: "/assets/products/meat/meat-012.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/pack",
    aliases: [
      "Cánh gà tươi CP",
      "cá",
      "thịt gà",
      "gà"
    ]
  },
  {
    id: "meat-013",
    name: "Cá Bông Lau Cắt Khoanh",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 255500,
    oldPrice: null,
    image: "/assets/products/meat/meat-013.png",
    detail: "600g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/pack",
    aliases: [
      "Cá Bông Lau Cắt Khoanh",
      "cá"
    ]
  },
  {
    id: "meat-014",
    name: "Cá Basa Cắt Khoanh Đóng Vỉ",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 88000,
    oldPrice: null,
    image: "/assets/products/meat/meat-014.png",
    detail: "600g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/pack",
    aliases: [
      "Cá Basa Cắt Khoanh Đóng Vỉ",
      "cá"
    ]
  },
  {
    id: "meat-015",
    name: "Cá Bạc má",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 32500,
    oldPrice: null,
    image: "/assets/products/meat/meat-015.png",
    detail: "600g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/pack",
    aliases: [
      "Cá Bạc má",
      "cá"
    ]
  },
  {
    id: "meat-016",
    name: "Cá Thu",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 289500,
    oldPrice: null,
    image: "/assets/products/meat/meat-016.png",
    detail: "600g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/pack",
    aliases: [
      "Cá Thu",
      "cá thu",
      "cá"
    ]
  },
  {
    id: "meat-017",
    name: "Mực Muối Hồng Hương",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 129000,
    oldPrice: null,
    image: "/assets/products/meat/meat-017.png",
    detail: "600g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/pack",
    aliases: [
      "Mực Muối Hồng Hương",
      "mực",
      "muối"
    ]
  },
  {
    id: "meat-018",
    name: "Phi Lê Cá Hồi Còn Da",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 648000,
    oldPrice: null,
    image: "/assets/products/meat/meat-018.png",
    detail: "400g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 400,
    packageUnit: "g",
    displayUnit: "400g/pack",
    aliases: [
      "Phi Lê Cá Hồi Còn Da",
      "cá hồi",
      "phi lê cá hồi",
      "cá"
    ]
  },
  {
    id: "meat-019",
    name: "Cá Bớp Cắt Khoanh",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 489000,
    oldPrice: null,
    image: "/assets/products/meat/meat-019.png",
    detail: "400g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 400,
    packageUnit: "g",
    displayUnit: "400g/pack",
    aliases: [
      "Cá Bớp Cắt Khoanh",
      "cá"
    ]
  },
  {
    id: "meat-020",
    name: "Cá Chim Trắng Nguyên Con",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 249000,
    oldPrice: null,
    image: "/assets/products/meat/meat-020.png",
    detail: "700g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 700,
    packageUnit: "g",
    displayUnit: "700g/pack",
    aliases: [
      "Cá Chim Trắng Nguyên Con",
      "cá"
    ]
  },
  {
    id: "meat-021",
    name: "Tôm Thẻ Tươi Size 30-40 Con",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 309000,
    oldPrice: null,
    image: "/assets/products/meat/meat-021.png",
    detail: "300g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 300,
    packageUnit: "g",
    displayUnit: "300g/pack",
    aliases: [
      "Tôm Thẻ Tươi Size 30-40 Con",
      "tôm"
    ]
  },
  {
    id: "meat-022",
    name: "Nộm Sứa Tĩnh Gia",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 25900,
    oldPrice: null,
    image: "/assets/products/meat/meat-022.png",
    detail: "350g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 350,
    packageUnit: "g",
    displayUnit: "350g/pack",
    aliases: [
      "Nộm Sứa Tĩnh Gia"
    ]
  },
  {
    id: "meat-023",
    name: "Chả Cá Chiên Thoại An",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 42000,
    oldPrice: 48000,
    image: "/assets/products/meat/meat-023.png",
    detail: "300g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 300,
    packageUnit: "g",
    displayUnit: "300g/pack",
    aliases: [
      "Chả Cá Chiên Thoại An",
      "cá"
    ]
  },
  {
    id: "meat-024",
    name: "Cá Viên Thì Là",
    category: "meat",
    categoryLabel: "Thịt & Hải sản",
    collection: "category",
    groups: [],
    price: 57000,
    oldPrice: 50500,
    image: "/assets/products/meat/meat-024.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "pack",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/pack",
    aliases: [
      "Cá Viên Thì Là",
      "cá"
    ]
  },
  {
    id: "milk-001",
    name: "Sữa Tươi Tiệt Trùng Mlekovita ....",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 29000,
    oldPrice: null,
    image: "/assets/products/Popular Item/milk-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Sữa Tươi Tiệt Trùng Mlekovita ....",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "soymilk-001",
    name: "Sữa Đậu Nành Fami Canxi Ít ....",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 4500,
    oldPrice: null,
    image: "/assets/products/Popular Item/soymilk-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Sữa Đậu Nành Fami Canxi Ít ....",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "spicy-noodle-001",
    name: "Mì Siukay Acecook Hải Sản",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 12600,
    oldPrice: null,
    image: "/assets/products/Popular Item/spicy-noodle-001.png",
    detail: "128G",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 128,
    packageUnit: "g",
    displayUnit: "128g/gói",
    aliases: [
      "Mì Siukay Acecook Hải Sản",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "vinamilk-yogurt-001",
    name: "Lốc 4 Sữa Chua Ăn Vinamilk ....",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 22900,
    oldPrice: null,
    image: "/assets/products/Popular Item/vinamilk-yogurt-001.png",
    detail: "4 hộp/lốc",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 4,
    packageUnit: "piece",
    displayUnit: "4 hộp/lốc",
    aliases: [
      "Lốc 4 Sữa Chua Ăn Vinamilk ....",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "lavie-001",
    name: "Nước Khoáng Lavie Dịu Nhẹ",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 4900,
    oldPrice: null,
    image: "/assets/products/Popular Item/lavie-001.png",
    detail: "500ML",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "ml",
    displayUnit: "500ml/gói",
    aliases: [
      "Nước Khoáng Lavie Dịu Nhẹ"
    ]
  },
  {
    id: "vinh-hao-001",
    name: "Nước Khoáng Vĩnh Hảo Chai",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 3800,
    oldPrice: null,
    image: "/assets/products/Popular Item/vinh-hao-001.png",
    detail: "500ML",
    sellUnit: "bottle",
    sellUnitLabel: "chai",
    packageSize: 500,
    packageUnit: "ml",
    displayUnit: "500ml/chai",
    aliases: [
      "Nước Khoáng Vĩnh Hảo Chai"
    ]
  },
  {
    id: "noodle-001",
    name: "Mì 3 Miền Gà Sợi Phở Gói 65G",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 3500,
    oldPrice: null,
    image: "/assets/products/Popular Item/noodle-001.png",
    detail: "65G",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 65,
    packageUnit: "g",
    displayUnit: "65g/gói",
    aliases: [
      "Mì 3 Miền Gà Sợi Phở Gói 65G",
      "thịt gà",
      "gà",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "noodle-002",
    name: "Mì Hảo Hảo Tôm Chua Cay 75G",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 3900,
    oldPrice: null,
    image: "/assets/products/Popular Item/noodle-002.png",
    detail: "75G",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 75,
    packageUnit: "g",
    displayUnit: "75g/hũ",
    aliases: [
      "Mì Hảo Hảo Tôm Chua Cay 75G",
      "tôm",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "vinamilk-001",
    name: "Sữa Tươi Tiệt Trùng Vinamilk ....",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 8200,
    oldPrice: null,
    image: "/assets/products/Popular Item/vinamilk-001.png",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Sữa Tươi Tiệt Trùng Vinamilk ....",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "egg-001",
    name: "Hộp Trứng Gà Tươi CL Size XL",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 27900,
    oldPrice: null,
    image: "/assets/products/Popular Item/egg-001.png",
    detail: "10 Trứng/hộp Size XL",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 10,
    packageUnit: "piece",
    displayUnit: "10 quả/hộp",
    aliases: [
      "Hộp Trứng Gà Tươi CL Size XL",
      "trứng",
      "trứng gà",
      "thịt gà",
      "gà"
    ]
  },
  {
    id: "spicy-noodle-002",
    name: "Mì Siukay Acecook Vị Bò 127G",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 12600,
    oldPrice: null,
    image: "/assets/products/Popular Item/spicy-noodle-002.png",
    detail: "127G",
    sellUnit: "bunch",
    sellUnitLabel: "bó",
    packageSize: 127,
    packageUnit: "g",
    displayUnit: "127g/bó",
    aliases: [
      "Mì Siukay Acecook Vị Bò 127G",
      "thịt bò",
      "bò",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "vinamilk-yogurt-002",
    name: "Sữa Chua Ăn Vinamilk Có ....",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 22900,
    oldPrice: null,
    image: "/assets/products/Popular Item/vinamilk-yogurt-002.png",
    detail: "4 hộp/lốc",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 4,
    packageUnit: "piece",
    displayUnit: "4 hộp/lốc",
    aliases: [
      "Sữa Chua Ăn Vinamilk Có ....",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "rice-001",
    name: "Gạo Thơm Phù Sa Vua Gạo 5KG",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 118000,
    oldPrice: null,
    image: "/assets/products/Popular Item/rice-001.png",
    detail: "5KG",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 5000,
    packageUnit: "g",
    displayUnit: "5kg/hũ",
    aliases: [
      "Gạo Thơm Phù Sa Vua Gạo 5KG",
      "gạo",
      "gạo thơm"
    ]
  },
  {
    id: "sapvwa-water-001",
    name: "Nước Tinh Khiết Sapuwa",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 2500,
    oldPrice: null,
    image: "/assets/products/Popular Item/sapvwa-water-001.png",
    detail: "330ML",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 330,
    packageUnit: "ml",
    displayUnit: "330ml/gói",
    aliases: [
      "Nước Tinh Khiết Sapuwa"
    ]
  },
  {
    id: "milk-002",
    name: "Lốc 4 Sữa Tươi Tiệt Trùng ....",
    category: "egg-dairy",
    categoryLabel: "Sữa & chế phẩm sữa",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 43500,
    oldPrice: null,
    image: "/assets/products/Popular Item/milk-002.png",
    detail: "4 hộp/lốc",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 4,
    packageUnit: "piece",
    displayUnit: "4 hộp/lốc",
    aliases: [
      "Lốc 4 Sữa Tươi Tiệt Trùng ....",
      "sữa",
      "sữa tươi",
      "sữa tiệt trùng"
    ]
  },
  {
    id: "revive-001",
    name: "Nước Điện Giải Revive",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 62000,
    oldPrice: null,
    image: "/assets/products/Popular Item/revive-001.png",
    detail: "6 chai/lốc",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 6,
    packageUnit: "piece",
    displayUnit: "6 chai/lốc",
    aliases: [
      "Nước Điện Giải Revive"
    ]
  },
  {
    id: "tissue-001",
    name: "Khăn Giấy Lụa Let Green",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "all",
    groups: [
      "popular"
    ],
    price: 20200,
    oldPrice: null,
    image: "/assets/products/Popular Item/tissue-001.png",
    detail: "300 Tờ",
    sellUnit: "item",
    sellUnitLabel: "sản phẩm",
    packageSize: 1,
    packageUnit: "item",
    displayUnit: "1 sản phẩm",
    aliases: [
      "Khăn Giấy Lụa Let Green"
    ]
  },
  {
    id: "carb-001",
    name: "Bánh mì sandwich lạt Otto",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 31000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-001.png",
    detail: "gói 490g (khoảng 13 lát)",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 13000,
    packageUnit: "ml",
    displayUnit: "13L/gói",
    aliases: [
      "Bánh mì sandwich lạt Otto",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "carb-002",
    name: "Gạo lứt tím Vinh Hiền",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 48000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-002.png",
    detail: "túi 1kg",
    sellUnit: "bag",
    sellUnitLabel: "túi",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/túi",
    aliases: [
      "Gạo lứt tím Vinh Hiền",
      "gạo",
      "gạo thơm"
    ]
  },
  {
    id: "carb-003",
    name: "Gạo nếp cái hoa vàng Việt…",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 50000,
    oldPrice: 60000,
    image: "/assets/products/rice-noodle/carb-003.png",
    detail: "túi 1kg",
    sellUnit: "bag",
    sellUnitLabel: "túi",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/túi",
    aliases: [
      "Gạo nếp cái hoa vàng Việt…",
      "cá",
      "gạo",
      "gạo thơm"
    ]
  },
  {
    id: "carb-004",
    name: "Gạo thơm Vua Gạo ST25",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 129000,
    oldPrice: 190000,
    image: "/assets/products/rice-noodle/carb-004.png",
    detail: "túi 5kg",
    sellUnit: "bag",
    sellUnitLabel: "túi",
    packageSize: 5000,
    packageUnit: "g",
    displayUnit: "5kg/túi",
    aliases: [
      "Gạo thơm Vua Gạo ST25",
      "gạo",
      "gạo thơm"
    ]
  },
  {
    id: "carb-005",
    name: "Phở khô Susan gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 15000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-005.png",
    detail: "200g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 200,
    packageUnit: "g",
    displayUnit: "200g/gói",
    aliases: [
      "Phở khô Susan gói"
    ]
  },
  {
    id: "carb-006",
    name: "Bánh đa khô",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 30000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-006.png",
    detail: "300g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 300,
    packageUnit: "g",
    displayUnit: "300g/gói",
    aliases: [
      "Bánh đa khô"
    ]
  },
  {
    id: "carb-007",
    name: "Miến khô Vifon gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 41000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-007.png",
    detail: "210g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 210,
    packageUnit: "g",
    displayUnit: "210g/gói",
    aliases: [
      "Miến khô Vifon gói"
    ]
  },
  {
    id: "carb-008",
    name: "Bún gạo Bà Bảy gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 28000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-008.png",
    detail: "400g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 400,
    packageUnit: "g",
    displayUnit: "400g/gói",
    aliases: [
      "Bún gạo Bà Bảy gói",
      "gạo",
      "gạo thơm"
    ]
  },
  {
    id: "carb-009",
    name: "Hủ tiếu khô Nuffam gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 23000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-009.png",
    detail: "250g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 250,
    packageUnit: "g",
    displayUnit: "250g/hũ",
    aliases: [
      "Hủ tiếu khô Nuffam gói",
      "tiêu"
    ]
  },
  {
    id: "carb-010",
    name: "Mì trứng cao cấp Meizan gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 33500,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-010.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/gói",
    aliases: [
      "Mì trứng cao cấp Meizan gói",
      "trứng",
      "trứng gà",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "carb-011",
    name: "Bánh Canh Khô (Mì Vắt) Đặc…",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 26800,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-011.png",
    detail: "350g",
    sellUnit: "can",
    sellUnitLabel: "lon",
    packageSize: 350,
    packageUnit: "g",
    displayUnit: "350g/lon",
    aliases: [
      "Bánh Canh Khô (Mì Vắt) Đặc…",
      "mì",
      "mì gói"
    ]
  },
  {
    id: "carb-012",
    name: "Nui rau củ ống dài Nuffam gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 23000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-012.png",
    detail: "350g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 350,
    packageUnit: "g",
    displayUnit: "350g/gói",
    aliases: [
      "Nui rau củ ống dài Nuffam gói",
      "rau"
    ]
  },
  {
    id: "carb-013",
    name: "Bột bắp Meizan gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 13000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-013.png",
    detail: "150g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 150,
    packageUnit: "g",
    displayUnit: "150g/gói",
    aliases: [
      "Bột bắp Meizan gói",
      "bột"
    ]
  },
  {
    id: "carb-014",
    name: "Bột bánh xèo Meizan gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 20000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-014.png",
    detail: "400g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 400,
    packageUnit: "g",
    displayUnit: "400g/gói",
    aliases: [
      "Bột bánh xèo Meizan gói",
      "bột"
    ]
  },
  {
    id: "carb-015",
    name: "Bột gạo Tài Ký gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 21000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-015.png",
    detail: "400g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 400,
    packageUnit: "g",
    displayUnit: "400g/gói",
    aliases: [
      "Bột gạo Tài Ký gói",
      "gạo",
      "gạo thơm",
      "bột"
    ]
  },
  {
    id: "carb-016",
    name: "Bột mì đa dạng Meizan cao cấp",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 14000,
    oldPrice: 15000,
    image: "/assets/products/rice-noodle/carb-016.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/gói",
    aliases: [
      "Bột mì đa dạng Meizan cao cấp",
      "mì",
      "mì gói",
      "bột"
    ]
  },
  {
    id: "carb-017",
    name: "Bột chiên giòn Meizan gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 9000,
    oldPrice: 10000,
    image: "/assets/products/rice-noodle/carb-017.png",
    detail: "150g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 150,
    packageUnit: "g",
    displayUnit: "150g/gói",
    aliases: [
      "Bột chiên giòn Meizan gói",
      "bột"
    ]
  },
  {
    id: "carb-018",
    name: "Hủ tiếu sườn heo Cung Đình gói",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 10300,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-018.png",
    detail: "85g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 85,
    packageUnit: "g",
    displayUnit: "85g/hũ",
    aliases: [
      "Hủ tiếu sườn heo Cung Đình gói",
      "thịt heo",
      "heo",
      "tiêu"
    ]
  },
  {
    id: "carb-019",
    name: "Phở bò Vifon gói (có gói thịt…",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 17000,
    oldPrice: null,
    image: "/assets/products/rice-noodle/carb-019.png",
    detail: "90g",
    sellUnit: "bunch",
    sellUnitLabel: "bó",
    packageSize: 90,
    packageUnit: "g",
    displayUnit: "90g/bó",
    aliases: [
      "Phở bò Vifon gói (có gói thịt…",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "carb-020",
    name: "Combo 2 gói cháo tươi cá hồi…",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 39000,
    oldPrice: 50000,
    image: "/assets/products/rice-noodle/carb-020.png",
    detail: "240g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 240,
    packageUnit: "g",
    displayUnit: "240g/gói",
    aliases: [
      "Combo 2 gói cháo tươi cá hồi…",
      "cá hồi",
      "phi lê cá hồi",
      "cá",
      "thịt bò",
      "bò"
    ]
  },
  {
    id: "carb-021",
    name: "Ngũ cốc dinh dưỡng MacCereal…",
    category: "rice-noodle",
    categoryLabel: "Ngũ cốc & lương thực",
    collection: "category",
    groups: [],
    price: 69000,
    oldPrice: 87000,
    image: "/assets/products/rice-noodle/carb-021.png",
    detail: "560g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 560,
    packageUnit: "g",
    displayUnit: "560g/gói",
    aliases: [
      "Ngũ cốc dinh dưỡng MacCereal…",
      "đường"
    ]
  },
  {
    id: "seasoning-001",
    name: "Đường vàng Quảng Ngãi gói",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 33500,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-001.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/gói",
    aliases: [
      "Đường vàng Quảng Ngãi gói",
      "đường"
    ]
  },
  {
    id: "seasoning-002",
    name: "Đường tinh luyện trắng Biên Hòa",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 38000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-002.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/gói",
    aliases: [
      "Đường tinh luyện trắng Biên Hòa",
      "đường"
    ]
  },
  {
    id: "seasoning-003",
    name: "Nước màu dừa bến Tre A Tuấn…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 15000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-003.png",
    detail: "120g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 120,
    packageUnit: "g",
    displayUnit: "120g/gói",
    aliases: [
      "Nước màu dừa bến Tre A Tuấn…"
    ]
  },
  {
    id: "seasoning-004",
    name: "Nước màu thốt nốt nguyên chấ…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 13000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-004.png",
    detail: "90ml",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 90,
    packageUnit: "ml",
    displayUnit: "90ml/gói",
    aliases: [
      "Nước màu thốt nốt nguyên chấ…"
    ]
  },
  {
    id: "seasoning-005",
    name: "Nghệ bột Viper hũ",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 10900,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-005.png",
    detail: "35g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 35,
    packageUnit: "g",
    displayUnit: "35g/hũ",
    aliases: [
      "Nghệ bột Viper hũ",
      "bột"
    ]
  },
  {
    id: "seasoning-006",
    name: "Hoa hồi Viper hũ",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 9600,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-006.png",
    detail: "15g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 15,
    packageUnit: "g",
    displayUnit: "15g/hũ",
    aliases: [
      "Hoa hồi Viper hũ"
    ]
  },
  {
    id: "seasoning-007",
    name: "Quế cây Viper hũ",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 10900,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-007.png",
    detail: "20g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 20,
    packageUnit: "g",
    displayUnit: "20g/hũ",
    aliases: [
      "Quế cây Viper hũ"
    ]
  },
  {
    id: "seasoning-008",
    name: "Bột điều Thành Lộc gói",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 9300,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-008.png",
    detail: "20g",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 20,
    packageUnit: "g",
    displayUnit: "20g/lốc",
    aliases: [
      "Bột điều Thành Lộc gói",
      "bột"
    ]
  },
  {
    id: "seasoning-009",
    name: "Bột tỏi Thành Lộc gói",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 11000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-009.png",
    detail: "20g",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 20,
    packageUnit: "g",
    displayUnit: "20g/lốc",
    aliases: [
      "Bột tỏi Thành Lộc gói",
      "tỏi",
      "bột"
    ]
  },
  {
    id: "seasoning-010",
    name: "Bột ngũ vị hương Thành Lộc gói",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 9000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-010.png",
    detail: "20g",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 20,
    packageUnit: "g",
    displayUnit: "20g/lốc",
    aliases: [
      "Bột ngũ vị hương Thành Lộc gói",
      "bột"
    ]
  },
  {
    id: "seasoning-011",
    name: "Dầu mè thơm hảo hãng Meizan…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 59000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-011.png",
    detail: "250ml",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 250,
    packageUnit: "ml",
    displayUnit: "250ml/gói",
    aliases: [
      "Dầu mè thơm hảo hãng Meizan…"
    ]
  },
  {
    id: "seasoning-012",
    name: "Dầu ăn thượng hạng Neptune…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 59000,
    oldPrice: 65000,
    image: "/assets/products/seasoning/seasoning-012.png",
    detail: "1L",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 1000,
    packageUnit: "ml",
    displayUnit: "1L/hũ",
    aliases: [
      "Dầu ăn thượng hạng Neptune…",
      "dầu ăn",
      "dầu"
    ]
  },
  {
    id: "seasoning-013",
    name: "Bột ngọt Meizan gói",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 32000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-013.png",
    detail: "400g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 400,
    packageUnit: "g",
    displayUnit: "400g/gói",
    aliases: [
      "Bột ngọt Meizan gói",
      "bột"
    ]
  },
  {
    id: "seasoning-014",
    name: "Hạt nêm Knorr thịt thăn, xương…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 65000,
    oldPrice: 86000,
    image: "/assets/products/seasoning/seasoning-014.png",
    detail: "900g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 900,
    packageUnit: "g",
    displayUnit: "900g/gói",
    aliases: [
      "Hạt nêm Knorr thịt thăn, xương…"
    ]
  },
  {
    id: "seasoning-015",
    name: "Nước tương Ông Chà Và 707 vị…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 15500,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-015.png",
    detail: "500ml",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "ml",
    displayUnit: "500ml/gói",
    aliases: [
      "Nước tương Ông Chà Và 707 vị…"
    ]
  },
  {
    id: "seasoning-016",
    name: "2 chai nước mắm cốt nhĩ 35%...",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 53000,
    oldPrice: 106000,
    image: "/assets/products/seasoning/seasoning-016.png",
    detail: "500ml",
    sellUnit: "bottle",
    sellUnitLabel: "chai",
    packageSize: 500,
    packageUnit: "ml",
    displayUnit: "500ml/chai",
    aliases: [
      "2 chai nước mắm cốt nhĩ 35%...",
      "nước mắm",
      "mắm"
    ]
  },
  {
    id: "seasoning-017",
    name: "Dầu hào Maggi đậm đặc chai",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 38000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-017.png",
    detail: "530g",
    sellUnit: "bottle",
    sellUnitLabel: "chai",
    packageSize: 530,
    packageUnit: "g",
    displayUnit: "530g/chai",
    aliases: [
      "Dầu hào Maggi đậm đặc chai"
    ]
  },
  {
    id: "seasoning-018",
    name: "Giấm gạo lên men Ajinomoto…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 18000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-018.png",
    detail: "400ml",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 400,
    packageUnit: "ml",
    displayUnit: "400ml/gói",
    aliases: [
      "Giấm gạo lên men Ajinomoto…",
      "gạo",
      "gạo thơm"
    ]
  },
  {
    id: "seasoning-019",
    name: "Tương ớt Nam Dương Hàng Vi…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 19000,
    oldPrice: 25000,
    image: "/assets/products/seasoning/seasoning-019.png",
    detail: "800g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 800,
    packageUnit: "g",
    displayUnit: "800g/gói",
    aliases: [
      "Tương ớt Nam Dương Hàng Vi…",
      "đường"
    ]
  },
  {
    id: "seasoning-020",
    name: "Tương cà Chinsu chai",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 18500,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-020.png",
    detail: "250g",
    sellUnit: "bottle",
    sellUnitLabel: "chai",
    packageSize: 250,
    packageUnit: "g",
    displayUnit: "250g/chai",
    aliases: [
      "Tương cà Chinsu chai"
    ]
  },
  {
    id: "seasoning-021",
    name: "Xốt mayonnaise Simply hương…",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 27000,
    oldPrice: 37000,
    image: "/assets/products/seasoning/seasoning-021.png",
    detail: "230g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 230,
    packageUnit: "g",
    displayUnit: "230g/hũ",
    aliases: [
      "Xốt mayonnaise Simply hương…"
    ]
  },
  {
    id: "seasoning-022",
    name: "Ớt khô sa tế Cholimex hũ",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 19500,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-022.png",
    detail: "100g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/hũ",
    aliases: [
      "Ớt khô sa tế Cholimex hũ"
    ]
  },
  {
    id: "seasoning-023",
    name: "Tiêu đen xay Fadely hũ",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 22000,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-023.png",
    detail: "45g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 45,
    packageUnit: "g",
    displayUnit: "45g/hũ",
    aliases: [
      "Tiêu đen xay Fadely hũ",
      "tiêu"
    ]
  },
  {
    id: "seasoning-024",
    name: "Bột cà ri Vianca gói",
    category: "seasoning",
    categoryLabel: "Gia vị & nước chấm",
    collection: "category",
    groups: [],
    price: 5500,
    oldPrice: null,
    image: "/assets/products/seasoning/seasoning-024.png",
    detail: "10g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 10,
    packageUnit: "g",
    displayUnit: "10g/gói",
    aliases: [
      "Bột cà ri Vianca gói",
      "bột"
    ]
  },
  {
    id: "vegetable-001",
    name: "Giá đậu nành",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 18000,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-001.png",
    detail: "150g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 150,
    packageUnit: "g",
    displayUnit: "150g/gói",
    aliases: [
      "Giá đậu nành",
      "giá đậu",
      "giá"
    ]
  },
  {
    id: "vegetable-002",
    name: "Cải thìa baby",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 45800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-002.png",
    detail: "350g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 350,
    packageUnit: "g",
    displayUnit: "350g/gói",
    aliases: [
      "Cải thìa baby"
    ]
  },
  {
    id: "vegetable-003",
    name: "Rau Muống Phú Lộc",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 32500,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-003.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "lốc",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/lốc",
    aliases: [
      "Rau Muống Phú Lộc",
      "rau"
    ]
  },
  {
    id: "vegetable-004",
    name: "Măng Tây loại III",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 34000,
    oldPrice: 34000,
    image: "/assets/products/vegetable/vegetable-004.png",
    detail: "200g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 200,
    packageUnit: "g",
    displayUnit: "200g/gói",
    aliases: [
      "Măng Tây loại III"
    ]
  },
  {
    id: "vegetable-005",
    name: "Đậu Bắp",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 20500,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-005.png",
    detail: "200g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 200,
    packageUnit: "g",
    displayUnit: "200g/gói",
    aliases: [
      "Đậu Bắp"
    ]
  },
  {
    id: "vegetable-006",
    name: "Cà Chua Đà Lạt",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 42800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-006.png",
    detail: "1kg",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/hũ",
    aliases: [
      "Cà Chua Đà Lạt",
      "cà chua"
    ]
  },
  {
    id: "vegetable-007",
    name: "Dưa leo",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 22000,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-007.png",
    detail: "1kg",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 1000,
    packageUnit: "g",
    displayUnit: "1kg/gói",
    aliases: [
      "Dưa leo",
      "dưa leo"
    ]
  },
  {
    id: "vegetable-008",
    name: "Hành tây",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 17500,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-008.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/gói",
    aliases: [
      "Hành tây"
    ]
  },
  {
    id: "vegetable-009",
    name: "Cà rốt",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 16500,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-009.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/gói",
    aliases: [
      "Cà rốt",
      "cà rốt"
    ]
  },
  {
    id: "vegetable-010",
    name: "Khoai tây",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 15000,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-010.png",
    detail: "500g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 500,
    packageUnit: "g",
    displayUnit: "500g/gói",
    aliases: [
      "Khoai tây",
      "khoai tây"
    ]
  },
  {
    id: "vegetable-011",
    name: "Ớt chuông hai màu",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 33800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-011.png",
    detail: "350g",
    sellUnit: "jar",
    sellUnitLabel: "hũ",
    packageSize: 350,
    packageUnit: "g",
    displayUnit: "350g/hũ",
    aliases: [
      "Ớt chuông hai màu"
    ]
  },
  {
    id: "vegetable-012",
    name: "Sả cây",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 6000,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-012.png",
    detail: "200g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 200,
    packageUnit: "g",
    displayUnit: "200g/gói",
    aliases: [
      "Sả cây"
    ]
  },
  {
    id: "vegetable-013",
    name: "Hành Tím Lý Sơn",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 14800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-013.png",
    detail: "100g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/gói",
    aliases: [
      "Hành Tím Lý Sơn",
      "hành tím",
      "hành"
    ]
  },
  {
    id: "vegetable-014",
    name: "Me Nấu Canh Chua Đóng Hộp",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 8800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-014.png",
    detail: "60g",
    sellUnit: "can",
    sellUnitLabel: "lon",
    packageSize: 60,
    packageUnit: "g",
    displayUnit: "60g/lon",
    aliases: [
      "Me Nấu Canh Chua Đóng Hộp"
    ]
  },
  {
    id: "vegetable-015",
    name: "Củ Gừng Tươi",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 8800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-015.png",
    detail: "100g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/gói",
    aliases: [
      "Củ Gừng Tươi"
    ]
  },
  {
    id: "vegetable-016",
    name: "Ớt Sừng Đỏ",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 9000,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-016.png",
    detail: "100g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/gói",
    aliases: [
      "Ớt Sừng Đỏ"
    ]
  },
  {
    id: "vegetable-017",
    name: "Hỗn Hợp Hành Ngò",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 13800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-017.png",
    detail: "100g",
    sellUnit: "box",
    sellUnitLabel: "hộp",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/hộp",
    aliases: [
      "Hỗn Hợp Hành Ngò"
    ]
  },
  {
    id: "vegetable-018",
    name: "Tỏi Lý Sơn Nguyên Củ",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 24800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-018.png",
    detail: "100g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 100,
    packageUnit: "g",
    displayUnit: "100g/gói",
    aliases: [
      "Tỏi Lý Sơn Nguyên Củ",
      "tỏi"
    ]
  },
  {
    id: "vegetable-019",
    name: "Trái Tắc Tươi Túi",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 8800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-019.png",
    detail: "150g",
    sellUnit: "bag",
    sellUnitLabel: "túi",
    packageSize: 150,
    packageUnit: "g",
    displayUnit: "150g/túi",
    aliases: [
      "Trái Tắc Tươi Túi"
    ]
  },
  {
    id: "vegetable-020",
    name: "Nấm Rơm",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 38800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-020.png",
    detail: "200g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 200,
    packageUnit: "g",
    displayUnit: "200g/gói",
    aliases: [
      "Nấm Rơm"
    ]
  },
  {
    id: "vegetable-021",
    name: "Nấm Kim Châm Hàn Quốc",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 22800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-021.png",
    detail: "150g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 150,
    packageUnit: "g",
    displayUnit: "150g/gói",
    aliases: [
      "Nấm Kim Châm Hàn Quốc"
    ]
  },
  {
    id: "vegetable-022",
    name: "Xà Lách",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 44800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-022.png",
    detail: "330g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 330,
    packageUnit: "g",
    displayUnit: "330g/gói",
    aliases: [
      "Xà Lách"
    ]
  },
  {
    id: "vegetable-023",
    name: "Cải Thảo",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 31800,
    oldPrice: 58800,
    image: "/assets/products/vegetable/vegetable-023.png",
    detail: "600g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 600,
    packageUnit: "g",
    displayUnit: "600g/gói",
    aliases: [
      "Cải Thảo"
    ]
  },
  {
    id: "vegetable-024",
    name: "Bạc Hà",
    category: "vegetable",
    categoryLabel: "Rau, củ, quả",
    collection: "category",
    groups: [],
    price: 9800,
    oldPrice: null,
    image: "/assets/products/vegetable/vegetable-024.png",
    detail: "200g",
    sellUnit: "pack",
    sellUnitLabel: "gói",
    packageSize: 200,
    packageUnit: "g",
    displayUnit: "200g/gói",
    aliases: [
      "Bạc Hà"
    ]
  }
];

export const productCatalogById = new Map(productCatalog.map((product) => [product.id, product]));
