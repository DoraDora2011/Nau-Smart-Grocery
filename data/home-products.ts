import type { StaticImageData } from "next/image";

import { homeCategoryProducts } from "@/data/home-category-products";
import { productCatalog, type ProductCatalogItem } from "@/data/productCatalog";
import logoMascotBigsize from "@/assets/brand_logo/logo-mascot-bigsize.png";
import logoMascot from "@/assets/brand_logo/logo-mascot.png";
import logoText from "@/assets/brand_logo/logo-text.png";
import mealIcon from "@/assets/brand_logo/Meal.png";
import bestBirdNest from "@/assets/products/Best deal/bird-nest-001.png";
import bestChilliSauce from "@/assets/products/Best deal/chilli-sauce-001.png";
import bestCooker from "@/assets/products/Best deal/cooker-001.png";
import bestEnergy from "@/assets/products/Best deal/energy-001.png";
import bestFan from "@/assets/products/Best deal/fan-001.png";
import bestFishSauce from "@/assets/products/Best deal/fish-sauce-001.png";
import bestKettleOne from "@/assets/products/Best deal/kettle-001.png";
import bestKettleTwo from "@/assets/products/Best deal/kettle-002.png";
import bestPlasticBox from "@/assets/products/Best deal/plastic-box-001.png";
import bestSausageOne from "@/assets/products/Best deal/sausage-001.png";
import bestSausageTwo from "@/assets/products/Best deal/sausage-002.png";
import bestTeddyBear from "@/assets/products/Best deal/teddy-bear-001.png";
import bestTissue from "@/assets/products/Best deal/tissue-002.png";
import bestToothbrush from "@/assets/products/Best deal/toothbrush-001.png";
import bestVietnameseCakeOne from "@/assets/products/Best deal/vietnamese-cake-001.png";
import bestVietnameseCakeTwo from "@/assets/products/Best deal/vietnamese-cake-002.png";
import bestWatermelon from "@/assets/products/Best deal/watermelon-001.png";
import dairyIcon from "@/assets/products/egg-dairy/dairy-001.png";
import meatIcon from "@/assets/products/meat/meat-001.png";
import popularEgg from "@/assets/products/Popular Item/egg-001.png";
import popularLavie from "@/assets/products/Popular Item/lavie-001.png";
import popularMilk from "@/assets/products/Popular Item/milk-001.png";
import popularMilkTwo from "@/assets/products/Popular Item/milk-002.png";
import popularNoodle from "@/assets/products/Popular Item/noodle-001.png";
import popularNoodleTwo from "@/assets/products/Popular Item/noodle-002.png";
import popularRevive from "@/assets/products/Popular Item/revive-001.png";
import popularRice from "@/assets/products/Popular Item/rice-001.png";
import popularSapuwaWater from "@/assets/products/Popular Item/sapvwa-water-001.png";
import popularSoymilk from "@/assets/products/Popular Item/soymilk-001.png";
import popularSpicyNoodleOne from "@/assets/products/Popular Item/spicy-noodle-001.png";
import popularSpicyNoodleTwo from "@/assets/products/Popular Item/spicy-noodle-002.png";
import popularTissue from "@/assets/products/Popular Item/tissue-001.png";
import popularVinamilk from "@/assets/products/Popular Item/vinamilk-001.png";
import popularYogurt from "@/assets/products/Popular Item/vinamilk-yogurt-001.png";
import popularYogurtTwo from "@/assets/products/Popular Item/vinamilk-yogurt-002.png";
import popularVinhHao from "@/assets/products/Popular Item/vinh-hao-001.png";
import grainsIcon from "@/assets/products/rice-noodle/carb-001.png";
import seasoningIcon from "@/assets/products/seasoning/seasoning-001.png";
import vegetableIcon from "@/assets/products/vegetable/vegetable-001.png";

export type HomeCategoryKey = "vegetables" | "dairy" | "meat-seafood" | "grains" | "sauces";
export type HomeProductSection = "popular" | "best-deal" | "category";

export interface HomeCategory {
  key: HomeCategoryKey;
  label: string;
  image: StaticImageData;
}

export interface HomeProduct {
  id: string;
  category: HomeCategoryKey;
  section: HomeProductSection;
  name: string;
  detail: string;
  price: number;
  oldPrice?: number;
  image: StaticImageData;
}

const catalogCategoryToHomeCategory: Partial<Record<string, HomeCategoryKey>> = {
  "egg-dairy": "dairy",
  meat: "meat-seafood",
  "rice-noodle": "grains",
  seasoning: "sauces",
  vegetable: "vegetables"
};

function findCatalogProductByImage(image: StaticImageData): ProductCatalogItem | undefined {
  return productCatalog.find((product) => {
    const fileName = product.image.split("/").pop()?.replace(/\.png$/i, "");

    return fileName ? image.src.includes(fileName) : false;
  });
}

