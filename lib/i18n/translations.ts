export type Locale = "vi" | "en";

type TranslationTree = {
  common: {
    appName: string;
  };
  header: {
    tagline: string;
    shop: string;
    cart: string;
    language: string;
  };
  nav: {
    home: string;
    scan: string;
    dish: string;
    shop: string;
    cart: string;
  };
  home: {
    badge: string;
    title: string;
    description: string;
    scanCta: string;
    dishCta: string;
    directionLabel: string;
    directionPoints: string[];
    pillars: Array<{
      title: string;
      description: string;
      href: string;
    }>;
    openFlow: string;
  };
  dishPage: {
    badge: string;
    title: string;
    description: string;
  };
  recipePage: {
    badge: string;
    title: string;
    description: string;
  };
  languages: {
    vi: string;
    en: string;
  };
};

export const defaultLocale: Locale = "vi";

export const translations: Record<Locale, TranslationTree> = {
  vi: {
    common: {
      appName: "Nấu Smart Grocery"
    },
    header: {
      tagline: "Trợ lý nấu ăn AI với kiến trúc grocery sẵn sàng mở rộng",
      shop: "Mua sắm",
      cart: "Giỏ hàng",
      language: "Ngôn ngữ"
    },
    nav: {
      home: "Trang chủ",
      scan: "Quét ảnh",
      dish: "Món ăn",
      shop: "Cửa hàng",
      cart: "Giỏ hàng"
    },
    home: {
      badge: "MVP grocery ưu tiên di động",
      title: "Từ nguyên liệu trên bếp đến giỏ hàng của bạn.",
      description:
        "Nấu Smart Grocery được xây dựng như một trải nghiệm nấu ăn có AI hôm nay và một nền tảng mua sắm đầy đủ vào ngày mai.",
      scanCta: "Bắt đầu quét nguyên liệu",
      dishCta: "Tìm món ăn",
      directionLabel: "Định hướng sản phẩm",
      directionPoints: [
        "Các wrapper AI được tách riêng trong service, không đặt trực tiếp trong UI.",
        "Mapping catalog vẫn giữ deterministic để mở rộng siêu thị về sau ổn định hơn.",
        "Cấu trúc app đã sẵn sàng cho các flow shopping dùng Supabase và Postgres sau này."
      ],
      pillars: [
        {
          title: "Quét nguyên liệu",
          description:
            "Bắt đầu bằng camera điện thoại hoặc upload trên desktop, sau đó xác nhận các nguyên liệu hệ thống nhìn thấy.",
          href: "/scan"
        },
        {
          title: "Tìm món theo khẩu phần",
          description:
            "Sinh recipe có cấu trúc, scale nguyên liệu theo số người ăn, rồi đưa sang grocery flow.",
          href: "/dish"
        },
        {
          title: "Mở rộng sang shopping",
          description:
            "Giữ phần AI tách biệt với catalog và cart deterministic để dễ phát triển thành website grocery đầy đủ.",
          href: "/cart"
        }
      ],
      openFlow: "Mở flow"
    },
    dishPage: {
      badge: "Tính năng 2",
      title: "Tìm món, chọn khẩu phần, kiểm tra dị ứng và thêm vào giỏ",
      description:
        "Flow MVP 2 bắt đầu từ tên món, hỏi số người ăn và dị ứng, kiểm tra độ an toàn, sinh recipe thực tế, cho phép chỉnh nguyên liệu, rồi thêm danh sách đã xác nhận vào giỏ hàng."
    },
    recipePage: {
      badge: "Recipe",
      title: "Tìm món, chọn khẩu phần, kiểm tra dị ứng và thêm vào giỏ",
      description:
        "Flow MVP 2 bắt đầu từ tên món, hỏi số người ăn và dị ứng, kiểm tra độ an toàn, sinh recipe thực tế, cho phép chỉnh nguyên liệu, rồi thêm danh sách đã xác nhận vào giỏ hàng."
    },
    languages: {
      vi: "Tiếng Việt",
      en: "English"
    }
  },
  en: {
    common: {
      appName: "Nau Smart Grocery"
    },
    header: {
      tagline: "AI cooking help with future-ready grocery architecture",
      shop: "Shop",
      cart: "Cart",
      language: "Language"
    },
    nav: {
      home: "Home",
      scan: "Scan",
      dish: "Dish",
      shop: "Shop",
      cart: "Cart"
    },
    home: {
      badge: "Mobile-first grocery MVP",
      title: "From ingredients on your counter to groceries in your cart.",
      description:
        "Nau Smart Grocery is scaffolded as an AI-assisted cooking experience today and a full shopping platform tomorrow.",
      scanCta: "Start ingredient scan",
      dishCta: "Search a dish",
      directionLabel: "Product direction",
      directionPoints: [
        "AI wrappers live in isolated service files, never inside the UI tree.",
        "Catalog mapping stays deterministic so future supermarket browsing is predictable.",
        "The app structure is ready for future Supabase and Postgres-backed shopping flows."
      ],
      pillars: [
        {
          title: "Scan ingredients",
          description:
            "Start with a phone camera or desktop upload, then confirm what the system detects.",
          href: "/scan"
        },
        {
          title: "Search dishes by servings",
          description:
            "Generate a structured recipe, scaled ingredient list, and grocery mapping in one flow.",
          href: "/dish"
        },
        {
          title: "Build toward shopping",
          description:
            "Keep AI suggestion logic separate from the deterministic grocery catalog and cart layer.",
          href: "/cart"
        }
      ],
      openFlow: "Open flow"
    },
    dishPage: {
      badge: "Feature 2",
      title: "Dish search, servings, allergy check, and cart-ready recipe flow",
      description:
        "This MVP 2 flow asks for a dish name first, then servings and allergies, checks safety, generates a practical bulk recipe, lets the user review ingredients, and finally adds the confirmed list to cart with optional upsell extras."
    },
    recipePage: {
      badge: "Recipe",
      title: "Dish search, servings, allergy check, and cart-ready recipe flow",
      description:
        "This MVP 2 flow asks for a dish name first, then servings and allergies, checks safety, generates a practical bulk recipe, lets the user review ingredients, and finally adds the confirmed list to cart with optional upsell extras."
    },
    languages: {
      vi: "Tiếng Việt",
      en: "English"
    }
  }
};

