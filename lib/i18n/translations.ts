export type Locale = "vi" | "en";

export const defaultLocale: Locale = "vi";
export const locales: Locale[] = ["vi", "en"];

export const translations = {
  vi: {
    common: {
      appName: "Nấu Smart Grocery",
      brand: "Nấu",
      currencyLocale: "vi-VN",
      currencySuffix: "đ",
      loading: "Đang tải...",
      save: "Lưu",
      cancel: "Hủy",
      done: "Hoàn tất",
      back: "Quay lại",
      remove: "Xóa",
      addToCart: "Thêm vào giỏ",
      addedToCart: "Đã thêm vào giỏ hàng ✓",
      addFavorite: "Thêm vào yêu thích",
      removeFavorite: "Bỏ yêu thích",
      product: "Sản phẩm",
      searchResults: "Kết quả tìm kiếm",
      noProducts: "Không tìm thấy sản phẩm phù hợp.",
      viewAll: "Xem tất cả",
      collapse: "Thu gọn",
      servings: "người",
      none: "Không có",
      calories: "Calories",
      carbs: "Carb",
      protein: "Protein",
      fat: "Fat"
    },
    header: {
      tagline: "Trợ lý nấu ăn AI với grocery sẵn sàng mở rộng",
      shop: "Mua sắm",
      cart: "Giỏ hàng",
      language: "Ngôn ngữ"
    },
    languages: {
      vi: "Tiếng Việt",
      en: "English",
      shortVi: "VI",
      shortEn: "EN"
    },
    nav: {
      home: "Trang chủ",
      favorite: "Yêu thích",
      notifications: "Thông báo",
      policy: "Chính sách",
      scan: "Scan",
      dish: "Món ăn",
      shop: "Cửa hàng",
      cart: "Giỏ hàng",
      profile: "Hồ sơ"
    },
    home: {
      featureLabel: "Chức năng",
      dishLookup: "Tra cứu món ăn",
      scanIngredients: "Scan nguyên liệu",
      tapHere: "Nhấn vào đây",
      shoppingCategories: "Danh mục mua sắm",
      popularItems: "Popular Items",
      bestDeal: "Best deal",
      searchPlaceholder: "Tìm nguyên liệu tại đây ...",
      clearSearch: "Xóa từ khóa tìm kiếm",
      inputAddress: "Nhập địa chỉ giao hàng",
      addressTitle: "Địa chỉ giao hàng",
      addressDescription: "Kiểm tra hoặc chỉnh sửa địa chỉ giao hàng của bạn.",
      currentAddress: "Địa chỉ hiện tại",
      guide: "Hướng dẫn",
      guideAgain: "Xem lại hướng dẫn",
      cartBrand: "Nấu Smart Grocery",
      addressPrompt: "Nhập địa chỉ giao hàng của bạn:",
      heroCopy:
        "Bạn không biết nên nấu món gì hoặc cần mua thêm nguyên liệu nào? Nấu giúp bạn quét ảnh nguyên liệu, gợi ý món ăn phù hợp, lập công thức cho nhiều người và tự động thêm nguyên liệu còn thiếu vào giỏ hàng.",
      scanHint: "(Tải ảnh nguyên liệu lên và khám phá những món bạn có thể nấu)",
      chefAsk: "Hỏi Nấu đầu bếp",
      chefHint:
        "(Nhập món ăn và số người, Nấu sẽ gợi ý công thức, khẩu phần và tự động tạo giỏ hàng.)",
      mascotGreeting: "Let Nâu\nhelp you “Nấu”",
      contact: "Liên hệ: (028) 3776 1300",
      footerLinks: [
        "Trung tâm dịch vụ",
        "Quy định hoàn trả",
        "Về chúng tôi",
        "Chính sách giao hàng",
        "Chính sách bảo mật",
        "Điều khoản sử dụng"
      ],
      companyInfo: [
        "Tên công ty: CÔNG TY TNHH Mã Tấu Thành Công",
        "Người đại diện: Mã Tấu Thành Công",
        "Mã số doanh nghiệp: 0123568888",
        "Địa chỉ: 702 Đường Nguyễn Văn Linh, TP. Hồ Chí Minh",
        "Bản quyền Mã Tấu Thành Công © 2026"
      ]
    },
    onboarding: {
      carouselLabel: "Hướng dẫn chức năng",
      carouselIndicator: "Xem hướng dẫn {index}",
      skip: "Bỏ qua hướng dẫn",
      understood: "Đã hiểu",
      finish: "Hoàn tất",
      next: "Tiếp theo",
      stepLabel: "Chức năng {current} / {total}",
      cards: [
        {
          eyebrow: "Chức năng 1 / 3",
          title: "Quét nguyên liệu",
          description:
            "Chụp hoặc tải ảnh nguyên liệu bạn đang có. Nấu sẽ nhận diện thực phẩm và gợi ý món có thể nấu ngay.",
          imageAlt: "Chức năng scan"
        },
        {
          eyebrow: "Chức năng 2 / 3",
          title: "Nhập món ăn bạn muốn nấu",
          description:
            "Nhập món ăn và số người dùng bữa. AI sẽ gợi ý công thức, điều chỉnh định lượng và hỗ trợ thêm vào giỏ hàng.",
          imageAlt: "Chức năng nhập món"
        },
        {
          eyebrow: "Chức năng 3 / 3",
          title: "Cá nhân hoá nhân vật của bạn",
          description:
            "Vào User Profile để chọn outfit cho character đại diện của bạn, giúp trải nghiệm mua sắm vui hơn.",
          imageAlt: "Chức năng hồ sơ người dùng"
        }
      ],
      tourSteps: [
        {
          title: "Quét nguyên liệu còn lại",
          description:
            "Chụp ảnh hoặc tải ảnh nguyên liệu bạn đang có. Nấu sẽ nhận diện thực phẩm và gợi ý những món có thể nấu ngay, giúp bạn tận dụng đồ ăn còn lại và giảm lãng phí."
        },
        {
          title: "Nấu món bạn muốn cho nhiều người",
          description:
            "Nhập tên món ăn và số người dùng bữa. AI sẽ gợi ý công thức, tự điều chỉnh định lượng nguyên liệu và hỗ trợ thêm danh sách cần mua vào giỏ hàng."
        },
        {
          title: "Cá nhân hoá nhân vật của bạn",
          description:
            "Vào User Profile để chọn outfit cho character đại diện của bạn. Bạn có thể thay đổi phong cách nhân vật để trải nghiệm mua sắm trở nên vui hơn và cá nhân hơn."
        }
      ]
    },
    loginOnboarding: {
      eyebrow: "Chào mừng bạn",
      title: "Đăng nhập để bắt đầu",
      description: "Điền thông tin để Nấu ghi nhớ tên và địa chỉ giao hàng của bạn.",
      name: "Tên khách hàng",
      address: "Địa chỉ",
      email: "Gmail cá nhân",
      submit: "Đăng nhập",
      nameError: "Vui lòng nhập tên khách hàng.",
      addressError: "Vui lòng nhập địa chỉ.",
      emailRequiredError: "Vui lòng nhập Gmail cá nhân.",
      emailInvalidError: "Gmail chưa đúng định dạng.",
      storageError: "Không thể lưu thông tin trên thiết bị này. Vui lòng thử lại."
    },
    categories: {
      all: "Best deal",
      vegetables: "Rau, củ, quả",
      dairy: "Sữa & chế phẩm sữa",
      "meat-seafood": "Thịt & Hải sản",
      grains: "Ngũ cốc & lương thực",
      sauces: "Gia vị & nước chấm"
    },
    difficulty: {
      easy: "Dễ",
      medium: "Vừa",
      advanced: "Khó"
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
    recipe: {
      inputTitle: "Nhập món ăn",
      inputDescription: "Nhập tên món, số người ăn và nguyên liệu dị ứng nếu có.",
      dishName: "Tên món ăn",
      dishPlaceholder: "Ví dụ: Canh chua cá, bò kho, thịt kho trứng",
      servings: "Số người ăn",
      allergies: "Dị ứng cần tránh",
      allergiesPlaceholder: "Ví dụ: tôm, đậu phộng, sữa",
      emptyAllergies: "Có thể để trống nếu không cần lọc dị ứng.",
      create: "Tạo công thức nấu ăn",
      creating: "Đang tạo công thức...",
      checking: "AI đang kiểm tra dị ứng và tạo công thức...",
      resultFor: "Công thức cho",
      allergyWarning: "Cảnh báo dị ứng",
      conflictIngredients: "Nguyên liệu xung đột",
      unsafeHelp:
        "Bạn có thể xoá nguyên liệu xung đột khỏi danh sách bên dưới, hoặc nếu vẫn muốn giữ nguyên công thức thì bấm nút xác nhận thêm vào giỏ.",
      safeMessage: "Công thức không phát hiện xung đột với danh sách dị ứng bạn đã nhập.",
      reviewTitle: "Danh sách nguyên liệu chuẩn bị thêm vào giỏ",
      conflictHelp: "Có thể gây dị ứng, hãy xoá nếu bạn muốn loại khỏi giỏ.",
      alternatives: "Có thể thay bằng",
      addListToCart: "Xác nhận thêm danh sách vào giỏ hàng",
      addingToCart: "Đang thêm vào giỏ...",
      stepsTitle: "Cách làm",
      emptyTitle: "Công thức sẽ hiển thị ở đây",
      emptyDescription:
        "Sau khi nhập tên món, số người ăn và dị ứng nếu có, hệ thống sẽ tạo sẵn các card nguyên liệu. Nếu phát hiện xung đột dị ứng, bạn có thể xoá nguyên liệu đó trước khi thêm vào giỏ.",
      enterDishError: "Vui lòng nhập tên món ăn.",
      servingsError: "Số người ăn phải lớn hơn 0.",
      aiError: "AI chưa thể tạo công thức lúc này.",
      emptyCartList: "Danh sách nguyên liệu đang trống, chưa thể thêm vào giỏ.",
      addCartFailed: "Chưa thể thêm vào giỏ lúc này.",
      removedIngredient: "Đã xoá nguyên liệu này khỏi danh sách chuẩn bị thêm vào giỏ.",
      noIngredientList: "Chưa có danh sách nguyên liệu.",
      recipeFallbackName: "Công thức nấu ăn",
      cartAddedSummary: "Đã thêm {matched} mặt hàng vào giỏ. {unmatched}",
      unmatchedSummary: "{count} nguyên liệu chưa có sản phẩm phù hợp.",
      mobileGenerated: "Đã tạo công thức {dish} cho {servings} người.",
      mobileReopened: "Đã mở lại công thức {dish} cho {servings} người."
    },
    scan: {
      noIngredients: "Chưa có đủ nguyên liệu để gợi ý món ăn.",
      suggestFailed: "Chưa thể gợi ý món lúc này.",
      scanRequired: "Vui lòng chọn hoặc chụp ảnh trước khi bắt đầu quét.",
      scanFailed: "Hiện chưa thể phân tích ảnh này.",
      fallbackWarning:
        "Hệ thống đang dùng kết quả dự phòng an toàn. Bạn hãy kiểm tra lại danh sách nguyên liệu.",
      unclearWarning:
        "Chưa nhận diện rõ nguyên liệu trong ảnh này. Bạn có thể quét lại hoặc chỉnh danh sách thủ công.",
      identifiedCount: "Đã xác định {count} nguyên liệu.",
      dragHandle: "Kéo xuống để thu gọn gợi ý món",
      suggestionEyebrow: "Gợi ý từ ảnh quét",
      suggestionTitle: "Món có thể nấu",
      findingDishes: "Nấu đang tìm món phù hợp...",
      descriptionLabel: "Mô tả món ăn:",
      mainIngredients: "Nguyên liệu chính",
      matching: "đang đối chiếu",
      saveDish: "Lưu món {dish} vào yêu thích",
      recipeIntro:
        "Công thức này ưu tiên các nguyên liệu đã nhận diện được từ ảnh quét. Bạn có thể xem nhanh cách nấu, sau đó mua thêm các sản phẩm phù hợp ở phần bên dưới.",
      loadingSteps: "Nấu đang viết hướng dẫn chi tiết từng bước...",
      youtubeLabel: "Link các video hướng dẫn tại Youtube:",
      seeMore: "xem thêm",
      youtubeQueryPrefix: "cách nấu",
      upsellIntro: "Món ăn của bạn sẽ hoàn hảo hơn nếu có thêm các nguyên liệu sau:",
      increaseProduct: "Tăng số lượng {product}",
      addProduct: "Thêm {product} vào giỏ"
    },
    shop: {
      badge: "Siêu thị",
      title: "Xem các danh mục siêu thị tĩnh",
      description:
        "Danh mục và sản phẩm trên các trang này được tải từ JSON cục bộ và đường dẫn ảnh PNG, hoàn toàn tách biệt với các tính năng AI.",
      categories: "Danh mục",
      categoriesDescription: "Bắt đầu từ một ngành hàng và giữ logic duyệt catalog hoàn toàn deterministic.",
      featured: "Sản phẩm nổi bật",
      featuredDescription: "Các mặt hàng này cũng được lấy trực tiếp từ nguồn dữ liệu catalog tĩnh."
    },
    cart: {
      emptyTitle: "Giỏ hàng đang trống",
      emptyDescription: "Sản phẩm bạn bấm thêm ở Trang chủ, mục Tất cả hoặc các Category sẽ tự xuất hiện tại đây.",
      clear: "Xóa giỏ",
      checkout: "Mua Hàng",
      suggested: "Có thể bạn cần"
    },
    api: {
      invalidSuggest: "Danh sách nguyên liệu xác nhận phải là mảng chuỗi không rỗng.",
      suggestFailed: "Chưa thể gợi ý món lúc này.",
      invalidRecipe: "Tên món và số người ăn là bắt buộc để tạo công thức.",
      recipeFailed: "Chưa thể tạo công thức lúc này.",
      invalidCartAdd: "Cần ít nhất một nguyên liệu có tên, số lượng và đơn vị.",
      cartAddFailed: "Chưa thể tạo mặt hàng trong giỏ lúc này."
    }
  },
  en: {
    common: {
      appName: "Nau Smart Grocery",
      brand: "Nau",
      currencyLocale: "vi-VN",
      currencySuffix: " VND",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      done: "Done",
      back: "Back",
      remove: "Remove",
      addToCart: "Add to cart",
      addedToCart: "Added to cart ✓",
      addFavorite: "Add to favorites",
      removeFavorite: "Remove from favorites",
      product: "Product",
      searchResults: "Search results",
      noProducts: "No matching products found.",
      viewAll: "View all",
      collapse: "Collapse",
      servings: "people",
      none: "None",
      calories: "Calories",
      carbs: "Carb",
      protein: "Protein",
      fat: "Fat"
    },
    header: {
      tagline: "AI cooking help with grocery-ready architecture",
      shop: "Shop",
      cart: "Cart",
      language: "Language"
    },
    languages: {
      vi: "Tiếng Việt",
      en: "English",
      shortVi: "VI",
      shortEn: "EN"
    },
    nav: {
      home: "Home",
      favorite: "Favorites",
      notifications: "Notifications",
      policy: "Policy",
      scan: "Scan",
      dish: "Dish",
      shop: "Shop",
      cart: "Cart",
      profile: "Profile"
    },
    home: {
      featureLabel: "Feature",
      dishLookup: "Dish lookup",
      scanIngredients: "Scan ingredients",
      tapHere: "Tap here",
      shoppingCategories: "Shopping categories",
      popularItems: "Popular Items",
      bestDeal: "Best deal",
      searchPlaceholder: "Search ingredients here ...",
      clearSearch: "Clear search keyword",
      inputAddress: "Enter delivery address",
      addressTitle: "Delivery address",
      addressDescription: "Review or edit your delivery address.",
      currentAddress: "Current address",
      guide: "Guide",
      guideAgain: "Replay guide",
      cartBrand: "Nau Smart Grocery",
      addressPrompt: "Enter your delivery address:",
      heroCopy:
        "Not sure what to cook or what ingredients you still need? Nau scans your ingredients, suggests fitting dishes, builds serving-based recipes, and adds missing items to your cart.",
      scanHint: "(Upload an ingredient photo and discover what you can cook)",
      chefAsk: "Ask Chef Nau",
      chefHint:
        "(Enter a dish and serving count; Nau suggests the recipe, portions, and a ready cart.)",
      mascotGreeting: "Let Nâu\nhelp you “Nấu”",
      contact: "Contact: (028) 3776 1300",
      footerLinks: [
        "Service center",
        "Return policy",
        "About us",
        "Delivery policy",
        "Privacy policy",
        "Terms of use"
      ],
      companyInfo: [
        "Company: Mo Tao Commerce Co., Ltd.",
        "Representative: Mo Dao",
        "Business ID: 0123568888",
        "Address: 702 Nguyen Van Linh Street, Ho Chi Minh City",
        "Copyright Mo Tao Commerce © 2026"
      ]
    },
    onboarding: {
      carouselLabel: "Feature guide",
      carouselIndicator: "View guide {index}",
      skip: "Skip guide",
      understood: "Got it",
      finish: "Finish",
      next: "Next",
      stepLabel: "Feature {current} / {total}",
      cards: [
        {
          eyebrow: "Feature 1 / 3",
          title: "Scan ingredients",
          description:
            "Take or upload a photo of the ingredients you have. Nau will detect the food and suggest dishes you can cook right away.",
          imageAlt: "Scan feature"
        },
        {
          eyebrow: "Feature 2 / 3",
          title: "Enter the dish you want",
          description:
            "Enter a dish and serving count. AI will suggest a recipe, adjust ingredient amounts, and help add items to your cart.",
          imageAlt: "Recipe typing feature"
        },
        {
          eyebrow: "Feature 3 / 3",
          title: "Personalize your character",
          description:
            "Open User Profile to choose an outfit for your representative character and make shopping feel more personal.",
          imageAlt: "User profile feature"
        }
      ],
      tourSteps: [
        {
          title: "Scan leftover ingredients",
          description:
            "Take or upload a photo of the ingredients you have. Nau will detect the food and suggest dishes you can cook right away, helping you use leftovers and reduce waste."
        },
        {
          title: "Cook for more people",
          description:
            "Enter a dish name and the number of people eating. AI will suggest a recipe, adjust ingredient amounts, and help add the shopping list to your cart."
        },
        {
          title: "Personalize your character",
          description:
            "Open User Profile to choose an outfit for your representative character. You can change the character style to make the shopping experience more fun and personal."
        }
      ]
    },
    loginOnboarding: {
      eyebrow: "Welcome",
      title: "Sign in to start",
      description: "Fill in your details so Nau can remember your name and delivery address.",
      name: "Customer name",
      address: "Address",
      email: "Personal Gmail",
      submit: "Sign in",
      nameError: "Please enter the customer name.",
      addressError: "Please enter an address.",
      emailRequiredError: "Please enter your personal Gmail.",
      emailInvalidError: "Gmail is not in the correct format.",
      storageError: "Unable to save information on this device. Please try again."
    },
    categories: {
      all: "Best deal",
      vegetables: "Vegetables & fruit",
      dairy: "Milk, eggs & dairy",
      "meat-seafood": "Meat & seafood",
      grains: "Grains & staples",
      sauces: "Seasoning & sauces"
    },
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      advanced: "Advanced"
    },
    dishPage: {
      badge: "Feature 2",
      title: "Dish search, servings, allergy check, and cart-ready recipe flow",
      description:
        "This MVP 2 flow starts with a dish name, asks for servings and allergies, checks safety, generates a practical recipe, lets users edit ingredients, then adds the confirmed list to cart."
    },
    recipePage: {
      badge: "Recipe",
      title: "Dish search, servings, allergy check, and cart-ready recipe flow",
      description:
        "This MVP 2 flow starts with a dish name, asks for servings and allergies, checks safety, generates a practical recipe, lets users edit ingredients, then adds the confirmed list to cart."
    },
    recipe: {
      inputTitle: "Enter a dish",
      inputDescription: "Enter the dish name, serving count, and allergy ingredients if needed.",
      dishName: "Dish name",
      dishPlaceholder: "Example: sour fish soup, beef stew, caramelized pork and eggs",
      servings: "Servings",
      allergies: "Allergies to avoid",
      allergiesPlaceholder: "Example: shrimp, peanut, milk",
      emptyAllergies: "Leave blank if you do not need allergy filtering.",
      create: "Create recipe",
      creating: "Creating recipe...",
      checking: "AI is checking allergies and creating the recipe...",
      resultFor: "Recipe for",
      allergyWarning: "Allergy warning",
      conflictIngredients: "Conflicting ingredients",
      unsafeHelp:
        "You can remove conflicting ingredients from the list below, or keep the recipe and confirm adding the list to cart.",
      safeMessage: "No conflict was found with the allergy list you entered.",
      reviewTitle: "Ingredients prepared for cart",
      conflictHelp: "This may trigger an allergy. Remove it if you want it excluded from the cart.",
      alternatives: "Can be replaced with",
      addListToCart: "Confirm and add list to cart",
      addingToCart: "Adding to cart...",
      stepsTitle: "Steps",
      emptyTitle: "Your recipe will appear here",
      emptyDescription:
        "After you enter a dish, serving count, and optional allergies, the system creates ingredient cards. If an allergy conflict is found, you can remove that ingredient before adding items to cart.",
      enterDishError: "Please enter a dish name.",
      servingsError: "Serving count must be greater than 0.",
      aiError: "AI cannot create a recipe right now.",
      emptyCartList: "The ingredient list is empty, so it cannot be added to cart.",
      addCartFailed: "Unable to add to cart right now.",
      removedIngredient: "Removed this ingredient from the pending cart list.",
      noIngredientList: "No ingredient list yet.",
      recipeFallbackName: "Cooking recipe",
      cartAddedSummary: "Added {matched} items to cart. {unmatched}",
      unmatchedSummary: "{count} ingredients do not have matching products yet.",
      mobileGenerated: "Created {dish} for {servings} people.",
      mobileReopened: "Reopened {dish} for {servings} people."
    },
    scan: {
      noIngredients: "Not enough ingredients to suggest dishes yet.",
      suggestFailed: "Unable to suggest dishes right now.",
      scanRequired: "Please choose or capture a photo before scanning.",
      scanFailed: "Unable to analyze this image right now.",
      fallbackWarning:
        "The system is using a safe fallback result. Please review the ingredient list.",
      unclearWarning:
        "The ingredients in this image are not clear yet. You can scan again or edit the list manually.",
      identifiedCount: "Identified {count} ingredients.",
      dragHandle: "Drag down to collapse dish suggestions",
      suggestionEyebrow: "Suggestions from scan",
      suggestionTitle: "Dishes you can cook",
      findingDishes: "Nau is finding matching dishes...",
      descriptionLabel: "Dish description:",
      mainIngredients: "Main ingredients",
      matching: "matching",
      saveDish: "Save {dish} to favorites",
      recipeIntro:
        "This recipe prioritizes ingredients detected from your scan. You can review the cooking steps, then add relevant products below.",
      loadingSteps: "Nau is writing detailed step-by-step instructions...",
      youtubeLabel: "Tutorial videos on YouTube:",
      seeMore: "see more",
      youtubeQueryPrefix: "how to cook",
      upsellIntro: "Your dish will be better with these extra ingredients:",
      increaseProduct: "Increase quantity for {product}",
      addProduct: "Add {product} to cart"
    },
    shop: {
      badge: "Supermarket",
      title: "Browse static supermarket categories",
      description:
        "These category and product pages load from local JSON and PNG image paths, fully separate from AI features.",
      categories: "Categories",
      categoriesDescription: "Start from a department while keeping catalog browsing deterministic.",
      featured: "Featured products",
      featuredDescription: "These items are also loaded directly from the static catalog source."
    },
    cart: {
      emptyTitle: "Your cart is empty",
      emptyDescription: "Products added from Home, All, or category sections will appear here automatically.",
      clear: "Clear cart",
      checkout: "Checkout",
      suggested: "You may need"
    },
    api: {
      invalidSuggest: "Confirmed ingredients must be a non-empty string array.",
      suggestFailed: "Unable to suggest dishes right now.",
      invalidRecipe: "Dish name and servings are required to generate a recipe.",
      recipeFailed: "Unable to generate a recipe right now.",
      invalidCartAdd: "Provide at least one ingredient with name, quantity, and unit.",
      cartAddFailed: "Unable to build cart items right now."
    }
  }
} as const;

export type TranslationTree = (typeof translations)[Locale];

export function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  );
}