function withCatalogMetadata(products: HomeProduct[]): HomeProduct[] {
  return products.map((product) => {
    const catalogProduct = findCatalogProductByImage(product.image);

    if (!catalogProduct) {
      return product;
    }

    return {
      ...product,
      id: catalogProduct.id,
      category: catalogCategoryToHomeCategory[catalogProduct.category] ?? product.category,
      name: catalogProduct.name,
      detail: catalogProduct.detail ?? catalogProduct.displayUnit,
      price: catalogProduct.price,
      oldPrice: catalogProduct.oldPrice ?? undefined
    };
  });
}

export const homeBrandAssets = {
  logoText,
  logoMascot,
  logoMascotBigsize,
  mealIcon
};

export const homeCategories: HomeCategory[] = [
  {
    key: "vegetables",
    label: "Rau, củ, quả",
    image: vegetableIcon
  },
  {
    key: "dairy",
    label: "Sữa & chế phẩm sữa",
    image: dairyIcon
  },
  {
    key: "meat-seafood",
    label: "Thịt & Hải sản",
    image: meatIcon
  },
  {
    key: "grains",
    label: "Ngũ cốc & lương thực",
    image: grainsIcon
  },
  {
    key: "sauces",
    label: "Gia vị & nước chấm",
    image: seasoningIcon
  }
];

const featuredHomeProducts: HomeProduct[] = [
  {
    id: "home-popular-egg-001",
    category: "dairy",
    section: "popular",
    name: "Trứng Gà Tươi",
    detail: "vỉ",
    price: 36000,
    image: popularEgg
  },
  {
    id: "home-popular-lavie-001",
    category: "grains",
    section: "popular",
    name: "Nước Khoáng La Vie",
    detail: "chai",
    price: 7000,
    image: popularLavie
  },
  {
    id: "home-popular-milk-001",
    category: "dairy",
    section: "popular",
    name: "Sữa Tươi Tiệt Trùng MeKovita",
    detail: "1L",
    price: 29000,
    image: popularMilk
  },
  {
    id: "home-popular-milk-002",
    category: "dairy",
    section: "popular",
    name: "Sữa Tươi Hộp Gia Đình",
    detail: "1L",
    price: 32000,
    image: popularMilkTwo
  },
  {
    id: "home-popular-noodle-001",
    category: "grains",
    section: "popular",
    name: "Mì Siukay Acecook Hải Sản",
    detail: "128g",
    price: 12600,
    image: popularNoodle
  },
  {
    id: "home-popular-noodle-002",
    category: "grains",
    section: "popular",
    name: "Mì Ăn Liền Gói Gia Đình",
    detail: "gói",
    price: 8500,
    image: popularNoodleTwo
  },
  {
    id: "home-popular-revive-001",
    category: "grains",
    section: "popular",
    name: "Nước Bù Khoáng Revive",
    detail: "chai",
    price: 11000,
    image: popularRevive
  },
  {
    id: "home-popular-rice-001",
    category: "grains",
    section: "popular",
    name: "Gạo Thơm Túi Nhỏ",
    detail: "túi",
    price: 89000,
    image: popularRice
  },
  {
    id: "home-popular-sapuwa-water-001",
    category: "grains",
    section: "popular",
    name: "Nước Uống Sapuwa",
    detail: "chai",
    price: 6000,
    image: popularSapuwaWater
  },
  {
    id: "home-popular-soymilk-001",
    category: "dairy",
    section: "popular",
    name: "Sữa Đậu Nành Fami Canxi",
    detail: "50 bịch/thùng",
    price: 4500,
    image: popularSoymilk
  },
  {
    id: "home-popular-spicy-noodle-001",
    category: "grains",
    section: "popular",
    name: "Mì Cay Hàn Quốc",
    detail: "128g",
    price: 14500,
    image: popularSpicyNoodleOne
  },
  {
    id: "home-popular-spicy-noodle-002",
    category: "grains",
    section: "popular",
    name: "Mì Cay Vị Bò",
    detail: "gói",
    price: 14500,
    image: popularSpicyNoodleTwo
  },
  {
    id: "home-popular-tissue-001",
    category: "grains",
    section: "popular",
    name: "Khăn Giấy Gia Đình",
    detail: "gói",
    price: 25000,
    image: popularTissue
  },
  {
    id: "home-popular-vinamilk-001",
    category: "dairy",
    section: "popular",
    name: "Sữa Vinamilk",
    detail: "hộp",
    price: 22900,
    image: popularVinamilk
  },
  {
    id: "home-popular-vinamilk-yogurt-001",
    category: "dairy",
    section: "popular",
    name: "Lốc 4 Sữa Chua Ăn Vinamilk",
    detail: "4 hộp",
    price: 22900,
    image: popularYogurt
  },
  {
    id: "home-popular-vinamilk-yogurt-002",
    category: "dairy",
    section: "popular",
    name: "Sữa Chua Vinamilk Có Đường",
    detail: "4 hộp",
    price: 22900,
    image: popularYogurtTwo
  },
  {
    id: "home-popular-vinh-hao-001",
    category: "grains",
    section: "popular",
    name: "Nước Khoáng Vĩnh Hảo",
    detail: "chai",
    price: 7000,
    image: popularVinhHao
  },
  {
    id: "home-best-bird-nest-001",
    category: "grains",
    section: "best-deal",
    name: "Nước Yến Dinh Dưỡng",
    detail: "hộp",
    price: 59000,
    oldPrice: 79000,
    image: bestBirdNest
  },
  {
    id: "home-best-chilli-sauce-001",
    category: "sauces",
    section: "best-deal",
    name: "Tương Ớt Chai Lớn",
    detail: "chai",
    price: 32000,
    oldPrice: 45000,
    image: bestChilliSauce
  },
  {
    id: "home-best-cooker-001",
    category: "grains",
    section: "best-deal",
    name: "Nồi Cơm Điện Tử Tefal",
    detail: "1L",
    price: 690000,
    oldPrice: 1490000,
    image: bestCooker
  },
  {
    id: "home-best-energy-001",
    category: "grains",
    section: "best-deal",
    name: "Nước Tăng Lực",
    detail: "lon",
    price: 12000,
    oldPrice: 16000,
    image: bestEnergy
  },
  {
    id: "home-best-fan-001",
    category: "meat-seafood",
    section: "best-deal",
    name: "Quạt Sạc Để Bàn Tiện Dụng",
    detail: "cái",
    price: 119000,
    oldPrice: 279000,
    image: bestFan
  },
  {
    id: "home-best-fish-sauce-001",
    category: "sauces",
    section: "best-deal",
    name: "Nước Mắm Truyền Thống",
    detail: "chai",
    price: 45000,
    oldPrice: 59000,
    image: bestFishSauce
  },
  {
    id: "home-best-kettle-001",
    category: "grains",
    section: "best-deal",
    name: "Ấm Đun Siêu Tốc",
    detail: "cái",
    price: 189000,
    oldPrice: 269000,
    image: bestKettleOne
  },
  {
    id: "home-best-kettle-002",
    category: "grains",
    section: "best-deal",
    name: "Bình Đun Nước Mini",
    detail: "cái",
    price: 159000,
    oldPrice: 229000,
    image: bestKettleTwo
  },
  {
    id: "home-best-plastic-box-001",
    category: "grains",
    section: "best-deal",
    name: "Hộp Nhựa Bảo Quản",
    detail: "bộ",
    price: 49000,
    oldPrice: 79000,
    image: bestPlasticBox
  },
  {
    id: "home-best-sausage-001",
    category: "meat-seafood",
    section: "best-deal",
    name: "Xúc Xích Ăn Liền",
    detail: "gói",
    price: 39900,
    oldPrice: 52000,
    image: bestSausageOne
  },
  {
    id: "home-best-sausage-002",
    category: "meat-seafood",
    section: "best-deal",
    name: "Lạp Xưởng Nướng Đỏ Vị Cay",
    detail: "gói",
    price: 80900,
    oldPrice: 192500,
    image: bestSausageTwo
  },
  {
    id: "home-best-teddy-bear-001",
    category: "grains",
    section: "best-deal",
    name: "Gấu Bông Quà Tặng",
    detail: "cái",
    price: 99000,
    oldPrice: 159000,
    image: bestTeddyBear
  },
  {
    id: "home-best-tissue-002",
    category: "grains",
    section: "best-deal",
    name: "Khăn Giấy Ưu Đãi",
    detail: "combo",
    price: 39000,
    oldPrice: 59000,
    image: bestTissue
  },
  {
    id: "home-best-toothbrush-001",
    category: "sauces",
    section: "best-deal",
    name: "Bàn Chải Điện Đa Năng",
    detail: "bộ",
    price: 159000,
    oldPrice: 399000,
    image: bestToothbrush
  },
  {
    id: "home-best-vietnamese-cake-001",
    category: "grains",
    section: "best-deal",
    name: "Bánh Việt Nam Truyền Thống",
    detail: "hộp",
    price: 59000,
    oldPrice: 79000,
    image: bestVietnameseCakeOne
  },
  {
    id: "home-best-vietnamese-cake-002",
    category: "grains",
    section: "best-deal",
    name: "Bánh Ngọt Việt Nam",
    detail: "hộp",
    price: 65000,
    oldPrice: 89000,
    image: bestVietnameseCakeTwo
  },
  {
    id: "home-best-watermelon-001",
    category: "vegetables",
    section: "best-deal",
    name: "Dưa Hấu Không Hạt",
    detail: "kg",
    price: 19680,
    oldPrice: 195000,
    image: bestWatermelon
  }
];

export const homeProducts: HomeProduct[] = [
  ...withCatalogMetadata(featuredHomeProducts),
  ...homeCategoryProducts
];
